import AV from '../../../../libs/av-weapp-min'

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
    finishedApplication.equalTo('applicationFinished', true)

    const passenger = new AV.Query('Application')
    passenger.equalTo('passenger', user)
    const query = AV.Query.and(finishedApplication, passenger)

    query.find().then(function (results) {
      const applicationLog = results.map((applicationItem) => {
        return {
          id: applicationItem.id,
          postStartAddress: applicationItem.get('postStartAddress'),
          postEndAddress: applicationItem.get('postEndAddress'),
          postStartDateTime: applicationItem.get('postStartDateTime'),
          postNotes: applicationItem.get('postNotes'),
          postSeatNumber: applicationItem.get('postSeatNumber'),
          postLeftNumber: applicationItem.get('postLeftNumber')
        }
      })
      console.log(applicationLog)
      that.setData({applicationLog})
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })
  }
})
