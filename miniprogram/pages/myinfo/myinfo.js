let db = wx.cloud.database() //设置数据库
Page({
  data: {
    value: '',
    openId:"",
    Volunteer:[],
    VTelephone:"",
    VIntroduce:"",
    Vaddress:"",
    VTelephoneerror:""
  },
  onLoad(){
    let that=this
    // 读取缓存，获取openId
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data,
        })  
      }
    })
    setTimeout(function() {
      that.selectVolunteer()
    }, 100);
  },
  onChange(event) {
    let that=this
    that.setData({
      value: event.detail
    })
  },
  // 查询志愿者信息
  selectVolunteer(){
    let that=this
    db.collection('Volunteer').where({
      openId:that.data.openId
    }).get({
      success: res => {
        that.setData({
          Volunteer: res.data[0],
          VIntroduce:res.data[0].VIntroduce,
          VTelephone:res.data[0].VTelephone,
          Vaddress:res.data[0].Vaddress
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  getVTelephone:function(event){
    const regex = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if (event.detail.length !== 0 && event.detail.length !== 11) {
      this.setData({
        VTelephoneerror: '手机长度有误'
      })
    } else if (event.detail.length !== 0 && !regex .test(event.detail)) {
      this.setData({
        VTelephoneerror: '手机号有误'
      })
    }else{
      this.setData({
        VTelephoneerror:"",
        VTelephone:event.detail
      })
    } 
  },
  getVaddress:function(event){
      this.setData({
        Vaddress:event.detail
      })
  },
  getVIntroduce:function(event){
      this.setData({
        VIntroduce:event.detail
      })
  },
  submit:function(){
    let that=this
    wx.showModal({
      content: '确认提交？',
      success (res) {
        // 确认
        if (res.confirm) {
          // 判断信息是否有误
          if(that.data.VTelephone==""||that.data.Vaddress==""||that.data.VTelephoneerror!=""){
            wx.showToast({
              title: '请认真填写噢',
              icon: 'error',
              duration: 2000,
              mask: true
            })
          }
          // 插入数据库
          else{
            db.collection('Volunteer')
            .where({
              openId: that.data.openId
            })
            .update({
              data: {
                VTelephone: that.data.VTelephone,
                VIntroduce: that.data.VIntroduce,
                Vaddress:that.data.Vaddress
              }
            }).then((ress)=>{
               // 设置3秒休眠时间再跳转
              setTimeout(function() {
                wx.switchTab({
                  url: '../../pages/me/me',
              })  
             }, 3000);
              wx.showToast({
                title: '修改成功',
                icon: 'succes',
                duration: 3000,
                mask: true
              }) 
            })
          }

        }
      }
    })
  },
});
