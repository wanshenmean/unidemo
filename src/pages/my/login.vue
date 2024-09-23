<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '登录',
  },
}
</route>
<template>
  <view class="login">
    <view class="login-main">
      <text class="login-main-title">欢迎登录</text>
      <view class="login-main-subtitle">XXXXXXXPDA程序</view>
      <view class="login-main-body">
        <wd-input v-model="user" clear-trigger="focus" placeholder="请输入用户名" clearable />
        <view class="login-password">
          <uni-easyinput type="password" v-model="pass" placeholder="请输入密码"></uni-easyinput>
          <wd-input
            v-model="pass"
            clear-trigger="focus"
            show-password
            placeholder="请输入密码"
            clearable
          />
        </view>
        <view class="verCode" v-if="SYS_DEFAULT_CAPTCHA_OPEN">
          <wd-input
            v-model="code"
            clear-trigger="focus"
            placeholder="请输入右边验证码"
            clearable
            :use-suffix-slot="true"
          >
            <template v-slot:suffix>
              <img
                :src="validCodeBase64"
                :style="{ width: width + 'px', height: height + 'px' }"
                class="login-validCode-img"
                @click="refresh()"
              />
            </template>
          </wd-input>
          <!-- <view class="canvas-img-code" @click="refresh()">
            <img
              :src="validCodeBase64"
              :style="{ width: width + 'px', height: height + 'px' }"
              class="login-validCode-img"
            />
          </view> -->
        </view>
        <view class="login-main-body-bottom">
          <wd-checkbox v-model="rememberMe" @change="handleChange" shape="square">
            记住账号
          </wd-checkbox>
        </view>
        <wd-button block @click="login">登录</wd-button>
      </view>
    </view>
  </view>
  <wd-toast />
</template>

<script lang="ts" setup>
import { getVierificationCode, loginPost } from '@/service/index/foo'
import { useToast } from 'wot-design-uni'
import { useUserStore } from '@/store'
const userStore = useUserStore()
const toast = useToast()

const rememberMe = ref<boolean>(false)

const SYS_DEFAULT_CAPTCHA_OPEN = true

const handleChange = (ref) => {
  rememberMe.value = ref.value
}

const loadRememberedCredentials = () => {
  // #ifdef APP
  const remember = uni.getStorageSync('rememberMe')
  // #endif

  // #ifdef H5
  const remember = localStorage.getItem('rememberMe')
  // #endif
  if (remember === 'true') {
    rememberMe.value = true
    // #ifdef H5
    user.value = localStorage.getItem('username')
    pass.value = localStorage.getItem('password')
    // #endif
    // #ifdef APP
    user.value = uni.getStorageSync('username')
    pass.value = uni.getStorageSync('password')
    // #endif
  }
}

const configSysBaseList = () => {
  // 如果验证码开关是开就加载验证码
  if (SYS_DEFAULT_CAPTCHA_OPEN) {
    loginCaptcha()
  }
}

const width = 100
const height = 40
const validCodeBase64 = ref('')
const validCodeReqNo = ref('')
const user = ref('')
const pass = ref('')
const code = ref('')

onLoad(() => {
  loginCaptcha()
  loadRememberedCredentials()
})

const loginCaptcha = async () => {
  userStore.clearUserInfo()
  await getVierificationCode().then((res) => {
    validCodeBase64.value = 'data:image/png;base64,' + res.img
    validCodeReqNo.value = res.uuid
  })
}

const refresh = () => {
  loginCaptcha()
}
const login = async () => {
  if (pass.value === '') {
    toast.show('请输入密码')
  } else if (user.value === '') {
    toast.show('请输入用户名')
  } else if ((pass.value as string).length < 6) {
    toast.show('密码应大于6位')
  } else {
    toast.loading({ loadingType: 'ring', msg: '正在登录...' })
    const userifno = {
      verificationCode: SYS_DEFAULT_CAPTCHA_OPEN ? code.value : null,
      password: pass.value,
      userName: user.value,
      UUID: SYS_DEFAULT_CAPTCHA_OPEN ? validCodeReqNo.value : null,
    }
    await loginPost(userifno).then((res) => {
      console.log('🚀 ~ loginPost ~ res:', res)
      if (res.status === true) {
        toast.close()
        toast.show('登录成功')
        userStore.clearUserInfo()
        userStore.setUserInfo(res.data)
        if (rememberMe.value) {
          console.log('🚀 ~ loginPost ~ res:', '保存成功')
          saveCredentials()
        } else {
          clearCredentials()
        }
        setTimeout(() => {
          uni.reLaunch({
            url: '/pages/index/index',
          })
        }, 300)
      } else {
        toast.close()
        toast.show(res.message)
      }
    })
  }
}

const saveCredentials = () => {
  // #ifdef APP
  uni.setStorageSync('rememberMe', rememberMe.value ? 'true' : 'false')
  uni.setStorageSync('username', user.value)
  uni.setStorageSync('password', pass.value)
  // #endif

  // #ifdef H5
  localStorage.setItem('rememberMe', rememberMe.value ? 'true' : 'false')
  localStorage.setItem('username', user.value)
  localStorage.setItem('password', pass.value)
  // #endif
}

const clearCredentials = () => {
  // #ifdef APP
  uni.removeStorageSync('rememberMe')
  uni.removeStorageSync('username')
  uni.removeStorageSync('password')
  // #endif

  // #ifdef H5
  localStorage.removeItem('rememberMe')
  localStorage.removeItem('username')
  localStorage.removeItem('password')
  // #endif
}
</script>

<style lang="scss" scoped>
.login {
  box-sizing: border-box;
  width: 100vw;
  // font-family: PingFangSC-Regular, PingFang SC;
  // background-color: $color-white;
  height: calc(100vh - var(--window-top));

  &-main {
    position: relative;
    padding: 112rpx 75rpx 0 75rpx;

    &-title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 64rpx;
      font-size: 48rpx;
      font-weight: 600;
      // color: $color-text-secondary;
      line-height: 64rpx;
      letter-spacing: 8rpx;
    }

    &-subtitle {
      margin: 8rpx 0 104rpx;
      font-size: 28rpx;
      // color: $color-text-thirdly;
      line-height: 40rpx;
      text-align: center;
      letter-spacing: 12rpx;
    }

    &-body {
      position: relative;
      box-sizing: border-box;
      // width: 600rpx;
      height: 548rpx;

      .login-password {
        position: relative;
        padding: 40rpx 0 40rpx;
      }

      .verCode {
        position: relative;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0rpx 0 50rpx;
      }
      .login-main-body-bottom {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0rpx 0 50rpx;
      }
    }
  }

  &-footer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 300rpx;
    font-size: 20rpx;
    font-weight: 500;
    line-height: 28rpx;
    text-align: center;
  }
}
</style>
