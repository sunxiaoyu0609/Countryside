let db = wx.cloud.database() //设置数据库
const utils = require('../utils/utils');
var time = require('../utils/utils');
Page({
  data: {
    IName:"",
    discuss:[],
    show: false,
    reply:"",
    isdiplay:"none"
  },
  onLoad: function (options) {
    let that=this
    wx.hideHomeButton()
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
        that.selectdiscuss()
      }
    })
  },
  selectdiscuss(event){
    let that=this
    wx.showLoading({ 
      title: "加载中",
      mask: true  
    });
    db.collection('discuss').where({
      IName:that.data.IName,
      isreply:0
    }).orderBy("_createTime","desc").get({
      success: res => {
        if(res.data.length==0){
          that.setData({
            isdiplay:"block"
          })
        }else{
        res.data=that.transtime(res.data)
        that.setData({
          isdiplay:"none",
          discuss: res.data
        })
      }    
        wx.hideLoading()
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 转换时间戳
  transtime(event){
    for(var i=0;i<event.length;i++){
        event[i].rtime=utils.formatTimeTwo(event[i]._createTime/1000,'Y/M/D h:m:s')
    }
    return event
  },
  //  回复内容
  onChange(event){
    let that=this
    that.setData({
      reply:event.detail
    })
  },
  // 提交回复
  submit(event){
    let that=this
    wx.showModal({
      content: '请确认填写位置是否正确',
      success (res) {
          // 确认
          if (res.confirm) {
            wx.showLoading({ 
              title: "加载中",
              mask: true  
            });
            db.collection('discuss')
            .where({
              _id:event.currentTarget.dataset.id
            })
            .update({
              data: {
                answer:that.data.reply,
                isreply:1
              }
            }).then((ress)=>{
               // 设置3秒休眠时间再跳转
              wx.showToast({
                title: '回复成功',
                icon: 'succes',
                duration: 2000,
                mask: true
              }) 
              that.setData({
                reply:""
              })
              wx.hideLoading()    
             that.onLoad()
            })
          }
      }
    })


    
    
  }
})