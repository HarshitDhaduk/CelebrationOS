import { useState } from 'react';
import { useEventProject } from './hooks/useEventProject';
import { useDarkMode } from './hooks/useDarkMode';
import { useGeminiApiKey } from './hooks/useGeminiApiKey';
import { useAccessibilityState } from './hooks/useAccessibilityState';
import { AccessibilityBar } from './components/common/AccessibilityBar';
import { Navbar } from './components/layout/Navbar';
import { ApiKeyModal } from './components/layout/ApiKeyModal';
import { ExportModal } from './components/layout/ExportModal';
import { EventHero } from './components/overview/EventHero';
import { BudgetManager } from './components/budget/BudgetManager';
import { TimelineManager } from './components/timeline/TimelineManager';
import { VendorManager } from './components/vendors/VendorManager';
import { CreativeStudio } from './components/ideas/CreativeStudio';
import { AssistantDrawer } from './components/assistant/AssistantDrawer';
import {
  Sparkles,
  PieChart,
  Calendar,
  Briefcase,
  Palette,
  LayoutDashboard,
  Heart,
} from 'lucide-react';

type TabId = 'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas';

export default function App() {
  const {
    project,
    selectEventType,
    changeCurrency,
    updateEventDetails,
    updateBudgetItems,
    updateRunOfShow,
    updateMilestones,
    updateVendors,
    updateChecklist,
    updateThemes,
    updateInvites,
    updateDrinks,
    updateSpeeches,
    updateChatHistory,
    importProject,
  } = useEventProject();

  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { apiKey, updateApiKey } = useGeminiApiKey();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);

  // Global Accessibility (a11y) Hook for WCAG AAA compliance and hotkeys
  const accessibility = useAccessibilityState({
    onSelectTab: (tab) => setActiveTab(tab as TabId),
    onToggleCopilot: () => setIsAssistantOpen((prev) => !prev),
    onCloseModals: () => {
      setIsApiKeyModalOpen(false);
      setIsExportModalOpen(false);
      setIsAssistantOpen(false);
    },
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* WCAG 2.1 AA / AAA Accessibility Controls Toolbar */}
      <AccessibilityBar accessibility={accessibility} />

      {/* Skip to Main Content Link for Screen Readers & Keyboard Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-rose-600 focus:text-white focus:rounded-xl focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 font-semibold text-xs"
      >
        Skip to main content
      </a>

      {/* Top Sticky Navbar */}
      <Navbar
        currentEventType={project.event.eventType}
        onSelectEventType={selectEventType}
        currency={project.event.currency}
        onChangeCurrency={changeCurrency}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Planning Container */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 focus:outline-none"
      >
        {/* Event Hero Overview Header */}
        <EventHero
          event={project.event}
          budgetItems={project.budgetItems}
          milestones={project.milestones}
          vendors={project.vendors}
          currency={project.event.currency}
          onUpdateEvent={updateEventDetails}
        />

        {/* Primary Tabs Navigation Bar with WAI-ARIA tablist semantics */}
        <div
          role="tablist"
          aria-label="Planning workspace modules"
          className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-1 text-sm font-semibold"
        >
          <button
            type="button"
            role="tab"
            id="tab-overview"
            aria-selected={activeTab === 'overview'}
            aria-controls="panel-overview"
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'overview'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview</span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-budget"
            aria-selected={activeTab === 'budget'}
            aria-controls="panel-budget"
            onClick={() => setActiveTab('budget')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'budget'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Budget Engine</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500">
              {project.budgetItems.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-timeline"
            aria-selected={activeTab === 'timeline'}
            aria-controls="panel-timeline"
            onClick={() => setActiveTab('timeline')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'timeline'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Timeline & Run-of-Show</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500">
              {project.runOfShow.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-vendors"
            aria-selected={activeTab === 'vendors'}
            aria-controls="panel-vendors"
            onClick={() => setActiveTab('vendors')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'vendors'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Vendors & Checklists</span>
            <span className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md text-slate-500">
              {project.vendors.length}
            </span>
          </button>

          <button
            type="button"
            role="tab"
            id="tab-ideas"
            aria-selected={activeTab === 'ideas'}
            aria-controls="panel-ideas"
            onClick={() => setActiveTab('ideas')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'ideas'
                ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Creative Studio</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="pt-2 focus:outline-none"
        >
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Dual quick overview of budget and timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <PieChart className="w-4 h-4 text-rose-500" />
                      Budget Summary Snapshot
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('budget')}
                      className="text-xs text-rose-600 dark:text-rose-400 font-semibold hover:underline"
                    >
                      View Full Budget →
                    </button>
                  </div>
                  <BudgetManager
                    items={project.budgetItems}
                    totalBudget={project.event.totalBudget}
                    guestCount={project.event.guestCount}
                    currency={project.event.currency}
                    eventType={project.event.eventType}
                    onUpdateItems={updateBudgetItems}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      Day-of Run of Show Pacing
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('timeline')}
                      className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      View Full Schedule →
                    </button>
                  </div>
                  <TimelineManager
                    project={project}
                    onUpdateRunOfShow={updateRunOfShow}
                    onUpdateMilestones={updateMilestones}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <BudgetManager
              items={project.budgetItems}
              totalBudget={project.event.totalBudget}
              guestCount={project.event.guestCount}
              currency={project.event.currency}
              eventType={project.event.eventType}
              onUpdateItems={updateBudgetItems}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineManager
              project={project}
              onUpdateRunOfShow={updateRunOfShow}
              onUpdateMilestones={updateMilestones}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorManager
              project={project}
              currency={project.event.currency}
              onUpdateVendors={updateVendors}
              onUpdateChecklist={updateChecklist}
            />
          )}

          {activeTab === 'ideas' && (
            <CreativeStudio
              project={project}
              onUpdateThemes={updateThemes}
              onUpdateInvites={updateInvites}
              onUpdateDrinks={updateDrinks}
              onUpdateSpeeches={updateSpeeches}
            />
          )}
        </div>
      </main>

      {/* Floating Copilot Button */}
      <button
        type="button"
        onClick={() => setIsAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 font-bold text-sm group"
        aria-label="Open CelebrationOS AI Copilot"
      >
        <Sparkles className="w-5 h-5 animate-pulse-subtle" />
        <span className="hidden sm:inline pr-1">Ask Event Copilot</span>
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400" />
        </span>
      </button>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 mt-12 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              CelebrationOS
            </span>
            <span>• Google PromptWars Challenge 5 Submission</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> by Harshit Dhaduk
            </span>
            <a
              href="https://github.com/HarshitDhaduk/CelebrationOS"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-white"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </footer>

      {/* Assistant Slide-over Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        project={project}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onSwitchTab={(tabId) => setActiveTab(tabId as TabId)}
        onAddBudgetItem={(item) => updateBudgetItems([...project.budgetItems, item])}
        onAddScheduleItem={(item) => updateRunOfShow([...project.runOfShow, item])}
        onUpdateChatHistory={updateChatHistory}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={updateApiKey}
      />

      {/* Export / Sync Hub Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        onImportProject={importProject}
      />
    </div>
  );
}
