//获取应用实例
const app = getApp()

let Api = require('../../app/api');
let Url = require('../../app/url');
let AutoImage = require('../../app/autoImage');
let Authorize = require('../../app/authorize');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: {},
    sellerShow: false, //卖家详情展示
    animation: '',
    orderShow: false,
    orderAnimation: '',
    buyNum: 1,
    delStatus: false,
    addStatus: false,
    buyerVillage: {} //买家收货地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _self = this;
    Authorize('/pages/index/index', function (e, v) {
      Api._ajax({
        url: Url.details,
        data: {
          id: options.id
        },
        success: function (res) {
          _self.setData({
            list: res.data,
            id: options.id
          }, () => {
            _self.getAddress();
          })
        }
      })
    })
  },
  /**
   * todo 卖家信息面板显示
   */
  onSellerShow: function () {
    this.detailsSellerOverlay._show()
  },
  /**
   * todo 卖家信息面板隐藏
   */
  onSellerHide: function () {
    let _self = this;
    this.detailsSellerOverlay._hide()
  },
  /**
   * todo 下单列表展示
   * @param {*} param 
   */
  onOrderShow: function (param) {
    let _self = this;

    if(!app.globalData.userInfo.names){
     wx.showModal({
       title: '完善信息',
       content: '请进行信息填充',
       showCancel: true,
       cancelText: '取消',
       cancelColor: '#000000',
       confirmText: '补充信息',
       confirmColor: '#3CC51F',
       success: (result) => {
         if(result.confirm){
           wx.navigateTo({
            url : '/pages/information/information?resolve='+encodeURIComponent('/pages/details/details?id='+_self.data.id),
           })
         }
       },
       fail: ()=>{},
       complete: ()=>{}
     });

      return false;
    }




    if (_self.data.list.stock == 0) {
      Api._toast('该商品已售罄');
    } else {
      this.detailsOrderOverlay._show();
    }
  },
  /**
   * todo 下单列表=> 商品数量增减
   * @param {*} e 
   */
  onItemNumChange: function (e) {
    let _self = this;
    let type = e.target.dataset.type;

    if (type == 'add' && _self.data.buyNum < _self.data.list.balance) {
      _self.setData({
        buyNum: _self.data.buyNum + 1
      }, () => {})
    }

    if (type == 'del' && _self.data.buyNum > 1) {
      _self.setData({
        buyNum: _self.data.buyNum - 1
      }, () => {})
    }
  },
  /**
   * todo  下单列表=> 商品数量手动输入
   * @param {*} e 
   */
  buyInput: function (e) {
    let _self = this;
    let value = e.detail.value;
    if (value == 0) {
      this.setData({
        buyNum: 1
      })
      return false;
    } else if (value > _self.data.list.balance) {
      this.setData({
        buyNum: _self.data.list.balance
      })
    } else {
      this.setData({
        buyNum: value
      })
    }

  },
  /**
   * todo 下单列表 => 确认下单
   * @param {*} param 
   */
  onOrderSure: function (param) {
    let _self = this;
    let sellerObj = _self.data.list.sellerinfo;
    let sellerAddressText = sellerObj.names + ',' + sellerObj.province + sellerObj.city + sellerObj.area + sellerObj.communityname + sellerObj.addressinfo;

    // console.log({userId : app.globalData.userInfo.userId,//用户id
    //   commodityId : _self.data.id,//商品id
    //   businessid : _self.data.list.userId,//卖家id
    //   productname : _self.data.list.productname, //商品名称
    //   productmap : _self.data.list.productmap,//商品图片
    //   unitprice : _self.data.list.unitprice,//商品价格
    //   addressinfo : _self.data.buyerVillage.addressText,//买家收货地址
    //   totalprice : _self.data.list.unitprice * _self.data.buyNum,//订单总价
    //   quantity : _self.data.buyNum,//商品数量
    //   shippingAddress:sellerAddressText})
    //     return false;


    Api._ajax({
      url: Url.orderBuy,
      header: {
        'content-type': 'application/json'
      },
      data: {
        userId: app.globalData.userInfo.userId, //用户id
        commodityId: _self.data.id, //商品id
        businessid: _self.data.list.userId, //卖家id
        productname: _self.data.list.productname, //商品名称
        productmap: _self.data.list.productmap, //商品图片
        unitprice: _self.data.list.unitprice, //商品价格
        addressinfo: _self.data.buyerVillage.addressText, //买家收货地址
        totalprice: _self.data.list.unitprice * _self.data.buyNum, //订单总价
        quantity: _self.data.buyNum, //商品数量
        shippingAddress: sellerAddressText //发货地址
      },
      success: function (res) {
        if (res.success) {
          wx.navigateTo({
            url: '../../pages/orderDetails/orderDetails?id=' + res.data,
            success: (result) => {

            },
            fail: () => {},
            complete: () => {}
          });

        } else {
          Api._toast(res.message);
        }

      }
    })
  },
  /**
   * todo 商品分享
   * @param {*} param 
   */
  onTransmit: function (param) {
    let _self = this;
    let transmitImage = new AutoImage();
    transmitImage.shareImage();
  },
  /**
   * todo 获取买家地址信息
   */
  getAddress() {
    let _self = this;
    Api._ajax({
      url: Url.getVillage,
      data: {
        userId: app.globalData.userInfo.userId
      },
      success: function (res) {
        var data = res.data.list;
        var buyerVillage = {};
        data.forEach((item, i) => {
          if (item.villagelistId == _self.data.list.villagelistId) {
            buyerVillage = item;
            buyerVillage.addressText = item.username + ',' + item.userphone + ',' + item.province + item.city + item.area + item.communityname + item.addressinfo;
          }
        })
        _self.setData({
          buyerVillage: buyerVillage
        })

      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.detailsOrderOverlay = this.selectComponent("#J_details_order");
    this.detailsSellerOverlay = this.selectComponent("#J_details_seller");
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