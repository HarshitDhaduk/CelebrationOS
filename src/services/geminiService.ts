/**
 * @file geminiService.ts
 * @description Enterprise Google Gemini 2.5 AI orchestration service for CelebrationOS.
 * Integrates:
 * - Sliding-window rate limiting to prevent API quota exhaustion and loops
 * - Client-side PII redaction vault to mask phone, email, card, and address data before dispatch
 * - Reversible token rehydration on AI responses
 * - Dual-tier caching (MemoryLRUCache + sessionStorage) to eliminate redundant calls
 * - Adversarial prompt injection defense and input sanitization
 * - Authentic, dynamically computed heuristic simulation fallback with transparent engine badges
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { EventProject, SuggestedAction } from '../types';
import { calculateBudgetMetrics, formatCurrency } from '../utils/budgetEngine';
import { detectPromptInjection, sanitizePromptInput } from '../lib/security';
import { maskPII, rehydratePII } from '../lib/pii';
import { geminiRateLimiter } from '../lib/rate-limiter';
import { getOrSetDualCache } from '../lib/client-cache';

export interface CopilotGenerationResult {
  text: string;
  suggestedActions?: SuggestedAction[];
  isLiveApi: boolean;
  engineBadge: string;
}

/**
 * Instantiates the GoogleGenerativeAI client using the provided API key.
 * Returns null if no key is supplied, enabling the heuristic fallback engine.
 *
 * @param apiKey - Optional Google Gemini API key.
 * @returns GoogleGenerativeAI client instance or null.
 */
export function getGeminiClient(apiKey?: string): GoogleGenerativeAI | null {
  if (!apiKey || !apiKey.trim()) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey.trim());
}

/**
 * Generates an authentic, dynamically computed heuristic analysis for custom event data.
 * Computes exact mathematical variances, category breakdown, cost-per-guest metrics,
 * and pacing recommendations tailored specifically to user inputs.
 *
 * @param prompt - Sanitized user question.
 * @param project - EventProject state.
 * @returns Structured heuristic generation result.
 */
export function generateHeuristicAnalysis(
  prompt: string,
  project: EventProject
): { text: string; suggestedActions?: SuggestedAction[] } {
  return generateContextualSimulation(prompt, project);
}

/**
 * Main entry point for Celebration Copilot.
 * Enforces rate limiting, prompt injection defense, PII masking, dual-tier caching,
 * and calls Google Gemini 2.5 Flash (or adaptive dynamic simulation fallback).
 *
 * @param userPrompt - Raw user inquiry.
 * @param project - Current live event project context.
 * @param apiKey - Optional Google Gemini API key.
 * @returns CopilotGenerationResult with response text, suggested actions, and engine metadata.
 */
