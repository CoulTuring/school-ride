import AV from '../../../../libs/av-weapp-min'
import { schools } from '../../../../utils/optionsValue'
import { findSchoolIndexByOptions } from '../../../../utils/util'
import { leanError } from '../../../common/common'

Page({
  data: {},
  onShow: function () {
    const user = AV.User.current()
    const that = this
    const formData = {
      name: user.get('name'),
      userGender: user.get('userGender'),
      mobilePhoneNumber: user.get('mobilePhoneNumber'),
      userId: user.get('userId') || null,
      school: schools[findSchoolIndexByOptions(user.get('school'))].name || null,
      carColor: user.get('carColor') || null,
      carModel: user.get('carModel') || null,
      carSeatNumber: user.get('carSeatNumber') || null,
      carPlateNumber: user.get('carPlateNumber') || null
    }
    this.setData({
      formData: formData
    })


  },

  editUserInfo: function () {
    wx.navigateTo({url: '../editUserInfo/editUserInfo'})
  },
})
