import AV from '../../libs/av-weapp-min'

Page({
  data: {},
  onLoad: function () {
    const that = this
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    console.log('test')
    const user = AV.User.current()
    const finishedApplication = new AV.Query('Post')
    finishedApplication.notEqualTo('postFinished', true)

    const creator = new AV.Query('Post')
    creator.equalTo('creator', user)
    const query = AV.Query.and(finishedApplication, creator)

    query.find().then(function (results) {
      const postList = results.map((postItem) => {
        return {
          id: postItem.id,
          postStartAddress: postItem.get('postStartAddress'),
          postEndAddress: postItem.get('postEndAddress'),
          postStartDateTime: postItem.get('postStartDateTime'),
        }
      })
      console.log(postList)
      that.setData({postList})
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })

  },
  editPost: () => {
    wx.navigateTo({url: './pages/editPost/editPost'})
  },
  postDetail: (event) => {
    const postId = event.target.id
    wx.navigateTo({url: `./pages/postDetail/postDetail?postId=${postId}`})
  }
})