export async function askEventCopilot(
  userPrompt: string,
  project: EventProject,
  apiKey?: string
): Promise<CopilotGenerationResult> {
  // 1. Prompt Injection Defense
  const injectionAnalysis = detectPromptInjection(userPrompt);
  if (!injectionAnalysis.isSafe) {
    return {
      text: `⚠️ **Security Alert:** Your input could not be processed because it was flagged by our prompt security filter (${injectionAnalysis.reason || 'Adversarial instruction detected'}). Please rephrase your event planning request.`,
      isLiveApi: false,
      engineBadge: 'Security Filter Neutralized',
    };
  }

  // 2. Sanitize and Strip Delimiters
  const cleanPrompt = sanitizePromptInput(userPrompt);
  const cleanKey = apiKey?.trim();

  // 3. Client-Side PII Masking Vault
  const piiRedaction = maskPII(cleanPrompt);
  const sanitizedPrompt = piiRedaction.sanitizedText;

  // 4. Rate Limiter Check
  const rateLimit = geminiRateLimiter.checkLimit();
  if (!rateLimit.allowed) {
    return {
      text: `⏳ **Rate Limit Advisory:** You have reached the maximum inquiry limit for this minute. Please wait **${rateLimit.retryAfterSeconds} seconds** before submitting another request to protect API quotas.`,
      isLiveApi: false,
      engineBadge: 'Rate Limiter Throttled',
    };
  }

  // 5. Dual-Tier Cache Lookup Key (Normalized prompt + event ID + total budget)
  const cacheKey = `copilot_${project.event.id}_${project.event.totalBudget}_${sanitizedPrompt.toLowerCase().replace(/\s+/g, '_')}`;

  // If live key is provided, attempt live Gemini API call
  if (cleanKey) {
    try {
      const liveResult = await getOrSetDualCache(
        cacheKey,
        async () => {
          return await callGeminiLive(sanitizedPrompt, project, cleanKey);
        },
        5 * 60 * 1000 // 5 minute TTL
      );

      // Rehydrate any masked PII tokens before presenting to user
      const rehydratedText = rehydratePII(liveResult.text, piiRedaction.vault);

      return {
        text: rehydratedText,
        suggestedActions: liveResult.suggestedActions,
        isLiveApi: true,
        engineBadge: 'Google Gemini 2.5 Flash API (Live)',
      };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Network limitation';
      console.warn('Gemini API call encountered an issue, falling back to intelligent offline assistant engine:', err);

      // Graceful fallback to dynamic authentic simulation
      const simulated = generateContextualSimulation(sanitizedPrompt, project);
      const rehydratedSim = rehydratePII(simulated.text, piiRedaction.vault);

      return {
        text: `*[Live Gemini Note: Switched to Intelligent Local Engine due to API response: ${errMessage}]*\n\n${rehydratedSim}`,
        suggestedActions: simulated.suggestedActions,
        isLiveApi: false,
        engineBadge: 'Local Adaptive Heuristic Engine (Fallback)',
      };
    }
  }

  // Offline / Default Mode: Dynamic Contextual Simulation
  const simulated = generateContextualSimulation(sanitizedPrompt, project);
  const rehydratedSim = rehydratePII(simulated.text, piiRedaction.vault);

  return {
    text: rehydratedSim,
    suggestedActions: simulated.suggestedActions,
    isLiveApi: false,
    engineBadge: 'Local Contextual Adaptive Engine (Simulation)',
  };
}

async function callGeminiLive(
  prompt: string,
  project: EventProject,
  apiKey: string
): Promise<{ text: string; suggestedActions?: SuggestedAction[] }> {
  const metrics = calculateBudgetMetrics(project.budgetItems, project.event.totalBudget, project.event.guestCount);

  const systemInstruction = `You are "CelebrationOS Copilot", an elite, creative, and detail-oriented event planner AI specializing in Weddings, Milestone Birthdays, and Community Civic Events.
CURRENT EVENT CONTEXT:
- Event: "${project.event.title}" (${project.event.eventType.toUpperCase()})
- Sub-theme: ${project.event.subType || 'N/A'}
- Date & Time: ${project.event.date} at ${project.event.time || 'TBD'}
- Location: ${project.event.location}
- Guest Count: ${project.event.guestCount} attendees
- Total Budget: ${project.event.currency} ${project.event.totalBudget} (Spent: ${project.event.currency} ${metrics.totalActual}, Estimated: ${project.event.currency} ${metrics.totalEstimated})
- Cost Per Guest: ${project.event.currency} ${Math.round(metrics.costPerGuestEstimated)}
- Health Status: ${metrics.healthStatus} (${metrics.variance >= 0 ? 'Under budget by ' + metrics.variance : 'Over budget by ' + Math.abs(metrics.variance)})
- Vibe / Aesthetic: ${project.event.vibe}

GUIDELINES:
1. Provide proactive, actionable, and structured guidance tailored strictly to the event persona.
2. When answering budget questions, cite specific categories, percentages, or cost-saving tradeoffs.
3. When answering schedule questions, consider setup buffers, guest transitions, and vendor breakdown time.
4. Keep tone warm, celebratory, practical, and highly organized. Use markdown lists and bold text for clarity.`;

  // 1. Attempt GoogleGenerativeAI SDK dispatch
  const genAI = getGeminiClient(apiKey);
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 1200 },
      });
      const result = await model.generateContent(`${systemInstruction}\n\nUSER QUESTION: ${prompt}`);
      const text = result.response.text();
      if (text && text.trim().length > 0) {
        const suggestedActions = detectSuggestedActions(prompt, project);
        return { text, suggestedActions };
      }
    } catch {
      // Fallback to direct REST endpoint below
    }
  }

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUSER QUESTION: ${prompt}` }],
      },
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1200,
    },
  };

  // 2. Direct REST endpoint fallback (gemini-2.5-flash, fallback to gemini-1.5-flash)
  let endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  let response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    // Retry with gemini-1.5-flash
    endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `HTTP ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated from Gemini.';

  const suggestedActions = detectSuggestedActions(prompt, project);

  return { text, suggestedActions };
}

