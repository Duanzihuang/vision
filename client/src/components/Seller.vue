<template>
  <div class="com-container">
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<script>
// import { getSellerData } from '@/api/seller'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      chartInstance: null,
      allData: null, // 服务器返回的数据
      currentPage: 1, // 当前页
      pageSize: 5, // 页容量
      totalPage: 0, // 一共有多少页
      timer: null // 定时器
    }
  },
  computed: {
    ...mapGetters(['getTheme'])
  },
  watch: {
    getTheme () {
      this.chartInstance.dispose() // 销毁之前的echarts实例
      this.initChart() // 重新创建echarts实例
      this.screenAdapter() // 重新进行屏幕适配
      this.updateChart() // 重新绘制图表
    }
  },
  created () {
    this.$socket.registerCallBack('sellerData', this.getData)
  },
  mounted () {
    this.initChart()
    this.$socket.send({
      action: 'getData',
      chartName: 'seller',
      socketType: 'sellerData',
      value: ''
    })
    // this.getData()
    window.addEventListener('resize', this.screenAdapter)
    // 在页面加载完成的时候，主动进行屏幕的适配
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('sellerData')
    clearInterval(this.timer)
  },
  methods: {
    // 初始化图表
    initChart () {
      this.chartInstance = this.$echarts.init(
        this.$refs.sellerRef,
        this.getTheme
      )
      // 对图表初始化配置的控制
      const initOption = {
        title: {
          text: '▎商家销售统计',
          left: 20,
          top: 20
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '3%',
          containLabel: true // 距离是包含坐标轴上的文字
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            label: {
              show: true,
              position: 'right',
              textStyle: {
                color: 'white'
              }
            },
            itemStyle: {
              // 指明颜色渐变的方向
              // 指明不同百分比之下的颜色值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                // 百分之0状态下的颜色值
                {
                  offset: 0,
                  color: '#5052EE'
                },
                // 百分之百状态下的颜色值
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      this.chartInstance.setOption(initOption)
      this.chartInstance.on('mouseover', () => {
        clearInterval(this.timer)
      })
      this.chartInstance.on('mouseout', () => {
        this.startInterval()
      })
    },
    // 获取服务器数据
    // async getData () {
    getData (res) {
      // const res = await getSellerData()

      // this.allData = res.data
      this.allData = res

      // 排序
      this.allData.sort((a, b) => a.value - b.value)

      // 计算总页码
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1

      // 更新图表
      this.updateChart()

      // 开启定时器
      this.startInterval()
    },
    // 更新图表
    updateChart () {
      const start = (this.currentPage - 1) * this.pageSize
      const end = this.currentPage * this.pageSize
      const showData = this.allData.slice(start, end)

      const sellerNames = showData.map(item => item.name)
      const sellerValues = showData.map(item => item.value)

      const dataOption = {
        yAxis: {
          data: sellerNames
        },
        series: [
          {
            data: sellerValues
          }
        ]
      }

      this.chartInstance.setOption(dataOption)
    },
    // 开启定时器
    startInterval () {
      if (this.timer) {
        clearInterval(this.timer)
      }

      this.timer = setInterval(() => {
        this.currentPage++
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1
        }

        this.updateChart()
      }, 3000)
    },
    // 当浏览器的大小发生变化的时候，会调用的方法，来完成屏幕的适配
    screenAdapter () {
      const titleFontSize = (this.$refs.sellerRef.offsetWidth / 100) * 3.6
      // 和分辨率大小相关的配置项
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: titleFontSize
            }
          }
        },
        series: [
          {
            barWidth: titleFontSize,
            itemStyle: {
              barBorderRadius: [0, titleFontSize / 2, titleFontSize / 2, 0]
            }
          }
        ]
      }

      this.chartInstance.setOption(adapterOption)
      // 手动的调用图表对象的resize，才能产生效果
      this.chartInstance.resize()
    }
  }
}
</script>
