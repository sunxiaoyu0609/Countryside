let db = wx.cloud.database() //设置数据库
Page({
  data: {
    IName:"",
    images:"",
    LTitle:"",
    LIntroduce:"",
    Link:"",
    Linkerror:"",
    // 已经发的文章
    Links:""
  },

  onLoad: function (options) {
    let that=this
    wx.getStorage({
      key: 'IName',
      success(res) {
        that.setData({
          IName:res.data
        })  
        that.selectLinks()
      }
    })
    wx.hideHomeButton()
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
  // 输入数据绑定
  onChange(event){
    this.setData({
      LTitle:event.detail
    })
  },
  onChange2(event){
    this.setData({
      LIntroduce:event.detail
    })
  },
  onChange3(event){
    var reg = /^(?:(http|https|ftp):\/\/)?((?:[\w-]+\.)+[a-z0-9]+)((?:\/[^/?#]*)+)?(\?[^#]+)?(#.+)?$/i
    if(reg.test(event.detail)){
      this.setData({
        Link:event.detail,
        Linkerror:""
      })
    }else{
      this.setData({
        Linkerror:"网站格式错误"
      })
    }
  },
  submit(){
    let that=this
    wx.showModal({
      content: '请确认信息是否正确，管理员审核多次不正确将不再具有资格申请！',
      success (res) {
        // 确认
        if (res.confirm) {
          // 判断信息是否有误
          if(that.data.LTitle==""||that.data.LIntroduce==""||that.data.Link==""||that.data.images==""||that.data.Linkerror!=""){
            wx.showToast({
              title: '请认真填写噢',
              icon: 'error',
              duration: 2000,
              mask: true
            })
          }
          // 插入数据库
          else{
            var timestamp = Date.parse(new Date());
            wx.showLoading({
              title: '上传中',
            })
            db.collection('Link').add({
              data: {
                LTitle:that.data.LTitle,
                LIntroduce:that.data.LIntroduce,
                LImage:that.data.images,
                Link:that.data.Link,
                Iname:that.data.IName,
                _createTime:timestamp
              }
            }).then(res => {
              console.log("数据插入成功")
              // 设置3秒休眠时间再跳转
             wx.showToast({
                title: '上传成功',
                icon: 'succes',
                duration: 3000,
                mask: true
              }) 
              wx.hideLoading()
              that.onLoad()    
            }).catch(err => {
              console.log('添加失败',err)//失败提示错误信息
            })
          }

        }
      }
    })
  },
  selectLinks(){
    let that=this
    db.collection('Link').where({
      Iname:that.data.IName,
    }).get({
      success: res => {
        that.setData({
          Links:res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  }
})