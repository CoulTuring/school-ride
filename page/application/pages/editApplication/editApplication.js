// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'
import { validate, validateRequired } from '../../../../util/validate'

Page({
  data: {
    submitting: false
  },
  onLoad: function (options) {

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
                 }, function (error) {
                   // 异常处理
                 })
    }
    else {
      post.get(postId)
          .then(function (postItem) {
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
            console.log(postData)

            that.setData({postData: postData, post: postItem, applicationData: applicationData})
          }, function (error) {
            // 异常处理
          })
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
    that.setData({submitting: !that.data.submitting})
    const postData = this.data.postData
    const post = this.data.post

    // validateRequired(['applicationStartAddress'], this)
    // if ('' === this.data.form.$invalidMsg) {
    //   console.log('invalid')
    // } else {
    //   console.log('valid')
    // }
    const form = {
      applicationStartAddress: e.detail.value.applicationStartAddress,
      applicationNotes: e.detail.value.applicationNotes
    }

    if (this.data.applicationId) {
      let application = AV.Object.createWithoutData('Application', this.data.applicationId)
      application.set(form)
                 .save()
                 .then(function (newApplication) {
                   setTimeout(function () {
                     wx.showToast({
                       title: '修改成功'
                     }, 500)
                   })
                 })
                 .then(function () {
                   that.setData({submitting: !that.data.submitting})
                   wx.navigateBack({number: 1})
                 })
                 .catch(console.error)

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
                              setTimeout(function () {
                                wx.showToast({
                                  title: '提交成功'
                                }, 500)
                              })
                            })
                            .then(function () {
                              that.setData({submitting: !that.data.submitting})
                              wx.navigateBack({number: 1})
                            })
                            .catch(console.error)
               }, function (error) {
               })
    }
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
