import { useState, useEffect, useCallback } from 'react';
import {
  EventProject,
  EventType,
  Currency,
  EventDetails,
  BudgetItem,
  RunOfShowItem,
  MilestoneTask,
  Vendor,
  VendorChecklist,
  CreativeTheme,
  DigitalInvite,
  SignatureDrink,
  SpeechDraft,
  AssistantMessage,
} from '../types';
import {
  loadProjectFromStorage,
  saveProjectToStorage,
  getPresetByEventType,
} from '../services/storage';

/**
 * Custom React hook encapsulating the primary event planning domain state.
 * Handles state initialization from local storage, automated persistence,
 * preset switching, and granular immutable update handlers.
 *
 * @returns Project state and associated dispatch actions
 */
export function useEventProject() {
  const [project, setProject] = useState<EventProject>(() => loadProjectFromStorage());

  // Automatically persist changes whenever project state changes
  useEffect(() => {
    saveProjectToStorage(project);
  }, [project]);

  const selectEventType = useCallback((type: EventType) => {
    const preset = getPresetByEventType(type);
    setProject(preset);
  }, []);

  const changeCurrency = useCallback((currency: Currency) => {
    setProject((prev) => ({
      ...prev,
      event: {
        ...prev.event,
        currency,
      },
    }));
  }, []);

  const updateEventDetails = useCallback((updated: EventDetails) => {
    setProject((prev) => ({
      ...prev,
      event: updated,
    }));
  }, []);

  const updateBudgetItems = useCallback((budgetItems: BudgetItem[]) => {
    setProject((prev) => ({
      ...prev,
      budgetItems,
    }));
  }, []);

  const updateRunOfShow = useCallback((runOfShow: RunOfShowItem[]) => {
    setProject((prev) => ({
      ...prev,
      runOfShow,
    }));
  }, []);

  const updateMilestones = useCallback((milestones: MilestoneTask[]) => {
    setProject((prev) => ({
      ...prev,
      milestones,
    }));
  }, []);

  const updateVendors = useCallback((vendors: Vendor[]) => {
    setProject((prev) => ({
      ...prev,
      vendors,
    }));
  }, []);

  const updateChecklist = useCallback((vendorChecklist: VendorChecklist[]) => {
    setProject((prev) => ({
      ...prev,
      vendorChecklist,
    }));
  }, []);

  const updateThemes = useCallback((creativeThemes: CreativeTheme[]) => {
    setProject((prev) => ({
      ...prev,
      creativeThemes,
    }));
  }, []);

  const updateInvites = useCallback((invitations: DigitalInvite[]) => {
    setProject((prev) => ({
      ...prev,
      invitations,
    }));
  }, []);

  const updateDrinks = useCallback((drinks: SignatureDrink[]) => {
    setProject((prev) => ({
      ...prev,
      drinks,
    }));
  }, []);

  const updateSpeeches = useCallback((speeches: SpeechDraft[]) => {
    setProject((prev) => ({
      ...prev,
      speeches,
    }));
  }, []);

  const updateChatHistory = useCallback((chatHistory: AssistantMessage[]) => {
    setProject((prev) => ({
      ...prev,
      chatHistory,
    }));
  }, []);

  const importProject = useCallback((imported: EventProject) => {
    setProject(imported);
  }, []);

  return {
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
  };
}
