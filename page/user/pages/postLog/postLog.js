import AV from '../../../../libs/av-weapp-min'

Page({
  data: {},
  onLoad: () => {
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const user = AV.User.current()
    const finishedPost = new AV.Query('Post')
    finishedPost.equalTo('finished', true)

    const creator = new AV.Query('Post')
    creator.equalTo('creator', user)

    const query = AV.Query.and(finishedPost, creator)

    query.find().then(function (results) {
      const postLog = results.map((postItem) => {
        return {
          id: postItem.id,
          postStartAddress: postItem.get('postStartAddress'),
          postEndAddress: postItem.get('postEndAddress'),
          postStartDateTime: postItem.get('postStartDateTime'),
          postNotes: postItem.get('postNotes'),
          postSeatNumber: postItem.get('postSeatNumber'),
        }
      })
      this.setData({
        postLog: postLog
      })
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })
  }
})
