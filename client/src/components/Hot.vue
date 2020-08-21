<template>
  <div class="com-container">
    <div class="com-chart" ref="hotRef"></div>
    <span class="iconfont left" :style="commonStyle" @click="goLeft"
      >&#xe6ef;</span
    >
    <span class="iconfont right" :style="commonStyle" @click="goRight"
      >&#xe6ed;</span
    >
    <span class="cat-name" :style="commonStyle">{{ catTitle }}</span>
  </div>
</template>

<script>
// import { getHotData } from '@/api/hot'
import { getTheme } from '@/utils/theme_utils'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      echartInstance: null,
      allData: null,
      currentIndex: 0,
      titleFontSize: 0
    }
  },
  created () {
    this.$socket.registerCallBack('hotData', this.getData)
  },
  computed: {
    ...mapState(['theme']),
    commonStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getTheme(this.theme).titleColor
      }
    },
    catTitle () {
      if (!this.allData) return ''

      return this.allData[this.currentIndex].name
    }
  },
  watch: {
    theme () {
      this.echartInstance.dispose() // 销毁之前的echarts实例
      this.initChart() // 重新创建echarts实例
      this.screenAdapter() // 重新进行屏幕适配
      this.updateChart() // 重新绘制图表
    }
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      chartName: 'hotproduct',
      socketType: 'hotData',
      value: ''
    })
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('hotData')
  },
  methods: {
    initChart () {
      this.echartInstance = this.$echarts.init(this.$refs.hotRef, this.theme)
      const initOption = {
        title: {
          text: '▎热销商品的占比',
          left: '20',
          top: '20'
        },
        legend: {
          top: '15%',
          icon: 'circle'
        },
        tooltip: {
          show: true
        },
        series: [
          {
            type: 'pie',
            left: '10%',
            top: '35%',
            right: '10%',
            bottom: '10%',
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: true
              },
              labelLine: {
                show: false
              }
            }
          }
        ]
      }
      this.echartInstance.setOption(initOption)
    },
    // 获取数据
    // async getData () {
    getData (res) {
      // const res = await getHotData()
      this.allData = res
      this.updateChart()
    },
    // 更新图表
    updateChart () {
      const data = this.allData && this.allData[this.currentIndex].children
      const legendData =
        this.allData &&
        this.allData[this.currentIndex].children.map(item => item.name)
      const dataOption = {
        legend: {
          data: legendData
        },
        tooltip: {
          formatter: arg => {
            let str = ''
            arg.data.children.forEach(item => {
              str += `${item.name}：${Math.round(
                (item.value / arg.data.value) * 100
              )}%<br/>`
            })

            return str
          }
        },
        series: [
          {
            data,
            radius: [0, this.titleFontSize * 4]
          }
        ]
      }
      this.echartInstance.setOption(dataOption)
    },
    goLeft () {
      this.currentIndex--
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1
      }

      this.updateChart()
    },
    goRight () {
      this.currentIndex++
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0
      }
      this.updateChart()
    },
    screenAdapter () {
      this.titleFontSize = (this.$refs.hotRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFontSize
          }
        },
        legend: {
          // itemWidth: this.titleFontSize / 2,
          // itemHeight: this.titleFontSize / 2,
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        },
        series: [
          {
            radius: [0, this.titleFontSize * 4]
          }
        ]
      }
      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.right {
  position: absolute;
  right: 10%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: white;
}
.cat-name {
  position: absolute;
  right: 10%;
  bottom: 10%;
  color: white;
}
</style>
