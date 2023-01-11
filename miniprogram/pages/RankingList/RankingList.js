let db = wx.cloud.database() //设置数据库
Page({
  data: {
    usersinfo1:[],// 评分排名
    usersinfo2:[],// 积分排名
    Vevaluate:0,// 评分
    VIntegral:0,//积分
  },
  onLoad: function (options) {
      this.selectbyVevaluate()
      this.selectbyVIntegral()
  },
  selectbyVevaluate:function(){
    db.collection('Volunteer')
    .orderBy('Vevaluate','desc')
    .get()
      .then(res=>{
        console.log('降序成功',res.data)
        this.setData({
          usersinfo1:res.data
        })
      })
      .catch(err=>{
        console.log('降序失败')
      })  
  },
  selectbyVIntegral:function(){
    db.collection('Volunteer')
    .orderBy('VIntegral','desc')
    .get()
      .then(res=>{
        console.log('降序成功',res.data)
        this.setData({
          usersinfo2:res.data
        })
      })
      .catch(err=>{
        console.log('降序失败')
      })  
  }
})