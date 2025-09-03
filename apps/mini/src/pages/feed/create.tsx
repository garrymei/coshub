import { View, Text, Textarea, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { feedApi } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  uploadImages,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./create.scss";

const FeedCreatePage: React.FC = () => {
  const [caption, setCaption] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  // 检查登录状态
  React.useEffect(() => {
    if (!checkLogin()) {
      showToast("请先登录");
      goToLogin();
    }
  }, []);

  const handleAddImages = async () => {
    try {
      const maxImages = 9 - images.length;
      if (maxImages <= 0) {
        showToast("最多上传9张图片");
        return;
      }

      const newImages = await uploadImages(maxImages);
      setImages([...images, ...newImages]);
    } catch (error) {
      console.error("上传图片失败:", error);
      showToast("上传图片失败", "error");
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const handleAddTag = () => {
    if (!tagInput.trim()) {
      return;
    }

    if (tags.includes(tagInput.trim())) {
      showToast("标签已存在");
      return;
    }

    if (tags.length >= 5) {
      showToast("最多添加5个标签");
      return;
    }

    setTags([...tags, tagInput.trim()]);
    setTagInput("");
  };

  const handleRemoveTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    setTags(newTags);
  };

  const handleSubmit = async () => {
    if (!caption.trim()) {
      showToast("请输入分享内容");
      return;
    }

    if (images.length === 0) {
      showToast("请上传至少一张图片");
      return;
    }

    try {
      showLoading("发布中...");

      await feedApi.createPost({
        caption,
        media: images,
        tags,
        type: "share",
      });

      hideLoading();
      showToast("发布成功", "success");

      // 返回分享列表页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("发布分享失败:", error);
      hideLoading();
      showToast("发布失败", "error");
    }
  };

  return (
    <View className="feed-create-page">
      <View className="form-section">
        <Textarea
          className="caption-textarea"
          placeholder="分享你的Cos日常..."
          maxlength={500}
          value={caption}
          onInput={(e) => setCaption(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="section-title">上传图片</Text>
        <View className="images-container">
          {images.map((image, index) => (
            <View key={index} className="image-item">
              <Image className="preview-image" src={image} mode="aspectFill" />
              <View
                className="remove-icon"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </View>
            </View>
          ))}

          {images.length < 9 && (
            <View className="add-image" onClick={handleAddImages}>
              <Text className="add-icon">+</Text>
              <Text className="add-text">添加图片</Text>
            </View>
          )}
        </View>
      </View>

      <View className="form-section">
        <Text className="section-title">添加标签</Text>
        <View className="tag-input-container">
          <Textarea
            className="tag-input"
            placeholder="输入标签，回车添加"
            value={tagInput}
            onInput={(e) => setTagInput(e.detail.value)}
            onConfirm={handleAddTag}
          />
          <Button className="add-tag-button" onClick={handleAddTag}>
            添加
          </Button>
        </View>

        <View className="tags-container">
          {tags.map((tag, index) => (
            <View key={index} className="tag-item">
              <Text className="tag-text">#{tag}</Text>
              <Text
                className="remove-tag"
                onClick={() => handleRemoveTag(index)}
              >
                ×
              </Text>
            </View>
          ))}
        </View>
      </View>

      <Button className="submit-button" onClick={handleSubmit}>
        发布分享
      </Button>
    </View>
  );
};

export default FeedCreatePage;
