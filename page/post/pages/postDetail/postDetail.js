import AV from '../../../../libs/av-weapp-min'

Page({

  data: {},
  onLoad: function (options) {
    const that = this
    this.setData({postId: options.postId})
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const post = new AV.Query('Post')
    const application = new AV.Query('Application')
    post.get(options.postId)
        .then(function (postItem) {
          let postData = {
            // 发布信息
            postStartAddress: postItem.get('postStartAddress'),
            postEndAddress: postItem.get('postEndAddress'),
            postStartDateTime: postItem.get('postStartDateTime'),
            postNotes: postItem.get('postNotes'),
            postSeatNumber: postItem.get('postSeatNumber'),
            postLeftNumber: postItem.get('postLeftNumber'),
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
          that.setData({postData})

          application.equalTo('post', postItem)
          application.find()
                     .then((results) => {
                       console.log(results)
                       const applicationList = results.map((applicationItem) => {
                         return {
                           id: applicationItem.id,
                           passengerName: applicationItem.get('passengerName'),
                           passengerMobilePhoneNumber: applicationItem.get('passengerMobilePhoneNumber'),
                           passengerGender: applicationItem.get('passengerGender'),
                           passengerUserId: applicationItem.get('passengerUserId'),
                           passengerSchool: applicationItem.get('passengerSchool'),

                           applicationStartAddress: applicationItem.get('applicationStartAddress'),
                           applicationNotes: applicationItem.get('applicationNotes'),
                           applicationCancelDateTime: applicationItem.get('applicationCancelDateTime'),
                           applicationCanceled: applicationItem.get('applicationCanceled'),
                           applicationFinishDateTime: applicationItem.get('applicationFinishDateTime'),
                           applicationFinished: applicationItem.get('applicationFinished'),
                         }
                       })
                       console.log(applicationList)
                       that.setData({applicationList})
                       wx.hideToast()
                     })
                     .catch((error) => {})
        })
        .catch((error) => {})
  },
  onCancel: function () {
    const postId = this.data.postId
    wx.showModal({
      content: '是否要取消此次行程',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          const post = new AV.Query('Post')
          post.get(postId)
              .then(function (post) {
                post.set('postCanceled', true)
                post.set('postFinished', true)
                post.save()
                    .then((newPost) => {
                      wx.navigateBack({number: 1})
                    })
              })
              .catch((error) => {console.log(error)})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  onEdit: function () {
    const postId = this.data.postId
    wx.navigateTo({url: `../editPost/editPost?postId=${postId}`})
  }
})
