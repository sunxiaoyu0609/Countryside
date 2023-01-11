let db = wx.cloud.database() //设置数据库
Page({
  data: {
    num:"",
    pwd:"",
    showShare: false,
  },
  onClick(event) {
    this.setData({ 
      showShare: true 
    });
  },
  onClose() {
    this.setData({ showShare: false });
  },
  onSelect(event) {
    this.onClose();
  },
  onLoad: function (options) {
      wx.hideHomeButton()
  },
  inputnum(event){
    this.setData({
      num:event.detail
    })
  },
  inputpwd(event){
    this.setData({
      pwd:event.detail
    })
  },
  load(){
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    });
    let that=this
    if(that.data.pwd==""||that.data.num==""){
      wx.showToast({
        title: '认真填写噢！',
        duration:2000,
        icon:"error"
      })
    }
    else{
      db.collection('Institution').where({
        Iaccount:that.data.num,
      }).get({
        success: res => {
          console.log(res.data)
          if(res.data.length==0){
            wx.showToast({
              title: '该账号不存在',
              duration:2000,
              icon:"error"
            })  
          }else if(that.data.pwd!=res.data[0].Ipassword){
            wx.showToast({
              title: '账号或密码错误',
              duration:2000,
              icon:"error"
            })
          }else if(that.data.pwd==res.data[0].Ipassword){
            wx.showToast({
              title: '登录成功',
              duration:2000,
              icon:"error"
            })
            wx.setStorageSync('IName', res.data[0].IName)
            setTimeout(function() {
              wx.reLaunch({
                url: '../Insactivities/Insactivities',
              })
            }, 2000);
          }
          wx.hideLoading()
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }
    
  },
  load2(){
    wx.reLaunch({
      url: '../login/login',
    })
  }
})