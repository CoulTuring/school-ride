// import { school } from '../../../../config'
import AV from '../../../../libs/av-weapp-min'

Page({
  onLoad: function () {
    // const create = false
    // const postId = '57328ca079bc44005c2472d0'
    // if (create) {
    //   const query = new AV.Query('Post')
    //   query.get(postId)
    //        .then(function (post) {
    //          const formData = {
    //            startAddress: post.get('startAddress'),
    //            endAddress: post.get('endAddress'),
    //            leftNumber: post.get('leftNumber'),
    //            startDateTime: post.get('startDateTime'),
    //            notes: post.get('notes')
    //          }
    //          this.setData({formData})
    //        }, function (error) {
    //          // 异常处理
    //        })
    //
    // }
    // else {
    const formData = {
      startAddress: null,
      endAddress: null,
      leftNumber: null,
      startDateTime: null,
      notes: null
    }
    this.setData({formData})
    // }

  },
  data: {},
  formSubmit: function (e) {
    const form = e.detail.value
    console.log('form发生了submit事件，携带数据为：', e.detail.value)

    const user = AV.User.current()
    const Post = AV.Object.extend('Post')
    // 新建对象
    let post = new Post()
    //
    post.set(form)
    post.set('driver', user)
    post.set('finished', false)
    post.save().then(function (post) {
      console.log('objectId is ' + post.id)
      wx.showToast({
        title: '发布成功',
        icon: 'success'
      })
    }, function (error) {
      console.error(error)
    })

    // post.set(form)
    //     .save()
    //     .then(function (post) {
    //       setTimeout(function () {
    //         wx.showToast({
    //           title: '提交成功'
    //         }, 500)
    //         // this.globalData.post = post.toJSON()
    //       })
    //     })
    //     .then(function () {
    //       wx.navigateBack({number: 1})
    //     })
    //     .catch(console.error)
  },
  formReset: function (e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      chosen: ''
    })
  }
})
