import AV from '../../../../libs/av-weapp-min'

Page({

  data: {},
  onLoad: function (options) {
    const that=this
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
          console.log(postData)
          that.setData({postData})

          application.equalTo('post', postItem)
          application.find()
                     .then((results) => {
            console.log(this.data.postData)
            console.log(results)
                       const applications = results.map((applicationItem) => {
                         return {
                           id: applicationItem.id,
                           passengerName: applicationItem.get('passengerName'),
                           passengerPhone: applicationItem.get('passengerPhone'),
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
                       that.setData({applications})
                       wx.hideToast()
                     })
                     .catch((error) => {})
        })
        .catch((error) => {})
  },
  onCancel: () => {
    wx.showModal({
      content: '是否要取消此次行程',
      confirmText: '确定',
      cancelText: '取消'
    })
    const postId = ''
    const post = new AV.Query('Post')
    post.get(postId)
        .then(function (post) {
          post.set('canceled', true)
          post.set('finished', true)
          post.save()
              .then((newPost) => {
                wx.navigateBack({number: 1})
              })
        })
        .catch((error) => {})
  }
})
