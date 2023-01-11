// pages/G_index_crousel/index.js
let db = wx.cloud.database() //设置数据库
Page({

  data: {
    images:[],
    upImg1:'',
    upImg2:'',
    upImg3:'',
    upImg4:'',
    upImg5:'',
    fileList:[],  
  },

  
  onLoad: function (options) {
    this.getImages()
    wx.hideHomeButton()
    
  },

  //获取轮播图
  getImages:function(){
    let that=this
    db.collection('RotationMap').get({
      success:function(res){
        // console.log(res)
        that.setData({
          images:res.data
        })
      }
    })
  },

  upImg(e){
    var index=e.currentTarget.dataset.index
    console.log(index)
    var that = this;
    wx.chooseImage({
      count: 1,
      success(res){
        // that.setData({
        //   images:res.tempFilePaths[0]
        // })
        wx.cloud.uploadFile({
          cloudPath:'test/' + Math.floor(Math.random()*1000000),
          filePath:res.tempFilePaths[0],
          success(res){
            if(index==0){
                that.setData({
                  upImg1:res.fileID
                })
            }else if(index==1){
              that.setData({
                upImg2:res.fileID
               })
            }else if(index==2){
              that.setData({
                upImg3:res.fileID
               })
            }else if(index==3){
              that.setData({
                upImg4:res.fileID
               })
            }else if(index==4){
              that.setData({
                upImg5:res.fileID
               })
            }
            
            // console.log("成功",res);
            wx.cloud.getTempFileURL({
              fileList:[res.fileID],
              success(res){
                // console.log(fileList)
              }
            })
          }
        })
      }
    })
  },

  modifyimg(e){
    let that=this
    let img
    if(e.currentTarget.dataset.index==0){
      img=that.data.upImg1
    }else if(e.currentTarget.dataset.index==1){
      img=that.data.upImg2
    }else if(e.currentTarget.dataset.index==2){
      img=that.data.upImg3
    }else if(e.currentTarget.dataset.index==3){
      img=that.data.upImg4
    }else if(e.currentTarget.dataset.index==4){
      img=that.data.upImg5
    }
    db.collection('RotationMap').doc(e.currentTarget.dataset.id).update({
      data:{
        RImage:img
      },
      success(){
        that.getImages()
      }
    })
  }




})