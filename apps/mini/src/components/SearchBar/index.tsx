import { useState } from "react";
import { View, Input } from "@tarojs/components";
import "./index.scss";

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
  onInput?: (value: string) => void;
  className?: string;
}

export default function SearchBar({
  placeholder = "搜索...",
  value = "",
  onSearch,
  onInput,
  className = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);

  const handleInput = (e: any) => {
    const newValue = e.detail.value;
    setInputValue(newValue);
    if (onInput) {
      onInput(newValue);
    }
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  const handleClear = () => {
    setInputValue("");
    if (onInput) {
      onInput("");
    }
  };

  return (
    <View className={`search-bar ${className}`}>
      <View className="search-container">
        <View className="search-icon">🔍</View>
        <Input
          className="search-input"
          placeholder={placeholder}
          value={inputValue}
          onInput={handleInput}
          onConfirm={handleSearch}
          confirmType="search"
        />
        {inputValue && (
          <View className="clear-icon" onClick={handleClear}>
            ✕
          </View>
        )}
      </View>
    </View>
  );
}
