// pages/team/team.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    Institution:[],
    // 是否展示空空如也
    isdiplay:"none"
  },
  onLoad: function (options) {
    this.selectInstitution()
    this.isdisplay()
  },
  // 查找机构信息
  selectInstitution:function(){
    db.collection('Institution')
    .get({
      success: res => {
        this.setData({
          Institution: res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 搜索功能
  onSearch:function(event){
    let that=this
    db.collection('Institution').where({
      IName:db.RegExp({
        regexp:event.detail,
        options:'i'
      })
    }).get({
      success(res){
        that.setData({
          Institution: res.data
        })
      }
    })
    this.isdisplay()
  },
  isdisplay:function(){
    let that=this
    setTimeout(function() {
      // 展示空空如也
      if(that.data.Institution.length == 0){
        that.setData({
         isdiplay: "block"
       })
     }else{
      that.setData({
         isdiplay: "none"
       })
     }
  }, 800);
  }
})