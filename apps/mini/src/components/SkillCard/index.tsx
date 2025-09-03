import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface SkillCardProps {
  id: string
  title: string
  price: number
  city: string
  tags: string[]
  coverImage: string
  role: string
}

export default function SkillCard(props: SkillCardProps) {
  const goDetail = () => {
    Taro.navigateTo({ url: `/pages/skills/detail?id=${props.id}` })
  }
  return (
    <View className="skill-card" onClick={goDetail}>
      <Image className="cover" src={props.coverImage} mode="aspectFill" />
      
      <View className="content">
        <Text className="title">{props.title}</Text>
        
        <View className="meta">
          <Text className="price">¥{props.price}</Text>
          <Text className="city">{props.city}</Text>
        </View>
        
        <View className="tags">
          <Text className="tag">{props.role}</Text>
          {props.tags.map((tag, index) => (
            <Text key={index} className="tag">{tag}</Text>
          ))}
        </View>
      </View>
    </View>
  )
}
