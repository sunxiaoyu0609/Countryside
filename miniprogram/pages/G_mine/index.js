
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    usernow:'',
    pwd:'',
    repwd:'',
    visirable:0,
    visirable1:0
  },
  //页面加载的时候，将load页面传过来的值获取过来
  onLoad: function (options) {
    wx.hideHomeButton()
    let that=this
    that.setData({
      visirable:0
    })
    // 读取缓存，获取微信名字,调用查询函数
    wx.getStorage({
      key: 'user',
      success(res) {
        // console.log(res)
        that.setData({
          usernow:res.data
        })
      }
    })
  },

  //显示修改密码输入框
  changepwd(){
    this.setData({
      visirable:1
    })
  },

  //修改密码
  submit(){
    let that=this
    db.collection('admin').doc(that.data.usernow._id).update({
      data:{
        PassWord:that.data.pwd
      },success(res){
        // console.log(res)
        //退出登录，重新登录 
        wx.removeStorageSync('user');
        wx.reLaunch({
          url: '../G_login/index',
        })
      }
    })
  },

  //退出登录
  exit(){
      wx.showModal({
        content:"确定退出吗"
      }).then(res=>{
        if(res.confirm){
          console.log("用户点击了确定");
          wx.removeStorageSync('user');
          wx.reLaunch({
            url: '../G_login/index',
          })
        }else if(res.cancel){
          console.log("用户点击了取消");
        }
        // console.log(wx.getStorageSync('user'))

      })
  },
  
  isequal(){
    if(this.data.pwd!=this.data.repwd){
      this.setData({
        visirable1:1
      })
    }else{
      this.setData({
        visirable1:0
      })
    }
  }
 
  
 })