let db = wx.cloud.database() //设置数据库
const _ = db.command
Page({
  data: {
      radio: 1,
      Iaccount:"",
      Ipassword:"",
      IName:"",
      IClassification:"",
      Iholder:"",
      Itel:"",
      IItroduce:"",
      images:"",
      Iaccounterror:"",
      Ipassworderror:"",
      Ipasswordagainerror:"",
      Itelerror:"",
      // 查看机构名是否重复
      INames:[]
  },
  onLoad: function (options) {
    wx.hideHomeButton()
  },
  // 上传图片
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
  // 提交所有信息
  submit:function(){
    let that=this
    wx.showModal({
      content: '请确认信息是否正确，管理员审核多次不正确将不再具有资格申请！',
      success (res) {
        // 确认
        if (res.confirm) {
          // 判断信息是否有误
          if(that.data.Iaccount==""||that.data.Ipassword==""||that.data.IName==""||that.data.Iholder==""||that.data.Itel==""||that.data.IItroduce==""||that.data.Iaccounterror!=""||that.data.Ipassworderror!=""||that.data.Ipasswordagainerror!=""||that.data.Itelerror!=""||that.data.images==""||that.data.IClassification==""){
            wx.showToast({
              title: '请认真填写噢',
              icon: 'error',
              duration: 2000,
              mask: true
            })
          }
          // 插入数据库
          else{
            db.collection('Institution').where(
              {
                Iaccount:that.data.Iaccount
              }
            ).get({
              success: res => {
                // 账号已存在
                if(res.data.length!=0){
                  wx.showToast({
                    title: '该账号主体已存在',
                    duration:2000,
                    icon:"error"
                  })  
                }else if(that.data.INames.length!=0){
                  wx.showToast({
                    title: '该团体已存在',
                    duration:2000,
                    icon:"error"
                  })  
                }
                // 未注册过
                else{
                  var timestamp = Date.parse(new Date());
                  db.collection('Institution').add({
                    data: {
                      Iaccount:that.data.Iaccount,
                      Ipassword:that.data.Ipassword,
                      IName:that.data.IName,
                      IClassification:that.data.IClassification,
                      Iholder:that.data.Iholder,
                      Itel:that.data.Itel,
                      IItroduce:that.data.IItroduce,
                      IImage:that.data.images,
                      IStatus:0,
                      _createTime:timestamp
                    }
                  }).then(res => {
                    console.log("数据插入成功")
                    // 设置3秒休眠时间再跳转
                    setTimeout(function() {
                      wx.reLaunch({
                        url: '../../pages/Inslogin/Inslogin',
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
            })      
          }
        }
      }
    })
  },
  // 输入绑定
  ChangeIaccount(event){
    var patt=/^[a-zA-Z]([-_a-zA-Z0-9]{6,20})$/;
    if(patt.test(event.detail)){
      this.setData({
        Iaccount:event.detail,
        Iaccounterror:""
      })
    }
    else{
      this.setData({
        Iaccounterror:"账号不符合要求"
      })
    }
  },
  ChangeIpassword(event){
    var patt=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/;
    if(patt.test(event.detail)){
      this.setData({
        Ipassword:event.detail,
        Ipassworderror:""
      })
    }
    else{
      this.setData({
        Ipassworderror:"密码不符合要求"
      })
    }
  },
  ChangeIpasswordagain(event){
    if(event.detail!=this.data.Ipassword){
      this.setData({
        Ipasswordagainerror:"两次密码输入不一致"
      })
    }else{
      this.setData({
        Ipasswordagainerror:""
      })
    }
    
  },
  ChangeIName(event){
    this.setData({
      IName:event.detail
    })
    this.selectIname()
  },
  ChangeIholder(event){
    this.setData({
      Iholder:event.detail
    })
  },
  ChangeItel(event){
    var patt=/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
    if(patt.test(event.detail)){
      this.setData({
        Itel:event.detail,
        Itelerror:""
      })
    }
    else{
      this.setData({
        Itelerror:"手机号不符合要求"
      })
    }
  },
  ChangeIItroduce(event){
    this.setData({
      IItroduce:event.detail
    })
  },
  onChange(event) {
    if(event.detail==1){
      this.setData({
        IClassification: "便民利民类",
      });
    }else if(event.detail==2){
      this.setData({
        IClassification: "扶贫帮困类",
      });
    }else if(event.detail==3){
      this.setData({
        IClassification: "就业指导类",
      });
    }else if(event.detail==4){
      this.setData({
        IClassification: "治安维稳类",
      });
    }else if(event.detail==5){
      this.setData({
        IClassification: "卫生保健类",
      });
    }else if(event.detail==6){
      this.setData({
        IClassification: "环境维护类",
      });
    }else if(event.detail==7){
      this.setData({
        IClassification: "宣传教育类",
      });
    }else if(event.detail==8){
      this.setData({
        IClassification: "文体娱乐类",
      });
    }else if(event.detail==9){
      this.setData({
        IClassification: "助农增收类",
      });
    }else if(event.detail==10){
      this.setData({
        IClassification: "心理咨询类",
      });
    }
    
  },
  // 查询机构名是否重复
  selectIname(){
    let that=this
    db.collection('Institution').where({
      IName:that.data.IName
    }
    ).get({
      success: res => {
        that.setData({
          INames:res.data
        })       
      }
    }) 
  }
})