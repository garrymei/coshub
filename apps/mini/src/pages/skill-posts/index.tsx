import { Component } from "react";
import {
  View,
  Text,
  Navigator,
  Image,
  Input,
  Picker,
} from "@tarojs/components";
import {
  skillsApi,
  formatPrice,
  showToast,
  hideLoading,
  showLoading,
} from "../../utils/api";
import {
  SKILL_CATEGORIES,
  SKILL_ROLES,
  POPULAR_CITIES,
  getLabel,
} from "../../utils/constants";
type SkillPost = any;
type SkillPostQueryDTO = {
  city?: string;
  role?: string;
  page?: number;
  limit?: number;
  keyword?: string;
};
import "./index.scss";

interface State {
  skillPosts: SkillPost[];
  loading: boolean;
  filters: SkillPostQueryDTO;
  total: number;
  categoryIndex: number;
  roleIndex: number;
  cityIndex: number;
}

export default class SkillPostsPage extends Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      skillPosts: [],
      loading: true,
      filters: {
        page: 1,
        limit: 10,
      },
      total: 0,
      categoryIndex: 0,
      roleIndex: 0,
      cityIndex: 0,
    };
  }

  componentDidMount() {
    this.fetchSkillPosts();
  }

  // 获取技能帖列表
  fetchSkillPosts = async () => {
    try {
      this.setState({ loading: true });

      const response = await skillsApi.getList(this.state.filters);

      if (response.success && response.data) {
        this.setState({
          skillPosts: response.data.items,
          total: response.data.total,
          loading: false,
        });
      } else {
        showToast("获取列表失败", "error");
        this.setState({ loading: false });
      }
    } catch (error) {
      console.error("获取技能帖列表失败:", error);
      showToast("网络请求失败", "error");
      this.setState({ loading: false });
    }
  };

  // 处理分类筛选
  handleCategoryChange = (e) => {
    const index = e.detail.value;
    const category = index > 0 ? SKILL_CATEGORIES[index - 1].value : undefined;

    this.setState(
      {
        categoryIndex: index,
        filters: {
          ...this.state.filters,
          category,
          page: 1,
        },
      },
      () => {
        this.fetchSkillPosts();
      },
    );
  };

  // 处理角色筛选
  handleRoleChange = (e) => {
    const index = e.detail.value;
    const role = index > 0 ? SKILL_ROLES[index - 1].value : undefined;

    this.setState(
      {
        roleIndex: index,
        filters: {
          ...this.state.filters,
          role,
          page: 1,
        },
      },
      () => {
        this.fetchSkillPosts();
      },
    );
  };

  // 处理城市筛选
  handleCityChange = (e) => {
    const index = e.detail.value;
    const city = index > 0 ? POPULAR_CITIES[index - 1] : undefined;

    this.setState(
      {
        cityIndex: index,
        filters: {
          ...this.state.filters,
          city,
          page: 1,
        },
      },
      () => {
        this.fetchSkillPosts();
      },
    );
  };

  // 处理关键词搜索
  handleKeywordChange = (e) => {
    const keyword = e.detail.value.trim();
    this.setState({
      filters: {
        ...this.state.filters,
        keyword: keyword || undefined,
        page: 1,
      },
    });
  };

  // 搜索确认
  handleSearch = () => {
    this.fetchSkillPosts();
  };

  render() {
    const { skillPosts, loading, total, categoryIndex, roleIndex, cityIndex } =
      this.state;

    const categoryOptions = [
      "全部分类",
      ...SKILL_CATEGORIES.map((cat) => cat.label),
    ];
    const roleOptions = ["全部角色", ...SKILL_ROLES.map((role) => role.label)];
    const cityOptions = ["全部城市", ...POPULAR_CITIES];

    return (
      <View className="skill-posts-page">
        {/* 页面标题 */}
        <View className="header">
          <Text className="title">技能帖广场</Text>
          <Navigator url="/pages/skill-posts/create">
            <View className="create-btn">发布</View>
          </Navigator>
        </View>

        {/* 筛选器 */}
        <View className="filters">
          <View className="filter-row">
            <Picker
              mode="selector"
              range={categoryOptions}
              value={categoryIndex}
              onChange={this.handleCategoryChange}
            >
              <View className="filter-item">
                <Text className="filter-label">分类</Text>
                <Text className="filter-value">
                  {categoryOptions[categoryIndex]}
                </Text>
              </View>
            </Picker>

            <Picker
              mode="selector"
              range={roleOptions}
              value={roleIndex}
              onChange={this.handleRoleChange}
            >
              <View className="filter-item">
                <Text className="filter-label">角色</Text>
                <Text className="filter-value">{roleOptions[roleIndex]}</Text>
              </View>
            </Picker>

            <Picker
              mode="selector"
              range={cityOptions}
              value={cityIndex}
              onChange={this.handleCityChange}
            >
              <View className="filter-item">
                <Text className="filter-label">城市</Text>
                <Text className="filter-value">{cityOptions[cityIndex]}</Text>
              </View>
            </Picker>
          </View>

          <View className="search-row">
            <Input
              className="search-input"
              placeholder="搜索技能、标签..."
              onInput={this.handleKeywordChange}
              onConfirm={this.handleSearch}
            />
          </View>
        </View>

        {/* 结果统计 */}
        <View className="stats">
          <Text className="stats-text">共找到 {total} 个技能帖</Text>
        </View>

        {/* 技能帖列表 */}
        {loading ? (
          <View className="loading">
            <Text>加载中...</Text>
          </View>
        ) : (
          <View className="skill-posts-list">
            {skillPosts.map((post) => (
              <Navigator
                key={post.id}
                url={`/pages/skill-posts/detail?id=${post.id}`}
                className="skill-post-item"
              >
                <View className="post-card">
                  {/* 图片 */}
                  <View className="post-image">
                    {post.images[0] ? (
                      <Image
                        src={post.images[0]}
                        mode="aspectFill"
                        className="image"
                      />
                    ) : (
                      <View className="image-placeholder">
                        <Text className="placeholder-text">暂无图片</Text>
                      </View>
                    )}
                  </View>

                  {/* 内容 */}
                  <View className="post-content">
                    <Text className="post-title">{post.title}</Text>

                    {/* 标签 */}
                    <View className="post-tags">
                      <Text className="tag category">
                        {getLabel(post.category, SKILL_CATEGORIES)}
                      </Text>
                      <Text className="tag role">
                        {getLabel(post.role, SKILL_ROLES)}
                      </Text>
                    </View>

                    {/* 价格和城市 */}
                    <View className="post-meta">
                      <Text className="price">{formatPrice(post)}</Text>
                      <Text className="city">📍 {post.city}</Text>
                    </View>

                    {/* 用户信息 */}
                    <View className="post-author">
                      <Image
                        src={
                          post.authorAvatar ||
                          `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.authorName}`
                        }
                        className="author-avatar"
                      />
                      <Text className="author-name">{post.authorName}</Text>
                      <Text className="author-rating">
                        ⭐ {post.stats.avgRating.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              </Navigator>
            ))}
          </View>
        )}

        {/* 空状态 */}
        {!loading && skillPosts.length === 0 && (
          <View className="empty-state">
            <Text className="empty-text">暂无符合条件的技能帖</Text>
            <Navigator url="/pages/skill-posts/create">
              <View className="empty-btn">发布第一个技能帖</View>
            </Navigator>
          </View>
        )}
      </View>
    );
  }
}
