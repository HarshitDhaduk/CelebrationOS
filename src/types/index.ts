export type EventType = 'wedding' | 'birthday' | 'community';

export type Currency = 'USD' | 'INR' | 'EUR' | 'GBP' | 'CAD' | 'AUD';

export interface EventDetails {
  id: string;
  title: string;
  eventType: EventType;
  subType?: string; // e.g. "Destination Beach Wedding", "Milestone 30th", "Neighborhood Block Party"
  date: string; // ISO format YYYY-MM-DD
  time?: string;
  location: string;
  guestCount: number;
  totalBudget: number;
  currency: Currency;
  vibe: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type BudgetCategory = 
  | 'venue'
  | 'catering'
  | 'photo_video'
  | 'decor_rentals'
  | 'entertainment'
  | 'attire_beauty'
  | 'permits_safety'
  | 'stationery_favors'
  | 'contingency'
  | 'other';

export interface BudgetItem {
  id: string;
  name: string;
  category: BudgetCategory;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  vendorId?: string;
  isPaid: boolean;
  priority: 'must-have' | 'nice-to-have' | 'optional';
  notes?: string;
}

export interface MilestoneTask {
  id: string;
  title: string;
  phase: '6_plus_months' | '3_to_6_months' | '1_to_2_months' | '2_to_4_weeks' | 'final_week' | 'day_of' | 'post_event';
  dueDate?: string;
  completed: boolean;
  category: BudgetCategory;
  priority: 'high' | 'medium' | 'low';
  assignedTo?: string;
}

export interface RunOfShowItem {
  id: string;
  startTime: string; // "14:00" or "02:00 PM"
  endTime?: string;
  title: string;
  description: string;
  responsibleParty: string; // "Coordinator", "DJ", "Photographer", "Best Man"
  location: string; // "Grand Ballroom", "Lawn", "Entrance"
  completed: boolean;
}

export type VendorStatus = 'researching' | 'contacted' | 'quoted' | 'booked' | 'completed' | 'declined';

export interface Vendor {
  id: string;
  name: string;
  category: BudgetCategory;
  status: VendorStatus;
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  quotedPrice?: number;
  depositPaid?: number;
  contractSigned: boolean;
  rating?: number;
  notes?: string;
}

export interface VendorChecklist {
  id: string;
  vendorCategory: BudgetCategory;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
}

export interface ColorPalette {
  name: string;
  hex: string;
  role: string; // Primary, Secondary, Accent, Neutral
}

export interface CreativeTheme {
  name: string;
  tagline: string;
  description: string;
  palettes: ColorPalette[];
  decorVibe: string[];
  dressCodePrompt: string;
}

export interface DigitalInvite {
  headline: string;
  hosts: string;
  honoree: string;
  dateAndLocation: string;
  dressCode: string;
  rsvpDeadline: string;
  fullInvitationText: string;
  quirkyPointers: string[];
}

export interface SignatureDrink {
  name: string;
  type: 'cocktail' | 'mocktail' | 'punch';
  description: string;
  glassware: string;
  ingredients: string[];
  garnish: string;
  funFactOrToast: string;
}

export interface SpeechDraft {
  title: string;
  speakerRole: string; // "Best Man", "Maid of Honor", "Proud Parent", "Host", "Community Leader"
  tone: 'heartfelt' | 'humorous' | 'inspirational' | 'festive';
  durationMinutes: number;
  bodyParagraphs: string[];
  closingToast: string;
}

export type SuggestedActionPayload =
  | string
  | Partial<BudgetItem>
  | Partial<RunOfShowItem>
  | Partial<Vendor>
  | Record<string, unknown>;

export interface SuggestedAction {
  label: string;
  actionType: 'add_budget' | 'add_timeline' | 'add_vendor' | 'switch_tab' | 'apply_theme';
  payload?: SuggestedActionPayload;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedActions?: SuggestedAction[];
}

export interface EventProject {
  event: EventDetails;
  budgetItems: BudgetItem[];
  milestones: MilestoneTask[];
  runOfShow: RunOfShowItem[];
  vendors: Vendor[];
  vendorChecklist: VendorChecklist[];
  creativeThemes: CreativeTheme[];
  activeThemeIndex: number;
  invitations: DigitalInvite[];
  drinks: SignatureDrink[];
  speeches: SpeechDraft[];
  chatHistory: AssistantMessage[];
}
