// component/overlay/overlay.js
/**
 * todo 页面的上拉弹层组件
 */

let Animation = wx.createAnimation({
  duration: 600,
  timingFunction: 'ease',
  delay: 100,
  transformOrigin: 'left bottom 0',
  success: function (res) {}
})

Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    customHeight : {
      type : String,
      value : '50%'
    },
    customTitle: {
      type: String,
      value: '自定义标题'
    },
    sureButton: {
      type: String,
      value: '确认'
    },
    cancelButton: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    overlayStatus: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * todo overlay=> 显示
     * @param {*} callback 
     */
    _show: function (callback) {
      let _self = this;
      Animation.bottom(0).step();
      this.setData({
        overlayStatus: true
      }, () => {
        _self.setData({
          animation: Animation.export(),
        },()=>{
          callback && callback();
        })
      })
    },
    /**
     * todo overlay => 隐藏
     * @param {*} param 
     */
    _hide: function (param) {
      let _self = this;
      Animation.bottom(-1000).step();
      this.setData({
        animation: Animation.export(),
      }, () => {
        setTimeout(function () {
          _self.setData({
            overlayStatus: false
          })
          _self.triggerEvent('cancel')
        }, 400)

      })
    },
    /**
     * todo 确认按钮的点击回调
     * @param {*} e 
     */
    _sure: function (e) {
      this.triggerEvent("sure");
    }
  }
})