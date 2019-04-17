// pages/camera/camera.js
const Api = require('../../app/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '', //拍摄的图片路径
    shootValue: '拍摄', // 拍摄按钮
    navStyle: false, //导航条
    front: '', //身份证正面照
    side: '', //身份证反面照
    progressValue: 68, //上传进度条
    progressShow: true, //上传进度条显示
    reconfirmation: 0, //信息确认
  },

  /**
   * todo 点击拍摄
   */
  onShoot() {
    let self = this;
    let { shootValue } = this.data;
    if (shootValue === '重拍') {
      self.setData({
        src: '',
        shootValue: '拍摄'
      });
    } else {
      const ctx = wx.createCameraContext()
      ctx.takePhoto({
        quality: 'low',
        success: (res) => {
          // console.log(res.tempImagePath)
          wx.getFileSystemManager().readFile({
            filePath: res.tempImagePath, //选择图片返回的相对路径
            encoding: 'base64', //编码格式
            success: res => { //成功的回调
              self.setData({
                src: 'data:image/png;base64,' + res.data,
                shootValue: '重拍'
              });
              console.log(self.data)
            }
          })
        }
      })
    }
  },

  /**
   * todo 人脸验证下一步
   */
  onNext() {
    let { src } = this.data;
    if (src == '') {
      Api._toast('请拍摄您本人的照片');
      return;
    }
    this.setData({
      navStyle: true
    });
  },

  /**
   * todo 人脸验证上一步
   */
  onBack() {
    this.setData({
      navStyle: false
    });
  },

  /**
  * todo 调取本地图片
  * @param {*} { currentTarget: { dataset } } 本地图片路径
  */
  onChooseImage({ currentTarget: { dataset } }) {
    const self = this;
    let { reconfirmation } = this.data;
    const { item } = dataset;
    /* if (!progressShow) {
      return false;
    } */
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        //self.uploadOnlyone(res.tempFilePaths[0], item);
        let obj = {};
        obj[item] = res.tempFilePaths[0];
        reconfirmation ++;
        self.setData({
          cardPhoto: res.tempFilePaths[0],
          imageShow: false,
          reconfirmation,
          ...obj
        });
      }
    })
  },

  /**
   * todo 提交认证
   */
  onSure() {
    let { reconfirmation } = this.data;
    if (reconfirmation !== 2) {
      return;
    }
    console.log('queren')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    

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