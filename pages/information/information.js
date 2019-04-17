const app = getApp();
const URL = require('../../app/url.js');
const Api = require('../../app/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cascading: true,
    dialogShow: true,
    otherPlot: true,
    listShow: true,
    inputShowed: false,
    citieValue: '', //省市区
    nameValue: '',//证实姓名
    telValue: '', //电话号码
    textareaValue: '', //详细地址
    codeValue: '', //验证码
    ocodeValue: '', //加密验证码
    inputVal: "",
    searchData: [],
    plot: '', //小区
    importInputValue: '', //用户输入小区
    roomValue: '', //房号
    wait: 60, //倒计时
    getCodeTxt: '获取验证码',
    getCodeState: false,
    animation: '',
    searchShow: false,
    dailogTitle: "选择小区",
    updataValue: '',
    enterfirstArea: ["这是第一个小区"],
    selectIndex: 'alababa',
    selectValue: '',
    editAddress: {},
    gotoUploadidcard: false
  },

  /**
   * todo 姓名输入框
   * @param {*} { detail: { value } } 值
   */
  onNameChange({ detail: { value } }){
    this.setData({
      nameValue: value
    });
  },

  /**
   * todo 号码输入框
   * @param {*} { detail: { value } } 值
   */
  onTelChange({ detail: { value } }) {
    this.setData({
      telValue: value
    });
  },

  /**
   * todo 二维码输入框
   * @param {*} { detail: { value } } 值
   */
  onCodeChange({ detail: { value } }) {
    this.setData({
      codeValue: value
    });
  },

  /**
   * todo 房号输入框
   * @param {*} { detail: { value } } 值
   */
  onRoomChange({ detail: { value } }) {
    this.setData({
      roomValue: value
    });
  },

  /**
   * todo 地区查询
   * @param {*} e 返回数据
   */
  searchResult: function (e) {
    let _self = this;
    let res = e.detail.province + ',' + e.detail.city + "," + e.detail.area + ',' + e.detail.communityname;
    _self.data.editAddress = e.detail;
    _self.data.editAddress.village = res;
    _self.setData({
      editAddress: _self.data.editAddress
    })
  },

  /**
   * todo 隐藏地区查询
   * @param {*} param
   */
  villageSerachShow: function (param) {
    let _self = this;
    this.villageSearch._show();
  },

  /**
   * todo 获取验证码
   * @returns
   */
  onGetCode() {
    const self = this;
    let { getCodeState, telValue } = this.data;
    if (Api._isTel(telValue, true)) {
      return;
    }
    if (getCodeState) {
      return false;
    }
    this.setData({
      getCodeState: true,
    });
    this.countDown();
    //获取验证码
    Api._getCode(telValue).then(res => {
      console.log(res, '获取验证码成功');
      self.setData({
        ocodeValue: res.data.ocode
      })
    }).catch(res => {
      console.log(res, '错误');
    });
  },

  /**
   * todo 倒计时
   * @returns
   */
  countDown() {
    const self = this;
    let { wait } = this.data;
    if (wait === 0) {
      this.setData({
        getCodeTxt: "获取验证码",
        getCodeState: false,
        wait: 60
      });
      return false;
    } else {
      wait--;
      this.setData({
        getCodeTxt: `(${wait}s)后重新获取`,
        wait
      });
      setTimeout(() => {
        self.countDown();
      }, 1000)
    }
  },

  /**
   * todo 提交审核
   * @returns 输入为空判断
   */
  onUploadBtn() {
    const self = this;
    let { 
      telValue, 
      nameValue, 
      codeValue, 
      editAddress: { village, id, communityname, province, city, area, detail }, 
      roomValue,
      ocodeValue,
      gotoUploadidcard
    } = this.data;
    const nullReg = /^\s*$/;
    const telReg = /^1[3456789]\d{9}$/;
    switch (true) {
      case nullReg.test(nameValue):
        Api._toast('真实姓名不能为空');
        return;
      case nullReg.test(telValue):
        Api._toast('手机号不能为空');
        return;
      case !telReg.test(telValue):
        Api._toast('手机号码错误');
        return;
      case nullReg.test(codeValue):
        Api._toast('验证码不能为空');
        return;
      case nullReg.test(ocodeValue):
        Api._toast('请获取验证码');
        return;
      case nullReg.test(village):
        Api._toast('关联小区不能为空');
        return;
      case nullReg.test(roomValue):
        Api._toast('房间号不能为空');
        return;
    };
    const openid = wx.getStorageSync('user');
    let obj = {
      userId: openid.userId,
      province, //省
      city, //市
      area, //区
      communityname, //小区名称
      addressinfo: roomValue, //详细地址
      def: 0, //默认
      villagelistId: id, //址汇总id
      userphone: telValue, //手机号码
      username: nameValue, //名字
      code: codeValue, //验证码
      ocode: ocodeValue, //加密的
    }
    //开始上传
    Api._ajax({
      url: URL.bulletBoxSaveAddress,
      header: {
        'content-type': 'application/json'
      },
      data: obj,
      success: (result) => {
        console.log(result);
        if (result.success) {
          app.globalData.userInfo.names = nameValue;
          app.globalData.userInfo.phone = telValue;
          if (gotoUploadidcard) {
            wx.redirectTo({
              url: '/pages/uploadidcard/uploadidcard'
            });
          } else {
            wx.reLaunch({
              url: '/pages/msgsuccess/msgsuccess'
            });
          }
        } else {
          Api._toast(result.message);
        }
      }
    });
  },

  /**
   * todo 地址弹层显示
   * @param {*} param
   */
  villageSerachShow: function (param) {
    let _self = this;
    this.villageSearch._show();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function ({ type }) {
    if (type == 'noInformation') {
      this.setData({
        gotoUploadidcard: true
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.villageSearch = this.selectComponent("#J_village_Search");
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