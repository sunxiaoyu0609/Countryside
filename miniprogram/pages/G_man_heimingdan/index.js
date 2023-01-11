let db = wx.cloud.database() 
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({
  data: {
    instition:[],
    volunteer:[],
  },


  onLoad: function (options) {
    this.getInstition()
    this.getVolunteer()
    wx.hideHomeButton()
  },

  getInstition:function(e){
    let that=this
    db.collection('Institution').where({
      IStatus:2
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
      VStatus:0
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
    wx.navigateTo({
      url: '../G_man_volunteer/index?id='+e.currentTarget.dataset.id,
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
    
  },

  recover(e){ 
    // console.log(e)
    let that=this
    Dialog.confirm({
      title: '确定恢复此机构认证吗？'
    }).then(() => {
      db.collection('Institution').doc(e.currentTarget.dataset.id).update({
        data:{
          IStatus:parseInt(1)
        },
        success(res){
          that.getInstition()
        }
      })
    }).catch(() => {
    });
  },

  cancel(e){
    let that=this
    Dialog.confirm({
      title: '确定取消该志愿者的封锁吗？'
    }).then(() => {
      db.collection('Volunteer').doc(e.currentTarget.dataset.id).update({
        data:{
          VStatus:parseInt(2)
        },
        success(res){
          that.getVolunteer()
        }
      })
    }).catch(() => {
    });
  }
  

 

 
})