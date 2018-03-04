// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'
import { schools, userGenderList } from '../../../../utils/optionsValue'
import { findSchoolIndexByOptions } from '../../../../utils/util'
import { leanError } from '../../../common/common'

Page({
  data: {
    userGenderList: userGenderList,
    userGenderIndex: 0,
    schools: schools,
    schoolIndex: schools.length - 1,
    submitting: false
  },
  onLoad: function () {
    const user = AV.User.current()

    const formData = {
      name: user.get('name') || null,
      userGender: user.get('userGender') || null,
      mobilePhoneNumber: user.get('mobilePhoneNumber') || null,
      userId: user.get('userId') || null,
      school: user.get('school') || null,
      carColor: user.get('carColor') || null,
      carModel: user.get('carModel') || null,
      carSeatNumber: user.get('carSeatNumber') || null,
      carPlateNumber: user.get('carPlateNumber') || null
    }

    this.setData({
      formData: formData,
      schoolIndex: findSchoolIndexByOptions(formData.school) || schools.length - 1,
      userGenderIndex: userGenderList.findIndex(function checkAdult (item) {return item === formData.userGender}) || 0
    })
  },
  bindUserGenderChange: function (e) {
    this.setData({
      userGenderIndex: e.detail.value
    })
  },
  bindSchoolChange: function (e) {
    this.setData({
      schoolIndex: e.detail.value
    })
  },
  formSubmit: function (e) {
    const that = this
    that.setData({submitting: true})
    const formData = this.data.formData
    const form = {
      name: e.detail.value.name || formData.name,
      userGender: e.detail.value.userGender || formData.userGender,
      mobilePhoneNumber: e.detail.value.mobilePhoneNumber || formData.mobilePhoneNumber,
      userId: e.detail.value.userId || formData.userId,
      school: schools[this.data.schoolIndex].id,
      carColor: e.detail.value.carColor || formData.carColor,
      carModel: e.detail.value.carModel || formData.carModel,
      carSeatNumber: Number(e.detail.value.carSeatNumber) || formData.carSeatNumber,
      carPlateNumber: e.detail.value.carPlateNumber || formData.carPlateNumber
    }
    if (!form.name) {
      this.setData({
        tip: '提示：姓名不可以为空！',
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting:false
        })
      }, 2000)
    }
    if (!form.mobilePhoneNumber) {
      this.setData({
        tip: '提示：手机号格式错误！',
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting: false
        })
      }, 2000)
    }
    else {
      const user = AV.User.current()
      user.set(form)
          .save()
          .then(function () {
            wx.showToast({
              title: '提交成功'
            })
            setTimeout(function () {
              that.setData({submitting:false})
              wx.navigateBack({number: 1})
              // this.globalData.user = user.toJSON()
            }, 1500)

          })
          .catch(function () {leanError()})
    }
  }
})
