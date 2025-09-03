import { useState } from "react";
import {
  View,
  Text,
  Input,
  Textarea,
  Image,
  Button,
  Switch,
  Picker,
} from "@tarojs/components";
import { getUploadConfig } from "@/services/upload";
import { feedApi, skillApi } from "@/services/api";
import "./index.scss";

// 帖子类型
const POST_TYPES = ["share", "skill"];
const POST_TYPE_LABELS = ["作品分享", "技能出售"];

// 技能角色选项
const ROLES = ["设计师", "程序员", "摄影师", "教师", "其他"];

// 城市选项
const CITIES = ["北京", "上海", "广州", "深圳", "杭州", "成都", "其他"];

export default function NewPostPage() {
  // 基础表单数据
  const [postType, setPostType] = useState<"share" | "skill">("share");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);

  // 技能帖特有数据
  const [price, setPrice] = useState("");
  const [city, setCity] = useState("");
  const [role, setRole] = useState("");

  // 上传状态
  const [uploading, setUploading] = useState(false);

  // 提交状态
  const [submitting, setSubmitting] = useState(false);

  // 切换帖子类型
  const handleTypeChange = (index: number) => {
    setPostType(POST_TYPES[index] as "share" | "skill");
  };

  // 添加标签
  const addTag = () => {
    if (tagInput && !tags.includes(tagInput) && tags.length < 5) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  };

  // 删除标签
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  // 上传图片
  const uploadImage = async () => {
    if (images.length >= 9) return;

    try {
      // 选择图片
      const res = await wx.chooseImage({
        count: 9 - images.length,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
      });

      setUploading(true);

      // 获取上传配置
      const config = await getUploadConfig();

      // 上传图片
      const uploadedImages = await Promise.all(
        res.tempFilePaths.map(async (path) => {
          const uploadRes = await wx.uploadFile({
            url: config.uploadUrl,
            filePath: path,
            name: "file",
            formData: config.formData,
          });

          const result = JSON.parse(uploadRes.data);
          return result.url;
        }),
      );

      setImages([...images, ...uploadedImages]);
    } catch (error) {
      wx.showToast({
        title: "上传失败",
        icon: "none",
      });
    } finally {
      setUploading(false);
    }
  };

  // 上传视频
  const uploadVideo = async () => {
    if (videos.length >= 1) return;

    try {
      // 选择视频
      const res = await wx.chooseVideo({
        sourceType: ["album", "camera"],
        maxDuration: 60,
      });

      setUploading(true);

      // 获取上传配置
      const config = await getUploadConfig();

      // 上传视频
      const uploadRes = await wx.uploadFile({
        url: config.uploadUrl,
        filePath: res.tempFilePath,
        name: "file",
        formData: config.formData,
      });

      const result = JSON.parse(uploadRes.data);
      setVideos([result.url]);
    } catch (error) {
      wx.showToast({
        title: "上传失败",
        icon: "none",
      });
    } finally {
      setUploading(false);
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    // 表单验证
    if (!title) {
      return wx.showToast({ title: "请输入标题", icon: "none" });
    }

    if (!content) {
      return wx.showToast({ title: "请输入内容", icon: "none" });
    }

    if (images.length === 0 && videos.length === 0) {
      return wx.showToast({ title: "请上传至少一张图片或视频", icon: "none" });
    }

    if (postType === "skill") {
      if (!price) {
        return wx.showToast({ title: "请输入价格", icon: "none" });
      }

      if (!city) {
        return wx.showToast({ title: "请选择城市", icon: "none" });
      }

      if (!role) {
        return wx.showToast({ title: "请选择角色", icon: "none" });
      }
    }

    try {
      setSubmitting(true);

      // 提交数据
      let result: any;
      if (postType === "share") {
        // 分享帖走 /posts，后端使用大写枚举
        result = await feedApi.createPost({
          title,
          content,
          type: "SHARE" as any,
          tags,
          images,
          videos,
        });
      } else {
        // 技能帖走 /skills
        result = await skillApi.createSkill({
          title,
          description: content,
          images,
          tags,
          city,
          role: role as any,
          price: {
            type: "fixed",
            amount: Number(price),
            currency: "CNY",
            negotiable: false,
          } as any,
          contactInfo: { preferred: "wechat" } as any,
          availability: {
            weekdays: true,
            weekends: true,
            holidays: false,
            timeSlots: [],
            advance: 1,
          },
        });
      }

      wx.showToast({
        title: "发布成功",
        icon: "success",
      });

      // 跳转到详情页
      setTimeout(() => {
        const newId = result?.data?.id || result?.id;
        wx.navigateTo({
          url: `/pages/${postType === "share" ? "feed" : "skills"}/detail?id=${newId}`,
        });
      }, 1500);
    } catch (error) {
      wx.showToast({
        title: "发布失败",
        icon: "none",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="new-post-page">
      <View className="type-selector">
        {POST_TYPE_LABELS.map((label, index) => (
          <Text
            key={index}
            className={`type-option ${postType === POST_TYPES[index] ? "active" : ""}`}
            onClick={() => handleTypeChange(index)}
          >
            {label}
          </Text>
        ))}
      </View>

      <View className="form-item">
        <Input
          className="title-input"
          placeholder="添加标题，会让更多人看到～"
          value={title}
          onInput={(e) => setTitle(e.detail.value)}
          maxlength={30}
        />
      </View>

      <View className="form-item">
        <Textarea
          className="content-textarea"
          placeholder="分享你的经验、感受或创作..."
          value={content}
          onInput={(e) => setContent(e.detail.value)}
          maxlength={2000}
        />
      </View>

      <View className="form-item">
        <View className="section-title">添加图片/视频</View>
        <View className="media-upload">
          {images.map((img, index) => (
            <View key={`img-${index}`} className="media-item">
              <Image className="media-preview" src={img} mode="aspectFill" />
              <Text
                className="delete-btn"
                onClick={() => setImages(images.filter((_, i) => i !== index))}
              >
                ×
              </Text>
            </View>
          ))}

          {videos.map((video, index) => (
            <View key={`video-${index}`} className="media-item video">
              <View className="video-icon">▶</View>
              <Text className="delete-btn" onClick={() => setVideos([])}>
                ×
              </Text>
            </View>
          ))}

          {images.length < 9 && videos.length === 0 && (
            <View className="upload-btn" onClick={uploadImage}>
              <Text className="plus">+</Text>
              <Text className="text">图片</Text>
            </View>
          )}

          {videos.length === 0 && (
            <View className="upload-btn" onClick={uploadVideo}>
              <Text className="plus">+</Text>
              <Text className="text">视频</Text>
            </View>
          )}
        </View>
      </View>

      <View className="form-item">
        <View className="section-title">添加标签 (最多5个)</View>
        <View className="tags-container">
          {tags.map((tag, index) => (
            <View key={index} className="tag">
              #{tag}
              <Text className="delete-tag" onClick={() => removeTag(index)}>
                ×
              </Text>
            </View>
          ))}
        </View>

        {tags.length < 5 && (
          <View className="tag-input-container">
            <Input
              className="tag-input"
              placeholder="添加标签"
              value={tagInput}
              onInput={(e) => setTagInput(e.detail.value)}
              maxlength={10}
            />
            <Text className="add-tag-btn" onClick={addTag}>
              添加
            </Text>
          </View>
        )}
      </View>

      {postType === "skill" && (
        <>
          <View className="form-item">
            <View className="section-title">价格 (元)</View>
            <Input
              className="price-input"
              type="digit"
              placeholder="请输入价格"
              value={price}
              onInput={(e) => setPrice(e.detail.value)}
            />
          </View>

          <View className="form-item">
            <View className="section-title">城市</View>
            <Picker
              mode="selector"
              range={CITIES}
              onChange={(e) => setCity(CITIES[e.detail.value as number])}
            >
              <View className="picker">{city || "请选择城市"}</View>
            </Picker>
          </View>

          <View className="form-item">
            <View className="section-title">角色</View>
            <Picker
              mode="selector"
              range={ROLES}
              onChange={(e) => setRole(ROLES[e.detail.value as number])}
            >
              <View className="picker">{role || "请选择角色"}</View>
            </Picker>
          </View>
        </>
      )}

      <Button
        className="submit-btn"
        loading={submitting}
        disabled={uploading || submitting}
        onClick={handleSubmit}
      >
        {uploading ? "上传中..." : "发布"}
      </Button>
    </View>
  );
}
