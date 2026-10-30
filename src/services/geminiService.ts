import { EventProject, SuggestedAction } from '../types';
import { calculateBudgetMetrics, formatCurrency } from '../utils/budgetEngine';
import { sanitizeText } from '../utils/security';

export interface CopilotGenerationResult {
  text: string;
  suggestedActions?: SuggestedAction[];
  isLiveApi: boolean;
}

export async function askEventCopilot(
  userPrompt: string,
  project: EventProject,
  apiKey?: string
): Promise<CopilotGenerationResult> {
  const sanitizedPrompt = sanitizeText(userPrompt, 1500);
  const cleanKey = apiKey?.trim();

  if (cleanKey) {
    try {
      const response = await callGeminiLive(sanitizedPrompt, project, cleanKey);
      return {
        ...response,
        isLiveApi: true,
      };
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Network limitation';
      console.warn('Gemini API call encountered an issue, falling back to intelligent offline assistant engine:', err);
      // Fallback gracefully so user experience is not disrupted
      const simulated = generateContextualSimulation(sanitizedPrompt, project);
      return {
        text: `*[Live Gemini Note: Switched to Intelligent Local Engine due to API response: ${errMessage}]*\n\n${simulated.text}`,
        suggestedActions: simulated.suggestedActions,
        isLiveApi: false,
      };
    }
  }

  // Offline intelligent simulation engine
  const simulated = generateContextualSimulation(sanitizedPrompt, project);
  return {
    ...simulated,
    isLiveApi: false,
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

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUSER QUESTION: ${prompt}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: 1200,
    }
  };

  // Try gemini-2.5-flash, fallback to gemini-1.5-flash
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

  // Detect potential context actions based on user query
  const suggestedActions = detectSuggestedActions(prompt, project);

  return { text, suggestedActions };
}

