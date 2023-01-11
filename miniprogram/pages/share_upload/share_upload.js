let db = wx.cloud.database() //设置数据库
Page({
  data: {
    value:"",
    openId:"",
    imgbox:'',//上传图片
    files:[],
    // 活动选择器
    value1: 0,
    Aids:[],
    records:[],
    radio: '1',
    // 头像和名字
    nickName:"",
    avatarUrl:""
  },
  onLoad: function (options) {
   
    let that=this
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    });
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          nickName:res.data.nickName,
          avatarUrl:res.data.avatarUrl
        })  
      }
    })
    // 读取缓存，获取openId
    wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data,
        })  
        that.selectAid()
        //隐藏加载界面
        wx.hideLoading(); 
      }
    })  
  },
  // 删除图片
  imgDelete1: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.deindex;
    let imgbox = this.data.imgbox;
    imgbox.splice(index, 1)
    that.setData({
      imgbox: imgbox
    });
  },
  // 选择图片
  addPic1: function (e) {
    var imgbox = this.data.imgbox;
    console.log(imgbox)
    var picid = e.currentTarget.dataset.pic;
    console.log(picid)
    var that = this;
    var n = 9;
    if (9 > imgbox.length > 0) {
      n = 9 - imgbox.length;
    } else if (imgbox.length == 9) {
      n = 1;
    }
    wx.chooseImage({
      count: n, // 默认9
      sizeType: ['original', 'compressed'], 
      sourceType: ['album', 'camera'], 
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
 
        if (imgbox.length == 0) {
          imgbox = tempFilePaths
        } else if (9 > imgbox.length) {
          imgbox = imgbox.concat(tempFilePaths);
 
        } else {
          imgbox[picid] = tempFilePaths[0];
        }
        that.setData({
          imgbox: imgbox
        });
      }
    })
  },
  // 上传图片
  upload(){
    let that=this
    wx.showLoading({
      title: '发布中...',
    })
    if(that.data.imgbox.length!=0){
      Promise.all(that.data.imgbox.map((item) => {
        return wx.cloud.uploadFile({
            cloudPath: 'uploadImages/' + Date.now() + item.match(/\.[^.]+?$/)[0], // 文件名称 
            filePath: item, 
      })
      })).then((resCloud) => {
          wx.hideLoading()
          that.setData({
              files: that.data.files.concat(resCloud.map((item) => {
                  return item.fileID
                })),
              // showfiles: that.data.showfiles.concat(res.tempFilePaths.map((item) => {
              //     return item
              // }))
          })
          that.uoloadresouace()
          }).catch((err) => {
              console.log(err)
            })

    }else{
      that.uoloadresouace()
      wx.hideLoading()
    }
    
  },
  // 根据openid查询Aid
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
            that.selectrecordbyAid()
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
  },
  //根据Aid查询活动
  selectrecordbyAid(){
      let that=this
      for(var i=0;i<that.data.Aids.length;i++){
        db.collection('Activity').where({
          _id:that.data.Aids[i].A_id
        }).field({
          Aname:true,
        }).get({
          success: res => {
            that.setData({
              records: that.data.records.concat(res.data[0].Aname)
            })
            
          },
          fail: err => {
            console.log('[数据库] [查询记录] 失败：');
          }
        })
      }
  },
  // 选择活动
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onChange2(event) {
    this.setData({
      value: event.detail,
    });
  },
  // 上传所有资源到数据库
  uoloadresouace(){
    var timeStamp = Date.parse(new Date());  
    let that=this
    db.collection('share').add({
      data: {
        openId:that.data.openId,
        images:that.data.files,
        sharecontent:that.data.value,
        Aname:that.data.records[that.data.radio],
        nickName:that.data.nickName,
        avatarUrl:that.data.avatarUrl,
        _createTime:timeStamp
      }
    }).then(res => {
      console.log("数据插入成功")
      setTimeout(function() {
        wx.reLaunch({
          url: '../share/share',
        })  
      }, 3000);
     wx.showToast({
      title: '发布成功',
      icon: 'succes',
      duration: 3000,
      mask: true
    })     
    }).catch(err => {
      console.log('添加失败',err)//失败提示错误信息
    })
  },
  back(){
    wx.reLaunch({
      url: '../share/share',
    })
  }
})