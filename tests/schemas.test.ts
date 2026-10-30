/**
 * @file schemas.test.ts
 * @description Root test suite for Zod runtime validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  BudgetItemSchema,
  TimelineItemSchema,
  VendorSchema,
  EventProjectSchema,
  GeminiActionSchema,
} from '../src/lib/schemas';

describe('Root Suite: Zod Runtime Schemas', () => {
  it('validates a complete BudgetItem', () => {
    const item = {
      id: 'b-root-1',
      category: 'Decor',
      name: 'Floral Centerpieces',
      allocated: 2500,
      actual: 2400,
      priority: 'medium',
    };
    expect(BudgetItemSchema.safeParse(item).success).toBe(true);
  });

  it('rejects a BudgetItem with negative allocated budget', () => {
    const item = {
      id: 'b-root-2',
      category: 'Venue',
      name: 'Hall',
      allocated: -100,
      actual: 0,
      priority: 'high',
    };
    expect(BudgetItemSchema.safeParse(item).success).toBe(false);
  });

  it('validates a TimelineItem with correct phase', () => {
    const timeline = {
      id: 't-root-1',
      time: '18:00',
      title: 'Grand Entrance',
      phase: 'day_of',
      responsible: 'DJ',
      location: 'Main Ballroom',
      completed: true,
    };
    expect(TimelineItemSchema.safeParse(timeline).success).toBe(true);
  });

  it('validates a Vendor with valid status enum', () => {
    const vendor = {
      id: 'v-root-1',
      category: 'Music',
      name: 'Live Jazz Ensemble',
      status: 'Booked',
    };
    expect(VendorSchema.safeParse(vendor).success).toBe(true);
  });

  it('validates an entire EventProject structure', () => {
    const sampleProject = {
      id: 'proj-root-1',
      title: 'Liam & Maya Wedding',
      type: 'wedding',
      date: '2026-09-18',
      location: 'Malibu, CA',
      guestCount: 120,
      totalBudget: 45000,
      currency: 'USD',
      contingencyPercent: 10,
      budgetItems: [
        {
          id: 'b-1',
          category: 'Venue',
          name: 'Ocean Villa',
          allocated: 12000,
          actual: 12000,
          priority: 'high',
        },
      ],
      timeline: [
        {
          id: 't-1',
          time: '16:00',
          title: 'Guest Arrival',
          phase: 'day_of',
          responsible: 'Ushers',
          location: 'Courtyard',
          completed: false,
        },
      ],
      vendors: [
        {
          id: 'v-1',
          category: 'Catering',
          name: 'Gourmet Chefs',
          status: 'Booked',
        },
      ],
      themeMoodboard: {
        themeName: 'Coastal Romance',
        description: 'Ethereal blues and warm sands',
        colors: [{ hex: '#2B4C7E', name: 'Deep Ocean', role: 'Primary' }],
        musicVibe: 'Acoustic Indie & Warm Jazz',
        dressCode: 'Cocktail Attire',
      },
    };
    expect(EventProjectSchema.safeParse(sampleProject).success).toBe(true);
  });

  it('validates GeminiActionSchema structure', () => {
    const action = {
      id: 'act-root-1',
      label: 'Add Contingency Buffer',
      type: 'ADJUST_BUDGET',
      payload: { amount: 500 },
      description: 'Expands the emergency buffer',
    };
    expect(GeminiActionSchema.safeParse(action).success).toBe(true);
  });
});
