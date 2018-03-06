import AV from '../../libs/av-weapp-min'

const app = getApp()
Page({
  onShow: function () {
    // console.log(app.globalData.getUserInfoSuccess)
    // if (app.globalData.getUserInfoSuccess === true) {
    //   wx.switchTab({url: '/page/application/index'})
    // }
  },
  openSetting: function () {
    if (wx.openSetting) {
      wx.openSetting({
        success: function (res) {
          console.log('tes')
          wx.getUserInfo({
            success: ({userInfo}) => {
              app.globalData.getUserInfoSuccess = true
              console.log('t')
              console.log(app.globalData.getUserInfoSuccess)
              wx.switchTab({url: '/page/application/index'})

            },
            fail: function (res) {
              app.globalData.getUserInfoSuccess = false
            }
          })
        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能使用哦~ 错过授权页面的处理方法：删除小程序->重新搜索进入->点击授权按钮'
      })
    }
  }

})