import React, { useState, useEffect } from 'react';
import { EventProject, EventType, Currency, BudgetItem, RunOfShowItem, MilestoneTask, Vendor, VendorChecklist } from './types';
import { loadProjectFromStorage, saveProjectToStorage, getPresetByEventType, getGeminiApiKey } from './services/storage';
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

export default function App() {
  const [project, setProject] = useState<EventProject>(() => loadProjectFromStorage());
  const [activeTab, setActiveTab] = useState<'overview' | 'budget' | 'timeline' | 'vendors' | 'ideas'>('overview');
  const [apiKey, setApiKey] = useState<string>(() => getGeminiApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Persist project on change
  useEffect(() => {
    saveProjectToStorage(project);
  }, [project]);

  const handleSelectEventType = (type: EventType) => {
    const preset = getPresetByEventType(type);
    setProject(preset);
  };

  const handleChangeCurrency = (curr: Currency) => {
    setProject({
      ...project,
      event: {
        ...project.event,
        currency: curr,
      },
    });
  };

  const handleUpdateEvent = (updatedDetails: any) => {
    setProject({
      ...project,
      event: updatedDetails,
    });
  };

  const handleUpdateBudgetItems = (items: BudgetItem[]) => {
    setProject({
      ...project,
      budgetItems: items,
    });
  };

  const handleUpdateRunOfShow = (items: RunOfShowItem[]) => {
    setProject({
      ...project,
      runOfShow: items,
    });
  };

  const handleUpdateMilestones = (milestones: MilestoneTask[]) => {
    setProject({
      ...project,
      milestones,
    });
  };

  const handleUpdateVendors = (vendors: Vendor[]) => {
    setProject({
      ...project,
      vendors,
    });
  };

  const handleUpdateChecklist = (checklist: VendorChecklist[]) => {
    setProject({
      ...project,
      vendorChecklist: checklist,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentEventType={project.event.eventType}
        onSelectEventType={handleSelectEventType}
        currency={project.event.currency}
        onChangeCurrency={handleChangeCurrency}
        apiKey={apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Event Hero Overview Header */}
        <EventHero
          event={project.event}
          budgetItems={project.budgetItems}
          milestones={project.milestones}
          vendors={project.vendors}
          currency={project.event.currency}
          onUpdateEvent={handleUpdateEvent}
        />

        {/* Primary Tabs Navigation Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-1 overflow-x-auto pb-1 text-sm font-semibold">
          <button
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
        <div className="pt-2">
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
                    onUpdateItems={handleUpdateBudgetItems}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      Day-of Run of Show Pacing
                    </h3>
                    <button
                      onClick={() => setActiveTab('timeline')}
                      className="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:underline"
                    >
                      View Full Schedule →
                    </button>
                  </div>
                  <TimelineManager
                    project={project}
                    onUpdateRunOfShow={handleUpdateRunOfShow}
                    onUpdateMilestones={handleUpdateMilestones}
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
              onUpdateItems={handleUpdateBudgetItems}
            />
          )}

          {activeTab === 'timeline' && (
            <TimelineManager
              project={project}
              onUpdateRunOfShow={handleUpdateRunOfShow}
              onUpdateMilestones={handleUpdateMilestones}
            />
          )}

          {activeTab === 'vendors' && (
            <VendorManager
              project={project}
              currency={project.event.currency}
              onUpdateVendors={handleUpdateVendors}
              onUpdateChecklist={handleUpdateChecklist}
            />
          )}

          {activeTab === 'ideas' && (
            <CreativeStudio
              project={project}
              onUpdateThemes={(themes) => setProject({ ...project, creativeThemes: themes })}
              onUpdateInvites={(invites) => setProject({ ...project, invitations: invites })}
              onUpdateDrinks={(drinks) => setProject({ ...project, drinks })}
              onUpdateSpeeches={(speeches) => setProject({ ...project, speeches })}
            />
          )}
        </div>

      </main>

      {/* Floating Copilot Button */}
      <button
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
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
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
        onSwitchTab={(tabId) => setActiveTab(tabId as any)}
        onAddBudgetItem={(item) => handleUpdateBudgetItems([...project.budgetItems, item])}
        onAddScheduleItem={(item) => handleUpdateRunOfShow([...project.runOfShow, item])}
        onUpdateChatHistory={(history) => setProject({ ...project, chatHistory: history })}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        currentKey={apiKey}
        onSaveKey={(k) => setApiKey(k)}
      />

      {/* Export / Sync Hub Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        project={project}
        onImportProject={(imported) => setProject(imported)}
      />

    </div>
  );
}
