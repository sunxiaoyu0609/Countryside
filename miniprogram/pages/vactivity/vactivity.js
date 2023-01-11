let db = wx.cloud.database() //设置数据库
Page({
  data: {
    openId:"",
    // 第一次查到的时间戳数组
    reactivities:[],
    // 转换过后的活动数组
    activities:[],
    // 是否展示空空如也
    isdiplay:"none"
  },
  onLoad: function (options) {
    let that=this
    wx.showLoading({ 
      title: "加载中",
      mask: true  
    });
    // 读取缓存，获取openId
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data,
        })  
      }
    })
    that.selectactivity()
    setTimeout(function() {
      that.fortransform()
      that.isdisplay()
      that.selectVStatus()
      wx.hideLoading();
    }, 2000);
   
  },
  // 查询活动信息
  selectactivity:function(){
        let that=this
        db.collection('Activity').orderBy("Aend","asc")
        .get({
          success: res => {   
            that.setData({
              reactivities: res.data,
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  //把时间戳转换为正常格式
  formatNumber:function(n){
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  formatTime:function(date) {
    var date = new Date(date);
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    return [year, month, day].map(this.formatNumber).join('/')
  },
  // 循环把活动数组中每个时间戳都转换成时间
  fortransform:function(){
    let that=this
    var timeStamp = Date.parse(new Date()); 
    for(var i=0;i<that.data.reactivities.length;i++){
      // 判断活动是否结束以及开始
      // 结束
      if(that.data.reactivities[i].AEndTime<timeStamp){
        that.data.reactivities[i].Aend=2
        db.collection('Activity')
        .where({
          _id: that.data.reactivities[i]._id
        })
        .update({
          data: {
            Aend:2
          }
        }).then((ress)=>{ 
        })
      }
      // 未开始
      else if(that.data.reactivities[i].AStartTime>timeStamp){
        that.data.reactivities[i].Aend=0
        db.collection('Activity')
        .where({
          _id: that.data.reactivities[i]._id
        })
        .update({
          data: {
            Aend:0
          }
        }).then((ress)=>{ 
        })
      }
      // 进行中
      else if(that.data.reactivities[i].AStartTime<=timeStamp&&that.data.reactivities[i].AEndTime>=timeStamp){
        that.data.reactivities[i].Aend=1
        db.collection('Activity')
        .where({
          _id: that.data.reactivities[i]._id
        })
        .update({
          data: {
            Aend:1
          }
        }).then((ress)=>{ 
        })
      }
      that.data.reactivities[i].AStartTime=that.formatTime(that.data.reactivities[i].AStartTime)
      that.data.reactivities[i].AEndTime=that.formatTime(that.data.reactivities[i].AEndTime)
    }
    that.setData({
      activities: that.data.reactivities
    })
  }, 
   // 搜索功能
  onSearch:function(event){
    let that=this
    db.collection('Activity').where({
      Aname:db.RegExp({
        regexp:event.detail,
        options:'i'
      })
    }).get({
      success(res){
        that.setData({
          reactivities: res.data
        })
        that.fortransform()
      }
    })
    that.isdisplay()
  },
  isdisplay:function(){
    let that=this
    setTimeout(function() {
      // 展示空空如也
      if(that.data.reactivities.length == 0){
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
  selectVStatus:function(event){
    let that=this
        db.collection('Volunteer').where({
          openId:that.data.openId
        }).get({
          success: res => {
            that.setData({
              VStatus:res.data[0].VStatus
            })
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  // 判断是否是志愿者
  beforeselectactivity(event){
    let that=this
    if(that.data.VStatus==0||that.data.VStatus==1){
      wx.showToast({
        title: '请先成为志愿者！',
        duration:3000,
        mask:true, 
        icon:'error', 
        complete:function(){ 
          setTimeout(function() {
            wx.navigateTo({
              url: '../authentication/authentication',
            })
        }, 1000);     
        },
      })
    }else if(that.data.VStatus==2){
      wx.navigateTo({
        url: '../vactivitydetails/vactivitydetails?_id='+event.currentTarget.dataset.id,
      })
    }
  },
})