<!-- 使用 type="home" 属性设置首页，其他页面不需要设置，默认为page；推荐使用json5，更强大，且允许注释 -->
<route lang="json5" type="home">
{
  layout: 'tabbar',
  style: {
    navigationStyle: 'custom',
    navigationBarTitleText: '首页',
  },
}
</route>
<template>
  <view class="mine">
    <view class="tools">
      <wd-icon name="setting" size="1rpx"></wd-icon>
    </view>
    <view class="main">
      <view
        class="bg-white overflow-hidden pt-2 px-4"
        :style="{ paddingTop: safeAreaInsets?.top + 'px' }"
      >
        <wd-row>
          <wd-col :span="24">
            <wd-grid :gutter="10" :column="3" border>
              <wd-grid-item
                :icon="item.icon"
                :text="item.text"
                v-for="(item, index) in dynamicList"
                :key="index"
                @click="clickCoupon(item.url)"
              />
            </wd-grid>
          </wd-col>
        </wd-row>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import PLATFORM from '@/utils/platform'
import { useToast } from 'wot-design-uni'
import { http } from '@/utils/http'

defineOptions({
  name: 'Home',
})
const toast = useToast()
const clickCoupon = (url: string) => {
  toast.success('点击了链接:' + url)
  if (url) {
    uni.navigateTo({
      url,
    })
  } else {
    toast.show('暂无链接')
  }
}
const dynamicList = ref([])

// 获取屏幕边界到安全区域距离
const { safeAreaInsets } = uni.getSystemInfoSync()
// 测试 uni API 自动引入
onLoad(() => {
  http
    .post('/api/menu/getTreePhoneMenu', {}, {})
    .then((res) => {
      dynamicList.value.push(...res)
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
})
</script>

<style>
.main-title-color {
  color: #d14328;
}

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
    margin-bottom: 100rpx;
  }

  .header {
    box-sizing: border-box;
    width: 100%;
    padding: 32rpx;
    margin-bottom: 24rpx;
    background: #f6f9fe;
    border-radius: 16rpx;
  }
}
.main {
  box-sizing: border-box;
  width: 100%;
  padding: 12rpx 12rpx;
  margin-top: 100rpx;
  background: #ffffff;
  border-radius: 16rpx;
}
</style>
