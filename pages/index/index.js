//index.js
//获取应用实例
const app = getApp()

let Api = require('../../app/api');
let Url = require('../../app/url');

let Authorize = require('../../app/authorize');

Page({
  data: {
    navList: [],
    itemList: [],
    navIndex: 0,
    banner: {},


  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('index onload')
    let _self = this;

    // console.log("index onload")

    Authorize('/pages/index/index', function (e, v) {

      _self.init();
      // if(app.globalData.userInfo.names){
       

      // }else{
      //   _self.getItemList('0')
      // }


    })

  },
  /**
   * todo 页面初始化函数
   */
  init: function () {
    let _self = this;
    Api._ajax({
      url: Url.getVillage,
      data: {
        userId: app.globalData.userInfo.names ? app.globalData.userInfo.userId :  0
      },
      success: function (res) {
        console.log('navlist:', res.data)
        _self.setData({
          navList: res.data.list,
          navIndex: 0
        }, () => {
          _self.getItemList(_self.data.navList[_self.data.navIndex]['villagelistId'])
        })
      }
    })
  },
  /**
   * todo  小区导航点击切换
   * @param {*} e 
   * @param {*} i 
   */
  onNavChange: function (e, i) {
    let _self = this;
    var index = e.target.dataset.index;
    console.log("navChange:", e)
    this.setData({
      navIndex: index
    }, () => {

      if (!_self.data.itemList[index] || !_self.data.itemList[index].length) {
        _self.getItemList(_self.data.navList[index]['villagelistId'])
      }
      //
    })
  },
  /**
   * todo 商品列表滑动切换
   * @param {*} e 
   * @param {*} d 
   */
  onListChange: function (e, d) {
    // console.log('e:',e)
    let _self = this;
    let index = e.detail.current;
    if (e.detail.source == 'touch') {
      _self.setData({
        navIndex: index
      }, () => {
        if (!_self.data.itemList[index] || !_self.data.itemList[index].length) {
          _self.getItemList(_self.data.navList[index]['villagelistId'])
        }
      })
    }
  },
  /**
   * todo 页面下拉刷新
   * @param {*} param 
   */
  onPullDownRefresh: function (param) {
    let _self = this;
    var curPages = getCurrentPages();

    console.log(curPages, 111)

    _self.onLoad();

  },
  /**
   * todo 页面上拉加载更多
   */
  onReachBottom() {
    let _self = this;
    console.log('onReachBottom')
  },
  /**
   * todo 获取当前小区的商品列表
   * @param {*} navId 
   * @param {*} index 
   */
  getItemList: function (navId, index) {
    let _self = this;
    Api._ajax({
      url: Url.itemList,
      data: {
        villagelistId: navId,
        page: index ? index : 1
      },
      success: function (res) {
        if (_self.data.itemList[_self.data.navIndex]) {
          _self.data.itemList[_self.data.navIndex] = _self.data.itemList[_self.data.navIndex].concat(res.data.list)
        } else {
          _self.data.itemList[_self.data.navIndex] = res.data.list
        }
        _self.setData({
          itemList: _self.data.itemList,
        }, () => {

        })
      }
    })
  },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})