var AutoImage = function (config) {
    let _self = this;
    _self.config = Object.assign({}, AutoImage.config, config);
   

}
AutoImage.config = {
    userName: '幸福de麻子',
    scale:1.6,
    userPhoto: 'http://fullspeed.cn/img/icon2.png',
    shareBg: 'http://fullspeed.cn/img/img2018/case-brand-2018zsyh-zyzl.jpg',
    QRcode: 'https://developers.weixin.qq.com/miniprogram/dev/devtools/image/devtools2/mydev/mydev-qrcode.jpg',
    temp: {

    }
}
AutoImage.prototype = {
    _getFile: function (type, url, callback) {
        let _self = this;
        wx.downloadFile({
            url: url,
            success: (result) => {
                _self.config.temp[type] = result.tempFilePath;
                callback && callback();
            },
            fail: () => {},
            complete: () => {}
        });
    },
    _drawImage: function () {
        let _self = this;
         //绘制canvas图片
         var that = this
         const ctx = wx.createCanvasContext('myCanvas')
         var bgPath = _self.config.temp.shareBg;//背景图片
         var portraitPath = _self.config.temp.userPhoto; //头像
         var hostNickname = _self.config.userName;
 
         var qrPath = _self.config.temp.QRcode ;//小程序码
         var windowWidth = _self.systemInfo.windowWidth;
         var scale = _self.config.scale;

         console.log("systemInfo:",_self.systemInfo)
        //  that.setData({
        //      scale: 1.6
        //  })
         //绘制背景图片
         ctx.drawImage(bgPath, 0, 0, windowWidth, scale * windowWidth)
 
         //绘制头像
         ctx.save()
         ctx.beginPath()
         ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
         ctx.clip()
         ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
         ctx.restore()
         //绘制第一段文本
         ctx.setFillStyle('#000000')
         ctx.setFontSize(0.037 * windowWidth)
         ctx.setTextAlign('center')
         ctx.fillText(hostNickname + ' 正在参加疯狂红包活动', windowWidth / 2, 0.52 * windowWidth)
         //绘制第二段文本
         ctx.setFillStyle('#000000')
         ctx.setFontSize(0.037 * windowWidth)
         ctx.setTextAlign('center')
         ctx.fillText('邀请你一起来领券抢红包啦~', windowWidth / 2, 0.57 * windowWidth)
         //绘制二维码
         ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
         //绘制第三段文本
         ctx.setFillStyle('#000000')
         ctx.setFontSize(0.037 * windowWidth)
         ctx.setTextAlign('center')
         ctx.fillText('长按二维码领红包', windowWidth / 2, 1.36 * windowWidth)
         ctx.draw(true,function (res) {
            console.log('11111')
            console.log('图片绘制结束')

            _self._canvasToImage()

        });
        
    },
    _canvasToImage :function () {
        var that = this
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: that.systemInfo.windowWidth,
            height: that.systemInfo.windowWidth * that.config.scale,
            destWidth: that.systemInfo.windowWidth * 4,
            destHeight: that.systemInfo.windowWidth * 4 * that.config.scale,
            canvasId: 'myCanvas',
            success: function (res) {
                console.log('朋友圈分享图生成成功:' + res.tempFilePath)
                wx.previewImage({
                    current: res.tempFilePath, // 当前显示图片的http链接
                    urls: [res.tempFilePath] // 需要预览的图片http链接列表
                })
            },
            fail: function (err) {
                console.log('失败')
                console.log(err)
            }
        })
    },
    shareImage: function (config) {
        let _self = this;
        config = config ? config : _self.config;

        wx.showLoading({
            title: '',
            mask: true,
            success: (result)=>{
                
            },
            fail: ()=>{},
            complete: ()=>{}
        });
         _self.systemInfo = wx.getSystemInfoSync();

        console.log('开始处理图片')
        //缓存头像
        _self._getFile('userPhoto', config.userPhoto, function () {
            //缓存背景图片
            _self._getFile('shareBg', config.shareBg, function () {
                //缓存小程序二维码
                _self._getFile('QRcode', config.QRcode, function () {
                    // console.log('缓存成功', _self.config.temp)
                    console.log('开始绘制图片')
                    _self._drawImage();
                    wx.hideLoading();
                    // setTimeout(function () {
                    //     that.canvasToImage()
                    // }, 200)


                })
            })
        })
    }

}

module.exports = AutoImage;