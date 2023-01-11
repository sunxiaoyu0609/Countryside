// pages/G_man_volunteer/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let db=wx.cloud.database()
const _= db.command;
Page({

  data: {
    volunteer:{},
    radio: 2,//审批意见选择
  },

  
  onLoad: function (e) {
    this.getVolunteer(e.id)
    wx.hideHomeButton()
  },
  
  getVolunteer:function(e){
    let that=this
    db.collection('Volunteer').where({
      _id:e
    }).get({
      success: function(res) {
        that.setData({
          volunteer:res.data[0]
        })
        // console.log(that.data.volunteer)
      } 
    })
  },

  submit(e){
    let that = this
    db.collection('Volunteer').doc(e.currentTarget.dataset.id).update({
      data:{
        VStatus:parseInt(that.data.radio)
      },
     success:function(res){ 
       wx.reLaunch({
         url: '../G_message/index',
       })
       // console.log(res)
     }
    })
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


  
})