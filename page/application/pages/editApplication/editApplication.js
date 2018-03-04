// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'
import { validate, validateRequired } from '../../../../utils/validate'
import { leanError } from '../../../common/common'

Page({
  data: {
    submitting: false
  },
  onLoad: function (options) {

    const user = AV.User.current()
    const postId = options.postId || null
    const applicationId = options.applicationId || null
    this.setData({applicationId: applicationId, postId: postId})
    const that = this
    const post = new AV.Query('Post')
    const application = new AV.Query('Application')

    let applicationData = {
      applicationNotes: null,
      applicationStartAddress: null
    }

    if (applicationId) {
      // 修改预约信息
      application.get(applicationId)
                 .then(function (applicationItem) {
                   const postData = {
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
                     driver: applicationItem.get('driver')
                   }
                   applicationData = {
                     applicationNotes: applicationItem.get('applicationNotes'),
                     applicationStartAddress: applicationItem.get('applicationStartAddress')
                   }
                   console.log(applicationData)
                   that.setData({
                     postData: postData,
                     applicationData: applicationData
                   })
                 })
                 .catch(function () {leanError()})
    }
    else {

      post.get(postId)
          .then(function (postItem) {

            const passenger = new AV.Query('Application')
            passenger.equalTo('passenger', user)

            const applicationNotFinished = new AV.Query('Application')
            applicationNotFinished.notEqualTo('applicationFinished', true)

            const thisPost = new AV.Query('Application')
            thisPost.equalTo('post', postItem)

            const existApplication = AV.Query.and(thisPost, applicationNotFinished, passenger)
            existApplication.find()
                            .then(function (results) {
                              const postData = {
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
                                driver: postItem.get('driver')
                              }

                              if (results.length > 0) {
                                that.setData({
                                  postData: postData,
                                  post: postItem,
                                  applicationData: applicationData,
                                  submitting: true
                                })
                                wx.showToast({icon: 'none', title: '您已预约过该行程', duration: 2000})
                              }
                              else {
                                that.setData({
                                  postData: postData,
                                  post: postItem,
                                  applicationData: applicationData
                                })
                              }
                            })
                            .catch(function () {leanError()})
          })
          .catch(function () {leanError()})

    }
  },
  validate (e) {
    this.setData({
      [e.currentTarget.dataset.name]: e.detail.value
    })
    validate(e, this)
  },

  formSubmit: function (e) {
    const that = this
    that.setData({submitting: true})
    const postData = this.data.postData
    const post = this.data.post
    const applicationData = this.data.applicationData
    // validateRequired(['applicationStartAddress'], this)
    // if ('' === this.data.form.$invalidMsg) {
    //   console.log('invalid')
    // } else {
    //   console.log('valid')
    // }
    const form = {
      applicationStartAddress: e.detail.value.applicationStartAddress || applicationData.applicationStartAddress,
      applicationNotes: e.detail.value.applicationNotes || applicationData.applicationNotes
    }

    if (form.applicationStartAddress) {
      this.setData({
        tip: '提示：上车位置不可以为空！'
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting: false
        })
      }, 2000)
    }

    if (this.data.applicationId) {
      let application = AV.Object.createWithoutData('Application', this.data.applicationId)
      application.set(form)
                 .save()
                 .then(function (newApplication) {
                   wx.showToast({
                     title: '修改成功'
                   })
                   setTimeout(function () {
                     that.setData({submitting: false})
                     wx.navigateBack({number: 1})
                   }, 1500)
                 })
                 .catch(function () {leanError()})

    }
    else {
      console.log('form发生了submit事件，携带数据为：', e.detail.value)
      const user = AV.User.current()
      const Application = AV.Object.extend('Application')
      let application = new Application()
      const acl = new AV.ACL()
      const roleQuery = new AV.Query(AV.Role)
      roleQuery.equalTo('name', 'ApplicationAdmin')
      roleQuery.first()
               .then(function (role) {
                 acl.setPublicReadAccess(true)
                 acl.setPublicWriteAccess(false)
                 acl.setWriteAccess(user, true)
                 acl.setRoleWriteAccess(role, true)
                 const passengerData = {
                   passengerName: user.get('name'),
                   passengerMobilePhoneNumber: user.get('mobilePhoneNumber'),
                   passengerGender: user.get('userGender'),
                   passengerUserId: user.get('userId'),
                   passengerSchool: user.get('school'),
                 }
                 application.set(form)  // app信息
                 application.set('passenger', user)  // passenger
                 application.set(passengerData)
                 application.set('post', post)
                 application.set(postData)
                 application.setACL(acl)
                 application.save()
                            .then(function (applicationItem) {
                              wx.showToast({title: '提交成功'})
                              setTimeout(function () {
                                that.setData({submitting: false})
                                wx.navigateBack({number: 1})
                              }, 1500)
                            })
                            .catch(function () {leanError()})
               })
               .catch(function () {leanError()})
    }
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
