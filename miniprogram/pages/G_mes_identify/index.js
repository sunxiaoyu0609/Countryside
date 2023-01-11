// pages/G_mes_identify/index.js
let db=wx.cloud.database()
Page({
  data: {
    idenReqDetail:[],
    radio: '1',//审批意见选择
  },

  onLoad: function (options) {
    this.getIdenReqDetail(options.Iaccount)
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
    // console.log(this.data.radio)
  },
  
  //获取数据
  getIdenReqDetail: function(e){
  let that=this
  db.collection('Institution')
    .where({
      Iaccount:e
    })
    .get({
      success: function(res) {
        // console.log(res)
        that.setData({
          idenReqDetail:res.data[0]
        })
        // console.log(res.data)
      } 
    })
    // console.log(this.data.idenReqDetail)
 },

 //提交审批
 submit(e){
   let that = this
   db.collection('Institution').doc(e.currentTarget.dataset.id).update({
     data:{
      IStatus:parseInt(that.data.radio)
     },
    success:function(res){ 
      wx.reLaunch({
        url: '../G_message/index',
      })
      // console.log(res)
    }
   })
 }
    
})