// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'
import { schools } from '../../../../util/optionsValue'
import { findSchoolIndexByOptions } from '../../../../util/util'

Page({
  data: {
    array: schools,
    index: schools.length - 1,
    pickerHidden: true,
    chosen: ''
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
      formData: formData, index: findSchoolIndexByOptions(formData.school)
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },
  pickerConfirm: function (e) {
    this.setData({
      pickerHidden: true
    })
    this.setData({
      chosen: e.detail.value
    })
  },
  pickerCancel: function (e) {
    this.setData({
      pickerHidden: true
    })
  },
  pickerShow: function (e) {
    this.setData({
      pickerHidden: false
    })
  },
  formSubmit: function (e) {
    let form = e.detail.value
    const formData = {
      name: form.name,
      userGender: form.userGender,
      mobilePhoneNumber: form.mobilePhoneNumber,
      userId: form.userId,
      school: schools[this.data.index].id,
      carColor: form.carColor || null,
      carModel: form.carModel || null,
      carSeatNumber: Number(form.carSeatNumber) || null,
      carPlateNumber: form.carPlateNumber || null
    }
    if (form.name.length === 0 || form.userGender.length === 0) {
      this.setData({
        tip: '提示：用户名不可以为空！',
      })
    } else {
      const user = AV.User.current()
      user.set(formData)
          .save()
          .then(function (user) {
            setTimeout(function () {
              wx.showToast({
                title: '提交成功'
              }, 500)
              // this.globalData.user = user.toJSON()
            })
          })
          .then(function () {
            wx.navigateBack({number: 1})
          })
          .catch(console.error)
    }
  }
})
