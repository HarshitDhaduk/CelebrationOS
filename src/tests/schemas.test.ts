/**
 * @file schemas.test.ts
 * @description Unit tests for Zod runtime validation schemas.
 */

import { describe, it, expect } from 'vitest';
import {
  BudgetItemSchema,
  TimelineItemSchema,
  VendorSchema,
  EventProjectSchema,
  GeminiActionSchema,
} from '../lib/schemas';

describe('Zod Runtime Schema Suite', () => {
  it('validates a well-formed BudgetItem', () => {
    const valid = {
      id: 'b-1',
      category: 'Catering',
      name: 'Plated Dinner',
      allocated: 5000,
      actual: 4800,
      priority: 'high',
      notes: 'Includes appetizers',
    };
    const result = BudgetItemSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects a BudgetItem with negative allocated amount', () => {
    const invalid = {
      id: 'b-2',
      category: 'Venue',
      name: 'Beach Pavilion',
      allocated: -500, // Negative budget
      actual: 0,
      priority: 'high',
    };
    const result = BudgetItemSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('validates a well-formed TimelineItem', () => {
    const valid = {
      id: 't-1',
      time: '14:00',
      title: 'Ceremony Kickoff',
      phase: 'day_of',
      responsible: 'Coordinator',
      location: 'Main Lawn',
      completed: false,
    };
    const result = TimelineItemSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('validates a Vendor and rejects invalid statuses', () => {
    const validVendor = {
      id: 'v-1',
      category: 'Photography',
      name: 'Luxe Studios',
      status: 'Booked',
      quotedAmount: 3200,
      depositPaid: 1000,
    };
    expect(VendorSchema.safeParse(validVendor).success).toBe(true);

    const invalidVendor = {
      ...validVendor,
      status: 'NonExistentStatus',
    };
    expect(VendorSchema.safeParse(invalidVendor).success).toBe(false);
  });

  it('validates an entire EventProject structure', () => {
    const sampleProject = {
      id: 'proj-1',
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

    const result = EventProjectSchema.safeParse(sampleProject);
    expect(result.success).toBe(true);
  });

  it('validates GeminiActionSchema with strict type enum', () => {
    const validAction = {
      id: 'act-1',
      label: 'Add $500 Buffer',
      type: 'ADJUST_BUDGET',
      payload: { amount: 500 },
      description: 'Expands the contingency fund',
    };
    expect(GeminiActionSchema.safeParse(validAction).success).toBe(true);

    const invalidAction = {
      ...validAction,
      type: 'UNKNOWN_ACTION_TYPE',
    };
    expect(GeminiActionSchema.safeParse(invalidAction).success).toBe(false);
  });
});
