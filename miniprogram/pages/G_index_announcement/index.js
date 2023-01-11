// pages/G_index_announcement/index.js
let db = wx.cloud.database() 
Page({

  data: {
    announce:'',
    newAnnounce:''
  },


  onLoad: function (options) {
    this.getAnnouncement()
    wx.hideHomeButton()
  },
  getAnnouncement:function(){
      let that=this
      db.collection('Notice').get({
        success:function(res){
          that.setData({
            announce:res.data[0]
          })
          // console.log(that.data.announce)
        }
      })  
  },
  getNewAnnounce:function(e){
    this.setData({
          newAnnounce:e.detail.value
     })
  },
  modifyAnnounce:function(){
    let that = this
    // console.log(this.data.newAnnounce)
    db.collection('Notice').doc('68426679628b48fa035c4b2d04568da8').update({
      data:{
        NContent:that.data.newAnnounce
      },
      success:function(res){
        that.getAnnouncement()
        that.setData({
          newAnnounce:''
        })
        // console.log(res)
      }
    })
  }
 
})