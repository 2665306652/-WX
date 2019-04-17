const app = getApp();
/**
 * todo 用户权限信息的中间件 用于判断用户权限
 * @param {*} resolve 来源页面
 * @param {*} callback 用户权限验证通过之后的回调
 */
let Authorize = function (resolve,callback) {
    wx.showLoading({
        title: '正在加载...',
        mask: true,
        success: (result)=>{
            
        },
        fail: ()=>{},
        complete: ()=>{}
    });

    app.getSetting().then((e, v) => {
        wx.hideLoading();
        if (e.status) {
          if (e.data.freeze) {
            wx.redirectTo({
              url: '/pages/freeze/freeze'
            });
            return;
          }
          callback && callback(e, v)
            if(e.data.names){
               
            }else{
                // wx.redirectTo({
                //     url: '/pages/information/information?resolve='+resolve,
                //     success: (result)=>{
                        
                //     },
                //     fail: ()=>{},
                //     complete: ()=>{}
                // });
            }


           
        }else{
            wx.redirectTo({
                url: '/pages/authorize/authorize?resolve='+resolve,
                success: (result)=>{
                    
                },
                fail: ()=>{},
                complete: ()=>{}
            });
        }


        //_self.selectComponent('#J_tab_nav').getData();
    })

};


module.exports = Authorize;