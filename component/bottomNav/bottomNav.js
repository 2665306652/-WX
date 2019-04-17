// component/bottomNav/bottomNav.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    checkedIndex: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: null     // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    wantSell: '',
    skipCenter: '',
    isIphoneX: false
  },

  created() {
    let self = this;
    const res = wx.getSystemInfoSync();
    let match = /iPhone\sX/g;
    console.log(res.model);
    if (match.test(res.model)) {
      self.setData({
        isIphoneX: true
      })
    }
  },
 /*  show() {
    let self = this;
    wx.getSystemInfo({
      success(res) {
        let match = /iPhone\sX/g
        console.log(res.model)
        //console.log(match.test(res.model));
        if (match.test(res.model)) {
          console.log(666666666666, 'dage')
          self.setData({
            isIphoneX: true
          })
        }
      }
    })
  }, */

  ready() {
    console.log('....');
    const self = this;
    self.loop.call(self, self.getOpenid);
  },

  /**
   * 组件的方法列表
   */
  methods: {
  /**
   * todo 跳转
   */
    wantSell() {
      let self = this;
      wx.navigateTo({
        url: self.data.wantSell
      })
    },
    /**
     * todo 隐藏地区查询
     * @param {*} cb 需要轮询的函数
     */
    loop(cb) {
      const self = this;
      let i = 200;
      let timer = setInterval(() => {
        i--;
        cb && cb.call(self, timer);
        if (!i) {
          clearInterval(timer);
          console.log('stop loop');
        }
      },50);
    },
    /**
     * todo 轮询获取openid
     * @param {*} timer 停止的轮询的定时器
     */
    
     
     getOpenid(timer) {
      const self = this;
      const openid = app.globalData.userInfoToo;
      if (openid) {
        
        clearInterval(timer);
        console.log('stop loop too');
        if (!openid.phone) {
          self.setData({
            wantSell: `../../pages/information/information?type=noInformation`,
            skipCenter: '../../pages/information/information'
          });
          return;
        }
        let index = openid.approvalstatus - 1;
        const url = ['uploadidcard', 'msgsuccess', 'msgsuccess', 'uploadcargo'];
        let parameter = index == 1 ? '?type=SHZ' : index == 2 ? '?type=WTG' : '';
        self.setData({
          wantSell: `../../pages/${url[index]}/${url[index]}${parameter}`,
          skipCenter: '../../pages/mycenter/mycenter'
        });
      }
    },
    /**
     * todo 跳转
     */
    onSkipCenter() {
      let self = this;
      wx.navigateTo({
        url: self.data.skipCenter
      })
    }
  }
})
