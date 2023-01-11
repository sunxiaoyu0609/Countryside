// pages/G_manage/index.js
let db = wx.cloud.database() 
Page({
  data: {
    instition:[],
    volunteer:[],
    // search:''
  },


  onLoad: function (options) {
    this.getInstition()
    this.getVolunteer()
    wx.hideHomeButton()
  },

  getInstition:function(e){
    let that=this
    db.collection('Institution').where({
      IStatus:1
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          instition:res.data
        })
      }
    })
  },

  getVolunteer:function(){
    let that=this
    db.collection('Volunteer').where({
      VStatus:2
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          volunteer:res.data
        })
      }
    })
  },

  goInsitiDetail:function(e){
    wx.navigateTo({
      url: '../G_man_institution/index?Iaccount='+e.currentTarget.dataset.insId,
    })
  },

  goVoliDetail:function(e){
    // console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../G_man_volunteer/index?id='+e.currentTarget.dataset.id,
    })
  },

  goHeiMingDan(){
    wx.navigateTo({
      url: '../G_man_heimingdan/index',
    })
  },  

  search(e){
    let that=this
    if(e.currentTarget.dataset.tag==1){
      if(e.detail==''){
          that.getInstition()
      }else{
        db.collection('Institution').where({
          IName : db.RegExp({
            regexp: e.detail,
            options:'i'
         })
        }).get({
            success: function(res) {
              that.setData({
                instition:res.data,
              })
            },
          })
      }
    }else{
      if(e.detail==''){
        that.getVolunteer()
        }else{
          db.collection('Volunteer').where({
            VName : db.RegExp({
              regexp: e.detail,
              options:'i'
           })
          }).get({
              success: function(res) {
                // console.log(res)
                that.setData({
                  volunteer:res.data,
                })
              },
            })
          }
    }
    
  }
  

 

 
})