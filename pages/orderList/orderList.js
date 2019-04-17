// pages/orderlist/orderlist.js
let app = getApp();
let Api = require('../../app/api');
let Url = require('../../app/url');
let Authorize = require('../../app/authorize');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    sellerShow: false, //卖家详情展示
    inputShowed: false,
    inputVal: "",
    orderList: [],
    user: [],
    isBusiness: false,
    tabs:["已付款", "配送中", "已完成"],
    tabsBu:["全部", "待接单", "已接单", "已完成"],
    activeIndex: 1,
    userInfo: ''//用户信息
  },
  showInput: function () {
      this.setData({
          inputShowed: true
      });
  },
  hideInput: function () {
      this.setData({
          inputVal: "",
          inputShowed: false
      });
  },
  clearInput: function () {
      this.setData({
          inputVal: ""
      });
  },
  inputTyping: function (e) {
    let _self = this;
    let {activeIndex} = this.data;
      this.setData({
          inputVal: e.detail.value
      });
      _self.getOrderList(activeIndex, e.detail.value);

  },
  openConfirm: function () {
      wx.showModal({
          title: '提示',
          content: '确认收货',
          confirmText: "确定",
          cancelText: "取消",
          success: function (res) {
              console.log(res);
              if (res.confirm) {
                  console.log('用户点击主操作')
              }else{
                  console.log('用户点击辅助操作')
              }
          }
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/userInfo/userInfo', function (param) {
      // console.log(app.globalData.userInfo)
      _self.setData({
        userInfo: app.globalData.userInfo,
      }, () => {
        _self._init();
      })
    })
    // Api._ajax({
    //   url: Url.details,
    //   data: {
    //     id: options.id
    //   },
    //   success: function (res) {
    //     _self.setData({
    //       list: res
    //     }, () => {
    //       console.log('res', res)
    //     })
    //   }
    // })
  },
  _init: function () {
    let _self = this;
    _self.getOrderList(1);
  },
  /**
   * todo 获取购买订单
   */
  getOrderList: function (type,q = '') { 
    let _self = this;
    Api._ajax({
      url: Url.orderList,
      data:{
        userId : _self.data.userInfo.userId,
        type: type,
        q
      },
      success: function (res) {
        _self.setData({
          orderList: res.data
        }, () => {
        })
      }
    })
  },
  /**
   * todo 订单状态切换
   */
  tapChange: function(e, i){
    let _self = this;
    var index = e.target.dataset.index;
    _self.setData({
      activeIndex: index
    },()=>{
      _self.getOrderList(index, '')
    })
    

  },
  /**
   * todo 显示卖家信息弹窗
   */
  onSellerShow: function () {
    let _self = this;

    _self.detailsSellerOverlay._show()
  },
  /**
   * todo 影藏卖家信息弹窗
   */
  onSellerHide: function () {
    let _self = this;
    _self.detailsSellerOverlay._hide()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.detailsSellerOverlay = this.selectComponent("#J_details_seller");
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