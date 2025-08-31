import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface SkillItem {
  id: string;
  title: string;
  city: string;
  role: string;
  description?: string;
  images?: string[];
  author?: string;
  createdAt: string;
}

@Injectable()
export class SkillsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { title: string; city: string; role: string; description?: string; images?: string[]; author?: string; lat?: number; lng?: number; }) {
    const created = await this.prisma.skillPost.create({
      data: {
        title: data.title,
        description: data.description || '',
        category: 'COSPLAY',
        role: data.role as any,
        experience: 'BEGINNER',
        city: data.city,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        geohash: data.lat != null && data.lng != null ? this.encodeGeohash(data.lat, data.lng) : null,
        price: { type: 'negotiable' } as any,
        images: data.images || [],
        tags: [],
        availability: {},
        contactInfo: {},
        status: 'ACTIVE',
        authorId: (await this.prisma.user.findFirst()).id,
      },
    });
    return created;
  }

  async findAll(params: { city?: string; role?: string; page?: number; pageSize?: number; lat?: number; lng?: number; radius?: number }) {
    const { city, role, page = 1, pageSize = 10, lat, lng, radius } = params;
    const where: any = {};
    if (city) where.city = city;
    if (role) where.role = role as any;
    let items = await this.prisma.skillPost.findMany({ where });
    // 地理筛选
    if (lat != null && lng != null && radius != null) {
      items = items
        .map((i) => ({
          ...i,
          _distance:
            i.lat != null && i.lng != null
              ? this.haversineDistance(lat!, lng!, i.lat!, i.lng!)
              : Number.POSITIVE_INFINITY,
        }))
        .filter((i) => i._distance <= radius!)
        .sort((a, b) => a._distance - b._distance);
    } else {
      items = items.sort((a, b) => (b.createdAt as any) - (a.createdAt as any));
    }
    const total = items.length;
    const start = (page - 1) * pageSize;
    const paged = items.slice(start, start + pageSize);
    return { total, page, pageSize, items: paged };
  }

  async findById(id: string) {
    return this.prisma.skillPost.findUnique({ where: { id } });
  }

  private encodeGeohash(_lat: number, _lng: number): string {
    // 占位：后续可引入 geohash 库，这里先返回空字符串以避免依赖
    return '';
  }

  private haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}


