const URL = require('./url.js');
var Api = {
  /**
   * todo ajax请求的二次封装
   * @param {*} config 
   * @param {*} ajaxConfig 
   */
  _ajax: function (config, ajaxConfig) {
    let header = {
      'token': 'kkk000',
      'content-type': 'application/x-www-form-urlencoded',
    };
    header = config.header ? { ...header, ...config.header } : header;
    wx.request({
      url: config.url,
      data: config.data,
      header: header,
      method: config.type ? config.type : 'post',
      dataType: 'json',
      responseType: 'text',
      success: (result) => {
        console.log('接口请求成功')
        config.success(result.data)
      },
      fail: () => {
        console.log(config.url + '接口异常')
      },
      complete: () => {
        // console.log(config.url + ' 接口complete')
      }
    });
  },
  /**
   * todo 获取验证码方法
   * @param {*} phone 
   */
  _getCode(phone) {
    const self = this;
    return new Promise((resolve, reject) => {
      self._ajax({
        url: URL.sendPhonemsg,
        data: {
          phone
        },
        success: resolve,
        fail: reject
      });
    });
  },
  /**
   * todo 电话号码正则验证，电话号码错误时返回true！！
   */
  _isTel(phone, isShow) {
    const tel = /^1[3456789]\d{9}$/;
    if (tel.test(phone)) {
      return false;
    };
    if (isShow) {
      this._toast('电话号码错误');
    }
    return true;
  },
  _toast(text) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 3000
    });
  }

};

// export default Api;
module.exports = Api;