// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'

Page({
  onLoad: function () {
    const user = AV.User.current()

    const formData = {
      name: user.get('name') || null,
      mobilePhoneNumber: user.get('mobilePhoneNumber') || null,
      userId: user.get('userId') || null,
      school: user.get('school') || null,
      carColor: user.get('carColor') || null,
      carModel: user.get('carModel') || null,
      plateNumber: user.get('plateNumber') || null
    }

    this.setData({
      formData
    })
  },
  data: {
    array: ['中国', '美国', '巴西', '日本'],
    index: 0,
    pickerHidden: true,
    chosen: ''
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
    const form = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    const user = AV.User.current()
    user.set(form)
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
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
