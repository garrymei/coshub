import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { AppModule } from "../app.module";
import { PrismaService } from "../prisma/prisma.service";
import {
  STORAGE_PROVIDER,
  type StorageProvider,
} from "../upload/storage.provider";

class FakePrismaService {
  users: any[] = [];
  skillPostsTable: any[] = [];

  constructor() {
    // seed one user for authorId
    this.users.push({ id: "u1", username: "demo", nickname: "Demo" });
  }

  user = {
    findFirst: async () => this.users[0],
  };

  skillPost = {
    create: async ({ data }: any) => {
      const now = new Date();
      const rec = {
        id: `sp_${this.skillPostsTable.length + 1}`,
        deletedAt: null,
        updatedAt: now,
        createdAt: now,
        viewCount: 0,
        favoriteCount: 0,
        contactCount: 0,
        likeCount: 0,
        avgRating: 0,
        reviewCount: 0,
        responseRate: 100,
        ...data,
      };
      this.skillPostsTable.push(rec);
      return { ...rec, author: this.users[0] };
    },
    findMany: async ({ where }: any) => {
      let list = this.skillPostsTable.filter(
        (p) => !p.deletedAt && p.status === "ACTIVE",
      );
      if (where?.city)
        list = list.filter((p) =>
          p.city.includes(
            where.city.contains ? where.city.contains : where.city,
          ),
        );
      if (where?.role) list = list.filter((p) => p.role === where.role);
      if (where?.category)
        list = list.filter((p) => p.category === where.category);
      if (where?.geohash?.startsWith)
        list = list.filter((p) =>
          (p.geohash || "").startsWith(where.geohash.startsWith),
        );
      return list;
    },
    count: async ({ where }: any) => {
      const list = await this.skillPost.findMany({ where });
      return list.length;
    },
    findFirst: async ({ where, include }: any) => {
      const found = this.skillPostsTable.find(
        (p) => p.id === where.id && !p.deletedAt && p.status === "ACTIVE",
      );
      if (!found) return null;
      return include?.author ? { ...found, author: this.users[0] } : found;
    },
    findUnique: async ({ where }: any) => {
      return this.skillPostsTable.find((p) => p.id === where.id) || null;
    },
    update: async ({ where, data, include }: any) => {
      const idx = this.skillPostsTable.findIndex((p) => p.id === where.id);
      if (idx === -1) throw new Error("not found");
      const current = this.skillPostsTable[idx];
      const next = { ...current, ...data };
      if (data?.viewCount?.increment) {
        next.viewCount = (current.viewCount || 0) + data.viewCount.increment;
      }
      this.skillPostsTable[idx] = next;
      return include?.author ? { ...next, author: this.users[0] } : next;
    },
  };
}

const FakeStorage: StorageProvider = {
  ensureBucket: async () => {},
  bucketExists: async () => true,
  presignedPut: async () => "http://localhost:9000/coshub-uploads/demo",
  removeObject: async () => {},
  statObject: async () => ({ size: 0, lastModified: new Date() }),
  getPublicUrl: (b, k) => `http://localhost:9000/${b}/${k}`,
};

describe("API Smoke (skill-posts)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(PrismaService)
      .useClass(FakePrismaService as any)
      .overrideProvider(STORAGE_PROVIDER)
      .useValue(FakeStorage)
      .compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api");
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /api/skill-posts -> create", async () => {
    const payload = {
      title: "专业摄影师提供二次元人像拍摄服务",
      description: "拥有5年经验，设备齐全，风格多样，欢迎各类Cos约拍。",
      category: "photography",
      role: "photographer",
      experience: "professional",
      city: "上海",
      price: { type: "fixed", amount: 300, negotiable: false },
      images: ["https://example.com/1.jpg"],
      tags: ["人像摄影"],
      availability: {
        weekdays: true,
        weekends: true,
        holidays: false,
        timeSlots: [{ start: "09:00", end: "18:00" }],
        advance: 3,
      },
      contactInfo: { preferred: "wechat", wechat: "alice_photo" },
    };

    const res = await request(app.getHttpServer())
      .post("/api/skill-posts")
      .send(payload)
      .expect(201);

    expect(res.body.success).toBeTruthy();
    expect(res.body.data?.id).toBeTruthy();
  });

  it("GET /api/skill-posts?city=上海 -> list contains created", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/skill-posts")
      .query({ city: "上海", page: 1, limit: 10 })
      .expect(200);
    expect(res.body.success).toBeTruthy();
    expect(Array.isArray(res.body.data?.items)).toBeTruthy();
    expect((res.body.data?.items || []).length).toBeGreaterThan(0);
  });

  it("GET /api/skill-posts/:id -> detail", async () => {
    const list = await request(app.getHttpServer())
      .get("/api/skill-posts")
      .query({ page: 1, limit: 10 });
    const id = list.body.data.items[0].id;
    const res = await request(app.getHttpServer())
      .get(`/api/skill-posts/${id}`)
      .expect(200);
    expect(res.body.success).toBeTruthy();
    expect(res.body.data?.id).toBe(id);
  });
});
