import request from '@/utils/request'

export const getStockData = () => {
  return request({
    url: '/stock'
  })
}
