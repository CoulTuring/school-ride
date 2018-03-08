import AV from '../../libs/av-weapp-min'
import { leanError } from '../common/common'
import moment from '../../libs/moment.min'

const app = getApp()

const sliderWidth = 96 // 需要设置slider的宽度，用于计算中间位置

Page({
  data: {
    icon60: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAAeFBMVEUAwAD///+U5ZTc9twOww7G8MYwzDCH4YcfyR9x23Hw+/DY9dhm2WZG0kbT9NP0/PTL8sux7LFe115T1VM+zz7i+OIXxhes6qxr2mvA8MCe6J6M4oz6/frr+us5zjn2/fa67rqB4IF13XWn6ad83nxa1loqyirn+eccHxx4AAAC/klEQVRo3u2W2ZKiQBBF8wpCNSCyLwri7v//4bRIFVXoTBBB+DAReV5sG6lTXDITiGEYhmEYhmEYhmEYhmEY5v9i5fsZGRx9PyGDne8f6K9cfd+mKXe1yNG/0CcqYE86AkBMBh66f20deBc7wA/1WFiTwvSEpBMA2JJOBsSLxe/4QEEaJRrASP8EVF8Q74GbmevKg0saa0B8QbwBdjRyADYxIhqxAZ++IKYtciPXLQVG+imw+oo4Bu56rjEJ4GYsvPmKOAB+xlz7L5aevqUXuePWVhvWJ4eWiwUQ67mK51qPj4dFDMlRLBZTqF3SDvmr4BwtkECu5gHWPkmDfQh02WLxXuvbvC8ku8F57GsI5e0CmUwLz1kq3kD17R1In5816rGvQ5VMk5FEtIiWislTffuDpl/k/PzscdQsv8r9qWq4LRWX6tQYtTxvI3XyrwdyQxChXioOngH3dLgOFjk0all56XRi/wDFQrGQU3Os5t0wJu1GNtNKHdPqYaGYQuRDfbfDf26AGLYSyGS3ZAK4S8XuoAlxGSdYMKwqZKM9XJMtyqXi7HX/CiAZS6d8bSVUz5J36mEMFDTlAFQzxOT1dzLRljjB6+++ejFqka+mXIe6F59mw22OuOw1F4T6lg/9VjL1rLDoI9Xzl1MSYDNHnPQnt3D1EE7PrXjye/3pVpr1Z45hMUdcACc5NVQI0bOdS1WA0wuz73e7/5TNqBPhQXPEFGJNV2zNqWI7QKBd2Gn6AiBko02zuAOXeWIXjV0jNqdKegaE/kJQ6Bfs4aju04lMLkA2T5wBSYPKDGF3RKhFYEa6A1L1LG2yacmsaZ6YPOSAMKNsO+N5dNTfkc5Aqe26uxHpx7ZirvgCwJpWq/lmX1hA7LyabQ34tt5RiJKXSwQ+0KU0V5xg+hZrd4Bn1n4EID+WkQdgLfRNtvil9SPfwy+WQ7PFBWQz6dGWZBLkeJFXZGCfLUjCgGgqXo5TuSu3cugdcTv/HjqnBTEMwzAMwzAMwzAMwzAMw/zf/AFbXiOA6frlMAAAAABJRU5ErkJggg==',
    tabs: ['添加预约', '已预约'],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },
  onPullDownRefresh: function () {
    this.loadInitialApplication()
        .then(() => {
          wx.stopPullDownRefresh()
        })
  },
  onLoad: function () {
    const that = this

    AV.User.loginWithWeapp().then(user => {
      app.globalData.user = user.toJSON()
    }).catch(console.error)

    wx.getUserInfo({
      success: ({userInfo}) => {
        app.globalData.getUserInfoSuccess = true
        console.log('f')

        const user = AV.User.current()
        user.set(userInfo)
            .save()
            .then(user => {
              app.globalData.user = user.toJSON()
              console.log('yy')
              if (!user.get('name')) {
                wx.navigateTo({url: `../user/pages/editUserInfo/editUserInfo`})
              }
            })
            .catch(console.error)
      },
      fail: function (res) {
        console.log('e')
        app.globalData.getUserInfoSuccess = false
        // 跳转到授权页
        wx.redirectTo({
          url: '/page/msg/msg_fail'
        })
      }
    })

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        })
      }
    })

  },
  onShow: function () {
    // console.log(app.globalData.getUserInfoSuccess)
    // const user = AV.User.current()
    // console.log(Boolean(user && !user.get('name') && app.globalData.getUserInfoSuccess === true))
    // if (user && !user.get('name') && app.globalData.getUserInfoSuccess === true) {
    //   wx.navigateTo({url: `../user/pages/editUserInfo/editUserInfo`})
    // }
    this.loadInitialApplication()
  },
  loadInitialApplication: function () {
    const that = this
    const user = AV.User.current()

    const postNotFinished = new AV.Query('Post')
    postNotFinished.notEqualTo('postFinished', true)

    const postLevelNumber = new AV.Query('Post')
    postLevelNumber.greaterThan('postLeftNumber', 0)

    const post = AV.Query.and(postLevelNumber, postNotFinished)

    const goingApplication = new AV.Query('Application')
    goingApplication.notEqualTo('applicationFinished', true)

    const passenger = new AV.Query('Application')
    passenger.equalTo('passenger', user)

    const query = AV.Query.and(goingApplication, passenger)

    return Promise.all([post.find(), query.find()])
                  .then(function (values) {
                    console.log(values)
                    const postDataList = values[0] || []
                    const applicationDataList = values[1] || []
                    const postList = postDataList.map((postItem) => {
                      return {
                        id: postItem.id,
                        postStartAddress: postItem.get('postStartAddress'),
                        postEndAddress: postItem.get('postEndAddress'),
                        postStartDateTime: moment(postItem.get('postStartDateTime')).format('YYYY-MM-DD HH:mm'),
                        postNotes: postItem.get('postNotes'),
                        postLeftNumber: postItem.get('postLeftNumber'),
                        postSeatNumber: postItem.get('postSeatNumber'),
                        // 车辆信息
                        driverCarSeatNumber: postItem.get('driverCarSeatNumber'),
                        driverCarModel: postItem.get('driverCarModel'),
                        driverCarColor: postItem.get('driverCarColor'),
                        driverCarPlateNumber: postItem.get('driverCarPlateNumber'),
                        // 司机信息
                        driverName: postItem.get('driverName'),
                        driverMobilePhoneNumber: postItem.get('driverMobilePhoneNumber'),
                        driverGender: postItem.get('driverGender'),
                        driverUserId: postItem.get('driverUserId'),
                        driverSchool: postItem.get('driverSchool'),
                      }
                    })

                    const applicationList = applicationDataList.map((applicationItem) => {
                      return {
                        id: applicationItem.id,
                        postStartAddress: applicationItem.get('postStartAddress'),
                        postEndAddress: applicationItem.get('postEndAddress'),
                        postStartDateTime: moment(applicationItem.get('postStartDateTime')).format('YYYY-MM-DD HH:mm'),
                        postNotes: applicationItem.get('postNotes'),
                        postSeatNumber: applicationItem.get('postSeatNumber'),
                        // 车辆信息
                        driverCarSeatNumber: applicationItem.get('driverCarSeatNumber'),
                        driverCarModel: applicationItem.get('driverCarModel'),
                        driverCarColor: applicationItem.get('driverCarColor'),
                        driverCarPlateNumber: applicationItem.get('driverCarPlateNumber'),
                        // 司机信息
                        driverName: applicationItem.get('driverName'),
                        driverMobilePhoneNumber: applicationItem.get('driverMobilePhoneNumber'),
                        driverGender: applicationItem.get('driverGender'),
                        driverUserId: applicationItem.get('driverUserId'),
                        driverSchool: applicationItem.get('driverSchool'),
                        // 预约信息
                        applicationStartAddress: applicationItem.get('applicationStartAddress'),
                        applicationNotes: applicationItem.get('applicationNotes'),
                        applicationCancelDateTime: applicationItem.get('applicationCancelDateTime'),
                        applicationCanceled: applicationItem.get('applicationCanceled'),
                        applicationFinishDateTime: applicationItem.get('applicationFinishDateTime'),
                        applicationFinished: applicationItem.get('applicationFinished'),
                      }
                    })
                    console.log(applicationList)
                    console.log(postList)
                    return that.setData({postList, applicationList})
                  })
                  .catch(function () {leanError()})
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    })
  },
  applicationDetail: (event) => {
    const app = getApp()
    const applicationId = event.currentTarget.id
    app.applicationId = applicationId
    wx.navigateTo({url: `./pages/applicationDetail/applicationDetail?applicationId=${applicationId}`})
  },
  editApplication: (event) => {
    const postId = event.currentTarget.id
    wx.navigateTo({url: `./pages/editApplication/editApplication?postId=${postId}`})
  }
})