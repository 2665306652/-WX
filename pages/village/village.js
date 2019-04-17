// pages/village/village.js
let app = getApp();
var Api = require("../../app/api");
var Url = require('../../app/url');
let Authorize = require('../../app/authorize');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressArr: [],
    editAddress: {},
    editAddressIndex: null,
    userInfoAddress: false,
    villageSearch: false,
    inputVal: '',
    userphoneStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/village/village', function (e, v) {

      _self.getAddress();



      // _self.setData({
      //   userInfo: app.globalData.userInfo
      // })
    })

  },
  /**
   * TODO 编辑地址信息弹层展示
   * @param {*} e 
   */
  onEditAddressShow: function (e) {
    let _self = this;
    let item = e.currentTarget.dataset.item ? e.currentTarget.dataset.item : {};

    item.defStatus = item.def;
    // console.log(e)
    this.setData({
      editAddress: item,
      editAddressIndex: e.currentTarget.dataset.index
    }, () => {
      _self.addressOverlay._show();
    })
  },
  /**
   * TODO 调用小区模糊搜索组件
   * @param {*} param 
   */
  onVillageSerachShow: function (param) {
    let _self = this;
    this.villageSearch._show();
  },
  /**
   * TODO 小区模糊搜索回调
   * @param {*} e 
   */
  onSearchResult: function (e) {
    let _self = this;
    let ItemId = _self.data.editAddress.id;
    let newAddress = Object.assign({}, _self.data.editAddress, e.detail);
    newAddress.id = ItemId;
    newAddress.villagelistId = e.detail.id;
    // console.log(newAddress.id,villageId)
    // let res = e.detail.province + ',' + e.detail.city + "," + e.detail.area + ',' + e.detail.name;
    _self.setData({
      editAddress: newAddress
    }, function () {

    })
  },
  /**
   * TODO 收货人信息编辑
   * @param {*} e 
   */
  onUserNameChange(e) {
    let _self = this;
    _self.data.editAddress.username = e.detail.value;
    _self.setData({
      editAddress: _self.data.editAddress
    })
  },
  /**
   * TODO 收货人手机号码编辑
   * @param {*} e 
   */
  onUserPhoneChange(e) {
    let _self = this;
    _self.data.editAddress.userphone = e.detail.value;
    _self.setData({
      editAddress: _self.data.editAddress,
      userphoneStatus: Api._isTel(e.detail.value)
    })
  },
  /**
   * TODO 收货地址是否默认变更
   * @param {*} e 
   */
  onDefChange: function (e) {
    let _self = this;
    // _self.data.editAddress.def = e.detail.value ? 0 : 1;
    _self.data.editAddress.defStatus = e.detail.value ? 0 : 1;
    _self.setData({
      editAddress: _self.data.editAddress
    })
  },
  /**
   * TODO 具体房间号信息变更
   * @param {*} e 
   */
  onAddressInfoChange(e) {
    let _self = this;
    _self.data.editAddress.addressinfo = e.detail.value;
    _self.setData({
      editAddress: _self.data.editAddress
    })
  },
  /**
   * TODO 删除当前收货地址
   * @param {*} e 
   */
  onAddressDel: function (e) {
    let _self = this;
    // let village = e.currentTarget.dataset.
    wx.showModal({
      title: '确认删除此条记录吗？',
      content: '',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if (result.confirm) {
          Api._ajax({
            url: Url.delVillage,
            data: {
              userId: app.globalData.userInfo.userId,
              id: _self.data.editAddress.id
            },
            success: function (res) {
              if (res.success) {
                Api._toast('删除成功');
                _self.getAddress();
                _self.addressOverlay._hide();
              }
            }
          })
        }
      },
      fail: () => {},
      complete: () => {}
    });
  },
  /**
   * TODO 收货地址变更保存
   * @param {*} e 
   */
  onAddressSave: function (e) {
    let _self = this;
    let editInfo = _self.data.editAddress;
    // _self.addressOverlay._hide();
    console.log(_self.data.editAddress)

    if (!editInfo.username) {
      Api._toast('请输入收货人');
      return false
    }
    if (!editInfo.userphone || _self.data.userphoneStatus) {
      Api._toast('请输入正确的手机号');
      return false
    }

    if (!editInfo.communityname) {
      Api._toast('请输入小区名称');
      return false
    }

    if (!editInfo.addressinfo) {
      Api._toast('请输入房间号');
      return false
    }

    Api._ajax({
      url: Url.editVillage,
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: app.globalData.userInfo.userId,
        username: editInfo.username,
        userphone: editInfo.userphone,
        province: editInfo.province,
        city: editInfo.city,
        area: editInfo.area,
        communityname: editInfo.communityname,
        addressinfo: editInfo.addressinfo,
        def: editInfo.defStatus ? editInfo.defStatus : 1,
        villagelistId: editInfo.villagelistId,
        id: editInfo.id,
      },
      success: function (data) {
        // let data = res.data;
        // console.log(data, 1111)
        if (data.success) {
          Api._toast('修改成功');
          _self.getAddress();
          _self.addressOverlay._hide();
        }


      }
    })
  },
  /**
   * TODO 获取用户地址信息
   */
  getAddress(){
    let _self = this;
    Api._ajax({
      url: Url.getVillage,
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: function (res) {
        if (res.success) {
          _self.setData({
            addressArr: res.data.list
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.villageSearch = this.selectComponent("#J_village_Search");
    this.addressOverlay = this.selectComponent("#J_edit_address");
    // this.villageSearch._show();
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