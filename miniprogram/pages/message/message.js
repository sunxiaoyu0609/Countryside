let db = wx.cloud.database() //设置数据库
Page({
  data: {
    openId:"",
    message:[]
  },
  onLoad(options) {
    let that=this
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data
        })        
          that.selectinfo()  
      }
    }) 
  },
  selectinfo(){   
    let that=this
    db.collection('message').orderBy('_createTime','desc').where({
      openid:that.data.openId
    }).get({
      success: res => {
        that.setData({
          message:res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  delete(event){
    let that=this
    wx.showModal({
      content: '确认删除？',
      success (res) {
        // 确认
        if (res.confirm) {
          // 判断信息是否有误
          db.collection('message').where({
            _id: event.currentTarget.dataset.id
          }).remove().then(res => {
            console.log('删除成功')
            that.onLoad()
          }).catch(err => {
            console.log('删除失败',err)//失败提示错误信息
          })
        }
      }
    })
  }
})