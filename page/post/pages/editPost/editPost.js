// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'

Page({
  data: {
    submitting: false
  },
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
    const that = this
    that.setData({submitting: !that.data.submitting})
    const user = AV.User.current()
    const Post = AV.Object.extend('Post')
    const form = {
      postStartAddress: e.detail.value.postStartAddress,
      postEndAddress: e.detail.value.postEndAddress,
      postSeatNumber: Number(e.detail.value.postSeatNumber),
      postStartDateTime: e.detail.value.postStartDateTime,
      postNotes: e.detail.value.postNotes
    }

    if (this.data.postId) {
      // 新建对象
      let post = AV.Object.createWithoutData('Post', this.data.postId)
      post.set(form)
          .save()
          .then(function (newPost) {
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
                         }, 500)
                       })
                     })
                     .then(function () {
                       that.setData({submitting: !that.data.submitting})
                       wx.navigateBack({number: 1})
                     })
                     .catch()
               })
               .catch(function () {
               })
    }
  }
})
