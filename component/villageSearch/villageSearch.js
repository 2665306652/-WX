/**
 * todo 小区模糊搜索组件
 */

let Api = require("../../app/api");
let Url = require("../../app/url");

/**
 * 动画对象
 */
let Animation_top = wx.createAnimation({
  duration: 600,
  timingFunction: 'ease',
  delay: 100,
  transformOrigin: 'left top 0',
  success: function (res) {}
})

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchValue: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    villageSearch: false,
    inputVal: '',
    searchAnimation: null,
    searchRes: []
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * todo 整体弹层的显示
     * @param {*} param 
     */
    _show: function (param) {
      let _self = this;
      Animation_top.top(0).step();
      this.setData({
        villageSearch: true,
        searchRes : []
      }, () => {
        _self.setData({
          searchAnimation: Animation_top.export(),
        })
      })
    },
    /**
     * todo 整体弹层的隐藏
     * @param {*} param 
     */
    _hide: function (param) {
      let _self = this;
      Animation_top.top(2000).step();
      this.setData({
        searchAnimation: Animation_top.export(),
      }, () => {
        setTimeout(function () {
          _self.setData({
            villageSearch: false,
            inputVal: ""
          })
        }, 400)

      })
    },
    /**
     * todo 输入框的input的监听
     * @param {*} e 
     */
    _inputTyping: function (e) {
      let _self = this;
      _self.setData({
        inputVal : e.detail.value
      })

      if (!e.detail.value) return false;

      Api._ajax({
        url: Url.villageSearch,
        data: {
          name: e.detail.value,
          type : 1
        },
        // type : 'get',
        success: function (res) {
          _self.setData({
            searchRes: res.data
          })
        }
      })


    },
    /**
     * todo 清除input内容
     * @param {*} param 
     */
    _clearInput:function (param) { 
      this.setData({
        inputVal: ""
      })
     },
     /**
      * todo 小区信息的深度搜索
      * @param {*} e 
      */
    _depthSearch:function (e) { 
      let _self = this;
      Api._ajax({
        url: Url.villageSearch,
        data: {
          name: _self.data.inputVal,
          type : 1
        },
        success: function (res) {
          _self.setData({
            searchRes: res.data
          })
        }
      })
    },
    /**
     * todo 小区选择的点击回调
     * @param {*} e 
     */
    _resultClick: function (e) { 
      this.triggerEvent("searchResult",e.currentTarget.dataset.item);
      this._hide();
    }
  }
})