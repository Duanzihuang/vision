<template>
  <div class="screen-container" :style="containerStyle">
    <header class="screen-header">
      <div>
        <img :src="headerSrc" alt="" />
      </div>
      <span class="logo">
        <img :src="logoSrc" alt="" />
      </span>
      <span class="title">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeSrc" class="qiehuan" @click="handleThemeChange" />
        <span class="datetime">2049-01-01 00:00:00</span>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div
          id="left-top"
          :class="[fullScreenStatus.trend ? 'fullscreen' : '']"
        >
          <!-- 销售趋势图表 -->
          <Trend ref="trend" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
              @click="changeSize('trend')"
            ></span>
          </div>
        </div>
        <div
          id="left-bottom"
          :class="[fullScreenStatus.seller ? 'fullscreen' : '']"
        >
          <!-- 商家销售金额表 -->
          <Seller ref="seller" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.seller
                  ? 'icon-compress-alt'
                  : 'icon-expand-alt'
              ]"
              @click="changeSize('seller')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div
          id="middle-top"
          :class="[fullScreenStatus.map ? 'fullscreen' : '']"
        >
          <!-- 商家分布图表 -->
          <Map ref="map" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.map ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
              @click="changeSize('map')"
            ></span>
          </div>
        </div>
        <div
          id="middle-bottom"
          :class="[fullScreenStatus.rank ? 'fullscreen' : '']"
        >
          <!-- 地区销售排行图表 -->
          <Rank ref="rank" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
              @click="changeSize('rank')"
            ></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="[fullScreenStatus.hot ? 'fullscreen' : '']">
          <!-- 热销商品占比图表 -->
          <Hot ref="hot" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
              @click="changeSize('hot')"
            ></span>
          </div>
        </div>
        <div
          id="right-bottom"
          :class="[fullScreenStatus.stock ? 'fullscreen' : '']"
        >
          <!-- 库存销量分析图表 -->
          <Stock ref="stock" />
          <div class="resize">
            <!-- <span class="iconfont icon-compress-alt"></span>-->
            <span
              :class="[
                'iconfont',
                fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt'
              ]"
              @click="changeSize('stock')"
            ></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Trend from '@/components/Trend'
import Seller from '@/components/Seller'
import Map from '@/components/Map'
import Rank from '@/components/Rank'
import Hot from '@/components/Hot'
import Stock from '@/components/Stock'
import { mapState } from 'vuex'
import { getTheme } from '@/utils/theme_utils'
export default {
  data () {
    return {
      fullScreenStatus: {
        trend: false,
        seller: false,
        map: false,
        rank: false,
        hot: false,
        stock: false
      }
    }
  },
  created () {
    this.$socket.registerCallBack('fullScreen', this.recvData)
    this.$socket.registerCallBack('changeTheme', this.changeTheme)
  },
  destroyed () {
    this.$socket.unRegisterCallBack('fullScreen')
    this.$socket.unRegisterCallBack('changeTheme')
  },
  components: {
    Trend,
    Seller,
    Map,
    Rank,
    Hot,
    Stock
  },
  computed: {
    ...mapState(['theme']),
    headerSrc () {
      return `static/img/${getTheme(this.theme).headerBorderSrc}`
    },
    logoSrc () {
      return `static/img/${getTheme(this.theme).logoSrc}`
    },
    themeSrc () {
      return `static/img/${getTheme(this.theme).themeSrc}`
    },
    containerStyle () {
      return {
        backgroundColor: getTheme(this.theme).backgroundColor,
        color: getTheme(this.theme).titleColor
      }
    }
  },
  methods: {
    changeSize (chartName) {
      // 1.改变fullScreenStatus的数据
      //   this.fullScreenStatus[chartName] = !this.fullScreenStatus[chartName]
      // 2.需要调用每一个图表组件的screenAdapter的方法
      //   this.$nextTick(() => {
      //     this.$refs[chartName].screenAdapter()
      //   })

      // 实现全屏切换的联动效果
      const targetValue = !this.fullScreenStatus[chartName]
      this.$socket.send({
        action: 'fullScreen',
        socketType: 'fullScreen',
        chartName: chartName,
        value: targetValue
      })
    },
    recvData ({ value, chartName }) {
      this.fullScreenStatus[chartName] = value
      this.$nextTick(() => {
        this.$refs[chartName].screenAdapter()
      })
    },
    handleThemeChange () {
      // this.$store.commit('changeTheme')
      this.$socket.send({
        action: 'changeTheme',
        socketType: 'changeTheme',
        chartName: '',
        value: ''
      })
    },
    changeTheme () {
      this.$store.commit('changeTheme')
    }
  }
}
</script>

<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 100;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    img {
      height: 35px;
      width: 128px;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
// section > div {
//   border: 1px solid red;
// }
</style>
