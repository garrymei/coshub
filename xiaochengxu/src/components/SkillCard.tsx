import { Star, BookOpen, Clock, Users } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SkillCardProps {
  id: string;
  title: string;
  description: string;
  instructor: {
    name: string;
    avatar: string;
    rating: number;
  };
  category: string;
  difficulty: string;
  duration: string;
  students: number;
  price: number;
  thumbnail: string;
  tags: string[];
  onEnroll?: (id: string) => void;
}

export function SkillCard({ 
  id, 
  title, 
  description, 
  instructor, 
  category, 
  difficulty, 
  duration, 
  students, 
  price, 
  thumbnail, 
  tags,
  onEnroll 
}: SkillCardProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case '初级': return 'bg-green-100 text-green-600';
      case '中级': return 'bg-yellow-100 text-yellow-600';
      case '高级': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-4">
      {/* Thumbnail */}
      <div className="relative">
        <ImageWithFallback
          src={thumbnail}
          alt={title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-full">
            {category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(difficulty)}`}>
            {difficulty}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{title}</h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{description}</p>

        {/* Instructor */}
        <div className="flex items-center mb-3">
          <ImageWithFallback
            src={instructor.avatar}
            alt={instructor.name}
            className="w-6 h-6 rounded-full object-cover mr-2"
          />
          <span className="text-sm text-gray-700 mr-2">{instructor.name}</span>
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-xs text-gray-500">{instructor.rating}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            <span>{students}人学习</span>
          </div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 bg-purple-100 text-purple-600 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-center justify-between">
          <div>
            {price === 0 ? (
              <span className="text-green-600 font-semibold">免费</span>
            ) : (
              <div className="flex items-baseline">
                <span className="text-sm text-gray-500">¥</span>
                <span className="text-lg font-semibold text-gray-900">{price}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => onEnroll?.(id)}
            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-sm rounded-full transition-colors"
          >
            <BookOpen className="w-4 h-4 inline mr-1" />
            学习
          </button>
        </div>
      </div>
    </div>
  );
}