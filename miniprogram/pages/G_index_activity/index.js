// pages/G_index_activity/index.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    activity:[],
    // search:''
  },

  onLoad: function (options) {
    this.getActivity()
    wx.hideHomeButton()
  },

  //初始
  getActivity: function(e){
    let that=this
    db.collection('Activity').where({
        AStatus: 1
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          activity:res.data
        })
      },
    })
  },

  // getSearch(e){
  //   // console.log(e)
  //   this.setData({
  //     search: e.detail.value
  //   })
  // },

  search(e){
    let that=this
    if(e.detail==''){
      that.getActivity()
    }else{
      db.collection('Activity').where({
          Aname:db.RegExp({
             regexp: e.detail,
             options:'i'
          })
      }).get({
          success: function(res) {
            // console.log(res)
            that.setData({
              activity:res.data,
            })
          },
        })
    }
  }
  
})