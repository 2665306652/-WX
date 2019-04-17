const URL = require('../../app/url.js');
const Api = require('../../app/api.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cardPhoto: '', //照片路径
    imageShow: true,
    progressShow: true,
    nameValue: '', //姓名
    cardValue: '', //证件
    telValue: '', //电话
    codeValue: '', //验证码
    progressValue: 68, //上传进度条
    wait: 60,
    getCodeTxt: '获取验证码',
    getCodeState: false,
    front: '', //身份证正面照
    side: '', //身份证反面照
    people: '' //手持身份证正面照
  },

  /**
   * todo 姓名输入框
   * @param {*} { detail: { value }} 值
   */
  onNameChange({ detail: { value }}) {
    this.setData({
      nameValue: value
    });
  },

  /**
   * todo 身份证输入框
   * @param {*} { detail: { value }} 值
   */  
  onCardChange({ detail: { value } }) {
    this.setData({
      cardValue: value
    });
  },

  /**
   * todo 电话号码输入框
   * @param {*} { detail: { value }} 值
   */
  onTelChange({ detail: { value } }) {
    this.setData({
      telValue: value
    });
  },

  /**
   * todo 验证码输入框
   * @param {*} { detail: { value }} 值
   */
  onCodeChange({ detail: { value } }) {
    this.setData({
      codeValue: value
    });
  },

  /**
   * todo 调取本地图片
   * @param {*} { currentTarget: { dataset } } 本地图片路径
   */
  onChooseImage({ currentTarget: { dataset } }) {
    const self = this;
    const { progressShow } = this.data;
    const { item } = dataset;
    if (!progressShow) { 
      return false;
    }
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count: 1,
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.uploadOnlyone(res.tempFilePaths[0], item);
        let obj = {};
        obj[item] = res.tempFilePaths[0];
        self.setData({
          cardPhoto: res.tempFilePaths[0],
          imageShow: false,
          progressShow: item,
          ...obj
        });
      }
    })
  },

  /**
   * todo 上传一张图片
   * @param {*} tempFilePath 本地图片路径
   * @param {*} item 上传图片的类型 （正面、反面、手持身份证）
   */
  uploadOnlyone(tempFilePath, item) {
    const self = this;
    /* const imageType = {
      front: 'front',
      side: 'side',
      people: 'people'
    } */
    let uploadTask = wx.uploadFile({
      url: URL.uploadImage, 
      filePath: tempFilePath,
      header: {
        'token': 'kkk000',
      },
      name: 'imageFile',
      success(res) {
        let obj = {};
        obj[item] = res.data;
        console.log(res);
        console.log('succ');
        self.setData({
          progressShow: true,
          ...obj, //跑正式接口的时候放开这个 这是存后台返回图片路径的
        });
      },
      fail: () => {
        Api._toast('图片上传失败');
        console.log(URL.uploadImage + '接口异常')
      }
    });
    uploadTask.onProgressUpdate((res) => {
      this.setData({
        progressValue: res.progress
      });
    })
  },

  /**
   * todo 获取验证码
   */
  onGetCode() {
    let { getCodeState, telValue} = this.data;
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
    }).catch(res => {
      console.log(res, '错误');
    }) 
  },

  /**
   * todo 倒计时
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
   * todo 提交按钮点击
   */
  onUploadBtn() {
    const self = this;
    let { nameValue, cardValue, telValue, codeValue, front, side, people } = this.data;
    const nullReg = /^\s*$/;
    const telReg = /^1[3456789]\d{9}$/;
    const cardreg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
    switch (true) {
      case nullReg.test(nameValue): 
        Api._toast('姓名不能为空');
        return;
      case nullReg.test(cardValue):
        Api._toast('证件号码不能为空');
        return;
      case !cardreg.test(cardValue):
        Api._toast('请正确输入身份证号');
        return;
      /* case nullReg.test(telValue):
        Api._toast('电话号码不能为空');
        return;
      case !telReg.test(telValue):
        Api._toast('电话号码错误');
        return;
      case nullReg.test(codeValue):
        Api._toast('验证码不能为空');
        return; */
      case nullReg.test(front):
        Api._toast('请上传身份证正面');
        return;
      case nullReg.test(side):
        Api._toast('请上传身份证反面');
        return;
      case nullReg.test(people):
        Api._toast('请上传您手持身份证照');
        return;
    };
    const openid = wx.getStorageSync('user');
    let obj = {
      id: openid.userId,
      names: nameValue,
      phone: openid.phone,
      cardid: cardValue,
      idcarda: front,
      idcardb: side,
      namepic: people
    }
    //上传
    Api._ajax({
      url: URL.saveSellerinfo,
      header: {
        'content-type': 'application/json'
      },
      data: obj,
      success(res) {
        console.log(res, 'shangchuan');
        if (res.success) {
          wx.reLaunch({
            url: '/pages/msgsuccess/msgsuccess'
          });
        } else {
          Api._toast(res.message);
        }
      }
    });
  },






  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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