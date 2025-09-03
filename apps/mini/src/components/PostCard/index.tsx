import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface PostCardProps {
  id: string
  avatar: string
  nickname: string
  time: string
  content: string
  images?: string[]
  likeCount: number
  commentCount: number
  collectCount: number
  isLiked: boolean
  isCollected: boolean
}

export default function PostCard(props: PostCardProps) {
  const goDetail = () => {
    Taro.navigateTo({ url: `/pages/feed/detail?id=${props.id}` })
  }
  return (
    <View className="post-card" onClick={goDetail}>
      <View className="header">
        <Image className="avatar" src={props.avatar} />
        <View className="info">
          <Text className="nickname">{props.nickname}</Text>
          <Text className="time">{props.time}</Text>
        </View>
      </View>
      
      <Text className="content">{props.content}</Text>
      
      {props.images && props.images.length > 0 && (
        <View className="images">
          {props.images.map((img, index) => (
            <Image key={index} className="image" src={img} mode="aspectFill" />
          ))}
        </View>
      )}
      
      <View className="stats">
        <View className="stat">
          <Text className={`icon ${props.isLiked ? 'liked' : ''}`}>♥</Text>
          <Text>{props.likeCount}</Text>
        </View>
        <View className="stat">
          <Text className="icon">💬</Text>
          <Text>{props.commentCount}</Text>
        </View>
        <View className="stat">
          <Text className={`icon ${props.isCollected ? 'collected' : ''}`}>☆</Text>
          <Text>{props.collectCount}</Text>
        </View>
      </View>
    </View>
  )
}
