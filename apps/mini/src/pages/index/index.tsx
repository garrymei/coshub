import { Component } from 'react'
import { View, Text, Navigator } from '@tarojs/components'
import { UserLevel, SkillCategory, PostType } from '@coshub/types'
import './index.scss'

// 模拟用户数据
const mockUser = {
  id: '1',
  username: 'mini_user',
  level: UserLevel.VIP,
  isActive: true
}

// 功能模块映射
const featureModules = [
  { 
    category: SkillCategory.COSPLAY, 
    emoji: '🎨', 
    title: 'Cosplay', 
    desc: '精彩作品分享',
    postType: PostType.SHOWCASE
  },
  { 
    category: SkillCategory.PHOTOGRAPHY, 
    emoji: '📷', 
    title: '摄影', 
    desc: '专业拍摄技巧',
    postType: PostType.TUTORIAL
  },
  { 
    category: SkillCategory.MAKEUP, 
    emoji: '💄', 
    title: '化妆', 
    desc: '妆容教程分享',
    postType: PostType.TUTORIAL
  },
  { 
    category: SkillCategory.PROP_MAKING, 
    emoji: '🔨', 
    title: '道具', 
    desc: '道具制作心得',
    postType: PostType.DISCUSSION
  }
]

export default class Index extends Component {

  componentWillMount () { }

  componentDidMount () { 
    console.log('🎌 Coshub Mini 首页加载完成')
    console.log('👤 模拟用户:', mockUser)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='container'>
        <Text className='title'>Coshub Mini</Text>
        <Text className='subtitle'>🎌 二次元交流小程序</Text>
        
        {/* 用户信息展示 */}
        <View className='user-info'>
          <Text className='user-text'>
            👤 {mockUser.username} ({mockUser.level})
          </Text>
        </View>
        
        <View className='feature-grid'>
          {featureModules.map((feature, index) => (
            <Navigator 
              key={index} 
              url={index === 0 ? '/pages/skill-posts/index' : `/pages/feature${index}/index`}
            >
              <View className='feature-item'>
                <View className='feature-emoji'>{feature.emoji}</View>
                <Text className='feature-title'>{feature.title}</Text>
                <Text className='feature-desc'>{feature.desc}</Text>
                <Text className='feature-category'>{feature.category}</Text>
              </View>
            </Navigator>
          ))}
        </View>

        <View className='info-box'>
          <Text className='info-title'>📱 小程序版本</Text>
          <Text className='info-text'>v0.1.0 开发中</Text>
          <Text className='info-text'>📦 使用共享类型: @coshub/types</Text>
          <Text className='info-text'>构建产物将输出到 dist 目录</Text>
        </View>
      </View>
    )
  }
}
