<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ '▎' + showTitle }}</span>
      <span
        class="iconfont title-icon"
        :style="comStyle"
        @click="showChoice = !showChoice"
        >&#xe6eb;</span
      >
      <div class="select-con" v-show="showChoice">
        <div
          v-for="item in selectTypes"
          :key="item.key"
          :style="marginStyle"
          @click="toggleSelect(item.key)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>
  </div>
</template>

<script>
// import { getTrendData } from '@/api/trend'
import { getTheme } from '@/utils/theme_utils'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      allData: null, // 图表所需数据
      echartInstance: null, // echarts实例
      choiceType: 'map', // 选择的类型
      showChoice: false, // 是否显示可选项
      titleFontSize: 10 // 标题的字体大小
    }
  },
  created () {
    this.$socket.registerCallBack('trendData', this.getData)
  },
  mounted () {
    this.initChart()
    // this.getData()
    this.$socket.send({
      action: 'getData',
      chartName: 'trend',
      socketType: 'trendData',
      value: ''
    })
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
    this.$socket.unRegisterCallBack('trendData')
  },
  computed: {
    ...mapGetters(['getTheme']),
    selectTypes () {
      if (!this.allData) {
        return []
      } else {
        return this.allData.type.filter(item => item.key !== this.choiceType)
      }
    },
    showTitle () {
      if (!this.allData) {
        return ''
      } else {
        return this.allData[this.choiceType].title
      }
    },
    // 设置给标题的样式
    comStyle () {
      return {
        fontSize: this.titleFontSize + 'px',
        color: getTheme(this.getTheme).titleColor
      }
    },
    marginStyle () {
      return {
        marginLeft: this.titleFontSize / 2 + 'px'
      }
    }
  },
  watch: {
    getTheme () {
      this.echartInstance.dispose() // 销毁之前的echarts实例
      this.initChart() // 重新创建echarts实例
      this.screenAdapter() // 重新进行屏幕适配
      this.updateChart() // 重新绘制图表
    }
  },
  methods: {
    // 初始化Chart
    initChart () {
      this.echartInstance = this.$echarts.init(
        this.$refs.trendRef,
        this.getTheme
      )
      const initOption = {
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        grid: {
          top: '25%',
          left: '3%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis'
        }
      }
      this.echartInstance.setOption(initOption)
    },
    // 切换类型选择
    toggleSelect (type) {
      this.choiceType = type
      this.showChoice = false
      this.updateChart()
    },
    // async getData () {
    getData (res) {
      // const res = await getTrendData()
      // this.allData = res.data
      this.allData = res

      this.updateChart()
    },
    // 更新Chart
    updateChart () {
      // 半透明的颜色值
      const colorArr1 = [
        'rgba(11, 168, 44, 0.5)',
        'rgba(44, 110, 255, 0.5)',
        'rgba(22, 242, 217, 0.5)',
        'rgba(254, 33, 30, 0.5)',
        'rgba(250, 105, 0, 0.5)'
      ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
      const categoryData = this.allData.common.month
      const legendData = this.allData[this.choiceType].data.map(
        item => item.name
      )
      const dataOption = {
        xAxis: {
          data: categoryData // 类目轴数据
        },
        legend: {
          data: legendData
        },
        series: this.allData[this.choiceType].data.map((item, index) => {
          return {
            type: 'line',
            name: item.name,
            data: item.data,
            stack: this.choiceType,
            areaStyle: {},
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: colorArr1[index] // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colorArr2[index] // 100% 处的颜色
                  }
                ]
              }
            }
          }
        })
      }
      this.echartInstance.setOption(dataOption)
    },
    // 屏幕适配
    screenAdapter () {
      this.titleFontSize = (this.$refs.trendRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        legend: {
          itemWidth: this.titleFontSize,
          itemHeight: this.titleFontSize,
          itemGap: this.titleFontSize,
          textStyle: {
            fontSize: this.titleFontSize / 2
          }
        }
      }

      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-con {
    background-color: '#2227333';
  }
}
</style>
