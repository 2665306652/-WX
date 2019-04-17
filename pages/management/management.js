// pages/management/management.js
const app = getApp();
let Authorize = require('../../app/authorize');
let Api = require('../../app/api');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: app.globalData.userInfo,
    mycenterPhone: "151****2867",
    cashValue: ''
  },
  goPreview() {
    wx.navigateTo({
      url: '/pages/preview/preview',
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/index/index', function (e, v) {
      app.globalData.userInfo.phone = "151****2867"
      _self.setData({
        userInfo: app.globalData.userInfo
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.cashOverlay = this.selectComponent('#J_cash');
  },
  goCash: function(){
    var _self = this;
    _self.cashOverlay._show();
  },
  /**
   * todo 提取金额输入
   */
  cashValueChange: function(e){
    var reg = /^[1-9]\d*$/;
    var nullReg = /^\s*$/;
    var _self = this;
    var value = e.detail.value;
    switch(true){
      case nullReg.test(value):
      Api._toast('输入金额不能为空不能为空');
      return;
      case reg.test(value):
      Api._toast('输入正确金额');
      return;
    }
    _self.setData({
      cashValue: e.detail.value
    })
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