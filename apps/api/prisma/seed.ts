import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 开始种子数据初始化...');

  // 创建示例用户
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@example.com' },
      update: {},
      create: {
        email: 'alice@example.com',
        username: 'alice_cos',
        nickname: 'Alice 摄影师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
        bio: '专业摄影师，擅长二次元人像和外景拍摄',
        level: 'PROFESSIONAL',
        verified: true,
        reputation: 950,
        city: '上海',
        wechat: 'alice_photo',
        viewCount: 1520,
        followerCount: 486,
        followingCount: 123,
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@example.com' },
      update: {},
      create: {
        email: 'bob@example.com',
        username: 'bob_tailor',
        nickname: 'Bob 服装师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
        bio: '专业Cos服装定制，承接各类角色服装制作',
        level: 'ADVANCED',
        verified: true,
        reputation: 876,
        city: '北京',
        qq: '123456789',
        viewCount: 892,
        followerCount: 234,
        followingCount: 87,
      },
    }),
    prisma.user.upsert({
      where: { email: 'carol@example.com' },
      update: {},
      create: {
        email: 'carol@example.com',
        username: 'carol_makeup',
        nickname: 'Carol 化妆师',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=carol',
        bio: '专业化妆师，擅长各种二次元角色妆容设计',
        level: 'INTERMEDIATE',
        verified: false,
        reputation: 723,
        city: '广州',
        wechat: 'carol_makeup',
        phone: '13800138000',
        viewCount: 445,
        followerCount: 156,
        followingCount: 89,
      },
    }),
  ]);

  console.log(`✅ 创建了 ${users.length} 个用户`);

  // 创建示例技能帖
  const skillPosts = await Promise.all([
    prisma.skillPost.create({
      data: {
        title: '专业摄影师提供二次元人像拍摄服务',
        description: '拥有5年二次元摄影经验，擅长外景和棚拍。设备齐全，包含专业单反、灯光设备等。可提供修图服务，风格多样。欢迎各类Cos约拍，无论是日系、欧美还是古风都能胜任。',
        category: 'PHOTOGRAPHY',
        role: 'PHOTOGRAPHER',
        experience: 'PROFESSIONAL',
        city: '上海',
        price: {
          type: 'range',
          currency: 'CNY',
          range: {
            min: 300,
            max: 800,
          },
          negotiable: true,
        },
        images: [
          'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
          'https://images.unsplash.com/photo-1594736797933-d0b6e6b4e67a?w=800',
        ],
        tags: ['人像摄影', '外景拍摄', '后期修图', '专业器材'],
        availability: {
          weekdays: true,
          weekends: true,
          holidays: false,
          timeSlots: [
            { start: '09:00', end: '18:00' },
          ],
          advance: 3,
        },
        contactInfo: {
          wechat: 'alice_photo',
          preferred: 'WECHAT',
        },
        status: 'ACTIVE',
        viewCount: 342,
        favoriteCount: 28,
        contactCount: 15,
        avgRating: 4.8,
        reviewCount: 23,
        responseRate: 95,
        authorId: users[0].id,
      },
    }),
    prisma.skillPost.create({
      data: {
        title: 'Cos服装定制 - 各类角色服装制作',
        description: '专业服装设计师，拥有完整的制作工作室。可承接各类角色的服装定制，从设计到制作一条龙服务。使用优质面料，做工精细，版型准确。支持各种尺寸定制，提供试穿调整服务。',
        category: 'COSTUME_MAKING',
        role: 'COSTUME_MAKER',
        experience: 'ADVANCED',
        city: '北京',
        price: {
          type: 'range',
          currency: 'CNY',
          range: {
            min: 500,
            max: 2000,
          },
          negotiable: true,
        },
        images: [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
          'https://images.unsplash.com/photo-1594736797933-d0b6e6b4e67a?w=800',
        ],
        tags: ['服装定制', '角色还原', '优质面料', '精细做工'],
        availability: {
          weekdays: true,
          weekends: false,
          holidays: false,
          timeSlots: [
            { start: '10:00', end: '17:00' },
          ],
          advance: 7,
        },
        contactInfo: {
          qq: '123456789',
          preferred: 'QQ',
        },
        status: 'ACTIVE',
        viewCount: 256,
        favoriteCount: 19,
        contactCount: 8,
        avgRating: 4.6,
        reviewCount: 12,
        responseRate: 88,
        authorId: users[1].id,
      },
    }),
    prisma.skillPost.create({
      data: {
        title: '专业化妆师 二次元角色妆容设计',
        description: '专业化妆师，擅长各种二次元角色的妆容设计与实现。拥有丰富的舞台妆、影楼妆经验，对色彩搭配和面部结构有深入理解。可根据角色特点定制专属妆容，让你完美还原心中角色。',
        category: 'MAKEUP',
        role: 'MAKEUP_ARTIST',
        experience: 'INTERMEDIATE',
        city: '广州',
        price: {
          type: 'fixed',
          amount: 200,
          currency: 'CNY',
          negotiable: false,
        },
        images: [
          'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800',
        ],
        tags: ['专业化妆', '角色妆容', '舞台妆', '影楼妆'],
        availability: {
          weekdays: false,
          weekends: true,
          holidays: true,
          timeSlots: [
            { start: '08:00', end: '20:00' },
          ],
          advance: 2,
        },
        contactInfo: {
          wechat: 'carol_makeup',
          phone: '13800138000',
          preferred: 'WECHAT',
        },
        status: 'ACTIVE',
        viewCount: 178,
        favoriteCount: 12,
        contactCount: 6,
        avgRating: 4.4,
        reviewCount: 8,
        responseRate: 92,
        authorId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ 创建了 ${skillPosts.length} 个技能帖`);

  // 创建示例请求
  const requests = await Promise.all([
    prisma.request.create({
      data: {
        title: '寻找优秀摄影师合作拍摄',
        description: '计划拍摄一组古风Cos，需要有经验的摄影师合作。要求有古风拍摄经验，熟悉光影运用。',
        type: 'COLLABORATION',
        category: 'PHOTOGRAPHY',
        city: '杭州',
        budget: {
          min: 400,
          max: 600,
          negotiable: true,
        },
        deadline: new Date('2024-12-31'),
        urgency: 'NORMAL',
        images: [],
        tags: ['古风', '合作拍摄', '摄影师'],
        status: 'OPEN',
        viewCount: 89,
        responseCount: 3,
        requesterId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ 创建了 ${requests.length} 个请求`);

  console.log('🎉 种子数据初始化完成！');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据初始化失败:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
