// pages/salesOrder/salesOrder.js

let Api = require('../../app/api');
let Url = require('../../app/url');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '', //保存个人数据
    inputShowed: false,
    inputVal: "",
    orderList: [],
    user: [],
    isBusiness: false,
    tabs: ["未发货", "已发货", "已完成"],
    // tabStatus : [''],
    tabsBu: ["全部", "待接单", "已接单", "已完成"],
    activeIndex: 0,
    distribution: false,
    animation: null,
    seedGoods : false,
    inputIndex : null,
    inputValue : ['','','','','',''],
    takeInputShow : false,
    hiddenInputValue : ''
    

  },

  /**
   * todo 搜索框显示input
   */
  onShowInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  /**
   * todo 搜索框隐藏input
   */
  onHideInput: function () {
    let { activeIndex } = this.data;
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.getOrderList(activeIndex);
  },

  /**
   * todo 搜索框清空input
   */
  onClearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  /**
   * todo 搜索框input值改变
   * @param {*} e
   */
  onInputTyping: function (e) {
    let { activeIndex } = this.data;
    this.setData({
      inputVal: e.detail.value
    });
    this.getOrderList(activeIndex, e.detail.value);
  },

  /**
   * todo tab选项卡改变事件
   * @param {*} e
   * @param {*} i
   */
  onTapChange: function (e, i) {
    let _self = this;
    var index = e.target.dataset.index;
    _self.setData({
      activeIndex: index
    }, () => {
      _self.getOrderList(index)
    })
  },

  /**
   * todo 获取列表数据
   * @param {*} statusId tab选项卡的参数
   * @param {string} [q=''] 模糊查询的参数
   */
  getOrderList: function (statusId, q = '') {
    let _self = this;
    let { openid } = this.data;
    Api._ajax({
      url: Url.salesOrder,
      data: {
        type: statusId + 1,
        userId: openid.userId,
        q
      },
      success: function (res) {
        console.log(res.data);
        if (res.success) {
          let data = res.data;
          data.forEach(value => {
            value.addressinfo = JSON.parse(value.addressinfo);
          })
          _self.setData({
            orderList: data
          });
        } else {
          Api._toast(res.message);
        }
      }
    })
  },

  /**
   * todo 确认配送弹层显示
   * @param {*} e 获取点击的是哪件商品
   */
  onSeedGoodsShow: function (e) {
    let _self = this;
    let goods = e.currentTarget.dataset.item;
    _self.setData({
      goods
    },()=>{
      _self.seedGoodsOverlay._show()
    })
  },

  /**
   * todo 确认配送请求
   */
  onSeedGoodsSure() {
    const _self = this;
    let { goods, activeIndex} = this.data;
    Api._ajax({
      url: Url.orderDelivery,
      data: {
        id: goods.id
      },
      success: function (res) {
        console.log(res)
        if (res.success) {
          Api._toast('发货成功');
          _self.getOrderList(activeIndex);
          _self.seedGoodsOverlay._hide();
        } else {
          Api._toast(res.message);
          _self.seedGoodsOverlay._hide()
        }
      }
    })
  },

  /**
   * todo 确认收货请求
   */
  onTakeGoodsSure() {
    const _self = this;
    let { goods, inputValue, activeIndex } = this.data;
    Api._ajax({
      url: Url.orderConfirmreceipt,
      data: {
        id: goods.id,
        buycode: inputValue.join('')
      },
      success: function (res) {
        console.log(res)
        if (res.success) {
          Api._toast('收货成功');
          _self.getOrderList(activeIndex);
          _self.takeGoodsOverlay._hide();
        } else {
          Api._toast(res.message);
          //_self.takeGoodsOverlay._hide();
        }
      }
    })
  },

  /* onSeedGoodsHide: function () {  
    let _self = this;
   
  }, */

  /**
   * todo 确认收货弹层显示
   * @param {*} param 获取点击的是哪件商品
   */
  onTakeGoodsShow: function (param) {
    let _self = this;
    let goods = param.currentTarget.dataset.item;
    _self.setData({
      goods,
      inputValue: ['', '', '', '', '', '']
    })
    _self.takeGoodsOverlay._show(function () { 
      setTimeout(function (param) { 
        _self.setData({
          takeInputShow : true
        })
       },400)
      
     });
    

  },

  /**
   * todo 确认收货弹层隐藏
   * @param {*} param
   */
  onTakeGoodsHide: function (param) {
    let _self = this;
    _self.setData({
      inputIndex : null,
      
    })
  },

  /**
   * todo 确认收货码输入
   * @param {*} e 收货码索引
   */
  onInputChange: function(e){
    let _self = this;
    let value = e.detail.value;
    let index = e.currentTarget.dataset.index;
    _self.data.inputValue[index] = value;
    _self.setData({
      inputValue : _self.data.inputValue
    })
    // _self.setData({
    //   inputIndex : parseInt(e.currentTarget.dataset.index,10)+1
    // })
  },

  /**
   * todo 收货码输入框显示
   * @param {*} param 
   */
  onTakeInputShow:function (param) { 
    this.setData({
      takeInputShow : true
    })
   },

  /**
   * todo 收货码输入框隐藏
   * @param {*} e
   */
  onHiddenInputChange:function (e) { 
    let _self = this;
    _self.setData({
      hiddenInputValue : e.detail.value.toString()
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('user');
    this.setData({
      openid
    },() => {
      this.getOrderList(0);
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.seedGoodsOverlay = this.selectComponent("#J_details_seedGoods");
    this.takeGoodsOverlay = this.selectComponent("#J_details_takeGoods");

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})