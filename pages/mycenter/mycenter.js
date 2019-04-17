const app = getApp();
let Authorize = require('../../app/authorize');

Page({
  data: {
    userInfo: app.globalData.userInfo,
    mycenterPhone: "151****2867"
  },
  onLoad: function (param) {
    let _self = this;
    Authorize('/pages/index/index', function (e, v) {
      console.log(app.globalData)
      _self.setData({
        userInfo: app.globalData.userInfo
      })
    })

  }
  // onLoad() {
  //   const user = wx.getStorageSync('user');
  //   const self = this;
  //   console.log(app.globalData.userInfo,user,1111);
  //   wx.request({
  //     url: app.url.userQuery,
  //     data: {
  //       openId: user.openid
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'get',
  //     dataType: 'json',
  //     responseType: 'text',
  //     success: res => {

  //       console.log(res,2222)
  //       if (res.data.success) {
  //         if (res.data.code != -1) {
  //           self.setData({
  //             mycenterPhone: res.data.data.phone
  //           })
  //         }
  //       }
  //     }
  //   });
  //   this.setData({
  //     userInfo: app.globalData.userInfo
  //   })
  // },

  // mycenterMe() {
  //   /* if (this.data.mycenterPhone !== '绑定手机号') {
  //     return false;
  //   }; */
  //   let { mycenterPhone } = this.data;
  //   wx.navigateTo({
  //     url: `../login/login?phone=${mycenterPhone}`
  //   });
  // }
})