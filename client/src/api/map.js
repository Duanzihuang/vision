import request from '@/utils/request'

// 获取全国地图
export const getChinaMapData = () => {
  // 开发环境
  // return request({ url: 'http://localhost:8080/static/map/china.json' })
  // 生产环境
  return request({
    url: 'http://huangjiangjun.top/vision/static/map/china.json'
  })
}

// 获取闪烁点数据
export const getMapData = () => {
  return request({
    url: '/map'
  })
}

// 获取省份数据
export const getProvinceMapData = url => {
  // 开发环境
  // return request({ url: `http://localhost:8080/${url}` })
  // 生产环境
  return request({
    url: `http://huangjiangjun.top/vision/${url}`
  })
}
