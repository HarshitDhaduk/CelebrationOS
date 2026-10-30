import React, { useState, useRef, useEffect } from 'react';
import { EventProject, AssistantMessage, BudgetItem, RunOfShowItem, SuggestedAction, BudgetCategory } from '../../types';
import { Button } from '../common/Button';
import { askEventCopilot } from '../../services/geminiService';
import {
  Sparkles,
  X,
  Send,
  Wand2,
  Key,
  ArrowRight,
  Bot,
  User,
} from 'lucide-react';

interface AssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  project: EventProject;
  apiKey: string;
  onOpenApiKeyModal: () => void;
  onSwitchTab: (tabId: string) => void;
  onAddBudgetItem: (item: BudgetItem) => void;
  onAddScheduleItem: (item: RunOfShowItem) => void;
  onUpdateChatHistory: (messages: AssistantMessage[]) => void;
}

export const AssistantDrawer: React.FC<AssistantDrawerProps> = ({
  isOpen,
  onClose,
  project,
  apiKey,
  onOpenApiKeyModal,
  onSwitchTab,
  onAddBudgetItem,
  onAddScheduleItem,
  onUpdateChatHistory,
}) => {
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'How is my budget looking for this event?',
    'Review my run-of-show schedule for pacing issues',
    'Write a vendor RFP inquiry email for catering',
    'Suggest a signature cocktail & mocktail recipe',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, project.chatHistory]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isGenerating) return;

    const userMessage: AssistantMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...project.chatHistory, userMessage];
    onUpdateChatHistory(newHistory);
    setInputText('');
    setIsGenerating(true);

    try {
      const result = await askEventCopilot(query, project, apiKey);

      const botMessage: AssistantMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        content: result.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: result.suggestedActions,
      };

      onUpdateChatHistory([...newHistory, botMessage]);
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : 'Please try again.';
      const errorMessage: AssistantMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        content: `Apologies, I encountered an issue processing that: ${errMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      onUpdateChatHistory([...newHistory, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleActionClick = (action: SuggestedAction) => {
    if (action.actionType === 'switch_tab' && typeof action.payload === 'string') {
      onSwitchTab(action.payload);
      onClose();
    } else if (action.actionType === 'add_budget' && action.payload && typeof action.payload === 'object') {
      const payload = action.payload as Partial<BudgetItem>;
      onAddBudgetItem({
        id: `ai-b-${Date.now()}`,
        name: payload.name || 'AI Added Item',
        category: (payload.category as BudgetCategory) || 'contingency',
        estimatedCost: payload.estimatedCost || 500,
        actualCost: 0,
        paidAmount: 0,
        isPaid: false,
        priority: payload.priority || 'must-have',
        notes: 'Added via AI Copilot recommendation.',
      });
      alert(`Added "${payload.name || 'Item'}" to your budget!`);
    } else if (action.actionType === 'add_timeline' && action.payload && typeof action.payload === 'object') {
      const payload = action.payload as Partial<RunOfShowItem>;
      onAddScheduleItem({
        id: `ai-t-${Date.now()}`,
        startTime: payload.startTime || '16:00',
        endTime: payload.endTime || '',
        title: payload.title || 'AI Added Milestone',
        description: payload.description || '',
        responsibleParty: payload.responsibleParty || 'Coordinator',
        location: payload.location || 'Main Venue',
        completed: false,
      });
      alert(`Added "${payload.title || 'Milestone'}" to your run-of-show!`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="CelebrationOS Copilot"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  CelebrationOS Copilot
                </h3>
                <p className="text-[11px] text-slate-500">
                  {apiKey ? 'Powered by Google Gemini 2.5' : 'Offline Intelligent Simulation Engine'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenApiKeyModal}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Configure Gemini API Key"
              >
                <Key className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4" aria-live="polite" aria-atomic="false">
            {project.chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs ${
                  msg.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 ${
                    msg.sender === 'user'
                      ? 'bg-rose-600 text-white rounded-br-none shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700/60'
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed prose prose-xs dark:prose-invert">
                    {msg.content}
                  </div>

                  {/* Assistant Suggested Action Buttons */}
                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(action)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
                        >
                          <Wand2 className="w-3 h-3" />
                          <span>{action.label}</span>
                          <ArrowRight className="w-2.5 h-2.5 ml-0.5" />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="text-[10px] text-right opacity-60">
                    {msg.timestamp}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isGenerating && (
              <div className="flex gap-2 items-center text-xs text-slate-400 p-2">
                <Sparkles className="w-4 h-4 animate-spin text-rose-500" />
                <span>CelebrationOS Copilot is formulating advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Suggested Questions:
            </p>
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSendMessage(prompt)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-400 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask advice, budget cuts, timing..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isGenerating}
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 focus:outline-none text-slate-900 dark:text-slate-100"
              />
              <Button
                type="submit"
                size="md"
                variant="primary"
                disabled={!inputText.trim() || isGenerating}
                loading={isGenerating}
                icon={<Send className="w-3.5 h-3.5" />}
              >
                Send
              </Button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};
