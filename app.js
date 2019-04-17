//app.js
let Api = require('./app/api')
let Url = require('./app/url');
App({
  onLaunch: function () {
    // 展示本地存储能力
    let _self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);

    var curPages = getCurrentPages();

    console.log(curPages, '3333')


    // var resolve = '/pages/index/index';
    // _self.getSetting().then((e, v) => {
    //   console.log(e, v, '22')

    //   if (e.status) {
    //     //callback && callback(e, v)
    //   } else {
    //     wx.redirectTo({
    //       url: '/pages/authorize/authorize?resolve=' + resolve,
    //       success: (result) => {

    //       },
    //       fail: () => {},
    //       complete: () => {}
    //     });
    //   }


    //   //_self.selectComponent('#J_tab_nav').getData();
    // })





  },
  getSetting: function () {
    let _self = this;
    // console.log('app:',_self)
    return new Promise(function (resolve, reject) {

      if (_self.globalData.userInfo) {
        resolve({
          status: true,
          data: _self.globalData.userInfo
        })

      } else {
        // 获取用户信息
        wx.getSetting({
          success: res => {
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
              wx.getUserInfo({
                success: res => {
                  // console.log('getUserInfo',res)

                  _self.globalData.userInfo = res.userInfo


                  _self.getOpenId(res.userInfo).then((e, v) => {
                    if (_self.userInfoReadyCallback) {
                      _self.userInfoReadyCallback(res)
                    }
                    resolve({
                      status: true,
                      data: e
                    })
                  })
                  // // console.log(res, 123);
                  // // 可以将 res 发送给后台解码出 unionId

                  // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                  // 所以此处加入 callback 以防止这种情况
                 

                }
              })
            } else {
              resolve({
                status: false,
                data: null
              })
            }
          }
        })
      }




    })
  },
  getOpenId: function (userInfo) {
    let _self = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: ref => {
          // console.log('login:', userInfo);
          // Api._ajax({

          // })
          Api._ajax({
            url: Url.getOpenid,
            data: {
              // appid: _self.globalData.appid,
              // secret: _self.globalData.secret,
              code: ref.code,
              nickname : userInfo.nickName,
              avatar : userInfo.avatarUrl
              // grant_type: 'authorization_code'
            },
            // method: 'GET',
            success: function (res) {
              console.log("openid:", res.data);
              if (res.code == '1015' && res.message == '用户已被冻结') {
                resolve({
                  freeze: true
                });
              }
              var obj = {};
              // obj.openid = res.data.data;
              // _self.globalData.userInfo = Object.assign({},_self.globalData.userInfo,res.data.data)
              _self.globalData.userInfo = res.data;
              _self.globalData.userInfoToo = res.data;//这条数据是后面用轮询
              wx.setStorageSync('user', _self.globalData.userInfo); //存储openid  
              resolve(_self.globalData.userInfo);
            }
          })
        }
      })



    })
  },
  globalData: {
    userInfo: null,
    userInfoToo: null,
    appid: 'wx7263083840ec9215', //appid需自己提供，此处的appid我随机编写
    secret: '1569c5fdb8985b881ab9cc7c4e76ef1a', //secret需自己提供，此处的secret我随机编写
  }
})