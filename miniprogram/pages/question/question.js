let db = wx.cloud.database() //设置数据库
Page({
  data: {
    activeNames: ['0'],
    questions:[]
  },
  onLoad(){
    this.selectquestion()
  },
  onChange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  selectquestion(){
    let that=this  
    db.collection('question').get({
      success: res => {
        console.log("res.data",res.data)
        that.setData({
          questions:res.data
        })
      },
      fail: err => {
        console.log('[数据库] [查询记录] 失败：');
      }
    })
  }
});
