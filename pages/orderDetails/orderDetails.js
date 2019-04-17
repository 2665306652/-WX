// pages/orderDetails/orderDetails.js

let app = getApp();
let Api = require('../../app/api');
let Url = require('../../app/url');
let Authorize = require('../../app/authorize');

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    userInfo: '',
    orderDetail: [],
    addressinfo: [],
    addressBuy:{},
    addressSold: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  /**
   * todo 获取购买订单详情
   */
  _getDetails: function() {
    let _self = this;
    Api._ajax({
      url: Url.orderDetail,
      data:{
        id : _self.data.id,
      },
      success: function (res) {
        console.log(res.data.addressinfo)
        _self.setData({
          orderDetail: res.data,
          addressinfo: JSON.parse(res.data.addressinfo),
          addressBuy: JSON.parse(res.data.addressinfo)[0],
          addressSold: JSON.parse(res.data.addressinfo)[1],
        }, () => {
          console.log(_self.data.addressinfo)
        })
      }
    })
  },
  /**
   * todo 确认收货
   */
  _getReceivingGoods: function (param) { 
    let _self = this;
    Api._ajax({
      url: Url.buyerConfirmreceipt,
      data:{
        id : _self.data.orderDetail.id,
        userId: _self.data.userInfo.userId
      },
      success: function (res) {
        console.log(res.data.addressinfo)
        // _self.setData({
         
        // }, () => {
        //   console.log(_self.data.addressinfo)
        // })
      }
    })
  },
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/userInfo/userInfo', function (param) {
      // console.log(app.globalData.userInfo)
      _self.setData({
        userInfo: app.globalData.userInfo,
      }, () => {
      })
    })
    if(options.id){
      _self.setData({
        id: options.id
      },()=>{
        _self._getDetails();
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * todo 点击确认收货
   */
  openConfirm: function () {
    let _self = this;
    wx.showModal({
      title: '提示',
      content: '确认收货',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
          console.log(res);
          if (res.confirm) {
              _self._getReceivingGoods();
              _self._getDetails();
              console.log('用户点击主操作')
          }else{
              console.log('用户点击辅助操作')
          }
      }
    });
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