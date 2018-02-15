function leanError () {
  wx.showToast({icon: 'none', title: '网络错误'})
}

module.exports = {
  leanError: leanError
}

