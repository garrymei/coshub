import { View, Image, Swiper, SwiperItem } from '@tarojs/components'
import { getBanners } from '@/services/banner'
import { useEffect, useState } from 'react'
import './index.scss'

interface BannerItem {
  id: string
  imageUrl: string
  linkType: string
  linkUrl: string
}

export default function Banner({ scene }: { scene: 'feed' | 'skills' }) {
  const [banners, setBanners] = useState<BannerItem[]>([])

  useEffect(() => {
    const fetchBanners = async () => {
      const res = await getBanners({ scene })
      setBanners(res.data)
    }
    fetchBanners()
  }, [scene])

  if (banners.length === 0) return null

  return (
    <View className="banner">
      <Swiper
        className="swiper"
        indicatorDots
        autoplay
        circular
        indicatorColor="#999"
        indicatorActiveColor="#FF6B9D"
      >
        {banners.map(banner => (
          <SwiperItem key={banner.id}>
            <Image
              className="image"
              src={banner.imageUrl}
              mode="aspectFill"
              onClick={() => {
                // 处理点击跳转
                if (banner.linkType === 'page') {
                  wx.navigateTo({ url: banner.linkUrl })
                } else if (banner.linkType === 'web') {
                  wx.navigateTo({ url: `/pages/webview/index?url=${encodeURIComponent(banner.linkUrl)}` })
                }
              }}
            />
          </SwiperItem>
        ))}
      </Swiper>
    </View>
  )
}