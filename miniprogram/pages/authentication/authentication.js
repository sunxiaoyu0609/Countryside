
let db = wx.cloud.database() //设置数据库
Page({
  data: {
    wxname:"",
    openId:"",
    VName:"",
    v_idcard:"",
    VTelephone:"",
    VIntroduce:"",
    Vaddress:"",
    // 文件上传
    images:"",
    // 错误提示
    VNameerror:"",
    v_idcarderror:"",
    VTelephoneerror:"",
    avatarUrl:""
  },
  submit:function(){
    let that=this
    wx.showModal({
      content: '请确认信息是否正确，管理员审核多次不正确将不再具有资格申请！',
      success (res) {
        // 确认
        if (res.confirm) {
          // 判断信息是否有误
          if(that.data.VName==""||that.data.v_idcard==""||that.data.VTelephone==""||that.data.Vaddress==""||that.data.images==""||that.data.v_idcarderror!=""||that.data.VTelephoneerror!=""){
            wx.showToast({
              title: '请认真填写噢',
              icon: 'error',
              duration: 2000,
              mask: true
            })
          }
          // 插入数据库
          else{
            db.collection('Volunteer').add({
              data: {
                wxname:that.data.wxname,
                openId:that.data.openId,
                avatarUrl:that.data.avatarUrl,
                VName: that.data.VName,
                v_idcard: that.data.v_idcard,
                VTelephone: that.data.VTelephone,
                VIntroduce: that.data.VIntroduce,
                Vaddress:that.data.Vaddress,
                v_image:that.data.images,
                VStatus:1
              }
            }).then(res => {
              console.log("数据插入成功")
              that.setData({
                wxname:wx.getStorage({
                  key: 'userInfo',
                }).nickName
              })
              // 设置3秒休眠时间再跳转
              setTimeout(function() {
                wx.switchTab({
                  url: '../../pages/me/me',
                })  
              }, 3000);
             wx.showToast({
              title: '等待管理员审核',
              icon: 'succes',
              duration: 3000,
              mask: true
            })     
            }).catch(err => {
              console.log('添加失败',err)//失败提示错误信息
            })
          }

        }
      }
    })
  },
  onLoad: function (options) {
    let that=this
    // 读取缓存，获取微信名字以及头像
    wx.getStorage({
      key: 'userInfo',
      success(res) {
        that.setData({
          wxname:res.data.nickName,
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
      }
    })
  },
  getVName:function(event){
      this.setData({
        VName:event.detail
      })
  },
  getv_idcard:function(event){
    var reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/;
      if (!event.detail|| !event.detail.match(reg)) {
        this.setData({
          v_idcarderror:"身份证号格式错误！"
        }) 
    }
    else{
      this.setData({
        v_idcarderror:"",
        v_idcard:event.detail
      })  
    } 
  },
  getVTelephone:function(event){
  const regex = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
  if (event.detail.length !== 0 && !regex .test(event.detail)) {
    this.setData({
      VTelephoneerror: '手机号有误'
    })
  }else{
    this.setData({
      VTelephoneerror:"",
      VTelephone:event.detail
    })
  } 
  },
  getVaddress:function(event){
    this.setData({
      Vaddress:event.detail
    })
  },
  getVIntroduce:function(event){
    this.setData({
      VIntroduce:event.detail
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

})