import AV from '../../../../libs/av-weapp-min'
import {leanError} from '../../../common/common'

Page({
  data: {},
  onLoad: function () {
    const that = this
    wx.showToast({
      title: 'loading...',
      icon: 'loading'
    })
    const user = AV.User.current()
    const finishedPost = new AV.Query('Post')
    finishedPost.equalTo('postFinished', true)

    const driver = new AV.Query('Post')
    driver.equalTo('driver', user)

    const query = AV.Query.and(finishedPost, driver)

    query.find()
         .then(function (results) {
           console.log(results)
           const postLog = results.map((postItem) => {
             return {
               id: postItem.id,
               postStartAddress: postItem.get('postStartAddress'),
               postEndAddress: postItem.get('postEndAddress'),
               postStartDateTime: postItem.get('postStartDateTime'),
               postNotes: postItem.get('postNotes'),
               postSeatNumber: postItem.get('postSeatNumber'),
               postLeftNumber: postItem.get('postLeftNumber')
             }
           })
           that.setData({
             postLog: postLog
           })
           wx.hideToast()
         })
         .catch(function () {console.log('test')})
  }
})
