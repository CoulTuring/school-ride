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

    const post = new AV.Query('Post')
    post.equalTo('finished', false)
    post.find().then(function (results) {
      const postList = results.map((postItem) => {
        return {
          id: postItem.id,
          postStartAddress: postItem.get('postStartAddress'),
          postEndAddress: postItem.get('postEndAddress'),
          postStartDateTime: postItem.get('postStartDateTime'),
          postNotes: postItem.get('postNotes'),
          postSeatNumber: postItem.get('postSeatNumber'),
          // 车辆信息
          driverLeftNumber: postItem.get('driverLeftNumber'),
          driverCarModel: postItem.get('driverCarModel'),
          driverCarColor: postItem.get('driverCarColor'),
          driverPlateNumber: postItem.get('driverPlateNumber'),
          // 司机信息
          driverName: postItem.get('driverName'),
          driverPhone: postItem.get('driverPhone'),
          driverGender: postItem.get('driverGender'),
          driverUsername: postItem.get('driverUsername'),
          driverSchool: postItem.get('driverSchool'),
        }
      })
      this.setData({
        postList: postList
      })
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })

    const user = AV.User.current()
    const goingPost = new AV.Query('Post')
    goingPost.equalTo('finished', false)

    const creator = new AV.Query('Post')
    creator.equalTo('creator', user)

    const query = AV.Query.and(goingPost, creator)

    query.find().then(function (results) {
      const applicationList = results.map((applicationItem) => {
        return {
          id: applicationItem.id,
          postStartAddress: applicationItem.get('postStartAddress'),
          postEndAddress: applicationItem.get('postEndAddress'),
          postStartDateTime: applicationItem.get('postStartDateTime'),
          postNotes: applicationItem.get('postNotes'),
          postSeatNumber: applicationItem.get('postSeatNumber'),
          // 车辆信息
          driverLeftNumber: applicationItem.get('driverLeftNumber'),
          driverCarModel: applicationItem.get('driverCarModel'),
          driverCarColor: applicationItem.get('driverCarColor'),
          driverPlateNumber: applicationItem.get('driverPlateNumber'),
          // 司机信息
          driverName: applicationItem.get('driverName'),
          driverPhone: applicationItem.get('driverPhone'),
          driverGender: applicationItem.get('driverGender'),
          driverUsername: applicationItem.get('driverUsername'),
          driverSchool: applicationItem.get('driverSchool'),
        }
      })
      this.setData({
        applicationList: applicationList
      })
      wx.hideToast()
    }, (error) => {
      console.log(error)
    })

  },
  applicationDetail: () => {
    wx.navigateTo({url: './pages/applicationDetail/applicationDetail'})
  },
  addApplication: () => {
    wx.navigateTo({url: './pages/editApplication/editApplication'})
  }
})