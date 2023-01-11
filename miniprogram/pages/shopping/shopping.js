// pages/shopping/shopping.js
let db = wx.cloud.database() //设置数据库
const _= db.command;
Page({
  data: {
    openId:"",
    active: 0,
    goods:[],
    deliver:[],
    Vaddress:"",
    GName:"",
    GPrice:0,
    VIntegral:0,
    GImage:"",
    VStatus:"",
    VName:"",
    // 进度条
    steps: [
      {
        text: '未兑换',
        activeIcon: 'clock'
      },
      {
        text: '已兑换',
        activeIcon: 'more',
      }
    ]
  },
  onLoad: function (options) {
    let that=this
    wx.showLoading({  // 显示加载中loading效果 
      title: "加载中",
      mask: true  //开启蒙版遮罩
    });
     // 读取缓存，获取openId
     wx.getStorage({
      key: 'openId',
      success(res) {
        that.setData({
          openId:res.data
        })  
      }
    })
    // 查找志愿者信息
    setTimeout(function() {
      that.SelectGoods()
      that.selectdeliver()
      that.selectuserinfo()
      wx.hideLoading();
    },500);  
  },
  // 查商品
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
  // 根据openid查个人信息
  selectuserinfo:function(event){
    let that=this
    db.collection('Volunteer').where({
      openId:that.data.openId
    }).get({
      success: res => {
        that.setData({
          Vaddress: res.data[0].Vaddress,
          VIntegral:res.data[0].VIntegral,
          VStatus:res.data[0].VStatus,
          VName:res.data[0].VName
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 兑换商品
  change(e){
    let that=this
      // 查询商品名字、积分
      db.collection('Goods')
      .where({
        _id: e.currentTarget.dataset.id
      }).get({
        success: res => {
          that.setData({
            GName: res.data[0].GName,
            GPrice:res.data[0].GPrice,
            GImage:res.data[0].GImage
          })
        },
        fail: err => {
          console.log('[数据库] [查询记录] 失败：');
        }
      })
      // 提示是否兑换
      wx.showModal({
        content: '兑换后不能取消,确认兑换此商品吗?',
        success (res) {
          if (res.confirm) {
            // 积分不够，提示
            if(that.data.GPrice-that.data.VIntegral>=0){
              wx.showToast({
                title:"积分不足,加油!",
                icon: 'error',
                duration: 2000,
              })
            }
            // 积分够了，成功兑换商品
            else{
              that.InsertOrder(),
              wx.showToast({
                title: '兑换成功，请前往永川区人民政府提供证明并兑换商品',
                icon: 'success',
                success: function () {
                  // 商品减少1
                  db.collection('Goods')
                  .where({
                    _id: e.currentTarget.dataset.id
                  })
                  .update({
                    data: {
                      GStock: _.inc(-1)
                    }
                  }).then((ress)=>{
                    console.log(ress)
                  })             
                  // 自己的积分减少
                  db.collection('Volunteer')
                  .where({
                    openId: that.data.openId
                  })
                  .update({
                    data: {
                      VIntegral: _.inc(-that.data.GPrice)
                    }
                  }).then((ress)=>{
                    console.log(ress)
                  })
                  
                }
              })
              that.setData({
                active:1
              })  
              that.onLoad()
            }  
          } 
        }
      })    
  } ,
  InsertOrder(e){
    db.collection('Deliver').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        openId:this.data.openId,
        VName:this.data.VName,
        GName:this.data.GName,
        Vaddress:this.data.Vaddress,
        Gstatus:0,
        GImage:this.data.GImage
      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      }
    })
  },
  // 标签页切换
  onChange(event) {
    let that=this
    that.setData({
      active:event
    })
  },
  // 根据openId查询订单信息
  selectdeliver:function(event){
    let that=this
    db.collection('Deliver').where({
      openId:that.data.openId
    }).orderBy("Gstatus","asc").get({
      success: res => {
        that.setData({
          deliver:res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  },
  // 确认商品收货
  confirm:function(e){
    let that=this
    wx.showModal({
      content: '确认收货后将结束订单，请确保已经收到礼品',
      success (res) {
        if (res.confirm) {
            wx.showToast({
              title: '兑换成功',
              icon: 'success',
              success: function () {  
                db.collection('Deliver')
                .where({
                  _id: e.currentTarget.dataset.id
                })
                .update({
                  data: {
                    Gstatus:2
                  }
                }).then((ress)=>{
                  console.log(ress)
                })
                that.onLoad()                   
              }
            })  
        } 
      }
    })
  },
  onTabItemTap(item){
    let that=this
    that.onLoad()
  }
})