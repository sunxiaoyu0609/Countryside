let db = wx.cloud.database() //设置数据库
const utils = require('../utils/utils.js');
Page({
  data: {
    activeName: '0',
    // 第一次查到的时间戳数组
    reactivities:[],
    // 转换过后的活动数组
    activities:[],
    IName:"",
    Institution:[],
    // 志愿者名字
    VName:"",
    openId:"",
    Sstatus:0,
    // 已报名的志愿者
    signup:[],
    Volunteers:[],
    // 问题
    problem:"",
    A_id:"",
    // 评论
    discuss:[],
    VName:"",
    time:""
    },
    onLoad: function (options) {
      let that=this
      // 读取缓存，获取openId
      wx.getStorage({
        key: 'openId',
        success(res) {
          that.setData({
            openId:res.data,
          })  
        }
      })
      wx.getStorage({
        key: 'userInfo',
        success(res) {
          that.setData({
            avatarUrl:res.data.avatarUrl
          })
        }
      })
      that.beforeselectactivity(options)
      that.selectactivity(options)
      setTimeout(function() {
        that.selectInstitution()
        that.ifsign()
        that.selectdiscuss()
        that.selectVName()
        that.selectsignup(that.data.A_id)
      }, 4000);  
    },
    onChange(event) {
      this.setData({
        activeName: event.detail,
      });
    },
    // 查询活动信息
    beforeselectactivity(event){
      if(event!=null){
        wx.setStorageSync('A_id',event._id)
      }   
    },
    selectactivity:function(event){
      let that=this
      wx.showLoading({ 
        title: "加载中",
        mask: true  
      });
      wx.getStorage({
        key: 'A_id',
        success(res) {
          that.setData({
            A_id:res.data
          })
        }
      }) 
      setTimeout(function() {
        db.collection('Activity').where({
          _id:that.data.A_id
        })
        .get({
          success: res => {  
            that.setData({
              reactivities: res.data,
              IName:res.data[0].IName
            })
            that.fortransform()
            wx.hideLoading();
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
      }, 3000);  
     
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
      for(var i=0;i<that.data.reactivities.length;i++){
        that.data.reactivities[i].AStartTime=that.formatTime(that.data.reactivities[i].AStartTime)
        that.data.reactivities[i].AEndTime=that.formatTime(that.data.reactivities[i].AEndTime)
      }
      console.log(that.data.reactivities)
      that.setData({
        activities: that.data.reactivities
      })
    }, 
    // 查询机构信息
    selectInstitution(){
      let that=this
      db.collection('Institution').where({
        IName:that.data.IName
      })
      .get({
        success: res => {  
          that.setData({
            Institution: res.data
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    },
    // 报名功能
    submit(){
      let that=this
      console.log(that.data.activities)
      if(that.data.activities[0].Aend==2){
        wx.showToast({
          title: '活动已结束',
          icon: 'error',
          duration: 500,
          mask: true
          })  
      }
      else if(that.data.activities[0].Aend==1 ){
        wx.showModal({
          content: '确认报名？中途报名只有一半积分奖励噢',
          success (res) {
            if(res.confirm){
              if(that.data.Sstatus==1){
                wx.showToast({
                  title: '您已报名',
                  icon: 'error',
                  duration: 500,
                  mask: true
                  })   
              }
              else{
                // 获取时间
                var timeStamp = Date.parse(new Date()); 
                db.collection('SignUp').add({
                  data: {
                    A_id:that.data.activities[0]._id,
                    openId:that.data.openId,
                    IName:that.data.IName,
                    Sstatus:1,
                    _createTime:timeStamp
                  }
                }).then(res => {
                  console.log("报名数据数据插入成功")
                  wx.showToast({
                    title: '报名成功',
                    icon: 'succes',
                    duration: 3000,
                    mask: true,
                    })    
                    setTimeout(function() {
                      that.onLoad()
                  }, 2000);         
                }).catch(err => {
                  console.log('添加失败',err)//失败提示错误信息
                })
              } 
            }        
          }
        })
      }
      else{
        wx.showModal({
          content: '确认报名？',
          success (res) {
            if(res.confirm){
              if(that.data.Sstatus==1){
                wx.showToast({
                  title: '您已报名',
                  icon: 'error',
                  duration: 500,
                  mask: true
                  })   
              }
              else{
                // 获取时间
                var timeStamp = Date.parse(new Date()); 
                db.collection('SignUp').add({
                  data: {
                    A_id:that.data.activities[0]._id,
                    openId:that.data.openId,
                    IName:that.data.IName,
                    Sstatus:1,
                    _createTime:timeStamp
                  }
                }).then(res => {
                  console.log("报名数据数据插入成功")
                  wx.showToast({
                    title: '报名成功',
                    icon: 'succes',
                    duration: 2000,
                    mask: true,
                    })  
                  setTimeout(function() {
                      that.onLoad()
                  }, 2000);        
                }).catch(err => {
                  console.log('添加失败',err)//失败提示错误信息
                })
              } 
            }        
          }
        })
      }  
    },
    // 查看志愿者是否报名
    ifsign(){
      let that=this
      db.collection('SignUp').where({
        openId:that.data.openId,
        A_id:that.data.A_id
      })
      .get({
        success: res => {  
          that.setData({
            Sstatus: res.data[0].Sstatus
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    },
    // 根据活动id查找报名志愿者
    selectsignup(event){
      let that=this
      db.collection('SignUp').where({
        A_id:that.data.A_id
      }).orderBy("_createTime","desc")
      .get({
        success: res => {  
          that.setData({
            signup:res.data
          })
          console.log(res.data)
          that.selectbyopenid(res.data)
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    },
    // 根据上边函数查找到的多个openid查找对应人的信息
    selectbyopenid(event){
      var a=0
      let that=this
      for(var i=0;i<event.length;i++){
        db.collection('Volunteer').where({
          openId:event[i].openId
        }).get({
          success: res => {
            // 防止自己头像出现两次
            for(var j=0;j<that.data.Volunteers.length;j++){
                if(that.data.Volunteers[j].openId==res.data[0].openId){
                  a=1
                }
            }
            if(a==0){
              that.setData({
                Volunteers: that.data.Volunteers.concat(res.data[0])
              })
            }  
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
      }    
    },
    // 提问
    questionsubmit(){
      let that=this
      wx.showModal({
        content: '确认发布？',
        success (res) {
          if(res.confirm){
              // 获取时间
              var timeStamp = Date.parse(new Date()); 
              db.collection('discuss').add({
                data: {
                  Aname:that.data.activities[0].Aname,
                  A_id:that.data.activities[0]._id,
                  openId:that.data.openId,
                  IName:that.data.IName,
                  problem:that.data.problem,
                  avatarUrl:that.data.avatarUrl,
                  VName:that.data.VName,
                  isreply:0,
                  _createTime:timeStamp
                }
              }).then(res => {
                console.log("评论数据数据插入成功")
                wx.showToast({
                  title: '评论成功',
                  icon: 'succes',
                  duration: 3000,
                  mask: true
                  })   
                  that.onLoad()
              }).catch(err => {
                console.log('添加失败',err)//失败提示错误信息
              })
            }    
        }
      })
    },
    // 绑定问题
    problem(event){
      let that=this
      that.setData({
        problem:event.detail
      })
    },
    // 查询活动评论
    selectdiscuss(){
      let that=this
      db.collection('discuss').where({
        A_id:that.data.A_id
      }).get({
        success: res => {
          that.transforntime(res.data)
          that.setData({
            discuss:res.data,
          })        
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    },
    // 获取志愿者姓名
    selectVName(){
      let that=this
      db.collection('Volunteer').where({
        openId:that.data.openId
      }).get({
        success: res => {
          that.setData({
            VName: res.data[0].VName
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    },
  //计算两个时间之间的时间差 多少天时分秒
  timeago(event){
    var dddd = new Date(event);
    var dateTimeStamp = dddd.getTime()
    var minute = 1000 * 60;      //把分，时，天，周，半个月，一个月用毫秒表示
    var hour = minute * 60;
    var day = hour * 24;
    var week = day * 7;
    var month = day * 30;
    var year = month * 12;
    var now = new Date().getTime();   //获取当前时间毫秒
    var diffValue = now - dateTimeStamp;//时间差

    var result = "";
    if(diffValue < 0){
        result = "" + "未来";
    }
    var minC = diffValue/minute;  //计算时间差的分，时，天，周，月
    var hourC = diffValue/hour;
    var dayC = diffValue/day;
    var weekC = diffValue/week;
    var monthC = diffValue/month;
    var yearC = diffValue/year;
    
    if(yearC >= 1){
        result = " " + parseInt(yearC) + "年前"
    }else if(monthC >= 1 && monthC < 12){
        result = " " + parseInt(monthC) + "月前"
    }else if(weekC >= 1 && weekC < 5 && dayC > 6 && monthC < 1){
        result = " " + parseInt(weekC) + "周前"
    }else if(dayC >= 1 && dayC <= 6){
        result = " " + parseInt(dayC) + "天前"
    }else if(hourC >= 1 && hourC <= 23){
        result = " " + parseInt(hourC) + "小时前"
    }else if(minC >= 1 && minC <= 59){
        result =" " + parseInt(minC) + "分钟前"
    }else if(diffValue >= 0 && diffValue <= minute){
        result = "刚刚"
    }
    console.log(result)
    return result;
  },
  // 转换discuss[]的时间格式
  transforntime(event){
    let that=this
    var dddd;
    for(var i=0;i<event.length;i++){
      dddd=utils.formatTimeTwo(event[i]._createTime/1000,"Y-M-D h:m:s")
      event[i].rtime=that.timeago(dddd)
    }
  },
})