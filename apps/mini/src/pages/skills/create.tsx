import { View, Text, Input, Textarea, Image, Button } from "@tarojs/components";
import Taro from "@tarojs/taro";
import React, { useState } from "react";
import { api } from "../../services/api";
import {
  showToast,
  showLoading,
  hideLoading,
  uploadImages,
  checkLogin,
  goToLogin,
} from "../../utils/common";
import "./create.scss";

const SkillCreatePage: React.FC = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const tags = [
    "摄影",
    "妆娘",
    "毛娘",
    "道具师",
    "后期",
    "修图",
    "场地",
    "服装",
  ];

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

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showToast("请输入技能标题");
      return;
    }

    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      showToast("请输入有效的价格");
      return;
    }

    if (!description.trim()) {
      showToast("请输入服务描述");
      return;
    }

    if (images.length === 0) {
      showToast("请上传至少一张图片");
      return;
    }

    if (selectedTags.length === 0) {
      showToast("请选择至少一个技能标签");
      return;
    }

    try {
      showLoading("发布中...");

      await api.skills.create({
        caption: title,
        price: Number(price),
        serviceDescription: description,
        contactInfo,
        media: images,
        skillTags: selectedTags,
        type: "skill",
      });

      hideLoading();
      showToast("发布成功", "success");

      // 返回技能列表页
      setTimeout(() => {
        Taro.navigateBack();
      }, 1500);
    } catch (error) {
      console.error("发布技能失败:", error);
      hideLoading();
      showToast("发布失败", "error");
    }
  };

  return (
    <View className="skill-create-page">
      <View className="form-section">
        <Text className="section-title">技能标题</Text>
        <Input
          className="input-field"
          placeholder="请输入技能标题（30字以内）"
          maxlength={30}
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="section-title">价格设置</Text>
        <View className="price-input">
          <Text className="price-symbol">¥</Text>
          <Input
            className="input-field"
            type="digit"
            placeholder="请输入价格"
            value={price}
            onInput={(e) => setPrice(e.detail.value)}
          />
        </View>
      </View>

      <View className="form-section">
        <Text className="section-title">技能标签</Text>
        <View className="tags-container">
          {tags.map((tag) => (
            <View
              key={tag}
              className={`tag-item ${selectedTags.includes(tag) ? "active" : ""}`}
              onClick={() => handleTagSelect(tag)}
            >
              {tag}
            </View>
          ))}
        </View>
      </View>

      <View className="form-section">
        <Text className="section-title">服务描述</Text>
        <Textarea
          className="textarea-field"
          placeholder="请详细描述你的服务内容、经验等信息"
          maxlength={500}
          value={description}
          onInput={(e) => setDescription(e.detail.value)}
        />
      </View>

      <View className="form-section">
        <Text className="section-title">联系方式</Text>
        <Input
          className="input-field"
          placeholder="请输入联系方式（微信号、QQ等）"
          value={contactInfo}
          onInput={(e) => setContactInfo(e.detail.value)}
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

      <Button className="submit-button" onClick={handleSubmit}>
        发布技能
      </Button>
    </View>
  );
};

export default SkillCreatePage;
