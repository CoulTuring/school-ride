// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'

Page({
  data: {},
  onLoad: function (options) {
    const postId = options.postId || null
    this.setData({postId})
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
             that.setData({formData})
           }, function (error) {
             // 异常处理
           })
    }
    else {
      const formData = {
        postStartAddress: null,
        postEndAddress: null,
        postSeatNumber: null,
        postStartDateTime: null,
        postNotes: null
      }
      this.setData({formData})
    }

  },
  formSubmit: function (e) {
    let form = e.detail.value
    form = {
      postStartAddress: form.postStartAddress,
      postEndAddress: form.postEndAddress,
      postSeatNumber: Number(form.postSeatNumber),
      postStartDateTime: form.postStartDateTime,
      postNotes: form.postNotes
    }

    const user = AV.User.current()
    const Post = AV.Object.extend('Post')

    if (this.data.postId) {
      // 新建对象
      let post = AV.Object.createWithoutData('Post', this.data.postId)
      post.set(form)
          .save()
          .then(function (newPost) {
            setTimeout(function () {
              wx.showToast({
                title: '提交成功'
              }, 500)
            })
          })
          .then(function () {
            wx.navigateBack({number: 1})
          })
          .catch(console.error)
    }
    else {
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
      post.set(form)
      post.set(driverDetail)
      post.set('driver', user)

      post.save().then(function (post) {
        console.log('objectId is ' + post.id)
        wx.showToast({
          title: '发布成功',
          icon: 'success'
        })
        wx.navigateBack({number: 1})
      }, function (error) {
        console.error(error)

        wx.navigateBack({number: 1})
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
