const openIdUrl = require('./config').openIdUrl
const AV = require('./libs/av-weapp-min.js')

AV.init({
  appId: '',
  appKey: '',
})

App({
  onLaunch: function () {

    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

  },
  getUserInfo: function (getUserInfoSuccess) {


  },
  globalData: {
    user: null,
    userInfo: null,
    hasLogin: false,
    applicationId: '',
    getUserInfoSuccess: false,
    postId: ''
  }
})
