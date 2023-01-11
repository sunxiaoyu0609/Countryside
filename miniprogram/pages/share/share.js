let db = wx.cloud.database() //设置数据库
const utils = require('../utils/utils.js');
Page({    
  data: {
    avatarUrl:"",
    wxname:"",
    share:[]
  },
  onLoad: function (options) {
    let that=this
    wx.showLoading({
      title: '加载中',
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
    // 读取缓存，获取名字头像
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          wxname:res.data.nickName,
          avatarUrl:res.data.avatarUrl
        })
        // 查询心得
        that.selectshare()
        wx.hideLoading({})
      }
    })
   
  },
  url(){
    wx.navigateTo({
      url: '../share_upload/share_upload',
    })
  },
  //查询活动心得分享
  selectshare(){
    let that=this
    db.collection('share')
    .orderBy("_createTime","desc")
        .get({
          success: res => {  
            console.log(that.transform(res.data))
            that.setData({
              share: res.data,
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  // 将时间戳转换成时间
  transform(event){
    let that=this
    for(var i=0;i<event.length;i++){  
      event[i]._createTime=utils.formatTimeTwo(event[i]._createTime/1000,"Y-M-D h:m:s")
    }
    return event
  },

  // 下拉刷新 
  onPullDownRefresh:function(){
    this.onLoad()
  },
  //预览图片，放大预览
  preview(event) {
    let currentUrl = event.currentTarget.dataset.src
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: event.currentTarget.dataset.images // 需要预览的图片http链接列表
    })
  }
})