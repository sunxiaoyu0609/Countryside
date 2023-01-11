const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    loginOk:true,
    nickName:"",
    avatarUrl:defaultAvatarUrl,
    Vevaluate:0,// 评分
    VIntegral:0,//积分
    wxname:"",
    openId:"",
    VStatus:0,
    showShare: false,
  },
  //页面加载的时候，将load页面传过来的值获取过来
  onLoad: function (options) {
    let that=this
    console.log("这里的options",options);
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          nickName:res.data.nickName,
          avatarUrl:res.data.avatarUrl
        })  
      }
    })
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
        that.selectVevaluateandVIntegral()
    }, 500);
  },

  //小程序声明周期的可见性函数里面来控制显示
  onShow(){
    let userInfo = wx.getStorageSync('userInfo')
    let openId = wx.getStorageSync('openId')
    console.log("我的缓存信息",userInfo);
    console.log("openId:",openId);
    if(userInfo){
    this.setData({
      loginOk:true,
      nickName:userInfo.nickName,   //从缓存中拿数据
      avatarUrl:userInfo.avatarUrl
    })
    }else{
    this.setData({
      loginOk:false
    }) 
    }
  }, 
  //点击登录
  load(){
      wx.navigateTo({
        url: '/pages/load/load',
      })
  },
  //退出登录
  exit(){
      wx.showModal({
        content:"确定退出吗"
      }).then(res=>{
        if(res.confirm){
        console.log("用户点击了确定");
        this.setData({
          loginOk:false
        })
        //清空登录的缓存
      wx.setStorageSync('userInfo', null)
        }else if(res.cancel){
          console.log("用户点击了取消");
        }
      })
  },
  selectVevaluateandVIntegral:function(event){
    let that=this  
    db.collection('Volunteer').where({
      openId:that.data.openId
    }).get({
      success: res => {
        that.setData({
          Vevaluate: res.data[0].Vevaluate,
          VIntegral: res.data[0].VIntegral,
          VStatus:res.data[0].VStatus
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  navigator(){
    let that=this
    if(that.data.VStatus==1){
      wx.showToast({
        title: '等待管理员审核',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.showToast({
        title: '已是志愿者啦',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==0){
      wx.navigateTo({
        url: '../authentication/authentication',
      })
    }
  },
  quanxian0(){
    wx.navigateTo({
      url: '../message/message',
    })
  },
  quanxian1(){
    let that=this
    if(that.data.VStatus==1||that.data.VStatus==0){
      wx.showToast({
        title: '请先成为志愿者',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../RankingList/RankingList',
      })
    }
  },
  quanxian3(){
    let that=this
    if(that.data.VStatus==1||that.data.VStatus==0){
      wx.showToast({
        title: '请先成为志愿者',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../myshare/myshare',
      })
    }
  },
  quanxian2(){
    let that=this
    if(that.data.VStatus==1||that.data.VStatus==0){
      wx.showToast({
        title: '请先成为志愿者',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../handclap/handclap',
      })
    }
  },
  quanxian4(){
    let that=this
    if(that.data.VStatus==1||that.data.VStatus==0){
      wx.showToast({
        title: '请先成为志愿者',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../myinfo/myinfo',
      })
    }
  },
  quanxian5(){
    this.setData({ showShare: true });
  },
  onTabItemTap(item){
    let that=this
    that.onLoad()
  },
  onClose() {
    let that=this
    that.setData({ showShare: false });
  },
  // 登出
  loginout(){
    wx.reLaunch({
      url: '../login/login',
    })
  }
 })