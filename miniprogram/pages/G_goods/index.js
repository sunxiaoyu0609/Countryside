// pages/G_goods/index.js
let db = wx.cloud.database() //设置数据库
Page({

  data: {
    goods:[],
    fileList: [],
    visable1:0,
    visable2:1,
    GImage:'',
    GName:'',
    GPrice:'',
    GStock:'',
    id:'',
    images:'',
    filePath:''
  },

  onLoad: function (options) {
    wx.hideHomeButton()
    // console.log(options)
    if(options.id==null){
      this.setData({
        visable1:1
      })
    }else{
      this.setData({
        visable:0,
        id:options.id
      })
      this.getGoodsDetail(this.data.id);
    }
  },

  //根据_id获取商品
  getGoodsDetail:function(e){
    let that=this
    db.collection('Goods').where({
      _id:e
    }).get({
      success: function(res) {
        // console.log(res)
        that.setData({
          goods:res.data[0],
          GName:res.data[0].GName,
          GPrice:res.data[0].GPrice,
          GStock:res.data[0].GStock
        })
      },
    })
  },

  modify:function(){//修改信息
    let that=this
    db.collection('Goods').doc(that.data.id).update({
      data:{
        GName:that.data.GName,
        GPrice:that.data.GPrice,
        GStock:that.data.GStock
      },
      success:function(res){
        wx.reLaunch({
          url: '../G_index_shop/index',
        })
      },fail:function(){
        // Dialog.alert({
        //   message: '修改失败',
        // }).then(() => {
        //   // on close
        // });
      }
    })
  },

  add(){
    let that=this
    db.collection('Goods').add({
      data:{
        GImage:that.data.GImage,
        GName:that.data.GName,
        GPrice:that.data.GPrice,
        GStock:that.data.GStock,
      },success(res){
        wx.reLaunch({
          url: '../G_index_shop/index',
        })
      }
    })
  },

  upImg(){
    var that = this;
    this.setData({
      visable2:0
    })
    wx.chooseImage({
      count: 1,
      success(res){
        wx.cloud.uploadFile({
          cloudPath:'test/' + Math.floor(Math.random()*1000000),
          filePath:res.tempFilePaths[0],
          success(res){
            that.setData({
              GImage:res.fileID
            })
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