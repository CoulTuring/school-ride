import AV from '../../../../libs/av-weapp-min'

Page({

  data: {
  },
  onLoad: () => {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const user = AV.User.current()
    const finishedApplication = new AV.Query('Application')
    finishedApplication.equalTo('finished', true)

    const creator = new AV.Query('Application')
    creator.equalTo('creator', user)

    const query = AV.Query.and(finishedApplication, creator)

    query.find().then(function (results) {
      const applicationLog = results.map((applicationItem) => {
        return {
          id: applicationItem.id,
          postStartAddress: applicationItem.get('postStartAddress'),
          postEndAddress: applicationItem.get('postEndAddress'),
          postStartDateTime: applicationItem.get('postStartDateTime'),
          postNotes: applicationItem.get('postNotes'),
          postSeatNumber: applicationItem.get('postSeatNumber'),
        }
      })
      this.setData({
        applicationLog: applicationLog
      })
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })
  }
})
