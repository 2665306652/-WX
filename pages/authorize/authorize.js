/**
 * todo 用户授权界面
 */
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    resolve: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    this.data.resolve = options.resolve;
    if (app.globalData.userInfo) {
      _self.getUserInfo({
        detail: {
          userInfo: app.globalData.userInfo
        }
      })
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          _self.getUserInfo({
            detail: {
              userInfo: res.userInfo
            }
          })
        }
      })
    }
  },
  /**
   * TODO: 获取用户信息，然后执行登录的方法，同步用户信息
   * @param {*} e 
   */
  getUserInfo: function (e) {
    let _self = this;
    app.globalData.userInfo = e.detail.userInfo;

    app.getOpenId(app.globalData.userInfo).then((e, v) => {
      wx.redirectTo({
        url: _self.data.resolve,
        success: (result) => {

        },
        fail: () => {},
        complete: () => {}
      });
    })
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