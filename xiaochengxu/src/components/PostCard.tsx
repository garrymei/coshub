import { Heart } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface PostCardProps {
  id: string;
  image: string;
  title: string;
  avatar: string;
  username: string;
  likes: number;
  views: string;
  isLiked?: boolean;
  onLike?: (id: string) => void;
}

export function PostCard({ 
  id, 
  image, 
  title, 
  avatar, 
  username, 
  likes, 
  views, 
  isLiked = false,
  onLike 
}: PostCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm">
      <div className="relative">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full aspect-[3/4] object-cover"
        />
        <button
          onClick={() => onLike?.(id)}
          className="absolute top-3 right-3 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`}
          />
        </button>
      </div>
      
      <div className="p-3">
        <p className="text-sm mb-2 line-clamp-1">{title}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageWithFallback
              src={avatar}
              alt={username}
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-xs text-gray-600">{username}</span>
          </div>
          
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Heart className="w-3 h-3" />
              <span>{likes}</span>
            </div>
            <span>{views}</span>
          </div>
        </div>
      </div>
    </div>
  );
}