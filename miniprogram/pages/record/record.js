let db = wx.cloud.database() //设置数据库
Page({
  data: {
    openId:"",
    Aids:"",
    records:[],
    isdiplay:"none"
  },
  onLoad: function (options) {
    let that=this
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    });
    // 读取缓存，获取openId
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data,
        })  
      that.selectAid()
      setTimeout(function() {
        that.isdisplay()
        //隐藏加载界面
        that.selectrecordbyAid()
        wx.hideLoading();
      }, 2000);     
      }
    })  
    wx.stopPullDownRefresh()
  },
  selectAid(){
    let that=this
        db.collection('SignUp')
        .where({
          openId:that.data.openId
        }).orderBy("Aend","asc")
        .get({
          success: res => {   
            that.setData({
              Aids: res.data,
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  // 根据Aid查找活动信息
  selectrecordbyAid(){
    let that=this
    for(var i=0;i<that.data.Aids.length;i++){
      console.log("aaa",i)
      db.collection('Activity').where({
        _id:that.data.Aids[i].A_id
      }).get({
        success: res => {
          that.setData({
            records: that.data.records.concat(res.data[0])
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }
  },
  isdisplay:function(){
    let that=this
    setTimeout(function() {
      // 展示空空如也
      if(that.data.records.length == 0){
        that.setData({
         isdiplay: "block"
       })
     }else{
      that.setData({
         isdiplay: "none"
       })
     }
  }, 800);
  },
  // onTabItemTap(item){
  //   let that=this
  //   that.setData({
  //     records:[]
  //   })
  //   that.onLoad()
  // }
  onPullDownRefresh(){
    let that=this
    that.setData({
      records:[]
    })
    that.onLoad()
  }
})