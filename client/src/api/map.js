import request from '@/utils/request'

// 获取全国地图
export const getChinaMapData = () => {
  return request({ url: 'http://localhost:8080/static/map/china.json' })
}

// 获取闪烁点数据
export const getMapData = () => {
  return request({
    url: '/map'
  })
}

// 获取省份数据
export const getProvinceMapData = url => {
  return request({ url: `http://localhost:8080/${url}` })
}
