// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'

Page({
  onLoad: function () {
    // const create = true
    // this.setData({create})
    // if (!create) {
    //   const applicationId = '57328ca079bc44005c2472d0'
    //   const query = new AV.Query('Application')
    //   query.get(applicationId)
    //        .then(function (applicationItem) {
    //          const applicationData = {
    //            applicationStartAddress: applicationItem.get('applicationStartAddress'),
    //            applicationNotes: applicationItem.get('applicationNotes'),
    //          }
    //          this.setData({applicationData})
    //        }, function (error) {
    //          // 异常处理
    //        })
    // }

    const postId = '57328ca079bc44005c2472d0'
    const post = new AV.Query('Post')
    post.get(postId)
        .then(function (postItem) {
          const postData = {
            postStartAddress: postItem.get('postStartAddress'),
            postEndAddress: postItem.get('postEndAddress'),
            postStartDateTime: postItem.get('postStartDateTime'),
            postNotes: postItem.get('postNotes'),
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
            driverSchool: postItem.get('driverSchool')
          }
          this.setData({postData: postData, post: post})
        }, function (error) {
          // 异常处理
        })
  },
  data: {},
  formSubmit: function (e) {
    const form = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    const user = AV.User.current()
    const Application = AV.Object.extend('Application')

    const passengerData = {
      passengerName: user.get('name'),
      passengerPhone: user.get('phone'),
      passengerGender: user.get('gender'),
      passengerUserId: user.get('userId'),
      passengerSchool: user.get('school'),
    }

    let application = new Application()
    application.set(form)  // app信息
    application.set('passenger', passengerData)  // passenger
    application.set('post', this.data.post)
    application.set(this.data.postData)
    application.save()
               .then(function (applicationItem) {
                 console.log('objectId is ' + applicationItem.id)
                 wx.showToast({
                   title: '发布成功',
                   icon: 'success'
                 })
               }, function (error) {
                 console.error(error)
               })

    // const form = e.detail.value
    // const postId = '57328ca079bc44005c2472d0'
    // console.log('form发生了submit事件，携带数据为：', e.detail.value)
    // const user = AV.User.current()
    // const Application = AV.Object.extend('Application')
    // const post = new AV.Query('Post')
    // post.get(postId)
    //     .then(function (postItem) {
    //       const postData = {
    //         postStartAddress: postItem.get('postStartAddress'),
    //         postEndAddress: postItem.get('postEndAddress'),
    //         postStartDateTime: postItem.get('postStartDateTime'),
    //         postNotes: postItem.get('postNotes'),
    //         postSeatNumber: postItem.get('postSeatNumber'),
    //         // 车辆信息
    //         driverCarSeatNumber: postItem.get('driverCarSeatNumber'),
    //         driverCarModel: postItem.get('driverCarModel'),
    //         driverCarColor: postItem.get('driverCarColor'),
    //         driverCarPlateNumber: postItem.get('driverCarPlateNumber'),
    //         // 司机信息
    //         driverName: postItem.get('driverName'),
    //         driverMobilePhoneNumber: postItem.get('driverMobilePhoneNumber'),
    //         driverGender: postItem.get('driverGender'),
    //         driverUserId: postItem.get('driverUserId'),
    //         driverSchool: postItem.get('driverSchool'),
    //       }
    //
    //       const passengerData = {
    //         passengerName: user.get('passengerName'),
    //         passengerPhone: user.get('passengerPhone'),
    //         passengerGender: user.get('passengerGender'),
    //         passengerUserId: user.get('passengerUserId'),
    //         passengerSchool: user.get('passengerSchool'),
    //       }
    //
    //       let application = new Application()
    //       application.set(form)  // app信息
    //       application.set('passenger', passengerData)  // passenger
    //       application.set('post', postItem)
    //       application.set(postData)
    //       application.save()
    //                  .then(function (applicationItem) {
    //                    console.log('objectId is ' + applicationItem.id)
    //                    wx.showToast({
    //                      title: '发布成功',
    //                      icon: 'success'
    //                    })
    //                  }, function (error) {
    //                    console.error(error)
    //                  })
    //     })
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
