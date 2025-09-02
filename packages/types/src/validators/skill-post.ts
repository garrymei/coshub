import { z } from 'zod';
import { SkillCategory } from '../skill';
import { SkillRole, ExperienceLevel, PriceType, ContactMethod } from '../skill-post';

export const timeSlotSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '时间格式必须为 HH:mm'),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, '时间格式必须为 HH:mm'),
});

export const availabilitySchema = z.object({
  weekdays: z.boolean(),
  weekends: z.boolean(),
  holidays: z.boolean(),
  timeSlots: z.array(timeSlotSchema).min(1),
  advance: z.number().min(0).max(30),
});

export const contactInfoSchema = z.object({
  wechat: z.string().min(3).max(50).optional().or(z.literal('')),
  qq: z.string().min(5).max(20).optional().or(z.literal('')),
  phone: z.string().min(11).max(20).optional().or(z.literal('')),
  email: z.string().email().min(5).max(100).optional().or(z.literal('')),
  preferred: z.nativeEnum(ContactMethod),
});

export const priceSchema = z.object({
  type: z.nativeEnum(PriceType),
  amount: z.number().min(0).max(99999).optional(),
  currency: z.string().default('CNY').optional(),
  unit: z.string().optional(),
  range: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
    })
    .refine((v) => (v ? v.min < v.max : true), '价格区间不合法')
    .optional(),
  negotiable: z.boolean(),
}).refine((p) => {
  if (p.type === 'fixed') return typeof p.amount === 'number' && p.amount > 0;
  if (p.type === 'range') return !!p.range && p.range.min < p.range.max;
  return true;
}, '价格配置不合法');

export const createSkillPostSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(2000),
  category: z.nativeEnum(SkillCategory),
  role: z.nativeEnum(SkillRole),
  city: z.string().min(2).max(20),
  price: priceSchema,
  images: z.array(z.string().url()).min(1).max(9),
  tags: z.array(z.string()).max(10).default([]),
  experience: z.nativeEnum(ExperienceLevel),
  availability: availabilitySchema,
  contactInfo: contactInfoSchema.refine((c) => {
    const has = !!(c.wechat || c.qq || c.phone || c.email);
    return has;
  }, '至少需要填写一种联系方式'),
});

export type CreateSkillPostInput = z.infer<typeof createSkillPostSchema>;

