<template>
  <div class="com-container">
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<script>
// import { getStockData } from '@/api/stock'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      echartInstance: null,
      allData: null,
      currentIndex: 0,
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
    this.$socket.registerCallBack('stockData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      chartName: 'stock',
      socketType: 'stockData',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.startInterval()
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('stockData')
    clearInterval(this.timerId)
  },
  methods: {
    initChart () {
      this.echartInstance = this.$echarts.init(
        this.$refs.stockRef,
        this.getTheme
      )
      this.echartInstance.on('mousemove', () => {
        clearInterval(this.timerId)
      })
      this.echartInstance.on('mouseout', this.startInterval)

      const initOption = {
        title: {
          text: '▎库存和销量分析',
          left: 20,
          top: 20
        }
      }
      this.echartInstance.setOption(initOption)
    },
    // async getData () {
    getData (res) {
      // const res = await getStockData()
      // this.allData = res.data
      this.allData = res

      this.updateChart()
    },
    updateChart () {
      const start = this.currentIndex * 5
      const end = (this.currentIndex + 1) * 5
      const showData = this.allData.slice(start, end)
      const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
      const colorArr = [
        ['#4FF778', '#0BA82C'],
        ['#E5DD45', '#E8B11C'],
        ['#E8821C', '#E55445'],
        ['#5052EE', '#AB6EE5'],
        ['#23E5E5', '#2E72BF']
      ]
      const seriesArr = showData.map((item, index) => {
        return {
          type: 'pie',
          hoverAnimation: false, // 是否开启 hover 在扇区上的放大动画效果。
          data: [
            {
              name: `${item.name}\n\n${item.sales}`,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[index][0]
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1]
                  }
                ])
              }
            },
            {
              value: item.stock,
              itemStyle: { color: '#333843' }
            }
          ],
          label: {
            show: true,
            position: 'center',
            color: colorArr[index][0]
          },
          // center: [centerArr[index][0], centerArr[index][1]],
          center: centerArr[index]
          // radius: [100, 110]
        }
      })
      const dataOption = {
        series: seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.stockRef.offsetWidth / 100) * 3.6
      const innerRadius = titleFontSize * 2.8
      const outerRadius = innerRadius * 1.125
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        series: [
          {
            type: 'pie',
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          },
          {
            type: 'pie',
            radius: [innerRadius, outerRadius],
            label: {
              fontSize: titleFontSize / 2
            }
          }
        ]
      }

      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },
    startInterval () {
      if (this.timerId) {
        clearInterval(this.timerId)
      }

      this.timerId = setInterval(() => {
        this.currentIndex++
        if (this.currentIndex > 1) {
          this.currentIndex = 0
        }

        this.updateChart()
      }, 5000)
    }
  }
}
</script>
