import AV from '../../libs/av-weapp-min'

Page({
  data: {
    list: [
      {
        id: 'form',
        name: '预约记录',
        url: 'applicationLog/applicationLog'
      }, {
        id: 'page',
        name: '发布记录',
        url: 'postLog/postLog'
      }, {
        id: 'view',
        name: '个人信息',
        url: 'userInfo/userInfo'
      }
    ]
  },
  onLoad: function () {
    AV.User.loginWithWeapp()
      .then(function (user) {
        // 调用小程序 API，得到用户信息
        wx.getUserInfo({
          success: function ({userInfo}) {
            // 更新当前用户的信息
            console.log(userInfo)
            user.set(userInfo).save().then(function (user) {
              // 成功，此时可在控制台中看到更新后的用户信息
              // this.globalData.user = user.toJSON()
            }).catch(console.error)
          }
        })
      })
      .catch(console.error)
  },

  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        if (list[i].url) {
          wx.navigateTo({
            url: 'pages/' + list[i].url
          })
          return
        }
      }
    }
    this.setData({
      list: list
    })
  }
})
