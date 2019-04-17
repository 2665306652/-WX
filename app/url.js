//let local = 'http://192.168.3.213:8080';//清炎
let local = 'http://2kf1951144.51mypc.cn:14432';//吕凯
// let local = 'http://192.168.1.102:8080';//吕凯mac

module.exports = {
  getOpenid: local + '/user/login',//获取用户openid
  navList: '../data/nav.js',
  itemList: local + '/commodity/indexlist',//首页商品数据接口
  orderList: local + '/order/purchaselist',//购买订单
  orderDetail:  local + '/order/purchasedetail',//购买订单详情
  buyerConfirmreceipt:   local + '/order/buyerConfirmreceipt',//买家确认收货
  details: local + '/commodity/commodityinfo', //详情页
  orderBuy : local + '/order/buy',//商品下单
  user: '../data/user.js',
  preview: '../data/preview.js',
  salesOrder: local + '/order/salelist',//销售订单列表
  regulate: local + '/commodity/list', // 商品管理
  banner : '../data/banner.js',
  saveAddress: local + '/address/saveaddress', // 保存地址
  saveSellerinfo: local + '/user/savesellerinfo', // 成为卖家
  uploadImage: local + '/file/upload', // 上传图片
  sendPhonemsg: local + '/sms/sendphonemsg', // 发送短信验证码
  villageSearch : local + '/address/likename',//关联小区搜索
  getVillage : local + '/address/getaddressinfo',//获取用户地址信息
  editVillage : local + '/address/saveaddress',//修改收货地址
  delVillage : local + '/address/deladdress',//删除收货地址
  editUser : local + '/user/savepersonal',//买家信息修改
  uploadCargo: local + '/commodity/upload',//卖家上传商品
  bulletBoxSaveAddress: local + '/address/bulletBoxSaveAddress',//用户第一次进入弹框接口
  orderDelivery: local + '/order/delivery',//配送
  orderConfirmreceipt: local + '/order/confirmreceipt',//确认收货
  commodityStop: local + '/commodity/stop',//停售
  commodityUpdate: local + '/commodity/update',//修改商品属性
  commoditySubmit: local + '/commodity/submit',//重新上架审核
}