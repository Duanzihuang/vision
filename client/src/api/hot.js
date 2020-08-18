import request from '@/utils/request'

// 获取热销商品占比数据
export const getHotData = () => {
  return request({
    url: '/hotproduct'
  })
}
