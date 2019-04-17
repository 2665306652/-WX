// pages/editprofile/editprofile.js
const app = getApp()

let Authorize = require('../../app/authorize');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    sellerShow: true,
    animation: '',
    updataValue: '',
    dialogTitle:'修改头像',
    progressShow: true,
    progressValue: 30
  },

  /**
   * 弹层隐藏
   */
  sellerHidden() {
    let self = this;
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 100,
      transformOrigin: 'left bottom 0'
    });
    animation.bottom("-80vh").step();
    self.setData({
      animation: animation.export(),
    })
    setTimeout(() => {
      self.setData({
        sellerShow: true,
      })
    }, 500);
  },

  dialogOff() {
    this.sellerHidden();
  },

  dialogOk() {
    this.sellerHidden();
  },

  /**
   * 取消冒泡
   */
  stopPrevent() {
    return false;
  },

  /**
   * 修改
   */
  modify({ currentTarget: { dataset } }) {
    let self = this;
    let { item, value } = dataset;
    const arr = ["修改头像", "修改名字", "修改性别", "修改号码",]
    let animation = wx.createAnimation({
      duration: 400,
      timingFunction: 'ease',
      delay: 100,
      transformOrigin: 'left bottom 0'
    });
    animation.bottom(0).step();
    
    this.setData({
      sellerShow: false,
      updataValue: value,
      dialogTitle: arr[item]
    }, () => {
      self.setData({
        animation: animation.export(),
      })
    })
  },

  updataValueChange({ detail: { value } }) {
    this.setData({
      updataValue: value
    });
  },

  clearUpdataValue() {
    this.setData({
      updataValue: ""
    });
  },

  /**
   * 拉起本地相册
   */
  chooseImage() {
    const self = this;
    const { progressShow } = this.data;
    if (!progressShow) {
      return false;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.uploadOnlyone(res.tempFilePaths[0]);
        self.setData({
          updataValue: res.tempFilePaths[0],
          progressShow: false
        });
      }
    })
  },

  /**
   * 上传一张图片
   */
  uploadOnlyone(tempFilePath) {
    const self = this;
    let uploadTask = wx.uploadFile({
      url: 'http://www.baidu.com', // 仅为示例，非真实的接口地址
      filePath: tempFilePath,
      name: 'imageFile',
      success(res) {
        console.log(res);
        const data = res.data;
        console.log('succ');
        self.setData({
          progressShow: true
        });
      },
      fail(res) {
        console.log(res)
      }
    });
    uploadTask.onProgressUpdate((res) => {
      this.setData({
        progressValue: res.progress
      });
      console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/editprofile/editprofile',function (param) {
      console.log(app.globalData.userInfo,'userInfo')
      _self.setData({
        userInfo : app.globalData.userInfo
      })
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