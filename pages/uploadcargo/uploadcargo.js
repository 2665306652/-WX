const URL = require('../../app/url.js');
const Api = require('../../app/api.js');

/**
 * todo 将wx的callback形式的API转换成支持Promise的形式
 * @param {*} api 需要转换的wx api
 * @returns 一个promise函数 按原生wx的api参数传参调用
 */
const promisify = api => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      const extras = {
        success: resolve,
        fail: reject
      }
      api({ ...options, ...extras }, ...params)
    })
  }
};
const wxUploadFile = promisify(wx.uploadFile);



Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    imageShow: true,
    progressShow: true,
    countries: ["全新", "二手"], //新旧程度
    countryIndex: 0,
    files: [], // 商品图片
    cardPhoto: '', //商品主图
    nameValue: '', //商品名称
    priceValue: '', //商品价格
    numberValue: '', //商品数量
    addressValue: '', //卖家地址
    explainValue: '', //商品描述
    progressValue: 68, //上传进度条
    unitValue: '', //商品单位
    imageList: '', //商品详情图
    checkboxItems: [
      { name: 'standard is dealt for u.', value: '0', checked: true },
      { name: 'standard is dealicient for u.', value: '1' },
      { name: 'standard is dealicient for uthree.', value: '2' }
    ],
    radioItems: [],
  },

  /**
   * todo 新旧程度选择改变
   * @param {*} { detail: { value } } 当前选中的value值
   */
  onBindCountryChange({ detail: { value } }) {
    this.setData({
      countryIndex: value
    })
  },

  /**
   * todo 商品名称输入框
   * @param {*} { detail: { value } } 当前值
   */
  onNameChange({ detail: { value } }) {
    this.setData({
      nameValue: value
    });
  },

  /**
   * todo 商品价格输入框
   * @param {*} { detail: { value } } 当前值
   */
  onPriceChange({ detail: { value } }) {
    this.setData({
      priceValue: value
    });
  },

  /**
   * todo 商品数量输入框
   * @param {*} { detail: { value } } 当前值
   */
  onNumberChange({ detail: { value } }) {
    this.setData({
      numberValue: value
    });
  },

  /**
   * todo 选择房号输入框
   * @param {*} { detail: { value } } 当前值
   */
  onAddressChange({ detail: { value } }) {
    this.setData({
      addressValue: value
    });
  },

  /**
   * todo 商品描述输入框
   * @param {*} { detail: { value } } 当前值
   */
  onExplainChange({ detail: { value } }) {
    this.setData({
      explainValue: value
    });
  },

  /**
   * todo 商品单位输入框
   * @param {*} { detail: { value } } 当前值
   */
  onUnitChange({ detail: { value } }) {
    this.setData({
      unitValue: value
    });
  },

  /**
   * todo 上传商品主图
   * @returns
   */
  onChooseImageMain() {
    const self = this;
    const { progressShow } =this.data;
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
          cardPhoto: res.tempFilePaths[0],
          imageShow: false,
          progressShow: false
        });
      }
    })
  },

  /**
   * todo 上传一张图片
   * @param {*} tempFilePath 图片本地路径
   */
  uploadOnlyone(tempFilePath) {
    const self = this;
    let uploadTask = wx.uploadFile({
      url: URL.uploadImage, // 仅为示例，非真实的接口地址
      filePath: tempFilePath,
      header: {
        'token': 'kkk000',
      },
      name: 'imageFile',
      success(res) {
        console.log(res, '图图图图图');
        console.log('succ');
        self.setData({
          cardPhoto: res.data,
          progressShow: true
        });
      },
      fail(res) {
        Api._toast('图片上传错误');
        self.setData({
          cardPhoto: '',
          progressShow: true
        });
        console.log(URL.uploadImage + '接口异常');
      }
    });
    uploadTask.onProgressUpdate((res) => {
      this.setData({
        progressValue: res.progress
      });
      /* console.log('上传进度', res.progress)
      console.log('已经上传的数据长度', res.totalBytesSent)
      console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend) */
    })
  },

  /**
   * todo 上传多张图片
   * @param {*} [tempFilePaths=[]] 图片的本地路径
   */
  uploadMore(tempFilePaths = []) {
    const self = this;
    const arr = [];
    tempFilePaths.forEach((value, index) => {
      arr.push(wxUploadFile({
        url: URL.uploadImage, // 仅为示例，非真实的接口地址
        filePath: value,
        header: {
          'token': 'kkk000',
        },
        name: 'imageFile',
      }));
    });
    wx.showLoading({
      title: '正在创建...',
      mask: true
    });
    Promise.all(arr).then(res => {
      console.log(res,"批量");
      let imgArr = res.map(val => {
        return val.data;
      });
      let imageList = self.data.imageList;

      self.setData({
        imageList: [...imageList, ...imgArr]
      })
      wx.hideLoading();
      //return res.map(item => JSON.parse(item.data).url)
    }).catch(err => {
      console.log(">>>> upload images error:", err);
      wx.hideLoading()
    });
  },

  /**
   * todo 调取本地图片
   * @param {*} e 
   */
  onChooseImage(e) {
    const self = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        self.uploadMore(res.tempFilePaths);
        self.setData({
          files: self.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },

  /**
   * todo 查看大图
   * @param {*} e
   */
  onPreviewImage(e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },

  /**
   * todo 移除图片
   * @param {*} { currentTarget: { dataset }} 移除的索引
   */
  onRemoveImage({ currentTarget: { dataset }}) {
    let { index } = dataset;
    let { files, imageList } = this.data;
    files.splice(index, 1);
    imageList.splice(index, 1);
    this.setData({
      files,
      imageList
    });
  },

  /**
   * todo 复选
   * @param {*} e 选中的value
   */
  onCheckboxChange(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    let checkboxItems = this.data.checkboxItems, values = e.detail.value;
    for (let i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;
      for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }
    this.setData({
      checkboxItems: checkboxItems
    });
  },

  /**
   * todo 单选
   * @param {*} e 选中的value
   */
  onRadioChange: function ({ detail: { value }}) {
    console.log('radio发生change事件，携带value值为：', value);
    let addressValue = ''
    var radioItems = this.data.radioItems;
    for (var i = 0, len = radioItems.length; i < len; ++i) {
      radioItems[i].checked = radioItems[i].value == value;
      if (radioItems[i].value == value) {
        addressValue = radioItems[i];
      }
    }
    this.setData({
      radioItems: radioItems,
      addressValue
    });
  },

  /**
   * todo 点击提交
   */
  onUploadBtn() {
    const self = this;
    let {
      openid,
      cardPhoto,
      nameValue, 
      priceValue, 
      numberValue, 
      addressValue, 
      explainValue,
      countryIndex,
      unitValue,
      imageList
    } = this.data;
    const nullReg = /^\s*$/;
    const numreg = /^[\.\d]+$/;
    //const telReg = /^1[3456789]\d{9}$/;
    switch (true) { // 验证不能为空
      case nullReg.test(cardPhoto):
        Api._toast('商品主图不能为空');
        return;
      case nullReg.test(nameValue):
        Api._toast('商品名不能为空');
        return;
      case nullReg.test(priceValue):
        Api._toast('商品价格不能为空');
        return;
      case !numreg.test(priceValue):
        Api._toast('商品价格只能是阿拉伯数字');
        return;
      case nullReg.test(numberValue):
        Api._toast('商品数量不能为空');
        return;
      case !numreg.test(numberValue):
        Api._toast('商品数量只能是阿拉伯数字');
        return;
      case nullReg.test(addressValue):
        Api._toast('销售小区不能为空');
        return;
      case nullReg.test(explainValue):
        Api._toast('产品描述不能为空');
        return;
      case nullReg.test(unitValue):
        Api._toast('商品单位不能为空');
        return;
      case !imageList.length:
        Api._toast('商品详情图不能为空');
        return;
    };
    let obj = {
      userId: openid.userId,
      bigImg: cardPhoto, //大图
      name: nameValue, //商品名称
      price: priceValue, //价格
      number: numberValue,//数量
      communityName: `${addressValue.communityname}-${addressValue.addressinfo}`, //销售小区
      villagelistId: addressValue.villagelistId, //销售小区所在小区集合id
      description: explainValue, //产品描述
      imgs: imageList,//相关图片 list数组
      unit: unitValue, //商品单位
      type: countryIndex + 1, //商品属性 1:全新2:二手
    };
    //上传
    Api._ajax({
      url: URL.uploadCargo,
      header: {
        'content-type': 'application/json'
      },
      data: obj,
      success(res) {
        console.log(res, 'shangchuan');
        if (res.success) {
          wx.reLaunch({
            url: '/pages/msgsuccess/msgsuccess?type=CARGO'
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
    const openid = wx.getStorageSync('user');
    const self = this;
   /*  radioItems: [
      { name: 'cell standard ', value: '0' },
      { name: 'cell standard', value: '1', checked: true }
    ], */
    Api._ajax({
      url: URL.getVillage,
      data: {
        userId: openid.userId
      },
      success(res) {
        console.log(res, 'huoqu diz');
        if (res.success) {
          let list = res.data.list;
          let arr = list.map((value, index) => {
            let obj = value;
            obj.name = `${value.province}、${value.city}、${value.area}、${value.communityname}、${value.addressinfo} ${value.username}：${value.userphone}`;
            obj.value = index;
            return obj;
          });
          self.setData({
            radioItems: arr
          });
        } else {
          Api._toast(res.message);
        }
      }
    })
    this.setData({
      openid
    });

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