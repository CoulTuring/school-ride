import AV from '../../libs/av-weapp-min'

Page({
  data: {},
  onLoad: function () {
    const that = this
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
          postLeftNumber: postItem.get('postLeftNumber'),
          postSeatNumber: postItem.get('postSeatNumber'),
          // 车辆信息
          driverCarSeatNumber: postItem.get('driverCarSeatNumber'),
          driverCarModel: postItem.get('driverCarModel'),
          driverCarColor: postItem.get('driverCarColor'),
          driverCarPlateNumber: postItem.get('driverCarPlateNumber'),
          // 司机信息
          driverName: postItem.get('driverName'),
          driverMobilePhoneNumber: postItem.get('driverMobilePhoneNumber'),
          driverGender: postItem.get('driverGender'),
          driverUserId: postItem.get('driverUserId'),
          driverSchool: postItem.get('driverSchool'),
        }
      })
      that.setData({postList})
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
          driverCarSeatNumber: applicationItem.get('driverCarSeatNumber'),
          driverCarModel: applicationItem.get('driverCarModel'),
          driverCarColor: applicationItem.get('driverCarColor'),
          driverCarPlateNumber: applicationItem.get('driverCarPlateNumber'),
          // 司机信息
          driverName: applicationItem.get('driverName'),
          driverMobilePhoneNumber: applicationItem.get('driverMobilePhoneNumber'),
          driverGender: applicationItem.get('driverGender'),
          driverUserId: applicationItem.get('driverUserId'),
          driverSchool: applicationItem.get('driverSchool'),
        }
      })
      that.setData({applicationList})
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