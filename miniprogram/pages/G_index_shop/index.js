// pages/G_index_shop/index.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
let db = wx.cloud.database() //设置数据库
const _= db.command;
Page({
  data: {
    goods:[],
    // search:''
  },

  onLoad: function (options) {
    let that=this
    // 显示商品
    that.SelectGoods()
    wx.hideHomeButton()
  },

  // 显示商品
  SelectGoods:function(){
    let that=this
    db.collection('Goods').get({
      success: function(ress) {
        that.setData({
          goods:ress.data
        })  
      }
    })
  },

  modify:function(e){
    // console.log(e)
    wx.navigateTo({
      url: '../G_goods/index?id='+e.currentTarget.dataset.gid,
    })
  },

  withdraw:function(e){
    let that=this
    Dialog.confirm({
      title: '确定下架此商品吗？',
      message:'注意：此操作不可逆'
    }).then(() => {
        // on confirm
          db.collection('Goods').doc(e.currentTarget.dataset.gid).remove({
            success:function(res){ 
              // console.log(res)
              //刷新商品
              that.SelectGoods()
            }
          })

      }).catch(() => {
        // on cancel
      });
   
  },
  add(){
    wx.navigateTo({
      url: '../G_goods/index',
    })
  },

  // getSearch(e){
  //   // console.log(e)
  //   this.setData({
  //     search: e.detail.value
  //   })
  // },

  search(e){
    let that=this
    if(e.detail==''){
      that.SelectGoods()
    }else{
      db.collection('Goods').where({
        GName : db.RegExp({
          regexp: e.detail,
          options:'i'
       })
      }).get({
          success: function(res) {
            // console.log(res)
            that.setData({
              goods:res.data,
            })
          },
        })
    }
  }


})