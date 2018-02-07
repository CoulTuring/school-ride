import AV from '../../libs/av-weapp-min'

Page({
  data: {
    application: []
  },
  onLoad: () => {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const user = AV.User.current()
    const finishedApplication = new AV.Query('Application')
    finishedApplication.equalTo('finished', false)

    const post = new AV.Query('post')
    post.equalTo('finished', false)
    post.find().then(function (results) {
      const postList = results.map((item) => {
        return {
          id: item.id,
          startAddress: item.get('startAddress'),
          endAddress: item.get('endAddress'),
          startDateTime: item.get('startDateTime'),
        }
      })
      this.setData({
        postList: postList
      })
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })
  },
  applicatioDetail: () => {
    wx.navigateTo({url: './pages/applicationDetail/applicationDetail'})
  },
  addApplication: () => {
    wx.navigateTo({url: './pages/addApplication/addApplication'})
  }
})