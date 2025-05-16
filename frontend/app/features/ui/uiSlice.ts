import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/lib/store';

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface Modal {
  isOpen: boolean;
  type: string;
  data?: any;
}

interface UiState {
  sidebarOpen: boolean;
  notifications: Notification[];
  modal: Modal;
  isLoading: boolean;
  currentStep: number;
  totalSteps: number;
  theme: 'light' | 'dark' | 'system';
}

const initialState: UiState = {
  sidebarOpen: false,
  notifications: [],
  modal: {
    isOpen: false,
    type: '',
    data: null,
  },
  isLoading: false,
  currentStep: 1,
  totalSteps: 4,
  theme: 'system',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      const id = Date.now().toString();
      state.notifications.push({
        id,
        ...action.payload,
      });
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data,
      };
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: '',
        data: null,
      };
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < state.totalSteps) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    setTotalSteps: (state, action: PayloadAction<number>) => {
      state.totalSteps = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', action.payload);
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
  setCurrentStep,
  nextStep,
  prevStep,
  setTotalSteps,
  setTheme,
} = uiSlice.actions;

export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen;
export const selectNotifications = (state: RootState) => state.ui.notifications;
export const selectModal = (state: RootState) => state.ui.modal;
export const selectIsLoading = (state: RootState) => state.ui.isLoading;
export const selectCurrentStep = (state: RootState) => state.ui.currentStep;
export const selectTotalSteps = (state: RootState) => state.ui.totalSteps;
export const selectTheme = (state: RootState) => state.ui.theme;

export default uiSlice.reducer;