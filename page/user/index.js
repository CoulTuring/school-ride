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
