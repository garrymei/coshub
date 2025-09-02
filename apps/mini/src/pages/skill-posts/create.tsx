import { Component } from "react";
import {
  View,
  Text,
  Input,
  Textarea,
  Picker,
  Button,
  Switch,
} from "@tarojs/components";
import Taro from "@tarojs/taro";
import { skillsApi, showToast, hideLoading, showLoading } from "../../utils/api";
import {
  SKILL_CATEGORIES,
  SKILL_ROLES,
  EXPERIENCE_LEVELS,
  PRICE_TYPES,
  CONTACT_METHODS,
  POPULAR_CITIES,
} from "../../utils/constants";
import type {
  CreateSkillPostDTO,
} from "@coshub/types";
import {
  SkillCategory,
  SkillRole,
  ExperienceLevel,
  PriceType,
  ContactMethod,
} from "@coshub/types";
import "./create.scss";

interface State {
  formData: CreateSkillPostDTO & {
    imageUrls: string;
    tagText: string;
  };
  categoryIndex: number;
  roleIndex: number;
  experienceIndex: number;
  priceTypeIndex: number;
  contactMethodIndex: number;
  cityIndex: number;
}

export default class CreateSkillPost extends Component<{}, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      formData: {
        title: "",
        description: "",
        category: SkillCategory.COSPLAY,
        role: SkillRole.COSER,
        city: "",
        price: {
          type: PriceType.FIXED,
          amount: 0,
          currency: "CNY",
          negotiable: false,
        },
        images: [],
        imageUrls: "",
        tags: [],
        tagText: "",
        experience: ExperienceLevel.INTERMEDIATE,
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false,
          timeSlots: [{ start: "09:00", end: "18:00" }],
          advance: 3,
        },
        contactInfo: {
          wechat: "",
          qq: "",
          phone: "",
          email: "",
          preferred: ContactMethod.WECHAT,
        },
      },
      categoryIndex: 0,
      roleIndex: 0,
      experienceIndex: 2, // 默认中级
      priceTypeIndex: 1, // 默认固定价格
      contactMethodIndex: 0,
      cityIndex: 0,
    };
  }

  // 处理输入变化
  handleInputChange = (field: string, value: any) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [field]: value,
      },
    });
  };

  // 处理嵌套字段变化
  handleNestedInputChange = (
    parentField: string,
    field: string,
    value: any,
  ) => {
    this.setState({
      formData: {
        ...this.state.formData,
        [parentField]: {
          ...this.state.formData[parentField],
          [field]: value,
        },
      },
    });
  };

  // 处理分类选择
  handleCategoryChange = (e) => {
    const index = e.detail.value;
    this.setState({
      categoryIndex: index,
      formData: {
        ...this.state.formData,
        category: SKILL_CATEGORIES[index].value,
      },
    });
  };

  // 处理角色选择
  handleRoleChange = (e) => {
    const index = e.detail.value;
    this.setState({
      roleIndex: index,
      formData: {
        ...this.state.formData,
        role: SKILL_ROLES[index].value,
      },
    });
  };

  // 处理经验等级选择
  handleExperienceChange = (e) => {
    const index = e.detail.value;
    this.setState({
      experienceIndex: index,
      formData: {
        ...this.state.formData,
        experience: EXPERIENCE_LEVELS[index].value,
      },
    });
  };

  // 处理价格类型选择
  handlePriceTypeChange = (e) => {
    const index = e.detail.value;
    this.setState({
      priceTypeIndex: index,
      formData: {
        ...this.state.formData,
        price: {
          ...this.state.formData.price,
          type: PRICE_TYPES[index].value,
          // 重置与类型不相关/不需要的字段，避免校验失败
          amount:
            PRICE_TYPES[index].value === PriceType.FIXED
              ? this.state.formData.price.amount || 0
              : undefined,
          range:
            PRICE_TYPES[index].value === PriceType.RANGE
              ? this.state.formData.price.range || { min: 0, max: 0 }
              : undefined,
          negotiable:
            PRICE_TYPES[index].value === PriceType.NEGOTIABLE
              ? true
              : this.state.formData.price.negotiable ?? false,
        },
      },
    });
  };

  // 处理联系方式选择
  handleContactMethodChange = (e) => {
    const index = e.detail.value;
    this.setState({
      contactMethodIndex: index,
      formData: {
        ...this.state.formData,
        contactInfo: {
          ...this.state.formData.contactInfo,
          preferred: CONTACT_METHODS[index].value,
        },
      },
    });
  };

  // 处理城市选择
  handleCityChange = (e) => {
    const index = e.detail.value;
    if (index === 0) {
      // 手动输入
      return;
    }
    this.setState({
      cityIndex: index,
      formData: {
        ...this.state.formData,
        city: POPULAR_CITIES[index - 1],
      },
    });
  };

  // 处理图片URL变化
  handleImageUrlsChange = (e) => {
    const urls = e.detail.value;
    const images = urls
      .split("\n")
      .filter((url) => url.trim())
      .slice(0, 9);
    this.setState({
      formData: {
        ...this.state.formData,
        imageUrls: urls,
        images,
      },
    });
  };

  // 处理标签变化
  handleTagsChange = (e) => {
    const tagText = e.detail.value;
    const tags = tagText
      .split(/[,，\s]+/)
      .filter((tag) => tag.trim())
      .slice(0, 10);
    this.setState({
      formData: {
        ...this.state.formData,
        tagText,
        tags,
      },
    });
  };

  // 表单验证
  validateForm = (): string | null => {
    const { formData } = this.state;
    
    if (!formData.title?.trim()) {
      return "请输入标题";
    }
    
    if (!formData.description?.trim()) {
      return "请输入描述";
    }
    
    if (!formData.city?.trim()) {
      return "请输入城市";
    }
    
    if (formData.price.amount <= 0) {
      return "请输入有效的价格";
    }
    
    return null;
  };

  // 提交表单
  handleSubmit = async () => {
    const validationError = this.validateForm();
    if (validationError) {
      showToast(validationError, "none");
      return;
    }

    try {
      showLoading("发布中...");

      // 准备提交数据，移除临时字段
      const { imageUrls, tagText, ...submitData } = this.state.formData;

      const response = await skillsApi.create(submitData);

      if (response.success) {
        hideLoading();
        showToast("发布成功", "success");
        setTimeout(() => {
          Taro.navigateTo({
            url: `/pages/skill-posts/detail?id=${response.data.id}`,
          });
        }, 1500);
      } else {
        hideLoading();
        showToast(response.error?.message || "发布失败", "error");
      }
    } catch (error) {
      hideLoading();
      showToast("网络请求失败", "error");
      console.error("创建技能帖失败:", error);
    }
  };

  render() {
    const {
      formData,
      categoryIndex,
      roleIndex,
      experienceIndex,
      priceTypeIndex,
      contactMethodIndex,
      cityIndex,
    } = this.state;

    const categoryOptions = SKILL_CATEGORIES.map((cat) => cat.label);
    const roleOptions = SKILL_ROLES.map((role) => role.label);
    const experienceOptions = EXPERIENCE_LEVELS.map((level) => level.label);
    const priceTypeOptions = PRICE_TYPES.map((type) => type.label);
    const contactMethodOptions = CONTACT_METHODS.map((method) => method.label);
    const cityOptions = ["手动输入", ...POPULAR_CITIES];

    return (
      <View className="create-skill-post">
        <View className="form-section">
          <Text className="section-title">基本信息</Text>

          {/* 标题 */}
          <View className="form-item">
            <Text className="label">标题 *</Text>
            <Input
              className="input"
              placeholder="简明扼要地描述你的技能服务"
              value={formData.title}
              maxlength={100}
              onInput={(e) => this.handleInputChange("title", e.detail.value)}
            />
            <Text className="char-count">{formData.title.length}/100</Text>
          </View>

          {/* 分类和角色 */}
          <View className="form-row">
            <View className="form-item half">
              <Text className="label">技能分类 *</Text>
              <Picker
                mode="selector"
                range={categoryOptions}
                value={categoryIndex}
                onChange={this.handleCategoryChange}
              >
                <View className="picker-view">
                  <Text>{categoryOptions[categoryIndex]}</Text>
                </View>
              </Picker>
            </View>

            <View className="form-item half">
              <Text className="label">角色类型 *</Text>
              <Picker
                mode="selector"
                range={roleOptions}
                value={roleIndex}
                onChange={this.handleRoleChange}
              >
                <View className="picker-view">
                  <Text>{roleOptions[roleIndex]}</Text>
                </View>
              </Picker>
            </View>
          </View>

          {/* 城市和经验 */}
          <View className="form-row">
            <View className="form-item half">
              <Text className="label">所在城市 *</Text>
              <Picker
                mode="selector"
                range={cityOptions}
                value={cityIndex}
                onChange={this.handleCityChange}
              >
                <View className="picker-view">
                  <Text>
                    {cityIndex === 0 ? "选择城市" : cityOptions[cityIndex]}
                  </Text>
                </View>
              </Picker>
              {cityIndex === 0 && (
                <Input
                  className="input"
                  placeholder="请输入城市名称"
                  value={formData.city}
                  onInput={(e) =>
                    this.handleInputChange("city", e.detail.value)
                  }
                />
              )}
            </View>

            <View className="form-item half">
              <Text className="label">经验等级 *</Text>
              <Picker
                mode="selector"
                range={experienceOptions}
                value={experienceIndex}
                onChange={this.handleExperienceChange}
              >
                <View className="picker-view">
                  <Text>{experienceOptions[experienceIndex]}</Text>
                </View>
              </Picker>
            </View>
          </View>

          {/* 描述 */}
          <View className="form-item">
            <Text className="label">详细描述 *</Text>
            <Textarea
              className="textarea"
              placeholder="详细介绍你的技能、经验、提供的服务内容等"
              value={formData.description}
              maxlength={2000}
              onInput={(e) =>
                this.handleInputChange("description", e.detail.value)
              }
            />
            <Text className="char-count">
              {formData.description.length}/2000
            </Text>
          </View>

          {/* 图片 */}
          <View className="form-item">
            <Text className="label">作品图片 * (最多9张)</Text>
            <Textarea
              className="textarea"
              placeholder="请输入图片URL，每行一个"
              value={formData.imageUrls}
              onInput={this.handleImageUrlsChange}
            />
            <Text className="char-count">
              已添加 {formData.images.length} 张图片
            </Text>
          </View>

          {/* 标签 */}
          <View className="form-item">
            <Text className="label">标签 (用逗号分隔)</Text>
            <Input
              className="input"
              placeholder="二次元, 写真, 精修, 专业器材"
              value={formData.tagText}
              onInput={this.handleTagsChange}
            />
          </View>
        </View>

        {/* 价格设置 */}
        <View className="form-section">
          <Text className="section-title">价格设置</Text>

          <View className="form-item">
            <Text className="label">价格类型 *</Text>
            <Picker
              mode="selector"
              range={priceTypeOptions}
              value={priceTypeIndex}
              onChange={this.handlePriceTypeChange}
            >
              <View className="picker-view">
                <Text>{priceTypeOptions[priceTypeIndex]}</Text>
              </View>
            </Picker>
          </View>

          {formData.price.type === "fixed" && (
            <View className="form-item">
              <Text className="label">固定价格 (元) *</Text>
              <Input
                className="input"
                type="number"
                placeholder="请输入价格"
                value={String(formData.price.amount || "")}
                onInput={(e) =>
                  this.handleNestedInputChange(
                    "price",
                    "amount",
                    Number(e.detail.value || 0),
                  )
                }
              />
              <View style={{ marginTop: 8 }}>
                <Text className="label">是否可议价</Text>
                <Switch
                  checked={!!formData.price.negotiable}
                  onChange={(ev) =>
                    this.handleNestedInputChange(
                      "price",
                      "negotiable",
                      !!ev.detail.value,
                    )
                  }
                />
              </View>
            </View>
          )}

          {formData.price.type === "range" && (
            <View className="form-item">
              <Text className="label">价格区间 (元) *</Text>
              <View className="form-row">
                <View className="form-item half">
                  <Text className="label">最小值</Text>
                  <Input
                    className="input"
                    type="number"
                    placeholder="例如 100"
                    value={String(formData.price.range?.min ?? "")}
                    onInput={(e) =>
                      this.handleNestedInputChange("price", "range", {
                        min: Number(e.detail.value || 0),
                        max: formData.price.range?.max ?? 0,
                      })
                    }
                  />
                </View>
                <View className="form-item half">
                  <Text className="label">最大值</Text>
                  <Input
                    className="input"
                    type="number"
                    placeholder="例如 300"
                    value={String(formData.price.range?.max ?? "")}
                    onInput={(e) =>
                      this.handleNestedInputChange("price", "range", {
                        min: formData.price.range?.min ?? 0,
                        max: Number(e.detail.value || 0),
                      })
                    }
                  />
                </View>
              </View>
              <View style={{ marginTop: 8 }}>
                <Text className="label">是否可议价</Text>
                <Switch
                  checked={!!formData.price.negotiable}
                  onChange={(ev) =>
                    this.handleNestedInputChange(
                      "price",
                      "negotiable",
                      !!ev.detail.value,
                    )
                  }
                />
              </View>
            </View>
          )}

          {formData.price.type === "free" && (
            <View className="form-item">
              <Text className="label">免费</Text>
              <Text>该服务免费提供，不需要填写价格。</Text>
            </View>
          )}

          {formData.price.type === "negotiable" && (
            <View className="form-item">
              <Text className="label">价格面议</Text>
              <Text>与服务者协商确定价格。</Text>
            </View>
          )}
        </View>

        {/* 联系方式 */}
        <View className="form-section">
          <Text className="section-title">联系方式</Text>

          <View className="form-item">
            <Text className="label">微信号</Text>
            <Input
              className="input"
              placeholder="微信号"
              value={formData.contactInfo.wechat}
              onInput={(e) =>
                this.handleNestedInputChange(
                  "contactInfo",
                  "wechat",
                  e.detail.value,
                )
              }
            />
          </View>

          <View className="form-item">
            <Text className="label">QQ号</Text>
            <Input
              className="input"
              placeholder="QQ号"
              value={formData.contactInfo.qq}
              onInput={(e) =>
                this.handleNestedInputChange(
                  "contactInfo",
                  "qq",
                  e.detail.value,
                )
              }
            />
          </View>

          <View className="form-item">
            <Text className="label">推荐联系方式 *</Text>
            <Picker
              mode="selector"
              range={contactMethodOptions}
              value={contactMethodIndex}
              onChange={this.handleContactMethodChange}
            >
              <View className="picker-view">
                <Text>{contactMethodOptions[contactMethodIndex]}</Text>
              </View>
            </Picker>
          </View>
        </View>

        {/* 提交按钮 */}
        <View className="submit-section">
          <Button className="submit-btn" onClick={this.handleSubmit}>
            发布技能帖
          </Button>
        </View>
      </View>
    );
  }
}
