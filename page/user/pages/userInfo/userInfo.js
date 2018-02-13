import AV from '../../../../libs/av-weapp-min'

Page({
  onLoad: function () {
    const user = AV.User.current()

    const formData = {
      name: user.get('name'),
      userGender: user.get('userGender'),
      mobilePhoneNumber: user.get('mobilePhoneNumber'),
      userId: user.get('userId') || null,
      school: user.get('school') || null,

      carColor: user.get('carColor') || null,
      carModel: user.get('carModel') || null,
      carSeatNumber: user.get('carSeatNumber') || null,
      carPlateNumber: user.get('carPlateNumber') || null
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

  editUserInfo: function () {
    wx.navigateTo({url: '../editUserInfo/editUserInfo'})
  },

  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.showToast({
      title: '提交成功'
    })

    // wx.navigateTo({
    //   url: '../editUserInfoSuccess/editUserInfoSuccess'
    // })
  }
  ,
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
