import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { templateAPI } from '@/app/lib/apiClient';
import type { RootState } from '@/app/lib/store';

// Define types
export interface Template {
  _id: string;
  name: string;
  description: string;
  previewImage: string;
  category: 'simple' | 'professional' | 'creative' | 'modern' | 'academic';
  isPremium: boolean;
  cssTemplate: string;
  htmlStructure: string;
  createdAt: string;
  updatedAt: string;
}

interface TemplateState {
  templates: Template[];
  template: Template | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  totalTemplates: number;
  currentPage: number;
  totalPages: number;
}

// Initial state
const initialState: TemplateState = {
  templates: [],
  template: null,
  categories: [],
  loading: false,
  error: null,
  totalTemplates: 0,
  currentPage: 1,
  totalPages: 1,
};

// Async thunks
export const getTemplates = createAsyncThunk(
  'templates/getAll',
  async (
    { category, isPremium, page = 1, limit = 10 }: 
    { category?: string; isPremium?: boolean; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await templateAPI.getTemplates(category, isPremium, page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const getTemplateById = createAsyncThunk(
  'templates/getById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await templateAPI.getTemplate(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template');
    }
  }
);

export const getTemplateCategories = createAsyncThunk(
  'templates/getCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await templateAPI.getTemplateCategories();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch template categories');
    }
  }
);

// Create the slice
const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {
    clearTemplate: (state) => {
      state.template = null;
    },
    resetTemplateState: (state) => {
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get all templates
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload.data;
        state.totalTemplates = action.payload.total;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.pages;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get template by ID
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.template = action.payload.data;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get template categories
      .addCase(getTemplateCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTemplateCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
      })
      .addCase(getTemplateCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and selectors
export const { clearTemplate, resetTemplateState } = templateSlice.actions;

export const selectTemplates = (state: RootState) => state.templates.templates;
export const selectTemplate = (state: RootState) => state.templates.template;
export const selectCategories = (state: RootState) => state.templates.categories;
export const selectTemplateLoading = (state: RootState) => state.templates.loading;
export const selectTemplateError = (state: RootState) => state.templates.error;
export const selectTotalTemplates = (state: RootState) => state.templates.totalTemplates;
export const selectCurrentPage = (state: RootState) => state.templates.currentPage;
export const selectTotalPages = (state: RootState) => state.templates.totalPages;

export default templateSlice.reducer;