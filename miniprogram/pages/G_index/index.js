// pages/index/index.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    // 轮播图
    RImage:[],
    swiperCurrent:"",

  },

  onLoad: function (options) {
    this.SelectRotationMap()
    wx.hideHomeButton()
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
        // console.log(res)
        that.setData({
          RImage:res.data
        })  
      } 
    })
  },
  
  toModifyCrousel:function(){
    wx.navigateTo({
      url: '../G_index_crousel/index',
    })
  },


})