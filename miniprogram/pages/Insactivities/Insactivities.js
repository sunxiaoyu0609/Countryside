// pages/Insactivities/Insactivities.js
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    active: 0,
    Aname:"",
    AStartTime:"",
    AEndTime:"",
    APlace:"",
    images:"",
    IName:"",
    Atime:"",
    Aarea:"",
    Aexplain:"",
    Anumber:"",
    AEndTimeerrer:"",
    IName:"",
    Activities:[],
  },
  onLoad: function (options) {
    let that=this
    wx.hideHomeButton()
    console.log("aaaa",new Date("2022,01,12"));
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
      }
    })
  },
  upImg(){
    var that = this;
    wx.chooseImage({
      count: 1,
      success(res){
        that.setData({
          images:res.tempFilePaths[0]
        })
        wx.cloud.uploadFile({
          cloudPath:'test/' + Math.floor(Math.random()*1000000),
          filePath:res.tempFilePaths[0],
          success(res){
            that.setData({
              images:res.fileID
            })
            console.log("成功",res);
            wx.cloud.getTempFileURL({
              fileList:[res.fileID],
              success(res){   
              }
            })
          }
        })
      }
    })
  },
  // 输入
  ChangeAname(event){
    this.setData({
      Aname:event.detail
    })
  },
  ChangeAStartTime(event){
    var date=new Date(event.detail)
    var timeTamp = Date.parse(date);
    this.setData({
      AStartTime:timeTamp
    })
  },
  ChangeAEndTime(event){
    var date=new Date(event.detail)
    var timeTamp = Date.parse(date);
    this.setData({
      AEndTime:timeTamp
    })
    if(this.data.AEndTime<this.data.AStartTime){
      this.setData({
        AEndTimeerrer:"结束时间不能小于开始时间！"
      })
    }else{
      this.setData({
        AEndTimeerrer:""
      })
    }
  },
  ChangeAPlace(event){
    this.setData({
      APlace:event.detail
    })
  },
  ChangeAtime(event){
    this.setData({
      Atime:event.detail
    })
  },
  ChangeAarea(event){
    this.setData({
      Aarea:event.detail
    })
  },
  ChangeAexplain(event){
    this.setData({
      Aexplain:event.detail
    })
  },
  ChangeAnumber(event){
    this.setData({
      Anumber:event.detail
    })
  },
  // 提交
  submit(){
    var timestamp = Date.parse(new Date());
    let that=this
    if(that.data.Aname==""||that.data.AStartTime==""||that.data.AEndTime==""||that.data.APlace==""||that.data.APlace==""||that.data.Atime==""||that.data.Aarea==""||that.data.Aexplain==""||that.data.Anumber==""||that.data.images==""||that.data.AEndTimeerrer!=""){
        wx.showToast({
          title: '请认真填写噢',
          duration:2000,
          icon:"error"
        })
    }else{
      db.collection('Activity').add({
        data: {
          Aname:that.data.Aname,
          AStartTime:that.data.AStartTime,
          AEndTime:that.data.AEndTime,
          APlace:that.data.APlace,
          APlace:that.data.APlace,
          Atime:that.data.Atime,
          Aarea:that.data.Aarea,
          Aexplain:that.data.Aexplain,
          Anumber:that.data.Anumber,
          Aimage:that.data.images,
          AStatus:0,
          _createTime:timestamp,
          IName:that.data.IName,
          Aend:0
        }
      }).then(res => {
        console.log("数据插入成功")
        that.setData({
          wxname:wx.getStorage({
            key: 'userInfo',
          }).nickName
        })
        // 设置3秒休眠时间再跳转
       wx.showToast({
        title: '等待管理员审核',
        icon: 'succes',
        duration: 3000,
        mask: true
      }) 
      that.onLoad()    
      }).catch(err => {
        console.log('添加失败',err)//失败提示错误信息
      })
    }
  },
  // 标签页切换
  onChange(event) {
    let that=this
    if(event.detail.name==1){
      db.collection('Activity').where({
        IName:that.data.IName,
      }).get({
        success: res => {
          that.setData({
            Activities:res.data
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
    }
  },

})