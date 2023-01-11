// pages/G_man_institution/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let db=wx.cloud.database()
Page({

  data: {
    institution:[],
  },
  
  onLoad: function (options) {
    this.getInstitution(options.Iaccount)
    wx.hideHomeButton()
  },
  //获取数据
  getInstitution: function(e){
    let that=this
    db.collection('Institution')
      .where({
        Iaccount:e
      })
      .get({
        success: function(res) {
          // console.log(res)
          that.setData({
            institution:res.data[0]
          })
        } 
      })
   },

   lock(){
    let that=this
    Dialog.confirm({
      title: '确定取消该机构的认证吗？'
    }).then(() => {
      db.collection('Institution').doc(that.data.institution._id).update({
        data:{
          IStatus:parseInt(2)
        },
        success:function(res){
          wx.reLaunch({
            url: '../G_manage/index',
          })
        }
      })
    }).catch(() => {
        // on cancel
    });
  },

  recover(e){ 
    // console.log(e)
    let that=this
    Dialog.confirm({
      title: '确定恢复此机构认证吗？'
    }).then(() => {
      db.collection('Institution').doc(that.data.institution._id).update({
        data:{
          IStatus:parseInt(1)
        },
        success(res){
          wx.reLaunch({
            url: '../G_man_heimingdan/index',
          })
        }
      })
    }).catch(() => {
    });
  },

})