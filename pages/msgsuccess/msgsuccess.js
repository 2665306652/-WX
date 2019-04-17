// pages/msgsuccess/msgsuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    introduceValue: '恭喜您注册成功',
    state: '操作成功',
    homePage: '个人中心',
    mainText: '首页看看',
    minorText: '个人中心',
    minorUrl: '/pages/mycenter/mycenter',
    type: '',
  },

  /**
   * todo 主跳转按钮
   */
  onMainOperation() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  /**
   * todo 次跳转按钮
   */
  onMinorOperation() {
    let { minorUrl, type } = this.data;
    if (type == 'CARGO') {
      wx.navigateTo({
        url: minorUrl
      });
      return;
    }
    wx.reLaunch({
      url: minorUrl
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({type}) {
    const obj1 = {
      SHZ: '审核中',
      WTG: '审核未通过',
      CARGO: '商品上传成功',
    },
    obj2 = {
      SHZ: '请您耐心等待',
      WTG: '请重新填写资料',
      CARGO: '我们将尽快给您审核，请您关注商品动态'
    };
    let { minorText, minorUrl } = this.data;
    if (type == 'CARGO') {
      minorText = '继续上传';
      minorUrl = '/pages/uploadcargo/uploadcargo';
    }
    this.setData({
      state: obj1[type] ? obj1[type] : '操作成功',
      introduceValue: obj2[type] ? obj2[type] : '恭喜您注册成功',
      type,
      minorText,
      minorUrl
    });
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