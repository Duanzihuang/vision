import request from '@/utils/request'

export const getSellerData = () => {
  return request({
    url: '/seller'
  })
}
