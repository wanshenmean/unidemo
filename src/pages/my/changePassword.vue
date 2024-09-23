<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '修改密码',
  },
}
</route>

<template>
  <view class="login">
    <view class="login-main">
      <text class="login-main-title">修改密码</text>
      <view class="login-main-subtitle">修改后请保存密码，忘记密码请找管理员修改</view>
      <view class="login-main-body">
        <wd-form ref="form" :model="model">
          <wd-cell-group border>
            <wd-input
              label="原密码"
              label-width="100px"
              prop="value1"
              show-password
              clearable
              v-model="model.value1"
              placeholder="请输入原密码"
              :rules="[{ required: true, message: '请填写原密码' }]"
            />
            <wd-input
              label="新密码"
              label-width="100px"
              prop="value2"
              show-password
              clearable
              v-model="model.value2"
              placeholder="请输入新密码"
              :rules="[{ required: true, message: '请填写新密码' }]"
            />
            <wd-input
              label="确认密码"
              label-width="100px"
              prop="value3"
              show-password
              clearable
              v-model="model.value3"
              placeholder="请输入确认密码"
              :rules="[
                {
                  required: true,
                  validator: validatorMessage,
                  message: '请填写新密码确认',
                },
              ]"
            />
          </wd-cell-group>
          <view class="footer">
            <wd-button type="primary" size="large" @click="handleSubmit" block>提交</wd-button>
          </view>
        </wd-form>
      </view>
    </view>
  </view>
  <wd-toast />
</template>

<script lang="ts" setup>
import { httpPost } from '@/utils/http'
import { useToast } from 'wot-design-uni'
import { useUserStore } from '@/store'

const userStore = useUserStore()
const toast = useToast()

const model = reactive<{
  value1: string
  value2: string
  value3: string
}>({
  value1: '',
  value2: '',
  value3: '',
})
const form = ref()
const validatorMessage = (val) => {
  if (val !== model.value2) {
    return Promise.reject(new Error('两次密码不一致'))
  } else {
    return Promise.resolve()
  }
}

const parms = {
  oldPwd: model.value1,
  newPwd: model.value2,
}

const { loading, error, data, run } = useRequest<null>(() =>
  httpPost(`/api/Sys_User/modifyPwd?oldPwd=${parms.oldPwd}&newPwd=${parms.newPwd}`, parms),
)

function handleSubmit() {
  form.value
    .validate()
    .then(async ({ valid, errors }) => {
      if (valid) {
        toast.loading('正在修改')
        parms.oldPwd = model.value1
        parms.newPwd = model.value2
        await run()
        if (!error.value) {
          userStore.clearUserInfo()
          toast.close()
          toast.success('修改成功')
          setTimeout((e) => {
            uni.reLaunch({
              url: 'login',
            })
          }, 1500)
        } else {
          toast.close()
        }
      }
    })
    .catch((err) => {
      toast.close()
      toast.error(err.msg)
    })
}
</script>

<style lang="scss" scoped>
//
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

      .login-passwordre {
        position: relative;
        padding: 0rpx 0 40rpx;
      }

      .verCode {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0rpx 0 140rpx;
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
