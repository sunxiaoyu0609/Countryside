// pages/G_man_volunteer/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let db=wx.cloud.database()
const _= db.command;
Page({

  data: {
    volunteer:{},
    show:false,
    message:''
  },

  onLoad: function (options) {
    this.getVolunteer(options.id)
    wx.hideHomeButton()
  },
  
  getVolunteer:function(e){
    let that=this
    db.collection('Volunteer').where({
      _id:e
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          volunteer:res.data[0]
        })
      } 
    })
  },

  lock(){
    let that=this
    Dialog.confirm({
      title: '确定封锁志愿者吗？'
    }).then(() => {
      db.collection('Volunteer').doc(that.data.volunteer._id).update({
        data:{
          VStatus:parseInt(0)
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

  //关闭消息窗口
  onClose() {
    this.setData({ 
      show: false,
    });
  },
  //打开消息窗口
  onOpen(e){
    this.setData({ 
      show: true
    });
  },

  sendMessge(e){
    var timestamp = Date.parse(new Date());
    // console.log(e)
    let that = this
    db.collection('message').add({
      data:{
        openid:that.data.volunteer.openId,
        vmessage:that.data.message,
        _createTime:timestamp
      },
      success(res){
        // console.log(res)
        that.setData({
          message:''
        })
      }
    })
  },

  cancel(e){
    let that=this
    Dialog.confirm({
      title: '确定取消该志愿者的封锁吗？'
    }).then(() => {
      db.collection('Volunteer').doc(that.data.volunteer._id).update({
        data:{
          VStatus:parseInt(2)
        },
        success(res){
          wx.reLaunch({
            url: '../G_man_heimingdan/index',
          })
        }
      })
    }).catch(() => {
    });
  }

})