export function generateContextualSimulation(
  prompt: string,
  project: EventProject
): { text: string; suggestedActions?: SuggestedAction[] } {
  const p = prompt.toLowerCase();
  const { event, budgetItems } = project;
  const metrics = calculateBudgetMetrics(budgetItems, event.totalBudget, event.guestCount);
  const cur = event.currency;

  // 1. Budget Optimization & Analysis
  if (p.includes('budget') || p.includes('cost') || p.includes('spend') || p.includes('money') || p.includes('save') || p.includes('expensive')) {
    const topCategory = metrics.categorySummaries[0];
    const isOver = metrics.isOverBudget;

    let response = `### 📊 Budget Intelligence Analysis for **${event.title}**\n\n`;
    response += `Here is your real-time financial health snapshot:\n\n`;
    response += `- **Total Planned Budget:** ${formatCurrency(event.totalBudget, cur)}\n`;
    response += `- **Estimated Commitments:** ${formatCurrency(metrics.totalEstimated, cur)} (${Math.round((metrics.totalEstimated / Math.max(1, event.totalBudget)) * 100)}% allocated)\n`;
    response += `- **Actual Paid So Far:** ${formatCurrency(metrics.totalPaid, cur)}\n`;
    response += `- **Cost Per Guest:** ~${formatCurrency(metrics.costPerGuestEstimated, cur)} / attendee (based on ${event.guestCount} guests)\n`;
    response += `- **Contingency Fund:** ${formatCurrency(metrics.contingencyTotal, cur)} (${metrics.contingencyPercentage.toFixed(1)}% of total budget)\n\n`;

    if (isOver) {
      response += `> ⚠️ **Over-Budget Advisory:** Your current estimated allocations exceed the target budget by **${formatCurrency(Math.abs(metrics.variance), cur)}**. \n\n`;
      response += `**Recommended Cost Optimization Levers:**\n`;
      response += `1. **Catering Tiering:** Trim the appetizer pass from 5 items to 3 items, or transition the final hour bar to beer/wine only to save ~8-12%.\n`;
      response += `2. **Decor Dual-Purposing:** Repurpose ceremony arch florals as sweetheart table or head table backdrops for the reception.\n`;
      response += `3. **Digital Stationery:** Shift save-the-dates and RSVP management entirely digital to recapture up to $400 in printing & postage.\n`;
    } else {
      response += `> ✅ **Financial Health: Strong.** You have a healthy buffer of **${formatCurrency(metrics.variance, cur)}** remaining for unexpected additions or upgrades.\n\n`;
      response += `**Strategic Allocations for ${event.eventType.toUpperCase()}:**\n`;
      response += `- Largest single expenditure: **${topCategory?.category || 'Catering'}** at ${formatCurrency(topCategory?.estimated || 0, cur)}.\n`;
      response += `- We recommend locking in remaining vendor contracts with 30-50% deposits to freeze 2026 pricing.\n`;
    }

    return {
      text: response,
      suggestedActions: [
        { label: 'Auto-Balance Budget Categories', actionType: 'switch_tab', payload: 'budget' },
        { label: 'Add Contingency Buffer ($500)', actionType: 'add_budget', payload: { name: 'Emergency Weather / Misc Buffer', category: 'contingency', estimatedCost: 500, priority: 'must-have' } },
        { label: 'Generate Vendor RFP Inquiry', actionType: 'switch_tab', payload: 'vendors' }
      ]
    };
  }

  // 2. Timeline, Run-of-Show & Schedule
  if (p.includes('timeline') || p.includes('schedule') || p.includes('run of show') || p.includes('itinerary') || p.includes('time') || p.includes('hour')) {
    let response = `### ⏱️ Run-of-Show & Timing Optimization\n\n`;
    response += `For a **${event.eventType}** with **${event.guestCount} attendees**, flow and pacing are critical to prevent guest fatigue and vendor bottlenecks.\n\n`;
    response += `**Key Pacing Recommendations for ${event.title}:**\n`;
    
    if (event.eventType === 'wedding') {
      response += `1. **The Golden Hour Buffer:** Schedule couple portraits 45 minutes before sunset. This ensures peak lighting without leaving guests waiting alone for more than 1 hour during cocktails.\n`;
      response += `2. **Speech Pacing:** Disperse speeches between dinner courses (e.g. Welcome toast after salads, Best Man & MOH toasts after main course) rather than one long 30-minute block.\n`;
      response += `3. **Vendor Arrival Windows:** Photographers should arrive minimum 90 minutes before first look; caterers require 2.5 hours load-in before guest arrival.\n`;
    } else if (event.eventType === 'birthday') {
      response += `1. **Energy Curve:** Keep the first 45 minutes casual for arrivals and drinks. Peak celebration (cake ceremony & toast) should occur at the 2-hour mark when crowd energy is highest.\n`;
      response += `2. **Food Availability:** Food trucks or heavy bites should open within 30 minutes of event start to keep guests mingling comfortably.\n`;
    } else {
      response += `1. **Civic Marshalling:** Volunteer stations must be staffed 60 minutes before gates open. First aid EMT check-in must happen before public admittance.\n`;
      response += `2. **Staging & Sound Ordinance:** All amplified sound tests must be completed 30 minutes before official opening ceremonies.\n`;
    }

    response += `\n*You can export your complete day-of itinerary directly to your phone calendar via the .ICS Export button in the Timeline tab.*`;

    return {
      text: response,
      suggestedActions: [
        { label: 'Review Minute-by-Minute Schedule', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Export to Google/Apple Calendar (.ICS)', actionType: 'switch_tab', payload: 'timeline' },
        { label: 'Add 15-Minute Guest Buffer', actionType: 'add_timeline', payload: { startTime: '16:15', title: 'Guest Seating & Ambient Music', description: 'Ushers guide guests to seats; soft music plays.', responsibleParty: 'Coordinator', location: 'Main Area' } }
      ]
    };
  }

  // 3. Vendors, RFP, Inquiries & Negotiation
  if (p.includes('vendor') || p.includes('rfp') || p.includes('email') || p.includes('contract') || p.includes('photographer') || p.includes('cater') || p.includes('dj') || p.includes('hire')) {
    let response = `### 🤝 Vendor Management & RFP Strategy\n\n`;
    response += `Finding and locking in high-quality vendors for **${event.location}** requires clear specifications upfront.\n\n`;
    response += `**3 Critical Questions to Ask Every Vendor Before Signing:**\n`;
    response += `1. *"What is your backup plan if your lead equipment fails or your primary team member is ill on event day?"*\n`;
    response += `2. *"Are travel, overtime hourly rates, and standard gratuities included, or will they be invoiced separately?"*\n`;
    response += `3. *"What are your exact electrical, staging, and load-in space requirements from the venue?"*\n\n`;
    response += `I have also pre-formatted an automated **Vendor RFP Inquiry Generator** in the Vendors tab that drafts customized outreach emails with your exact dates, guest count, and budget constraints!`;

    return {
      text: response,
      suggestedActions: [
        { label: 'Open Vendor Hub & RFP Drafter', actionType: 'switch_tab', payload: 'vendors' },
        { label: 'Add Videographer Checklist Item', actionType: 'add_vendor', payload: { name: 'Cinema Drone Videographer', category: 'photo_video', status: 'researching', quotedPrice: 1800 } }
      ]
    };
  }

  // 4. Creative Ideas: Theme, Cocktails, Speeches, Invites
  if (p.includes('idea') || p.includes('theme') || p.includes('drink') || p.includes('cocktail') || p.includes('speech') || p.includes('vow') || p.includes('invite') || p.includes('color') || p.includes('game')) {
    let response = `### 🎨 Personalized Creative Ideation Studio\n\n`;
    response += `Here are bespoke concepts tailored specifically to your aesthetic: **"${event.vibe}"**:\n\n`;
    response += `#### 🍸 Signature Beverage Concept: *"The Celestial Spark"*\n`;
    response += `- **Ingredients:** 1.5 oz Artisan Spirit (or Seedlip Zero-Proof), 0.75 oz Lavender Honey Syrup, 0.5 oz Fresh Lemon, sparkling float with edible gold glitter dust.\n`;
    response += `- **Presentation:** Coupe glass with a rosemary sprig and dehydrated lemon wheel.\n\n`;
    response += `#### 🎭 Interactive Guest Activation Idea:\n`;
    if (event.eventType === 'wedding') {
      response += `- **"Audio Guestbook Telephone":** Set up a vintage rotary telephone where guests pick up the receiver, hear a recorded welcome from the couple, and leave heartfelt audio voicemails all evening.\n`;
    } else if (event.eventType === 'birthday') {
      response += `- **"Decade Time Capsule Wall":** Polaroid cameras with a custom pegboard where guests pin photos next to funny handwritten predictions for the honoree's next decade.\n`;
    } else {
      response += `- **"Community Vision Tree":** Large canvas silhouette where attendees stamp colorful ink leaves with handwritten hopes for the neighborhood.\n`;
    }

    return {
      text: response,
      suggestedActions: [
        { label: 'Browse Creative Studio & Moodboards', actionType: 'switch_tab', payload: 'ideas' },
        { label: 'Generate Custom Speech / Toast', actionType: 'switch_tab', payload: 'ideas' },
        { label: 'Draft Invitation Copy', actionType: 'switch_tab', payload: 'ideas' }
      ]
    };
  }

  // Default dynamic assistant response
  let response = `### ✨ CelebrationOS Copilot Intelligence\n\n`;
  response += `I'm analyzing **${event.title}** (${event.guestCount} guests | Budget: ${formatCurrency(event.totalBudget, cur)}):\n\n`;
  response += `You are currently tracking **${budgetItems.length} budget items**, **${project.runOfShow.length} schedule milestones**, and **${project.vendors.length} vendors**.\n\n`;
  response += `**How would you like to proceed?**\n`;
  response += `- **"Optimize my budget"** → Calculate category ratios, contingency buffers, and cost-per-guest.\n`;
  response += `- **"Review run-of-show"** → Detect schedule overlaps, pacing conflicts, and generate calendar export.\n`;
  response += `- **"Draft vendor inquiry"** → Generate customized RFP emails for venues, caterers, or photographers.\n`;
  response += `- **"Brainstorm theme & cocktails"** → Curate color palettes, signature drinks, and invitation drafts.\n`;

  return {
    text: response,
    suggestedActions: [
      { label: 'Analyze Budget Breakdown', actionType: 'switch_tab', payload: 'budget' },
      { label: 'Check Schedule & Conflicts', actionType: 'switch_tab', payload: 'timeline' },
      { label: 'Creative Studio (Drinks & Themes)', actionType: 'switch_tab', payload: 'ideas' }
    ]
  };
}

function detectSuggestedActions(prompt: string, _project: EventProject): SuggestedAction[] {
  const p = prompt.toLowerCase();

  if (p.includes('budget') || p.includes('cost')) {
    return [
      { label: 'View Budget Dashboard', actionType: 'switch_tab', payload: 'budget' },
      { label: 'Add $1000 Contingency', actionType: 'add_budget', payload: { name: 'Emergency Contingency Reserve', category: 'contingency', estimatedCost: 1000, priority: 'must-have' } }
    ];
  }
  if (p.includes('timeline') || p.includes('schedule') || p.includes('run of show')) {
    return [
      { label: 'Inspect Run-of-Show Schedule', actionType: 'switch_tab', payload: 'timeline' }
    ];
  }
  if (p.includes('vendor') || p.includes('photographer') || p.includes('catering')) {
    return [
      { label: 'Open Vendor Hub & RFP Drafter', actionType: 'switch_tab', payload: 'vendors' }
    ];
  }
  return [
    { label: 'Explore Budget', actionType: 'switch_tab', payload: 'budget' },
    { label: 'Explore Timeline', actionType: 'switch_tab', payload: 'timeline' },
    { label: 'Explore Creative Studio', actionType: 'switch_tab', payload: 'ideas' }
  ];
}
