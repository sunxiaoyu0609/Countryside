// pages/index/index.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    // 轮播图
    RImage:[],
    swiperCurrent:"",
    // 公告
    content:"",
    //政府发布的新闻知识，学知识板块的部分内容
    news:[],
    openId:"",
    VStatus:""
  },

  onLoad: function (options) {
    let that=this
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    });
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
      that.SelectRotationMap()
      that.SelectNotice()
      that.SelectNews() 
      that.selectVStatus()
      wx.hideLoading();
  }, 500); 
  },
  // 轮播图
  swiperChange: function (e) {  //指示图标
    this.setData({
      swiperCurrent:e.detail.current
    })
  },
  SelectRotationMap:function(){
    let that=this
    db.collection('RotationMap').get({
      success: function(res) {
        that.setData({
          RImage:res.data
        })  
      }
    })
  },
  SelectNotice:function(){
    let that=this
    db.collection('Notice').get({
      success: function(ress) {
        that.setData({
          content:ress.data[0].NContent
        })  
      }
    })
  },
  SelectNews:function(){
    let that=this
    db.collection('news').get({
      success: function(ress) {
        that.setData({
          news:ress.data
        })  
      }
    })
  },
  // 查询志愿者状态
  selectVStatus:function(event){
    let that=this
    db.collection('Volunteer').where({
        openId:that.data.openId
        }).get({
          success: res => {
            that.setData({
              VStatus:res.data[0].VStatus
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  // 权限控制
  quanxian1(){
    let that=this
    if(that.data.VStatus==0||that.data.VStatus==1){
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
  quanxian2(){
    let that=this
    if(that.data.VStatus==0||that.data.VStatus==1){
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
    if(that.data.VStatus==0||that.data.VStatus==1){
      wx.showToast({
        title: '请先成为志愿者',
        duration:1000,
        mask:true,
        icon:'error', 
     })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../share/share',
      })
    }
  },
  onTabItemTap(item){
    let that=this
    that.onLoad()
  }
})