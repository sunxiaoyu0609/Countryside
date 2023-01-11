// pages/G_mes_activity/index.js
let db=wx.cloud.database()
var time = require('../utils/utils');
Page({
  data: {
    actReqDetail:[],//活动
    radio: '1',//审批意见选择
    reason:''
  },

  onLoad: function (options) {
    this.getActReqDetail(options.id)
    wx.hideHomeButton()
  },
  
  // 审批意见改变
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
  },

  //获取数据
  getActReqDetail: function(e){
    let that=this
    db.collection('Activity').where({
        _id:e
    }).get({
      success: function(res) {
        // console.log(res)
        var activity=res.data[0]
        activity.AStartTime=time.formatTimeTwo(activity.AStartTime,'Y-M-D')
        activity.AEndTime=time.formatTimeTwo(activity.AEndTime,'Y-M-D')
        that.setData({
          actReqDetail:res.data[0]
        })
        // console.log(that.data.actReqDetail)
      },
    })
  },

  //提交审批
  submit(e){
    let that = this
    db.collection('Activity').doc(e.currentTarget.dataset.id).update({
      data:{
        AStatus:parseInt(that.data.radio),
        AReason:that.data.reason
      },
      success:function(res){ 
        // console.log(res)
        wx.reLaunch({
          url: '../G_message/index',
        })
      }
    })
  },

  //获取理由
  getReason(e){
    this.setData({
      reason:e.detail.value
    })
    // console.log(this.data.reason)
  }
})