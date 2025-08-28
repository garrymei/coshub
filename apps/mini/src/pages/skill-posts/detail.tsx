import { Component } from 'react'
import { View, Text, Image, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { skillPostApi, formatPrice, showToast } from '../../utils/api'
import { SKILL_CATEGORIES, SKILL_ROLES, EXPERIENCE_LEVELS, CONTACT_METHODS, getLabel } from '../../utils/constants'
import type { SkillPost } from '@coshub/types'
import './detail.scss'

interface State {
  skillPost: SkillPost | null
  loading: boolean
  currentImageIndex: number
}

export default class SkillPostDetail extends Component<{}, State> {

  constructor(props) {
    super(props)
    this.state = {
      skillPost: null,
      loading: true,
      currentImageIndex: 0
    }
  }

  componentDidMount() {
    const router = Taro.getCurrentInstance().router
    const id = router?.params?.id
    
    if (id) {
      this.fetchSkillPost(id)
    } else {
      showToast('参数错误', 'error')
      Taro.navigateBack()
    }
  }

  // 获取技能帖详情
  fetchSkillPost = async (id: string) => {
    try {
      this.setState({ loading: true })
      
      const response = await skillPostApi.getDetail(id)
      
      if (response.success && response.data) {
        this.setState({
          skillPost: response.data,
          loading: false
        })
      } else {
        showToast('技能帖不存在', 'error')
        setTimeout(() => {
          Taro.navigateBack()
        }, 2000)
      }
    } catch (error) {
      console.error('获取技能帖详情失败:', error)
      showToast('获取详情失败', 'error')
      this.setState({ loading: false })
    }
  }

  // 切换图片
  handleImageTap = (index: number) => {
    this.setState({ currentImageIndex: index })
  }

  // 预览图片
  handleImagePreview = () => {
    const { skillPost, currentImageIndex } = this.state
    if (skillPost && skillPost.images.length > 0) {
      Taro.previewImage({
        current: skillPost.images[currentImageIndex],
        urls: skillPost.images
      })
    }
  }

  // 联系用户
  handleContact = () => {
    const { skillPost } = this.state
    if (!skillPost) return

    const { contactInfo } = skillPost
    let contactText = '联系方式：\n'
    
    if (contactInfo.wechat) {
      contactText += `微信：${contactInfo.wechat}\n`
    }
    if (contactInfo.qq) {
      contactText += `QQ：${contactInfo.qq}\n`
    }
    if (contactInfo.phone) {
      contactText += `电话：${contactInfo.phone}\n`
    }
    if (contactInfo.email) {
      contactText += `邮箱：${contactInfo.email}\n`
    }

    contactText += `\n推荐联系方式：${getLabel(contactInfo.preferred, CONTACT_METHODS)}`

    Taro.showModal({
      title: '联系信息',
      content: contactText,
      showCancel: false,
      confirmText: '知道了'
    })
  }

  // 收藏功能
  handleFavorite = () => {
    showToast('收藏功能开发中', 'none')
  }

  // 分享功能
  handleShare = () => {
    showToast('已复制链接', 'success')
  }

  render() {
    const { skillPost, loading, currentImageIndex } = this.state

    if (loading) {
      return (
        <View className='loading-page'>
          <Text>加载中...</Text>
        </View>
      )
    }

    if (!skillPost) {
      return (
        <View className='error-page'>
          <Text>技能帖不存在</Text>
        </View>
      )
    }

    return (
      <View className='skill-post-detail'>
        {/* 图片展示 */}
        <View className='image-section'>
          <View className='main-image' onClick={this.handleImagePreview}>
            {skillPost.images.length > 0 ? (
              <Image 
                src={skillPost.images[currentImageIndex]}
                mode='aspectFill'
                className='image'
              />
            ) : (
              <View className='image-placeholder'>
                <Text>暂无图片</Text>
              </View>
            )}
          </View>
          
          {/* 图片缩略图 */}
          {skillPost.images.length > 1 && (
            <View className='thumbnail-list'>
              {skillPost.images.map((image, index) => (
                <View 
                  key={index}
                  className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                  onClick={() => this.handleImageTap(index)}
                >
                  <Image src={image} mode='aspectFill' className='thumb-image' />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 基本信息 */}
        <View className='info-section'>
          <Text className='title'>{skillPost.title}</Text>
          
          {/* 标签 */}
          <View className='tags'>
            <Text className='tag category'>
              {getLabel(skillPost.category, SKILL_CATEGORIES)}
            </Text>
            <Text className='tag role'>
              {getLabel(skillPost.role, SKILL_ROLES)}
            </Text>
            <Text className='tag experience'>
              {getLabel(skillPost.experience, EXPERIENCE_LEVELS)}
            </Text>
            {skillPost.tags.map(tag => (
              <Text key={tag} className='tag normal'>{tag}</Text>
            ))}
          </View>

          {/* 价格和城市 */}
          <View className='price-info'>
            <Text className='price'>{formatPrice(skillPost)}</Text>
            <Text className='city'>📍 {skillPost.city}</Text>
          </View>
        </View>

        {/* 详细描述 */}
        <View className='description-section'>
          <Text className='section-title'>服务描述</Text>
          <Text className='description'>{skillPost.description}</Text>
        </View>

        {/* 可用时间 */}
        <View className='availability-section'>
          <Text className='section-title'>可用时间</Text>
          <View className='availability-info'>
            <View className='time-slots'>
              <Text className='label'>可接单时间：</Text>
              <View className='slots'>
                {skillPost.availability.weekdays && (
                  <Text className='slot'>工作日</Text>
                )}
                {skillPost.availability.weekends && (
                  <Text className='slot'>周末</Text>
                )}
                {skillPost.availability.holidays && (
                  <Text className='slot'>节假日</Text>
                )}
              </View>
            </View>
            <View className='time-range'>
              <Text className='label'>时间段：</Text>
              <Text className='range'>
                {skillPost.availability.timeSlots.map(slot => `${slot.start}-${slot.end}`).join(', ')}
              </Text>
            </View>
            <Text className='advance'>需提前 {skillPost.availability.advance} 天预约</Text>
          </View>
        </View>

        {/* 用户信息 */}
        <View className='author-section'>
          <View className='author-info'>
            <Image 
              src={skillPost.authorAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${skillPost.authorName}`}
              className='author-avatar'
            />
            <View className='author-details'>
              <Text className='author-name'>{skillPost.authorName}</Text>
              <Text className='publish-date'>
                发布于 {new Date(skillPost.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          {/* 统计信息 */}
          <View className='stats'>
            <View className='stat-item'>
              <Text className='stat-value'>{skillPost.stats.viewCount}</Text>
              <Text className='stat-label'>浏览</Text>
            </View>
            <View className='stat-item'>
              <Text className='stat-value'>{skillPost.stats.avgRating.toFixed(1)}</Text>
              <Text className='stat-label'>评分</Text>
            </View>
            <View className='stat-item'>
              <Text className='stat-value'>{skillPost.stats.responseRate}%</Text>
              <Text className='stat-label'>响应率</Text>
            </View>
          </View>
        </View>

        {/* 底部操作栏 */}
        <View className='bottom-actions'>
          <Button 
            className='action-btn secondary'
            onClick={this.handleFavorite}
          >
            收藏
          </Button>
          <Button 
            className='action-btn secondary'
            onClick={this.handleShare}
          >
            分享
          </Button>
          <Button 
            className='action-btn primary'
            onClick={this.handleContact}
          >
            立即联系
          </Button>
        </View>

        {/* 安全提示 */}
        <View className='safety-tips'>
          <Text className='tips-title'>💡 安全提示</Text>
          <Text className='tips-text'>• 建议先通过平台沟通</Text>
          <Text className='tips-text'>• 谨慎处理金钱交易</Text>
          <Text className='tips-text'>• 保留聊天和交易记录</Text>
          <Text className='tips-text'>• 如遇问题请及时举报</Text>
        </View>
      </View>
    )
  }
}
