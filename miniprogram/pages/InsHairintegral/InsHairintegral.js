let db = wx.cloud.database() //设置数据库
const _= db.command;
Page({
  data: {
    signup:[],
    Volunteers:[],
    A_id:"",
    VIntegral:0,
    IName:"",
    VIntegralerror:"",
    Vevaluate:0,
    Vevaluateerror:""
  },
  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
        that.setData({
          A_id:options.A_id
        })
        that.selectsignup(options.A_id)
      }
    })
    
  },
  // 根据活动id查找报名志愿者
  selectsignup(event){
    let that=this
    db.collection('SignUp').where({
      A_id:event,
      IName:that.data.IName
    }).orderBy("_createTime","desc")
    .get({
      success: res => {  
        that.setData({
          signup:res.data
        })
        console.log(res.data)
        that.selectbyopenid(res.data)
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 根据上边函数查找到的多个openid查找对应人的信息
  selectbyopenid(event){
    var a=0
    let that=this
    for(var i=0;i<event.length;i++){
      db.collection('Volunteer').where({
        openId:event[i].openId
      }).get({
        success: res => {
          // 防止自己头像出现两次
          for(var j=0;j<that.data.Volunteers.length;j++){
              if(that.data.Volunteers[j].openId==res.data[0].openId){
                a=1
              }
          }
          if(a==0){
            that.setData({
              Volunteers: that.data.Volunteers.concat(res.data[0])
            })
          }  
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }    
  },
  // 提交积分
  onChange1(event){
    var patt=/^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/
    if(patt.test(event.detail)){
      this.setData({
        VIntegral:parseInt(event.detail),
        VIntegralerror:""
      })
    }else{
      this.setData({
        VIntegralerror:"输入错误，请填写数字"
      })
    }
    
  },
  submit1(event){
    let that=this
    wx.showModal({
      content: '请确认填写位置是否正确,确认发放？',
      success (res) {
          // 确认
          if (res.confirm) {
            if(that.data.VIntegral==""||that.data.VIntegralerror!=""||that.data.VIntegral<=0||that.data.VIntegral>20){
              wx.showToast({
                title: '输入错误',
                icon:"error"
              })
            }else{
              wx.showLoading({ 
                title: "加载中",
                mask: true  
              });
              db.collection('Volunteer')
              .where({
                _id:event.currentTarget.dataset.id
              })
              .update({
                data: {
                  VIntegral: _.inc(parseInt(that.data.VIntegral))
                }
              }).then((ress)=>{
                setTimeout(function() {
                  wx.reLaunch({
                    url: '../Insactivitiesinfo/Insactivitiesinfo',
                  })
                }, 3000);
                wx.showToast({
                  title: '发放成功',
                  duration:3000,
                  icon:"success"
                })
                wx.hideLoading()    
              })
            }
           
          }
      }
    })
  },
  onChange2(event){
    var patt=/^[-+]?(([0-9]+)([.]([0-9]+))?|([.]([0-9]+))?)$/
    if(patt.test(event.detail)){
      this.setData({
        Vevaluate:parseInt(event.detail),
        Vevaluateerror:""
      })
    }else{
      this.setData({
        Vevaluateerror:"输入错误，请填写数字"
      })
    }
    
  },
  submit2(event){
    let that=this
    wx.showModal({
      content: '请确认填写位置是否正确,确认评分？',
      success (res) {
          // 确认
          if (res.confirm) {
            if(that.data.Vevaluate==""||that.data.Vevaluateerror!=""||that.data.Vevaluate<=0||that.data.Vevaluate>10){
              wx.showToast({
                title: '输入错误',
                icon:"error"
              })
            }else{
              wx.showLoading({ 
                title: "加载中",
                mask: true  
              });
              db.collection('Volunteer')
              .where({
                _id:event.currentTarget.dataset.id
              })
              .update({
                data: {
                  Vevaluate: that.data.Vevaluate
                }
              }).then((ress)=>{
                setTimeout(function() {
                  wx.reLaunch({
                    url: '../Insactivitiesinfo/Insactivitiesinfo',
                  })
                }, 3000);
                wx.showToast({
                  title: '评分成功',
                  duration:3000,
                  icon:"success"
                })
                wx.hideLoading()    
              })
            }
           
          }
      }
    })
  }
  
})