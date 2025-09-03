"use client";

import { useState, useEffect } from "react";

interface CitySelectorProps {
  value?: string;
  onChange: (city: string) => void;
  placeholder?: string;
  className?: string;
}

// 热门城市列表
const popularCities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "南京",
  "成都",
  "武汉",
  "西安",
  "重庆",
  "天津",
  "苏州",
  "长沙",
  "青岛",
  "宁波",
  "无锡",
  "佛山",
  "东莞",
  "郑州",
  "济南",
];

export default function CitySelector({
  value,
  onChange,
  placeholder = "选择城市",
  className = "",
}: CitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCities(popularCities);
    } else {
      const filtered = popularCities.filter((city) =>
        city.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  const handleCitySelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputClick = () => {
    setIsOpen(true);
    setSearchTerm("");
  };

  const handleInputBlur = () => {
    // 延迟关闭，让用户有时间点击城市选项
    setTimeout(() => setIsOpen(false), 200);
  };

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value || ""}
        onChange={handleInputChange}
        onClick={handleInputClick}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2 border-b border-gray-200">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索城市..."
              className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              autoFocus
            />
          </div>

          <div className="py-1">
            {filteredCities.length > 0 ? (
              filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                >
                  {city}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-gray-500 text-sm">
                未找到匹配的城市
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
