import { request } from '@/utils/api'

interface GetBannersParams {
  scene: 'feed' | 'skills'
}

interface GetBannersResponse {
  data: {
    id: string
    imageUrl: string
    linkType: string
    linkUrl: string
  }[]
}

export async function getBanners(params: GetBannersParams): Promise<GetBannersResponse> {
  return request({
    url: '/banners',
    method: 'GET',
    data: params
  })
}
