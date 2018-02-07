import AV from '../../libs/av-weapp-min'

Page({
  data: {
  },
  onLoad: function () {
    const that = this
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const user = AV.User.current()
    const finishedApplication = new AV.Query('Application')
    finishedApplication.equalTo('finished', false)

    const creator = new AV.Query('Application')
    creator.equalTo('creator', user)

    const query = AV.Query.and(finishedApplication, creator)

    query.find().then(function (results) {
      const applicationLog = results.map((item) => {
        return {
          id: item.id,
          startAddress: item.get('startAddress'),
          endAddress: item.get('endAddress'),
          startDateTime: item.get('startDateTime'),
        }
      })
      console.log(applicationLog)
      that.setData({applicationLog})
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })

  },
  editPost: () => {
    wx.navigateTo({url: './pages/editApplication/editApplication'})
  },
  postDetail: () => {
    wx.navigateTo({url: './pages/applicationDetail/applicationDetail'})
  }
})