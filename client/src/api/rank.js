import request from '@/utils/request'

export const getRankData = () => {
  return request({
    url: '/rank'
  })
}
