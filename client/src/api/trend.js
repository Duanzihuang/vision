import request from '@/utils/request'

export const getTrendData = () => {
  return request({
    url: '/trend'
  })
}
