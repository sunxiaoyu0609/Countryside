let db = wx.cloud.database() //设置数据库
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  data: {
      name:'',
      password:''
    },
    onLoad(){
      wx.hideHomeButton()
    },
    login: function(){
      let that=this
      var count=db.collection('admin').where({
        Name: that.data.name,
        PassWord:that.data.password
      }).get({
        success(res){
          // console.log(res)
          if(res.data.length==0){
            Toast('用户名或密码错误！');
          }else{
            wx.setStorageSync('user',res.data[0])
            // console.log( wx.getStorageSync('user'))
            wx.navigateTo({
              url: '../G_index/index',
            })
          }
            
        }
      })

  
      
    },
    login2(){
      wx.reLaunch({
        url: '../login/login',
      })
    }
  
})