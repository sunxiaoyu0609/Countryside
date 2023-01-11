let db = wx.cloud.database() //设置数据库
Page({
  data: {
    active: 0,
    IName:"",
    isdiplay:"none"
  },

  onLoad: function (options) {
    wx.hideHomeButton()
    let that=this
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
          // 默认查找未开始活动
        db.collection('Activity').where({
          IName:that.data.IName,
          AStatus:1,
          Aend:0
        }).get({
          success: res => {
            if(res.data.length==0){
              that.setData({
                isdiplay: "block"
              })
            }else{
              that.setData({
                isdiplay: "none"
              })
            }
            that.setData({
              records: res.data
            })
            wx.hideLoading()
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
      }
    })
  
  },
  onChange(event) {
    let that=this
    if(event.detail.name==0){
      wx.showLoading({
        title: '加载中',
      })
      db.collection('Activity').where({
        IName:that.data.IName,
        AStatus:1,
        Aend:0
      }).get({
        success: res => {
          if(res.data.length==0){
            that.setData({
              isdiplay: "block"
            })
          }else{
            that.setData({
              isdiplay: "none"
            })
          }
          that.setData({
            records: res.data
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }else if(event.detail.name==1){
      wx.showLoading({
        title: '加载中',
      })
      db.collection('Activity').where({
        IName:that.data.IName,
        AStatus:1,
        Aend:1
      }).get({
        success: res => {
          if(res.data.length==0){
            that.setData({
              isdiplay: "block"
            })
          }else{
            that.setData({
              isdiplay: "none"
            })
          }
          that.setData({
            records: res.data
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }else if(event.detail.name==2){
      wx.showLoading({
        title: '加载中',
      })
      db.collection('Activity').where({
        IName:that.data.IName,
        AStatus:1,
        Aend:2
      }).get({
        success: res => {
          if(res.data.length==0){
            that.setData({
              isdiplay: "block"
            })
          }else{
            that.setData({
              isdiplay: "none"
            })
          }
          that.setData({
            records: res.data
          })
          wx.hideLoading()
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }
  },
})