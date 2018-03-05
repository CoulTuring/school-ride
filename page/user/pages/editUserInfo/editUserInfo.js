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
      userId: user.get('userId'),
      school: user.get('school'),
      carColor: user.get('carColor'),
      carModel: user.get('carModel'),
      carSeatNumber: user.get('carSeatNumber'),
      carPlateNumber: user.get('carPlateNumber')
    }

    this.setData({
      formData: formData,
      schoolIndex: formData.school ? findSchoolIndexByOptions(formData.school) : schools.length - 1,
      userGenderIndex: formData.userGender ? userGenderList.findIndex(function checkAdult (item) {return item === formData.userGender}) : 0
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
      userGender: userGenderList[that.data.userGenderIndex] || formData.userGender,
      mobilePhoneNumber: e.detail.value.mobilePhoneNumber || formData.mobilePhoneNumber,
      userId: e.detail.value.userId,
      school: schools[this.data.schoolIndex].id,
      carColor: e.detail.value.carColor,
      carModel: e.detail.value.carModel,
      carSeatNumber: Number(e.detail.value.carSeatNumber),
      carPlateNumber: e.detail.value.carPlateNumber
    }
    if (!form.name) {
      this.setData({
        tip: '提示：姓名不可以为空！',
      })
      setTimeout(function () {
        that.setData({
          tip: null,
          submitting: false
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
      console.log(form)
      console.log(user)
      user.set(form)
          .save()
          .then(function () {
            wx.showToast({
              title: '提交成功'
            })
            setTimeout(function () {
              that.setData({submitting: false})
              wx.navigateBack({number: 1})
              // this.globalData.user = user.toJSON()
            }, 1500)

          })
          .catch(function (error) {
            leanError()
            console.log(error)
            that.setData({submitting: false})
          })
    }
  }

})
