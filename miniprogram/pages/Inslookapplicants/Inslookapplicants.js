let db = wx.cloud.database() //设置数据库
Page({
  data: {
    signup:[],
    Volunteers:[],
    A_id:""
  },

  onLoad: function (options) {
    this.setData({
      A_id:options.A_id
    })
      this.selectsignup(options.A_id)
  },
  // 根据活动id查找报名志愿者
  selectsignup(event){
    let that=this
    db.collection('SignUp').where({
      A_id:event
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
  delete(event){
    let that=this
      wx.showLoading({
        title: '删除中',
      })
      db.collection('SignUp') .where({
        A_id:event.currentTarget.dataset.a_id,
        openId:event.currentTarget.dataset.id
      }).remove().then(res => {
        setTimeout(function() {
          wx.reLaunch({
            url: '../Insactivitiesinfo/Insactivitiesinfo',
          })
        }, 3000);
        wx.showToast({
          title: '删除成功',
          duration:3000,
          icon:"success"
        })
        wx.hideLoading()
        console.log('删除成功')      
      }).catch(err => {
        console.log('删除失败',err)//失败提示错误信息
      })
  }
})