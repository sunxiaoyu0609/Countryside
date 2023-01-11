let db = wx.cloud.database() //设置数据库
Page({
  data: {
    IName:"",
    Institution:[]
  },
  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
        that.selectInstitution()
      }
    })
    wx.hideHomeButton()
  },
  selectInstitution(){
    let that=this
    db.collection('Institution').where({
      IName:that.data.IName,
    }).get({
      success: res => {
        that.setData({
          Institution:res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 登出
  loginout(){
    wx.reLaunch({
      url: '../Inslogin/Inslogin',
    })
  }
})