<template>
  <div class="com-container" @dblclick="resetMap">
    <div class="com-chart" ref="mapRef"></div>
  </div>
</template>

<script>
import { getChinaMapData, getMapData, getProvinceMapData } from '@/api/map'
import { getProvinceMapInfo } from '@/utils/map_utils'
export default {
  data () {
    return {
      echartInstance: null,
      mapData: {} // 所获取的省份的地图矢量数据
    }
  },
  mounted () {
    this.initChart()
    this.getData()
    window.addEventListener('resize', this.screenAdapter)
    this.screenAdapter()
  },
  destroyed () {
    window.removeEventListener('resize', this.screenAdapter)
  },
  methods: {
    async initChart () {
      this.echartInstance = this.$echarts.init(this.$refs.mapRef, 'chalk')
      this.echartInstance.on('click', async arg => {
        const provinceMapInfo = getProvinceMapInfo(arg.name)
        try {
          if (!this.mapData[provinceMapInfo.key]) {
            const res = await getProvinceMapData(provinceMapInfo.path)
            this.$echarts.registerMap(provinceMapInfo.key, res.data)
            this.mapData[provinceMapInfo.key] = res.data
          }
          const changeOption = {
            geo: {
              map: provinceMapInfo.key
            }
          }
          this.echartInstance.setOption(changeOption)
        } catch (err) {
          console.log(err)
        }
      })
      const res = await getChinaMapData()
      this.$echarts.registerMap('china', res.data)
      const initOption = {
        title: {
          text: '▎商家分布',
          left: 20,
          top: 20
        },
        legend: {
          left: '5%',
          bottom: '5%',
          orient: 'vertical'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E72BF',
            borderColor: '#333'
          }
        }
      }
      this.echartInstance.setOption(initOption)
    },
    async getData () {
      const res = await getMapData()
      const legendData = res.data.map(item => item.name)
      const seriesArr = res.data.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          data: item.children,
          coordinateSystem: 'geo',
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          }
        }
      })
      const dataOption = {
        legend: {
          data: legendData
        },
        series: seriesArr
      }
      this.echartInstance.setOption(dataOption)
    },
    screenAdapter () {
      const titleFontSize = (this.$refs.mapRef.offsetWidth / 100) * 3.6
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFontSize
          }
        },
        legend: {
          itemWidth: titleFontSize / 2,
          itemHeight: titleFontSize / 2,
          itemGap: titleFontSize / 2,
          textStyle: {
            fontSize: titleFontSize / 2
          }
        }
      }

      this.echartInstance.setOption(adapterOption)
      this.echartInstance.resize()
    },
    resetMap () {
      const changeOption = {
        geo: {
          map: 'china'
        }
      }
      this.echartInstance.setOption(changeOption)
    }
  }
}
</script>
