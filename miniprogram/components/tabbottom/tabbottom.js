// components/tabbottom/tabbottom.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activeindex:{
      type:String
    }
  },

 
  data: {
    active: '1',//底部tab
    index:'../G_index/index',
    message:'../G_message/index',
    manage:'../G_manage/index',
    mine:'../G_mine/index'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onChange(event) {//改变底部tab
      let that=this
      // console.log(event.detail)
      this.setData({ active: event.detail });
      // console.log(this.data.active)
      if(event.detail==1){
        wx.reLaunch({
          url: that.data.index,
        })
      }else if(event.detail==2){
        wx.reLaunch({
          url: that.data.message,
        })
      }else if(event.detail==3){
        wx.reLaunch({
          url: that.data.manage,
        })
      }else if(event.detail==4){
        wx.reLaunch({
          url: that.data.mine,
        })
      }
    },
  
  }
})
