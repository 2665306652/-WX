// pages/userInfo/userInfo.js
let app = getApp();
let Api = require("../../app/api");
let Url = require("../../app/url");
let Authorize = require('../../app/authorize');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    editPhone: null,
    editName: null,
    editCode: null,
    codeText: '获取验证码',
    codeStatus: true,
    phoneStatus: false,
    adverbCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/userInfo/userInfo', function (param) {
      _self.setData({
        userInfo: app.globalData.userInfo
      }, () => {
        //console.log(_self.data.userInfo)
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.editPhoneOverlay = this.selectComponent("#J_edit_phone");
    this.editNameOverlay = this.selectComponent("#J_edit_name");

  },
  /**
   * todo 手机号编辑弹层显示
   * @param {*} e 
   */
  onEditPhone: function (e) {
    let _self = this;
    this.setData({
      editPhone: _self.data.userInfo.phone,
      editCode : null
    }, () => {
      this.editPhoneOverlay._show()
    })
  },
  /**
   * todo 手机号input内容变更
   * @param {*} e 
   */
  onPhoneChange(e) {
    let _self = this;

    this.setData({
      editPhone: e.detail.value,
      phoneStatus: Api._isTel(e.detail.value, false)
    }, () => {
      console.log(_self.data.phoneStatus)
    })
  },
  /**
   * todo 获取手机验证码
   */
  onGetPhoneCode() {
    let _self = this;
    let timer;
    if (_self.data.phoneStatus) {
      Api._toast('电话号码错误');
      return false;
    }
    if (_self.data.codeStatus) {
      Api._getCode(_self.data.editPhone).then(res => {
        console.log(res, '获取验证码成功');
        var time = 10;
        _self.setData({
          codeStatus: false,
          adverbCode: res.data.ocode
        }, () => {
          _self.setData({
            codeText: '(' + time + 's)后重新获取'
          })
          timer = setInterval(() => {
            if (time == 1) {
              clearInterval(timer);
              _self.setData({
                codeText: '获取验证码',
                codeStatus: true
              })
            } else {
              time--;
              _self.setData({
                codeText: '(' + time + 's)后重新获取'
              })
            }

          }, 1000)
        })


      }).catch(res => {
        console.log(res, '错误');
      })
    }
  },
  /**
   * todo 验证码输入
   * @param {*} e 
   */
  onEditPhoneCode(e) {
    let _self = this;
    _self.setData({
      editCode: e.detail.value
    })
  },
  /**
   * todo 手机号保存
   */
  onEditPhoneSave() {
    let _self = this;
    if (!_self.data.editCode) {
      Api._toast('请输入验证码');
      return false;
    }
    if (_self.data.phoneStatus) {
      Api._toast('请输入正确的手机号');
      return false;
    }
    if (!_self.data.adverbCode) {
      Api._toast('请获取正确的验证码');
      return false;
    }

    _self.infoSave({
      id: _self.data.userInfo.userId,
      phone: _self.data.editPhone,
      code: _self.data.editCode,
      ocode: _self.data.adverbCode
    }, function (param) {
      _self.editPhoneOverlay._hide();
      app.globalData.userInfo.phone = _self.data.editPhone;
      _self.data.userInfo.name = _self.data.editPhone;
      _self.setData({
        userInfo: _self.data.userInfo,
        editCode : null
      })
    })

  },
  /**
   * todo 用户姓名变更弹层显示
   * @param {*} e 
   */
  onEditName: function (e) {
    let _self = this;
    this.setData({
      editName: _self.data.userInfo.names
    }, () => {
      this.editNameOverlay._show()
    })
  },
  /**
   * todo 用户信息变更
   * @param {*} e 
   */
  onNameChange(e) {
    let _self = this;
    this.setData({
      editName: e.detail.value
    })
  },
  /**
   * todo 用户姓名保存
   */
  onEditNameSave() {
    let _self = this;
    if (_self.data.editName == _self.data.userInfo.names) {
      _self.editNameOverlay._hide()
    } else {

      _self.infoSave({
        id: _self.data.userInfo.userId,
        names: _self.data.editName
      }, () => {
        _self.editNameOverlay._hide();
        app.globalData.userInfo.names = _self.data.editName;
        _self.data.userInfo.name = _self.data.editName;
        _self.setData({
          userInfo: _self.data.userInfo
        })
      })

    }
  },
  /**
   * todo 用户信息变更接口请求
   * @param {*} data 
   * @param {*} callback 
   */
  infoSave(data, callback) {
    Api._ajax({
      url: Url.editUser,
      header: {
        'content-type': 'application/json'
      },
      data: data,
      success: function (res) {
        if (res.success) {
          Api._toast('修改成功');
          callback && callback()
        } else {
          Api._toast(res.message);
        }
      }
    })
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