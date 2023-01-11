// pages/voluntarystyle/voluntarystyle.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    Link:[]
  },
  onLoad: function (options) {
    let that=this
    db.collection('Link').get({
      success: function(res) {
        that.setData({
          Link:res.data
        })  
      }
    })
  }
})