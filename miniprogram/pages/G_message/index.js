// miniprogram/pages/G_message/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let db = wx.cloud.database() //设置数据库
Page({

  data: {
    identifyrequest:[],
    activityrequest:[],
    suishoupai:[],
    volrequst:[],

    identify:0,
    activity:0,
    sui:0,
    volunteer:0,
    all:0,

    show: false,
    feedback:'',
    fid:''
  },

  onLoad: function (options) {
    let that=this
    this.getmessage()
    this.getIdentifyReq()
    this.getActivityReq()
    this.getSuishoupai()
    this.getVolReq()
    wx.hideHomeButton()
  },

  getmessage:async function(e){
    let that=this
    var count1 = await db.collection('Activity').where({
      AStatus: 0
    }).count()
    // console.log(count1)
    this.setData({
      activity:count1.total
    })
 
    var count2 = await db.collection('Institution').where({
      IStatus:0
    }).count()
    // console.log(count2)
    this.setData({
      identify:count2.total
    })
    
    var count3 = await db.collection('Handclap').where({
      Feedbackstatus:0
    }).count()
    // console.log(count3)
    that.setData({
      sui:count3.total
    })

    var count4 = await db.collection('Volunteer').where({
      VStatus:1
    }).count()
    this.setData({
      volunteer:count4.total
    })

    this.setData({
      all:this.data.identify+this.data.activity+this.data.sui+this.data.volunteer
    })
    
  },
  
  //机构认证
  getIdentifyReq: function(e){
    let that=this
    db.collection('Institution').where({
      IStatus:0
    }).get({
      success: function(res) {
        that.setData({
          identifyrequest:res.data
        })
      } 
    })
   },

   //志愿者申请
  getVolReq: function(e){
    let that=this
    db.collection('Volunteer').where({
      VStatus:1
    }).get({
      success: function(res) {
        that.setData({
          volrequst:res.data
        })
      } 
    })
   },

   //活动
   getActivityReq: function(e){
    let that=this
    db.collection('Activity').where({
        AStatus: 0
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          activityrequest:res.data
        })
      },
    })
  },

  //随手拍
  getSuishoupai:function(e){
    let that = this
    db.collection('Handclap').where({
      Feedbackstatus:0
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          suishoupai:res.data
        })
      },
    })
  },

  //关闭反馈
  onClose() {
    this.setData({ 
      show: false,
      fid:''
     });
  },
  //打开反馈
  openFeedback(e){
    this.setData({ 
      show: true,
      fid:e.currentTarget.dataset.fid
    });
  },

  goIdenDetail:function(e){
    wx.navigateTo({
      url: '../G_mes_identify/index?Iaccount='+e.currentTarget.dataset.identityId,
    })
  },

  goActDetail:function(e){
    wx.navigateTo({
      url: '../G_mes_activity/index?id='+e.currentTarget.dataset.activityId,
    })
  },

  goVolDetail:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../G_mes_volunteer/index?id='+e.currentTarget.dataset.id,
    })
  },
  
  submitI(e){
    let that = this
    // console.log(e)
    db.collection('Institution').doc(e.currentTarget.dataset.id).update({
      data:{
        IStatus:parseInt(e.currentTarget.dataset.view)
      },
      success:function(res){ 
        //刷新
        that.getIdentifyReq()
        that.getmessage()
      }
    })
  },

  submitV(e){
    let that = this
    // console.log(e)
    db.collection('Volunteer').doc(e.currentTarget.dataset.id).update({
      data:{
        VStatus:parseInt(e.currentTarget.dataset.view)
      },
      success:function(res){ 
        //刷新
        that.getVolReq()
        that.getmessage()
      }
    })
  },

  submitA(e){
    let that = this
    db.collection('Activity').doc(e.currentTarget.dataset.id).update({
      data:{
        AStatus:parseInt(e.currentTarget.dataset.view)
      },
      success:function(res){ 
        //刷新
        that.getActivityReq()
        that.getmessage()
      }
    })
  },

  submitS(e){
    // console.log(e)
    let that = this
    db.collection('Handclap').doc(that.data.fid).update({
      data:{
        feedback:that.data.feedback,
        Feedbackstatus:parseInt(1)
      },success(){
        that.setData({
          fid:'',
          feedback:''
        })
        that.getSuishoupai()
        that.getmessage()
      }
    })
  }
  

})