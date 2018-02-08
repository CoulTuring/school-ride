import AV from '../../../../libs/av-weapp-min'

Page({
  data: {},
  onLoad: function () {
    const that = this
    const applicationId = ''
    const application = new AV.Query('Application')
    application.get(applicationId)
               .then((applicationItem) => {
                 const applicationDetail = {
                   // 乘客信息
                   passengerName: applicationItem.get('passengerName'),
                   passengerPhone: applicationItem.get('passengerPhone'),
                   passengerGender: applicationItem.get('passengerGender'),
                   passengerUserId: applicationItem.get('passengerUserId'),
                   passengerSchool: applicationItem.get('passengerSchool'),
                   // 预约信息
                   applicationStartAddress: applicationItem.get('applicationStartAddress'),
                   applicationNotes: applicationItem.get('applicationNotes'),
                   applicationCancelDateTime: applicationItem.get('applicationCancelDateTime'),
                   applicationCanceled: applicationItem.get('applicationCanceled'),
                   applicationFinishDateTime: applicationItem.get('applicationFinishDateTime'),
                   applicationFinished: applicationItem.get('applicationFinished'),
                   // 发布信息
                   postStartAddress: applicationItem.get('postStartAddress'),
                   postEndAddress: applicationItem.get('postEndAddress'),
                   postStartDateTime: applicationItem.get('postStartDateTime'),
                   postNotes: applicationItem.get('postNotes'),
                   postSeatNumber: applicationItem.get('postSeatNumber'),
                   postLeftNumber: applicationItem.get('postLeftNumber'),
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
                 that.setData({applicationDetail})
               })
    // add load this post's applicationList
  },
  onCancel: () => {
    wx.showModal({
      content: '是否要取消此次行程',
      confirmText: '确定',
      cancelText: '取消'
    })
    const postId = ''
    const application = new AV.Query('Application')
    application.get(postId)
               .then(function (ApplicationItem) {
                 ApplicationItem.set('canceled', true)
                 ApplicationItem.save()
                                .then((newApplication) => {
                                  wx.navigateBack({number: 1})
                                })
               })
               .catch((error) => {})

  }
})
