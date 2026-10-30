/**
 * @file schemas.ts
 * @description Zod runtime validation schemas for CelebrationOS domain models, API requests,
 * and state mutator operations. Ensures end-to-end type safety, runtime boundary verification,
 * and guards against prototype pollution and malformed payloads.
 */

import { z } from 'zod';

export const CurrencyCodeSchema = z.enum(['USD', 'INR', 'EUR', 'GBP', 'CAD', 'AUD']);

export const PrioritySchema = z.enum(['high', 'medium', 'low']);

export const VendorStatusSchema = z.enum([
  'Researching',
  'Contacted',
  'Quoted',
  'Booked',
  'Completed',
]);

export const BudgetItemSchema = z.object({
  id: z.string().min(1, 'Item ID is required'),
  category: z.string().min(1, 'Category is required'),
  name: z.string().min(1, 'Expense name is required'),
  allocated: z.number().min(0, 'Allocated budget must be non-negative'),
  actual: z.number().min(0, 'Actual spend must be non-negative'),
  priority: PrioritySchema,
  notes: z.string().optional().default(''),
});

export const TimelineItemSchema = z.object({
  id: z.string().min(1, 'Timeline item ID is required'),
  time: z.string().min(1, 'Time is required'),
  title: z.string().min(1, 'Title is required'),
  phase: z.string().min(1, 'Phase is required'),
  responsible: z.string().min(1, 'Responsible party is required'),
  location: z.string().optional().default(''),
  completed: z.boolean().default(false),
});

export const VendorSchema = z.object({
  id: z.string().min(1, 'Vendor ID is required'),
  category: z.string().min(1, 'Vendor category is required'),
  name: z.string().min(1, 'Vendor name is required'),
  status: VendorStatusSchema,
  contact: z.string().optional().default(''),
  quotedAmount: z.number().min(0).optional().default(0),
  depositPaid: z.number().min(0).optional().default(0),
  notes: z.string().optional().default(''),
});

export const PaletteColorSchema = z.object({
  hex: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, 'Invalid hex color code'),
  name: z.string().min(1),
  role: z.string().min(1),
});

export const EventProjectSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Event title is required'),
  type: z.enum(['wedding', 'birthday', 'community']),
  date: z.string().min(1, 'Event date is required'),
  location: z.string().min(1, 'Location is required'),
  guestCount: z.number().int().min(1, 'Guest count must be at least 1'),
  totalBudget: z.number().min(0, 'Total budget must be non-negative'),
  currency: CurrencyCodeSchema,
  contingencyPercent: z.number().min(0).max(50),
  budgetItems: z.array(BudgetItemSchema),
  timeline: z.array(TimelineItemSchema),
  vendors: z.array(VendorSchema),
  themeMoodboard: z.object({
    themeName: z.string(),
    description: z.string(),
    colors: z.array(PaletteColorSchema),
    musicVibe: z.string(),
    dressCode: z.string(),
  }),
});

export const GeminiActionSchema = z.object({
  id: z.string(),
  label: z.string().min(1),
  type: z.enum([
    'ADJUST_BUDGET',
    'ADD_BUDGET_ITEM',
    'ADD_TIMELINE_ITEM',
    'UPDATE_VENDOR_STATUS',
    'SET_THEME_ACCENT',
  ]),
  payload: z.record(z.string(), z.unknown()),
  description: z.string(),
});

export const GeminiResponseSchema = z.object({
  message: z.string().min(1),
  suggestedActions: z.array(GeminiActionSchema).optional(),
});

export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  text: z.string().min(1),
  timestamp: z.number(),
  actions: z.array(GeminiActionSchema).optional(),
});

export type ValidatedBudgetItem = z.infer<typeof BudgetItemSchema>;
export type ValidatedTimelineItem = z.infer<typeof TimelineItemSchema>;
export type ValidatedVendor = z.infer<typeof VendorSchema>;
export type ValidatedEventProject = z.infer<typeof EventProjectSchema>;
export type ValidatedGeminiAction = z.infer<typeof GeminiActionSchema>;
export type ValidatedGeminiResponse = z.infer<typeof GeminiResponseSchema>;
export type ValidatedChatMessage = z.infer<typeof ChatMessageSchema>;
