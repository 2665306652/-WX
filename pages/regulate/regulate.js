// pages/regulate/regulate.js

let Api = require('../../app/api');
let Url = require('../../app/url');

Page({

  /**
   * todo 页面的初始数据
   */
  data: {
    openid: '',
    inputShowed: false,
    inputVal: "",
    nav: 2,
    listData: [],
    animation: '',
    name: '',
    surplus: '',
    units: '',
    sum: ''
  },

  /**
   * todo 搜索框显示input
   */
  onShowInput() {
    this.setData({
      inputShowed: true
    });
  },

  /**
   * todo 搜索框隐藏input
   */
  onHideInput() {
    let { nav } = this.data;
    this.setData({
      inputVal: "",
      inputShowed: false
    });
    this.getData(nav);
  },

  /**
   * todo 搜索框清空input
   */
  onClearInput() {
    this.setData({
      inputVal: ""
    });
  },

  /**
   * todo 搜索框input值改变
   * @param {*} e
   */
  onInputTyping(e) {
    let self = this;
    let { nav } = this.data;
    this.setData({
      inputVal: e.detail.value
    });
    this.getData(nav, e.detail.value);
  },

  /**
   * todo tab切换
   * @param {*} { currentTarget: { dataset }} tab切换索引
   */
  onNavClick({ currentTarget: { dataset }}) {
    let { nav } = dataset;
    this.setData({
      nav
    });
    this.getData(nav);
  },

  /**
   * todo 获取数据
   * @param {number} [e=2] 类型
   * @param {string} [q=''] 模糊匹配内容 没有可不传
   */
  getData(e = 2, q = '') {
    let self = this;
    let { openid } = this.data;
    Api._ajax({
      url: Url.regulate,
      data: {
        userId: openid.userId,
        type: e,
        q
      },
      success: res => {
        if (res.success) {
          self.setData({
            listData: res.data
          })
        } else {
          Api._toast(res.message);
        }
      }
    })
  },

  /**
   * todo 用户点击停售按钮
   * @param {*} { currentTarget: { dataset } } 点击的item
   */
  onHaltSales({ currentTarget: { dataset } }) {
    let self = this;
    let { item } = dataset;
    let { openid, nav } = this.data;
    wx.showModal({
      title: '停售商品',
      content: '停售后不可立即上架，请谨慎使用',
      confirmText: "取消",
      cancelText: "确认",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户取消')
        } else {
          Api._ajax({
            url: Url.commodityStop,
            data: {
              userId: openid.userId,
              commodityId: item.id
            },
            success: res => {
              console.log(res);
              if (res.success) {
                self.getData(nav);
              } else {
                Api._toast(res.message);
              }
            }
          })
        }
      }
    });
  },

  /**
   * 修改
   */
/*   modify({ currentTarget: { dataset }}) {
    let self = this;
    let { item } = dataset;
    let { productname, balance, unit, unitprice } = item;
    this.setData({
      name: productname,
      surplus: balance, 
      units: unit, 
      sum: unitprice,
    }, () => {
      self.takeGoodsOverlay._show();
    })
  }, */
  /**
   * todo 用户修改商品属性
   * @param {*} { currentTarget: { dataset } } 点击的item
   */
  onModify({ currentTarget: { dataset } }) {
    let self = this;
    let { item } = dataset;
    wx.showModal({
      title: '修改商品属性',
      content: '修改商品属性需先停售商品，请谨慎使用',
      confirmText: "取消",
      cancelText: "确认",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          console.log('用户取消')
        } else {
          Api._ajax({
            url: Url.commodityStop,
            data: {
              userId: self.data.openid.userId,
              commodityId: item.id
            },
            success: res => {
              console.log(res);
              if (res.success) {
                wx.navigateTo({
                  url: `../editcargo/editcargo?id=${item.id}`,
                })
              } else {
                Api._toast(res.message);
              }
            }
          })
        }
      }
    });
  },
  
  /**
   * todo 停售上架审核
   * @param {*} { currentTarget: { dataset } } 点击的item
   */
  onPutaway({ currentTarget: { dataset } }) {
    let self = this;
    let { item } = dataset;
    wx.showModal({
      title: '上架商品',
      content: '上架商品需要审核，请耐心等待',
      confirmText: "确认",
      cancelText: "取消",
      success: function (res) {
        console.log(res);
        if (!res.confirm) {
          console.log('用户取消')
        } else {
          Api._ajax({
            url: Url.commoditySubmit,
            data: {
              id: item.id
            },
            success: res => {
              console.log(res);
              if (res.success) {
                Api._toast('已提交');
                self.getData(self.data.nav);
              } else {
                Api._toast(res.message);
              }
            }
          })
        }
      }
    });
  },

  /**
   * todo 停售列表下的去修改
   * @param {*} { currentTarget: { dataset } } 点击的item
   */
  onModifyProperty({ currentTarget: { dataset } }) {
    let self = this;
    let { item } = dataset;
    wx.navigateTo({
      url: `../editcargo/editcargo?id=${item.id}`,
    })
  },
  /**
   * 弹层隐藏
   */
  /* sellerHidden() {
    let self = this;
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 100,
      transformOrigin: 'left bottom 0'
    });
    animation.bottom("-50vh").step();
    self.setData({
      animation: animation.export(),
    })
    setTimeout(() => {
      self.setData({
        sellerShow: true,
      })
    }, 500);
  }, */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const openid = wx.getStorageSync('user');
    this.setData({
      openid
    }, () => {
      this.getData(2);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.takeGoodsOverlay = this.selectComponent("#J_details_updataGoods");
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