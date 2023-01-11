let db = wx.cloud.database() //设置数据库
Page({
  data: {
    active: 0,
    openId:"",
    problem:"",
    Handclap:[],
     // 文件上传
     images:"",
    //  是否显示原点
    show:0,
    hasread:"block"
  },
  onLoad(){
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
    // 判断是否显示圆点
    setTimeout(function() {
      that.selectfeedback()
    }, 1000);
    
  },
  // 获取前台输入的问题
  getquestion(event){
    let that=this
    that.setData({
      problem:event.detail,
    })
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
  // 确认提交
  submit:function(){
    let that=this
    // 获取时间
    var timeStamp = Date.parse(new Date());  
    wx.showModal({
      content: '确认内容属实，未如实填写一经查处取消志愿者认证',
      success (res) {
        // 确认
        if (res.confirm) {
            db.collection('Handclap').add({
              data: {
                openId:that.data.openId,
                problem:that.data.problem,
                picture:that.data.images,
                Feedbackstatus:0,
                _createTime:timeStamp
              }
            }).then(res => {
              console.log("数据插入成功")
              })
             wx.showToast({
              title: '等待相关人员反馈回复',
              icon: 'succes',
              duration: 3000,
              mask: true
            })     
          }
        }
    })
  },
  //获取反馈
  selectfeedback(){
    let that =this
    db.collection("Handclap").
        where({
          Feedbackstatus:1,
          openId:that.data.openId
        })
        .orderBy("_createTime","desc").get() 
        .then(res=>{
          that.setData({
            Handclap:res.data
          })
          that.setData({
            show:that.data.Handclap.length
          })      
        })
  },
  Read(event){
    console.log(event)
    let that=this
    wx.showModal({
      content: '确认已经读?',
      success (res) {
        // 确认
        if (res.confirm) {
            db.collection('Handclap').where({
              _id:event.currentTarget.dataset.id
            }).update({
              data: {
                Feedbackstatus:2
              }
            }).then(res => {
              that.onLoad()
              console.log("数据插入成功")
              })
             wx.showToast({
              title: 'ok',
              icon: 'succes',
              duration: 3000,
              mask: true
            })     
          }
        }
    })
  }
});
