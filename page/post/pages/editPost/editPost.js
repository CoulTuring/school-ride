// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'
import { leanError } from '../../../common/common'

import moment from '../../../../libs/moment.min'

// import request from '../../utils/request'
// import {formatDate, formatTime, getTomorrow, getAfterDays} from '../../utils/datetime'
// import {combine} from '../../utils/utils'
// import tab from '../../components/tab'
// import { validate,validateRequired } from '../../../../utils/validate'

Page({
  data: {
    submitting: false,
    maxLeftNumber: 0,
    postStartDate: moment().format('YYYY-MM-DD'),
    postStartTime: moment().format('HH:mm')
  },
  onLoad: function (options) {
    const postId = options.postId || null
    const user = AV.User.current()
    this.setData({
      postId: postId,
      maxLeftNumber: user.get('carSeatNumber') - 1
    })
    const that = this
    if (postId) {
      const query = new AV.Query('Post')
      query.get(postId)
           .then(function (post) {
             const formData = {
               postStartAddress: post.get('postStartAddress'),
               postEndAddress: post.get('postEndAddress'),
               postSeatNumber: post.get('postSeatNumber'),
               postStartDateTime: post.get('postStartDateTime'),
               postNotes: post.get('postNotes')
             }
             that.setData({
               formData,
               postStartDate: moment(post.get('postStartDateTime')).format('YYYY-MM-DD'),
               postStartTime: moment(post.get('postStartDateTime')).format('HH:mm')
             })
           })
           .catch(function () {leanError()})
    }
    else {
      const formData = {
        postStartDateTime: new Date(),
        postSeatNumber: user.get('carSeatNumber') - 1,
      }
      this.setData({
        formData,
      })
    }

  },
  bindDateChange: function (e) {
    this.setData({
      postStartDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      postStartTime: e.detail.value
    })
  },

  formSubmit: function (e) {
    const that = this
    that.setData({submitting: true})
    const user = AV.User.current()
    const Post = AV.Object.extend('Post')
    const formData = that.data.formData
    const form = {
      postStartAddress: e.detail.value.postStartAddress || formData.postStartAddress,
      postEndAddress: e.detail.value.postEndAddress || formData.postEndAddress,
      postSeatNumber: Number(e.detail.value.postSeatNumber) || formData.postSeatNumber,
      postStartDateTime: new Date(`${that.data.postStartDate} ${that.data.postStartTime}`) || formData.postStartDateTime,
      postLeftNumber: Number(e.detail.value.postSeatNumber) || formData.postLeftNumber,
      postNotes: e.detail.value.postNotes || formData.postNotes
    }
    console.log(form)

    if (!form.postStartAddress) {
      that.setData({
        tip: '提示：始发站不可以为空！',
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting: false
        })
      }, 2000)
    }
    if (!form.postEndAddress) {
      that.setData({
        tip: '提示：终点站不可以为空！',
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting: false
        })
      }, 2000)
    }
    else {

      if (this.data.postId) {
        // 新建对象
        let post = AV.Object.createWithoutData('Post', this.data.postId)
        post.set(form)
            .save()
            .then(function () {
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
        const acl = new AV.ACL()
        const roleQuery = new AV.Query(AV.Role)
        let post = new Post()

        const driverDetail = {
          // 车辆信息
          driverCarModel: user.get('carModel'),
          driverCarColor: user.get('carColor'),
          driverCarSeatNumber: user.get('carSeatNumber'),
          driverCarPlateNumber: user.get('carPlateNumber'),
          // 司机信息
          driverName: user.get('name'),
          driverMobilePhoneNumber: user.get('mobilePhoneNumber'),
          driverGender: user.get('userGender'),
          driverUserId: user.get('userId'),
          driverSchool: user.get('school'),
        }

        roleQuery.equalTo('name', 'PostAdmin')
        roleQuery.first()
                 .then(function (role) {
                   acl.setPublicReadAccess(true)
                   acl.setPublicWriteAccess(false)
                   acl.setWriteAccess(user, true)
                   acl.setRoleWriteAccess(role, true)

                   post.setACL(acl)
                   post.set(form)
                   post.set(driverDetail)
                   post.set('driver', user)
                   post.save()
                       .then(function (post) {
                         setTimeout(function () {
                           wx.showToast({
                             title: '提交成功'
                           })
                         }, 1500)
                       })
                       .then(function () {
                         that.setData({submitting: !that.data.submitting})
                         wx.navigateBack({number: 1})
                       })
                       .catch(function (error) {
                         leanError()
                         that.setData({submitting: true})
                         console.log(error)
                       })
                 })
                 .catch(function (error) {
                   leanError()
                   console.log(error)
                   that.setData({submitting: true})
                 })
      }
    }

  }
})

