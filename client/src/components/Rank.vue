<template>
  <div class="com-container">
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<script>
// import { getRankData } from '@/api/rank'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      allData: null,
      echartInstance: null,
      startValue: 0,
      endValue: 9,
      timerId: null
    }
  },
  computed: {
    ...mapGetters(['getTheme'])
  },
  watch: {
    getTheme () {
      this.echartInstance.dispose() // 销毁之前的echarts实例
      this.initChart() // 重新创建echarts实例
      this.screenAdapter() // 重新进行屏幕适配
      this.updateChart() // 重新绘制图表
    }
  },
  created () {
    this.$socket.registerCallBack('rankData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.updateChart()
    this.$socket.send({
      action: 'getData',
      chartName: 'rank',
      socketType: 'rankData',
      value: ''
    })
    this.startInterval()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('rankData')
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.echartInstance = this.$echarts.init(
        this.$refs.rankRef,
        this.getTheme
      )
      this.echartInstance.on('mousemove', () => {
        clearInterval(this.timerId)
      })
      this.echartInstance.on('mouseout', () => {
        this.startInterval()
      })
      const initOption = {
        title: {
          text: '▎地区销售排行',
          left: '3%',
          top: '3%'
        },
        tooltip: {
          show: true
        },
        grid: {
          top: '30%',
          left: '5%',
          right: '5%',
          bottom: '5%'
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue
        },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            type: 'bar'
          }
        ]
      }
      this.echartInstance.setOption(initOption)
    },
    getData (res) {
      this.allData = res

      this.updateChart()
    },
    updateChart () {
      const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
      // 处理图表需要的数据
      // 所有省份所形成的数组
      // const res = await getRankData()
      // this.allData = res.data
      // const names = res.data.map(item => item.name)
      // const values = res.data.map(item => item.value)
      const names = this.allData.map(item => item.name)
      const values = this.allData.map(item => item.value)
      const dataOption = {
        xAxis: {
          data: names
        },
        dataZoom: {
          startValue: this.startValue,
          endValue: this.endValue
        },
        series: [
          {
            data: values,
            itemStyle: {
              color: arg => {
                let targetColor = null
                if (arg > 300) {
                  targetColor = colorArr[0]
                } else if (arg > 200) {
                  targetColor = colorArr[1]
                } else {
                  targetColor = colorArr[2]
                }
                return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: targetColor[0]
                  },
                  {
                    offset: 1,
                    color: targetColor[1]
                  }
                ])
              }
            }
          }
        ]
      }
      this.echartInstance.setOption(dataOption)
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }
      this.timerId = setInterval(() => {
        this.startValue++
        this.endValue++
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0
          this.endValue = 9
        }

        this.updateChart()
      }, 1000)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.rankRef.offsetWidth / 100) * 3.6

      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
            }
          }
        ]
      }

      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    }
  }
}
</script>
