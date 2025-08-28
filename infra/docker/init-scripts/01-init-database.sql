-- Coshub 数据库初始化脚本

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 创建基础表结构（占位）
-- 注意：实际的表结构应该通过 Prisma migrations 创建

-- 用户表（占位）
CREATE TABLE IF NOT EXISTS users_placeholder (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 帖子表（占位）
CREATE TABLE IF NOT EXISTS posts_placeholder (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id UUID REFERENCES users_placeholder(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_users_email ON users_placeholder(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users_placeholder(username);
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts_placeholder(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts_placeholder(created_at);

-- 插入测试数据
INSERT INTO users_placeholder (username, email) VALUES 
    ('test_user', 'test@coshub.local'),
    ('admin', 'admin@coshub.local')
ON CONFLICT (username) DO NOTHING;

-- 创建触发器更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users_placeholder 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at 
    BEFORE UPDATE ON posts_placeholder 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
