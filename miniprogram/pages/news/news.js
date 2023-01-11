// pages/voluntarystyle/voluntarystyle.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    news:[]
  },
  onLoad: function (options) {
    let that=this
    db.collection('news').get({
      success: function(res) {
        that.setData({
          news:res.data
        })  
      }
    })
  }
})