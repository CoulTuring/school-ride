import AV from '../../../../libs/av-weapp-min'
import {leanError} from '../../../common/common'

Page({
  data: {},
  onPullDownRefresh: function () {
    this.loadApplicationDetail()
        .then(() => {
          wx.stopPullDownRefresh()
        })
  },
  onShow: function () {
    this.loadApplicationDetail()
    // add load this post's applicationList
  },
  loadApplicationDetail: function () {
    const app = getApp()
    const that = this
    const applicationId = app.applicationId
    this.setData({applicationId})
    const application = new AV.Query('Application')
    return application.get(applicationId)
                      .then((applicationItem) => {
                        const applicationData = {
                          // 乘客信息
                          passengerName: applicationItem.get('passengerName'),
                          passengerMobilePhoneNumber: applicationItem.get('passengerMobilePhoneNumber'),
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
                        return that.setData({applicationData})
                      })
                      .catch(function () {leanError()})
  },
  onCancel: function () {
    const applicationId = this.data.applicationId
    wx.showModal({
      content: '是否要取消此次行程',
      confirmText: '确定',
      cancelText: '取消',
      success: function (res) {
        if (res.confirm) {
          const application = new AV.Query('Application')
          application.get(applicationId)
                     .then(function (applicationItem) {
                       applicationItem.set('applicationCanceled', true)
                       applicationItem.set('applicationFinished', true)
                       applicationItem.save()
                                      .then((newApplication) => {
                                        console.log(newApplication)
                                        wx.navigateBack({number: 1})
                                      })
                                      .catch(function () {leanError()})
                     })
                     .catch(function () {leanError()})
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  onEdit: function () {
    const applicationId = this.data.applicationId
    wx.navigateTo({url: `../editApplication/editApplication?applicationId=${applicationId}`})
  },
})
