Page({
    data: {
        openId:"",
      
      },
    //微信授权登录
    loadByWechat(){
      let that=this
        // 云开发初始化
        if (!wx.cloud) {
          console.error('不支持云开发，请使用 2.2.3 或以上的基础库');
        } else {
          wx.cloud.init({
            env: "sxy-tk2sr",//云环境的id
            traceUser: true
          });
          wx.cloud.callFunction({
            name: 'getWxid', //云函数名称 
            complete: res => { 
              that.setData({
                openId:res.result.openid
              }) 
              wx.setStorageSync('openId', res.result.openid)
              console.log(res.result.openid) //返回值
            }
          })
        wx.getUserProfile({
        desc: '用户完善会员资料',
        })
        .then(res=>{
         console.log("res:",res);
        console.log("用户允许了微信授权登录",res.userInfo);
        //注意：此时不能使用 wx.switchTab，不支持参数传递
        wx.reLaunch({
            //将微信头像和微信名称传递给【我的】页面
            url: '/pages/me/me?nickName='+res.userInfo.nickName+'&avatarUrl='+res.userInfo.avatarUrl,
        })
        //保存用户登录信息到缓存
            
            wx.setStorageSync('userInfo', res.userInfo)
        })
        .catch(err=>{
            console.log("用户拒绝了微信授权登录",err);
        })
    } 
   },
   onShow(){
     wx.hideHomeButton()
   }
})