const app = getApp()

let Api = require('../../app/api');
let Url = require('../../app/url');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource: [],
    animation : null,
    currentIndex : null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPreview();
  },
  /**
   * todo 获取订单明细
   */
  getPreview: function(){
    let self = this;
    Api._ajax({
      url: Url.preview,
      data: {
        id: options.id
      },
      success: function (res) {
        self.setData({
          dataSource: res
        }, () => {
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * todo 点击展开收起
   */
  itemToggle: function (e) {
    var _self = this;
    var status = e.currentTarget.dataset.status;
    var index = e.currentTarget.dataset.index;

    _self.setData({
      currentIndex : index
    },()=>{
      if(!status){
        Animation.height(0).step();
        _self.setData({
          animation : Animation.export()
        },()=>{
          _self.data.dataSource[index]['hidden'] = true;
          _self.setData({
            dataSource : _self.data.dataSource
          })
        })
      }else{
        Animation.height('auto').step();
        _self.data.dataSource[index]['hidden'] = false
          
        _self.setData({
          dataSource : _self.data.dataSource
        },()=>{
          _self.setData({
            animation : Animation.export()
          })
          
        })
      }
    })

    let Animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'ease',
      delay: 100,
      transformOrigin: 'left bottom 0',
      success: function (res) {}
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