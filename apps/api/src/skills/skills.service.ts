import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

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

  async create(data: {
    title: string;
    city: string;
    role: string;
    description?: string;
    images?: string[];
    author?: string;
    lat?: number;
    lng?: number;
  }) {
    const created = await this.prisma.skillPost.create({
      data: {
        title: data.title,
        description: data.description || "",
        category: "COSPLAY",
        role: data.role as any,
        experience: "BEGINNER",
        city: data.city,
        lat: data.lat ?? null,
        lng: data.lng ?? null,
        geohash:
          data.lat != null && data.lng != null
            ? this.encodeGeohash(data.lat, data.lng, 7)
            : null,
        price: { type: "negotiable" } as any,
        images: data.images || [],
        tags: [],
        availability: {},
        contactInfo: {},
        status: "ACTIVE",
        authorId: (await this.prisma.user.findFirst()).id,
      },
    });
    return created;
  }

  async findAll(params: {
    city?: string;
    role?: string;
    page?: number;
    pageSize?: number;
    lat?: number;
    lng?: number;
    radius?: number;
  }) {
    const { city, role, page = 1, pageSize = 10, lat, lng, radius } = params;
    const where: any = {};
    if (city) where.city = city;
    if (role) where.role = role as any;
    // 使用 geohash 前缀进行粗筛
    let coarseWhere: any = { ...where };
    if (lat != null && lng != null && radius != null && radius > 0) {
      const prefixLength = this.pickGeohashPrecision(radius);
      const prefix = this.encodeGeohash(lat, lng, prefixLength);
      coarseWhere.geohash = { startsWith: prefix };
    }

    let items = await this.prisma.skillPost.findMany({ where: coarseWhere });
    // 地理精筛与排序
    if (lat != null && lng != null && radius != null && radius > 0) {
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

  // 简易 geohash 编码（Base32），默认精度 6-7
  private encodeGeohash(lat: number, lng: number, precision = 6): string {
    const base32 = "0123456789bcdefghjkmnpqrstuvwxyz";
    let idx = 0;
    let bit = 0;
    let evenBit = true;
    let geohash = "";
    let latMin = -90, latMax = 90;
    let lonMin = -180, lonMax = 180;
    while (geohash.length < precision) {
      if (evenBit) {
        const lonMid = (lonMin + lonMax) / 2;
        if (lng >= lonMid) { idx = idx * 2 + 1; lonMin = lonMid; }
        else { idx = idx * 2; lonMax = lonMid; }
      } else {
        const latMid = (latMin + latMax) / 2;
        if (lat >= latMid) { idx = idx * 2 + 1; latMin = latMid; }
        else { idx = idx * 2; latMax = latMid; }
      }
      evenBit = !evenBit;
      if (++bit == 5) { geohash += base32.charAt(idx); bit = 0; idx = 0; }
    }
    return geohash;
  }

  // 根据半径（km）选择 geohash 前缀长度
  private pickGeohashPrecision(radiusKm: number): number {
    if (radiusKm >= 78) return 3;   // ~156km
    if (radiusKm >= 20) return 4;   // ~39km
    if (radiusKm >= 2.5) return 5;  // ~4.9km
    if (radiusKm >= 0.6) return 6;  // ~1.2km
    return 7;                       // ~0.15km
  }

  private haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371; // km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}
