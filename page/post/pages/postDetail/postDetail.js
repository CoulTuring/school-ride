import AV from '../../../../libs/av-weapp-min'

Page({

  data: {
    formData: {}
  },
  onLoad: () => {
    const postId = ''
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const post = new AV.Query('Post')
    post.get(postId)
        .then(function (postItem) {

          let postData = {
            // 发布信息
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
          this.setData({postData})
          const application = new AV.Query('Application')
          application.equalTo('post', postItem)
          application.find()
                     .then((results) => {
                       const applications = results.map((applicationItem) => {
                         return {
                           id:applicationItem.id,
                           passengerName: applicationItem.get('passengerName'),
                           passengerPhone: applicationItem.get('passengerPhone'),
                           passengerGender: applicationItem.get('passengerGender'),
                           passengerUsername: applicationItem.get('passengerUsername'),
                           passengerSchool: applicationItem.get('passengerSchool'),

                           applicationStartAddress: applicationItem.get('applicationStartAddress'),
                           applicationNotes: applicationItem.get('applicationNotes'),
                           applicationCancelDateTime: applicationItem.get('applicationCancelDateTime'),
                           applicationCanceled: applicationItem.get('applicationCanceled'),
                           applicationFinishDateTime: applicationItem.get('applicationFinishDateTime'),
                           applicationFinished: applicationItem.get('applicationFinished'),
                         }
                       })
                       this.setData({applications})
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
