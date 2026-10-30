import React, { useState } from 'react';
import { EventProject, CreativeTheme, DigitalInvite, SignatureDrink, SpeechDraft } from '../../types';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import {
  Palette,
  Mail,
  Wine,
  Mic,
  Sparkles,
  Copy,
  Check,
  Heart,
} from 'lucide-react';

interface CreativeStudioProps {
  project: EventProject;
  onUpdateThemes?: (themes: CreativeTheme[]) => void;
  onUpdateInvites?: (invites: DigitalInvite[]) => void;
  onUpdateDrinks?: (drinks: SignatureDrink[]) => void;
  onUpdateSpeeches?: (speeches: SpeechDraft[]) => void;
}

export const CreativeStudio: React.FC<CreativeStudioProps> = ({
  project,
}) => {
  const [activeSection, setActiveSection] = useState<'themes' | 'invites' | 'drinks' | 'speeches'>('themes');
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const activeTheme = project.creativeThemes[project.activeThemeIndex] || project.creativeThemes[0];
  const activeInvite = project.invitations[0];
  const activeSpeech = project.speeches[0];

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(identifier);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  return (
    <div className="space-y-6">
      
      {/* Sub-navigation Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-1.5 overflow-x-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            onClick={() => setActiveSection('themes')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'themes'
                ? 'bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Theme & Palette</span>
          </button>

          <button
            onClick={() => setActiveSection('invites')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'invites'
                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Digital Invites</span>
          </button>

          <button
            onClick={() => setActiveSection('drinks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'drinks'
                ? 'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Wine className="w-3.5 h-3.5" />
            <span>Signature Drinks</span>
          </button>

          <button
            onClick={() => setActiveSection('speeches')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'speeches'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Speech & Toast Coach</span>
          </button>
        </div>

        <Badge variant="rose" size="md">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Creative Engine Active
        </Badge>
      </div>

      {/* SECTION 1: Theme & Moodboard Palette */}
      {activeSection === 'themes' && activeTheme && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-500">
                  Active Creative Concept
                </span>
                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-1">
                  {activeTheme.name}
                </h3>
                <p className="text-xs text-slate-500 font-medium italic mt-0.5">
                  "{activeTheme.tagline}"
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {activeTheme.description}
                </p>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleCopyText(JSON.stringify(activeTheme, null, 2), 'theme')}
                icon={copiedItem === 'theme' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedItem === 'theme' ? 'Copied Specs' : 'Copy Palette'}
              </Button>
            </div>

            {/* Color Swatches Grid */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Curated Color Swatches
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {activeTheme.palettes.map((swatch, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleCopyText(swatch.hex, `hex-${idx}`)}
                    className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div
                      className="h-16 w-full rounded-xl shadow-inner border border-black/10 group-hover:scale-[1.02] transition-transform"
                      style={{ backgroundColor: swatch.hex }}
                    />
                    <div className="mt-2 text-center">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {swatch.name}
                      </p>
                      <div className="flex items-center justify-center gap-1 mt-0.5">
                        <span className="font-mono text-[11px] text-slate-500">
                          {swatch.hex}
                        </span>
                        {copiedItem === `hex-${idx}` && (
                          <Check className="w-3 h-3 text-emerald-500" />
                        )}
                      </div>
                      <span className="text-[10px] text-rose-500 uppercase tracking-wider font-semibold">
                        {swatch.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decor Elements & Dress Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Key Decor & Ambiance Elements
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  {activeTheme.decorVibe.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Guest Dress Code Prompt
                </h4>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">
                  "{activeTheme.dressCodePrompt}"
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* SECTION 2: Digital Invites */}
      {activeSection === 'invites' && activeInvite && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formatted Invite Preview Card */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-gradient-to-br from-amber-50/40 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-rose-950/20 border-rose-200/60 dark:border-rose-900/40 shadow-lg">
              <div className="max-w-xl mx-auto text-center space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 text-xl font-serif">
                  ✨
                </div>

                <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                  {activeInvite.hosts}
                </p>

                <h3 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 dark:text-white tracking-tight">
                  {activeInvite.headline}
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans px-4">
                  {activeInvite.fullInvitationText}
                </p>

                <div className="py-4 border-y border-rose-200/60 dark:border-rose-900/40 my-4 space-y-1">
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {activeInvite.dateAndLocation}
                  </p>
                  <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                    Attire: {activeInvite.dressCode}
                  </p>
                </div>

                <div className="space-y-1 text-xs text-slate-500">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Kindly RSVP by: {activeInvite.rsvpDeadline}
                  </p>
                </div>

                {activeInvite.quirkyPointers.length > 0 && (
                  <div className="pt-4 text-left bg-white/60 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <p className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[10px]">
                      Helpful Guest Notes:
                    </p>
                    {activeInvite.quirkyPointers.map((p, i) => (
                      <p key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-500">•</span>
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Quick Copy & Export Action Sidebar */}
          <div>
            <Card className="p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Share Invitation
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Copy this complete formatted invitation copy ready for WhatsApp, Paperless Post, Partiful, or printed stationery.
              </p>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() =>
                  handleCopyText(
                    `${activeInvite.headline}\n\n${activeInvite.fullInvitationText}\n\nDate & Location: ${activeInvite.dateAndLocation}\nAttire: ${activeInvite.dressCode}\nRSVP Deadline: ${activeInvite.rsvpDeadline}`,
                    'full-invite'
                  )
                }
                icon={copiedItem === 'full-invite' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              >
                {copiedItem === 'full-invite' ? 'Copied Invitation!' : 'Copy Full Invite Text'}
              </Button>
            </Card>
          </div>
        </div>
      )}

      {/* SECTION 3: Signature Drinks */}
      {activeSection === 'drinks' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.drinks.map((drink, idx) => (
            <Card key={idx} className="p-6 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant={drink.type === 'cocktail' ? 'rose' : drink.type === 'mocktail' ? 'emerald' : 'amber'}
                    size="sm"
                  >
                    {drink.type.toUpperCase()}
                  </Badge>

                  <span className="text-xs text-slate-400 font-medium">
                    Glassware: {drink.glassware}
                  </span>
                </div>

                <h3 className="text-lg font-bold font-serif text-slate-900 dark:text-white mt-2">
                  {drink.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {drink.description}
                </p>

                {/* Ingredients list */}
                <div className="mt-4 space-y-1.5">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Mixology Recipe & Proportions:
                  </h4>
                  <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300 font-mono">
                    {drink.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-3 text-xs text-slate-500">
                  <strong>Garnish:</strong> {drink.garnish}
                </div>

                {drink.funFactOrToast && (
                  <p className="mt-3 text-xs text-amber-800 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900 italic">
                    💡 "{drink.funFactOrToast}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    handleCopyText(
                      `${drink.name} (${drink.type.toUpperCase()})\nGlassware: ${drink.glassware}\n\nIngredients:\n${drink.ingredients.join('\n')}\nGarnish: ${drink.garnish}\n\nNote: ${drink.funFactOrToast}`,
                      `drink-${idx}`
                    )
                  }
                  icon={copiedItem === `drink-${idx}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                >
                  {copiedItem === `drink-${idx}` ? 'Copied Recipe' : 'Copy Recipe'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* SECTION 4: Speech & Toast Coach */}
      {activeSection === 'speeches' && activeSpeech && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="purple" size="sm">
                    {activeSpeech.speakerRole}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    Est. Length: ~{activeSpeech.durationMinutes} minutes
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-xs text-rose-500 font-semibold capitalize">
                    Tone: {activeSpeech.tone}
                  </span>
                </div>

                <h3 className="text-xl font-bold font-serif text-slate-900 dark:text-white mt-2">
                  {activeSpeech.title}
                </h3>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  handleCopyText(
                    `${activeSpeech.title}\nRole: ${activeSpeech.speakerRole}\n\n${activeSpeech.bodyParagraphs.join('\n\n')}\n\nClosing Toast:\n"${activeSpeech.closingToast}"`,
                    'speech'
                  )
                }
                icon={copiedItem === 'speech' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              >
                {copiedItem === 'speech' ? 'Copied Speech' : 'Copy Speech'}
              </Button>
            </div>

            {/* Speech Body */}
            <div className="mt-6 space-y-4 max-w-3xl text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {activeSpeech.bodyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}

              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-950 dark:text-rose-100 font-serif italic text-base">
                🥂 <strong>The Closing Toast:</strong> "{activeSpeech.closingToast}"
              </div>
            </div>
          </Card>
        </div>
      )}

    </div>
  );
};
