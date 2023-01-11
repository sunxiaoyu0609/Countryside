// components/tabbar/tabbar.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    active:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 便签栏

    icon: {
    },
  },
  methods: {
    onChange(event) {
       if(event.detail==0){
         wx.reLaunch({
           url: '../../pages/Insactivities/Insactivities',
         })
       }else if(event.detail==1){
        wx.reLaunch({
          url: '../../pages/Insactivitiesinfo/Insactivitiesinfo',
        })
      }else if(event.detail==2){
        wx.reLaunch({
          url: '../../pages/Insquestion/Insquestion',
        })
      }else if(event.detail==3){
        wx.reLaunch({
          url: '../../pages/Insstyle/Insstyle',
        })
      }else if(event.detail==4){
        wx.reLaunch({
          url: '../../pages/Insinfo/Insinfo',
        })
      }
    }
  }
})
