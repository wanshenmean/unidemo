<route lang="json5" type="page">
{
  layout: 'tabbar',
  style: {
    navigationBarTitleText: '我的',
  },
}
</route>

<template>
  <view class="mine">
    <view class="tools">
      <wd-icon name="scan" size="32rpx" @click="doScan"></wd-icon>
      <wd-icon name="setting" size="32rpx"></wd-icon>
    </view>
    <view class="header">
      <view class="header-user">
        <wd-img :width="100" :height="100" :src="userInfo.headImageUrl">
          <template #error>
            <view class="error-wrap">加载失败</view>
          </template>
          <template #loading>
            <view class="loading-wrap">
              <wd-loading />
            </view>
          </template>
        </wd-img>
        <view class="header-user-nickname">
          <view class="nickname">{{ userInfo.userTrueName }}🧑‍💻</view>
          <view class="info">{{ userInfo.userName }} &nbsp;&nbsp; {{ userInfo.roleName }}</view>
        </view>
        <view class="header-user-more">
          <uni-icons type="bars" size="48rpx" color="#BEC0C7"></uni-icons>
        </view>
      </view>
      <view class="header-target">
        <view class="header-target-item" v-for="(item, key) in target" :key="key">
          <text class="label">{{ item }}</text>
          <text class="value">{{ key }}</text>
        </view>
      </view>
    </view>
    <view class="main">
      <wd-cell-group>
        <wd-cell title="检查更新" is-link @click="checkVeision" />
        <wd-cell title="更新密码" is-link @click="updatePassWord" />
        <wd-cell title="退出当前账号" is-link @click="doLogout" />
      </wd-cell-group>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { getLoginUserAPI, GetReleaseApi } from '@/service/index/foo'

import { useUserStore } from '@/store'
const userStore = useUserStore()

const target = {
  修身: 99,
  齐家: 99,
  治国: 99,
  评天下: 99,
}

const userInfo = ref({})

onLoad(() => {
  getLoginUser()
})

const getLoginUser = async () => {
  await getLoginUserAPI()
    .then((res) => {
      if (res.status === true && userStore.userInfo.token !== '') {
        if (res.data.headImageUrl === '') {
          res.data.headImageUrl =
            'https://img.cdn.sugarat.top/mdImg/MTY3MjUwMzUxNjI4Nw==file_1635385316273.png'
        }

        userInfo.value = res.data
      } else {
        uni.showToast({
          icon: 'none',
          title: '登录失效请重新登录',
          duration: 1500,
        })
        Login()
      }
    })
    .catch((res) => {
      uni.showToast({
        icon: 'none',
        title: '登录失效请重新登录',
        duration: 1500,
      })
      Login()
    })
}

const Login = () => {
  uni.reLaunch({
    url: 'login',
  })
}
const doLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确认退出当前登录账号吗？',
    success: (action) => {
      if (action.confirm) {
        // 点击的确认按钮
        userStore.clearUserInfo()
        console.log('🚀 ~ doLogout ~ userStore.userInfo:', userStore.userInfo)
        Login()
      }
    },
  })
}

const updatePassWord = () => {
  uni.navigateTo({ url: 'changePassword' })
}

let code = ''

const doScan = () => {
  uni.scanCode({
    success: (res) => {
      // 扫码内容
      code = res.result || ''

      uni.showToast({
        title: `扫码内容：${code}`,
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const curVersion = ref('')
const curVersionCode = ref('')

const checkVeision = () => {
  // 获取manifest.json 的信息 版本信息
  plus.runtime.getProperty(plus.runtime.appid, (wgtinfo) => {
    curVersion.value = wgtinfo.version // 应用版本名称
    curVersionCode.value = wgtinfo.versionCode // 应用版本号
  })
  // 获取服务器版本信息
  GetReleaseApi().then((res) => {
    // 当前版本code
    const VersionCode = parseInt(curVersionCode.value)
    // 新版本code
    const newVersionCode1 = parseInt(res.data)
    console.log('curVersionCode:', VersionCode)
    console.log('newVersionCode:', newVersionCode1)
    // 有新版本
    if (newVersionCode1 > VersionCode) {
      console.log('有新版本')
      // 检测新版本提示
      uni.showModal({
        title: '版本检查',
        content: '检测到新版本，是否下载安装包？',
        confirmText: '下载',
        success: (res) => {
          // 安装包下载地址
          if (res.confirm) {
            // 请求基准地址
            const url = import.meta.env.VITE_SERVER_BASEUR + '/biz/test/FileDownload'
            uni.showLoading({
              title: '安装包下载中',
            })
            // 新建下载任务
            const dtask = plus.downloader.createDownload(url, {}, (d, status) => {
              if (status === 200) {
                uni.hideLoading()
                uni.showModal({
                  title: '提示',
                  content: '安装包下载成功，是否确认安装？',
                  success: (res) => {
                    if (res.confirm) {
                      plus.runtime.install(
                        plus.io.convertLocalFileSystemURL(d.filename),
                        {},
                        (success) => {
                          uni.showToast({
                            title: '安装成功',
                            mask: false,
                            duration: 1500,
                          })
                        },
                        // eslint-disable-next-line n/handle-callback-err
                        (error) => {
                          uni.showToast({
                            title: '安装失败',
                            mask: true,
                            duration: 1500,
                          })
                        },
                      )
                    }
                  },
                })
              } else {
                uni.hideLoading()
                uni.showToast({
                  title: '安装包下载失败',
                  mask: false,
                  duration: 1500,
                })
              }
            })
            // 开始下载
            dtask.start()
          }
        },
      })
    } else {
      uni.showToast({
        title: '暂无更新',
        mask: false,
        duration: 1500,
      })
    }
  })
}
</script>

<style lang="scss" scoped>
//
.mine {
  box-sizing: border-box;
  width: 100vw;
  min-height: calc(100vh - var(--window-top) - var(--window-bottom) - 100rpx);
  padding: 0 24rpx 24rpx;
  background: #e7f0ff;

  .tools {
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    padding: 0 12rpx;
    margin-bottom: 32rpx;
  }

  .header {
    box-sizing: border-box;
    width: 100%;
    padding: 32rpx;
    margin-bottom: 24rpx;
    background: #f6f9fe;
    border-radius: 16rpx;

    &-user {
      display: flex;
      margin-bottom: 56rpx;

      &-avatar {
        flex: 0 0 auto;
        width: 128rpx;
        height: 128rpx;
        overflow: hidden;
        border-radius: 50%;
      }

      &-nickname {
        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        justify-content: center;
        margin-left: 32rpx;

        .nickname {
          margin-bottom: 12rpx;
          font-size: 32rpx;
          font-weight: 550;
          color: #292c39;
        }

        .info {
          font-size: 26rpx;
          color: #c6c9cf;
        }
      }

      &-more {
        flex: 0 0 auto;
        width: 48rpx;
      }
    }

    &-target {
      display: flex;

      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 25%;

        .label {
          margin-bottom: 24rpx;
          font-size: 32rpx;
          font-weight: 550;
          color: #292c39;
        }

        .value {
          font-size: 28rpx;
          color: #3c3f49;
        }
      }
    }
  }

  .main {
    box-sizing: border-box;
    width: 100%;
    padding: 12rpx 12rpx;
    background: #ffffff;
    border-radius: 16rpx;
  }

  .error-wrap {
    width: 100%;
    height: 100%;
    line-height: 100px;
    color: rgb(17, 14, 14);
    text-align: center;
    background-color: rgb(206, 206, 206);
  }

  .loading-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
}
</style>
