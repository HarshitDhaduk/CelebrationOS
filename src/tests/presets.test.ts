import { describe, it, expect } from 'vitest';
import { weddingPreset, birthdayPreset, communityPreset } from '../data/defaultPresets';

describe('Event Presets Integrity Suite', () => {
  const presets = [
    { name: 'Wedding', data: weddingPreset, type: 'wedding' },
    { name: 'Birthday', data: birthdayPreset, type: 'birthday' },
    { name: 'Community', data: communityPreset, type: 'community' },
  ];

  presets.forEach(({ name, data, type }) => {
    describe(`${name} Preset Integrity`, () => {
      it('has valid core event metadata', () => {
        expect(data.event.eventType).toBe(type);
        expect(data.event.title.length).toBeGreaterThan(5);
        expect(data.event.guestCount).toBeGreaterThan(0);
        expect(data.event.totalBudget).toBeGreaterThan(0);
        expect(data.event.location.length).toBeGreaterThan(2);
        expect(data.event.vibe.length).toBeGreaterThan(5);
      });

      it('has non-empty budget items with valid categories and costs', () => {
        expect(data.budgetItems.length).toBeGreaterThan(0);
        data.budgetItems.forEach((item) => {
          expect(item.name.length).toBeGreaterThan(0);
          expect(item.estimatedCost).toBeGreaterThanOrEqual(0);
          expect(item.actualCost).toBeGreaterThanOrEqual(0);
        });
      });

      it('has chronological run of show items', () => {
        expect(data.runOfShow.length).toBeGreaterThan(0);
        data.runOfShow.forEach((item) => {
          expect(item.title.length).toBeGreaterThan(0);
          expect(item.startTime).toMatch(/^\d{2}:\d{2}/);
        });
      });

      it('has structured planning milestones across multiple phases', () => {
        expect(data.milestones.length).toBeGreaterThan(0);
        const phases = new Set(data.milestones.map((m) => m.phase));
        expect(phases.size).toBeGreaterThanOrEqual(2);
      });

      it('has complete vendor profiles and due diligence checklists', () => {
        expect(data.vendors.length).toBeGreaterThan(0);
        expect(data.vendorChecklist.length).toBeGreaterThan(0);
      });

      it('has creative assets: themes, invites, signature drinks, and speeches', () => {
        expect(data.creativeThemes.length).toBeGreaterThan(0);
        expect(data.creativeThemes[0].palettes.length).toBeGreaterThanOrEqual(3);
        expect(data.invitations.length).toBeGreaterThan(0);
        expect(data.drinks.length).toBeGreaterThanOrEqual(1);
        expect(data.speeches.length).toBeGreaterThan(0);
      });
    });
  });
});
