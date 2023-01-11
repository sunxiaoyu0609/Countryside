// pages/G_index_act_detail/index.js
let db=wx.cloud.database()
Page({
  
  data: {
    actReqDetail:[],//活动
  },
  
  onLoad: function (options) {
    // console.log(options)
    this.getActReqDetail(options.id)
    wx.hideHomeButton()
  },

  //获取数据
  getActReqDetail: function(e){
    let that=this

    db.collection('Activity').where({
        _id:e
    }).get({
      success: function(res) {
        let activity=res.data[0]
        let astart=that.timeform(activity.AStartTime/1000)
        let aend=that.timeform(activity.AEndTime/1000)
        activity.AStartTime=astart
        activity.AEndTime=aend
        // console.log(activity.AStartTime)
        // onsole.log(activity.AEndTime)
        // console.log(activity)
        // console.log(res.data[0])
        console.log("activity",activity)
        that.setData({
          actReqDetail:res.data[0]
        })   
      },
    })
  },

  timeform(e){
    var time = require('../utils/utils');
    return time.formatTimeTwo(e,'Y-M-D');
  }
})