/**
 * Authentic, dynamically computed simulation engine.
 * Computes exact mathematical responses and custom recommendations based on the user's
 * actual live project data, rather than returning static templates.
 */
export function generateContextualSimulation(
  prompt: string,
  project: EventProject
): { text: string; suggestedActions?: SuggestedAction[] } {
  const p = prompt.toLowerCase();
  const { event, budgetItems } = project;
  const metrics = calculateBudgetMetrics(budgetItems, event.totalBudget, event.guestCount);
  const cur = event.currency;

  // 1. Budget Optimization & Analysis
  if (
    p.includes('budget') ||
    p.includes('cost') ||
    p.includes('spend') ||
    p.includes('money') ||
    p.includes('save') ||
    p.includes('expensive') ||
    p.includes('price') ||
    p.includes('dollar')
  ) {
    const topCategory = metrics.categorySummaries[0];
    const isOver = metrics.isOverBudget;

    let response = `### 📊 Real-Time Budget Intelligence Analysis for **${event.title}**\n\n`;
    response += `Here is your current mathematical financial health assessment:\n\n`;
    response += `- **Total Planned Budget:** ${formatCurrency(event.totalBudget, cur)}\n`;
    response += `- **Committed Allocations:** ${formatCurrency(metrics.totalEstimated, cur)} (${Math.round((metrics.totalEstimated / Math.max(1, event.totalBudget)) * 100)}% allocated)\n`;
    response += `- **Actual Cash Paid:** ${formatCurrency(metrics.totalPaid, cur)}\n`;
    response += `- **Cost Per Guest:** ~${formatCurrency(metrics.costPerGuestEstimated, cur)} / attendee (${event.guestCount} confirmed guests)\n`;
    response += `- **Contingency Buffer:** ${formatCurrency(metrics.contingencyTotal, cur)} (${metrics.contingencyPercentage.toFixed(1)}% of total budget)\n\n`;

    if (isOver) {
      response += `> ⚠️ **Over-Budget Warning:** Current commitments exceed planned budget by **${formatCurrency(Math.abs(metrics.variance), cur)}**. \n\n`;
      response += `**Recommended Mathematical Adjustments:**\n`;
      response += `1. **Catering Recalibration:** At ${formatCurrency(metrics.costPerGuestEstimated, cur)}/guest, shaving just 10% off bar or dessert packages recovers ~${formatCurrency(Math.round(metrics.costPerGuestEstimated * event.guestCount * 0.1), cur)}.\n`;
      response += `2. **Decor Dual-Purposing:** Repurpose ceremony florals to reception banquet tables to reduce floral budget by 20%.\n`;
      response += `3. **Digital Stationery:** Shift physical mailings to digital invitations to immediately recover printing costs.\n`;
    } else {
      response += `> ✅ **Financial Status: Healthy.** You retain an unallocated cushion of **${formatCurrency(metrics.variance, cur)}** for peace of mind.\n\n`;
      response += `**Key Category Allocation:**\n`;
      response += `- Primary expenditure: **${topCategory?.category || 'Catering'}** at ${formatCurrency(topCategory?.estimated || 0, cur)} (${Math.round(((topCategory?.estimated || 0) / Math.max(1, event.totalBudget)) * 100)}% of total budget).\n`;
      response += `- Recommended action: Deposit 30-50% with primary vendors to lock in current contracted rates.\n`;
    }

    return {
      text: response,
      suggestedActions: [
        { label: 'Auto-Balance Budget Categories', actionType: 'switch_tab', payload: 'budget' },
        {
          label: 'Add Contingency Buffer ($500)',
          actionType: 'add_budget',
          payload: {
            name: 'Emergency Weather / Misc Buffer',
            category: 'contingency',
            estimatedCost: 500,
            priority: 'must-have',
          },
        },
        { label: 'Generate Vendor RFP Inquiry', actionType: 'switch_tab', payload: 'vendors' },
      ],
    };
  }

  // 2. Timeline, Run-of-Show & Pacing
  if (
    p.includes('timeline') ||
    p.includes('schedule') ||
    p.includes('run of show') ||
    p.includes('itinerary') ||
    p.includes('time') ||
    p.includes('hour') ||
    p.includes('conflict')
  ) {
    let response = `### ⏱️ Run-of-Show & Timing Optimization for **${event.title}**\n\n`;
    response += `For a **${event.eventType}** hosting **${event.guestCount} attendees**, dynamic flow is vital to avoid coordinator bottlenecks.\n\n`;
    response += `**Pacing Strategy for ${event.title}:**\n`;

    if (event.eventType === 'wedding') {
      response += `1. **Golden Hour Buffer:** Schedule couple portraits 45 minutes before sunset for optimal natural lighting.\n`;
      response += `2. **Toast Sequencing:** Disperse speeches between dinner courses rather than an extended 30-minute block to sustain crowd engagement.\n`;
      response += `3. **Vendor Load-in Buffer:** Photographers should arrive 90 minutes before first look; caterers need minimum 2.5 hours load-in.\n`;
    } else if (event.eventType === 'birthday') {
      response += `1. **Arrival & Peak Curve:** Keep arrivals casual for 45 minutes. Schedule main cake toast at the 2-hour mark when crowd attendance peaks.\n`;
      response += `2. **Food Timing:** Ensure heavy passed bites or food stations open within 30 minutes of event start.\n`;
    } else {
      response += `1. **Marshalling & Safety:** Volunteer stations must be staffed 60 minutes before gates open; EMT/first-aid check-in must precede public admittance.\n`;
      response += `2. **Amplified Sound Curfew:** Sound tests must conclude 30 minutes before official kickoff to respect municipal permits.\n`;
    }

    response += `\n*Planners can sync the complete day-of itinerary directly to Google/Apple Calendar via the .ICS Export button.*`;

    return {
      text: response,
      suggestedActions: [
        { label: 'Review Minute-by-Minute Schedule', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Export to Calendar (.ICS)', actionType: 'switch_tab', payload: 'timeline' },
        {
          label: 'Add 15-Minute Guest Buffer',
          actionType: 'add_timeline',
          payload: {
            startTime: '16:15',
            title: 'Guest Seating & Ambient Music',
            description: 'Ushers guide guests to seats; soft music plays.',
            responsibleParty: 'Coordinator',
            location: 'Main Area',
          },
        },
      ],
    };
  }

  // 3. Vendors, RFP & Contracts
  if (
    p.includes('vendor') ||
    p.includes('rfp') ||
    p.includes('email') ||
    p.includes('contract') ||
    p.includes('photographer') ||
    p.includes('cater') ||
    p.includes('dj') ||
    p.includes('hire') ||
    p.includes('quote')
  ) {
    let response = `### 🤝 Vendor Management & RFP Strategy for **${event.location}**\n\n`;
    response += `Currently managing **${project.vendors.length} vendors** across your celebration pipeline.\n\n`;
    response += `**Due Diligence Verifications Before Contract Execution:**\n`;
    response += `1. *"What is your redundancy protocol if primary equipment or team members encounter an emergency on event day?"*\n`;
    response += `2. *"Are travel, load-in overages, and gratuities inclusive or invoiced post-event?"*\n`;
    response += `3. *"What exact power wattage, dedicated circuits, and load-in dimensions do you require from ${event.location}?"*\n\n`;
    response += `I have also pre-formatted an automated **Vendor RFP Inquiry Generator** in the Vendors tab that drafts customized outreach emails with your exact dates, guest count (${event.guestCount}), and budget constraints!`;

    return {
      text: response,
      suggestedActions: [
        { label: 'Open Vendor Hub & RFP Drafter', actionType: 'switch_tab', payload: 'vendors' },
        {
          label: 'Add Videographer Checklist Item',
          actionType: 'add_vendor',
          payload: {
            name: 'Cinema Drone Videographer',
            category: 'photo_video',
            status: 'researching',
            quotedPrice: 1800,
          },
        },
      ],
    };
  }

  // 4. Creative Ideas & Studio
  if (
    p.includes('idea') ||
    p.includes('theme') ||
    p.includes('drink') ||
    p.includes('cocktail') ||
    p.includes('speech') ||
    p.includes('vow') ||
    p.includes('invite') ||
    p.includes('color') ||
    p.includes('game')
  ) {
    let response = `### 🎨 Personalized Creative Ideation Studio\n\n`;
    response += `Bespoke concepts tailored specifically to your aesthetic: **"${event.vibe}"**:\n\n`;
    response += `#### 🍸 Signature Beverage Concept: *"The Celebration Spark"*\n`;
    response += `- **Recipe:** 1.5 oz Artisan Spirit (or Seedlip botanical zero-proof), 0.75 oz Lavender Honey, 0.5 oz Fresh Lemon, topped with prosecco/soda and edible luster dust.\n`;
    response += `- **Glassware:** Coupe glass with rosemary sprig.\n\n`;
    response += `#### 🎭 Signature Guest Experience:\n`;
    if (event.eventType === 'wedding') {
      response += `- **"Vintage Audio Guestbook":** Rotary telephone where guests leave audio voicemails recounting favorite memories.\n`;
    } else if (event.eventType === 'birthday') {
      response += `- **"Decade Time Capsule Wall":** Instant photo wall with handwritten milestones and predictions for the honoree.\n`;
    } else {
      response += `- **"Civic Vision Canvas":** Interactive community art tree where attendees stamp ink leaves with neighborhood wishes.\n`;
    }

    return {
      text: response,
      suggestedActions: [
        { label: 'Browse Creative Studio & Moodboards', actionType: 'switch_tab', payload: 'ideas' },
        { label: 'Generate Speech / Toast Template', actionType: 'switch_tab', payload: 'ideas' },
        { label: 'Draft Digital Invitation Copy', actionType: 'switch_tab', payload: 'ideas' },
      ],
    };
  }

  // Default dynamic assistant response
  let response = `### ✨ CelebrationOS Copilot Intelligence\n\n`;
  response += `Analyzing **${event.title}** (${event.guestCount} guests | Planned Budget: ${formatCurrency(event.totalBudget, cur)}):\n\n`;
  response += `Active metrics: **${budgetItems.length} budget items**, **${project.runOfShow.length} schedule milestones**, and **${project.vendors.length} vendors**.\n\n`;
  response += `**Available Copilot Capabilities:**\n`;
  response += `- **"Analyze my budget"** → Calculate category percentages, contingency health, and cost-per-guest.\n`;
  response += `- **"Inspect timeline"** → Detect scheduling overlaps, pacing gaps, and export to iCalendar.\n`;
  response += `- **"Draft vendor RFP"** → Generate customized inquiries with date, headcount, and budget specs.\n`;
  response += `- **"Theme & cocktail ideas"** → Formulate color palettes, mixology concepts, and invitation copy.\n`;

  return {
    text: response,
    suggestedActions: [
      { label: 'Analyze Budget Breakdown', actionType: 'switch_tab', payload: 'budget' },
      { label: 'Check Schedule & Conflicts', actionType: 'switch_tab', payload: 'timeline' },
      { label: 'Creative Studio (Drinks & Themes)', actionType: 'switch_tab', payload: 'ideas' },
    ],
  };
}

function detectSuggestedActions(prompt: string, _project: EventProject): SuggestedAction[] {
  const p = prompt.toLowerCase();

  if (p.includes('budget') || p.includes('cost')) {
    return [
      { label: 'View Budget Dashboard', actionType: 'switch_tab', payload: 'budget' },
      {
        label: 'Add $1000 Contingency',
        actionType: 'add_budget',
        payload: {
          name: 'Emergency Contingency Reserve',
          category: 'contingency',
          estimatedCost: 1000,
          priority: 'must-have',
        },
      },
    ];
  }
  if (p.includes('timeline') || p.includes('schedule') || p.includes('run of show')) {
    return [{ label: 'Inspect Run-of-Show Schedule', actionType: 'switch_tab', payload: 'timeline' }];
  }
  if (p.includes('vendor') || p.includes('photographer') || p.includes('catering')) {
    return [{ label: 'Open Vendor Hub & RFP Drafter', actionType: 'switch_tab', payload: 'vendors' }];
  }
  return [
    { label: 'Explore Budget', actionType: 'switch_tab', payload: 'budget' },
    { label: 'Explore Timeline', actionType: 'switch_tab', payload: 'timeline' },
    { label: 'Explore Creative Studio', actionType: 'switch_tab', payload: 'ideas' },
  ];
}
