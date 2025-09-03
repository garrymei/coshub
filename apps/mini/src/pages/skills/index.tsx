import { useState, useEffect } from 'react'
import { View, ScrollView, Picker } from '@tarojs/components'
import SkillCard from '@/components/SkillCard'
import Banner from '@/components/Banner'
import { skillApi } from '@/services/api'
import './index.scss'

interface SkillPost {
  id: string
  title: string
  price: number
  city: string
  tags: string[]
  coverImage: string
  role: string
}

export default function SkillsPage() {
  const [posts, setPosts] = useState<SkillPost[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState<number>(1)
  const PAGE_SIZE = 10
  const [filters, setFilters] = useState({
    city: '',
    role: '',
    priceMin: '',
    priceMax: ''
  })

  // 获取技能帖数据
  const fetchPosts = async (refresh = false) => {
    if (loading) return
    
    setLoading(true)
    try {
      const currentPage = refresh ? 1 : page
      const res: any = await skillApi.getSkills({
        page: currentPage,
        limit: PAGE_SIZE,
        city: filters.city || undefined,
        role: filters.role || undefined,
      })
      const list = Array.isArray(res?.data) ? res.data : (res?.data?.items || [])
      const more = list.length === PAGE_SIZE || (res?.data?.meta?.hasNext ?? false)
      setPosts(prev => (refresh ? list : [...prev, ...list]))
      setHasMore(more)
      setPage(currentPage + 1)
    } finally {
      setLoading(false)
    }
  }

  // 初始化加载
  useEffect(() => {
    fetchPosts(true)
  }, [])

  // 筛选条件变化时重新加载
  useEffect(() => {
    fetchPosts(true)
  }, [filters])

  // 下拉刷新
  const onRefresh = async () => {
    await fetchPosts(true)
  }

  // 上拉加载更多
  const onScrollToLower = async () => {
    if (hasMore && !loading) {
      await fetchPosts()
    }
  }

  return (
    <ScrollView
      className="skills-page"
      scrollY
      refresherEnabled
      onRefresherRefresh={onRefresh}
      onScrollToLower={onScrollToLower}
    >
      <Banner scene="skills" />
      
      <View className="filters">
        <Picker
          mode="selector"
          range={['北京', '上海', '广州', '深圳', '杭州', '成都']}
          onChange={(e) => setFilters({...filters, city: e.detail.value as string})}
        >
          <View className="filter">
            {filters.city || '城市'}
          </View>
        </Picker>
        
        <Picker
          mode="selector"
          range={['设计师', '程序员', '摄影师', '教师', '其他']}
          onChange={(e) => setFilters({...filters, role: e.detail.value as string})}
        >
          <View className="filter">
            {filters.role || '角色'}
          </View>
        </Picker>
        
        <Picker
          mode="selector"
          range={['0-100', '100-300', '300-500', '500-1000', '1000+']}
          onChange={(e) => {
            const [min, max] = (e.detail.value as string).split('-')
            setFilters({
              ...filters,
              priceMin: min,
              priceMax: max === '+' ? '1000' : max
            })
          }}
        >
          <View className="filter">
            {filters.priceMin ? `${filters.priceMin}-${filters.priceMax}` : '价格'}
          </View>
        </Picker>
      </View>
      
      {posts.map(post => (
        <SkillCard key={post.id} {...post} />
      ))}
      
      {loading && <View className="loading">加载中...</View>}
      {!hasMore && <View className="no-more">没有更多内容了</View>}
    </ScrollView>
  )
}
