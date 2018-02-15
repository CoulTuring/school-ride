import AV from '../../../../libs/av-weapp-min'
import { leanError } from '../../../common/common'

Page({

  data: {},
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

    query.find()
         .then(function (results) {
           const applicationLog = results.map((applicationItem) => {
             return {
               id: applicationItem.id,
               postStartAddress: applicationItem.get('postStartAddress'),
               postEndAddress: applicationItem.get('postEndAddress'),
               postStartDateTime: applicationItem.get('postStartDateTime'),
               applicationNotes: applicationItem.get('applicationNotes'),
               postSeatNumber: applicationItem.get('postSeatNumber'),
               postLeftNumber: applicationItem.get('postLeftNumber')
             }
           })
           console.log(applicationLog)
           that.setData({applicationLog})
           wx.hideToast()
         })
         .catch(function () {console.log('test')})
  }
})
