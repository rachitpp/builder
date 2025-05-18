import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateAPI } from "@/app/lib/apiClient";
import { mockTemplates } from "@/app/lib/mockData";
import type { RootState } from "@/app/lib/store";

// Define types
export interface Template {
  _id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  previewImage?: string;
  category: string;
  isPremium: boolean;
  sections?: string[];
  layout?: {
    type: string;
    colors: string[];
    fonts: string[];
  };
  cssTemplate?: string;
  htmlStructure?: string;
  createdAt?: string;
  updatedAt?: string;
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
  "templates/getAll",
  async (
    {
      category,
      isPremium,
      page = 1,
      limit = 10,
    }: {
      category?: string;
      isPremium?: boolean;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await templateAPI.getTemplates(
        category,
        isPremium,
        page,
        limit
      );
      return response.data;
    } catch (error: any) {
      // If API fails, return mock data instead of rejecting
      console.warn(
        "Using mock template data due to API failure:",
        error.message
      );
      return {
        success: true,
        count: mockTemplates.length,
        total: mockTemplates.length,
        pagination: {
          page: 1,
          limit: mockTemplates.length,
          pages: 1,
        },
        data: mockTemplates,
      };
    }
  }
);

export const getTemplateById = createAsyncThunk(
  "templates/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await templateAPI.getTemplate(id);
      return response.data;
    } catch (error: any) {
      // If API fails, find the template in mock data
      console.warn(
        "Using mock template data due to API failure:",
        error.message
      );
      const mockTemplate = mockTemplates.find(
        (template) => template._id === id
      );

      if (mockTemplate) {
        return {
          success: true,
          data: mockTemplate,
        };
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch template"
      );
    }
  }
);

export const getTemplateCategories = createAsyncThunk(
  "templates/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await templateAPI.getTemplateCategories();
      return response.data;
    } catch (error: any) {
      // If API fails, extract categories from mock data
      console.warn(
        "Using mock template categories due to API failure:",
        error.message
      );
      const categories = Array.from(
        new Set(mockTemplates.map((template) => template.category))
      );

      return {
        success: true,
        count: categories.length,
        data: categories,
      };
    }
  }
);

// Create the slice
const templateSlice = createSlice({
  name: "templates",
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
export const selectCategories = (state: RootState) =>
  state.templates.categories;
export const selectTemplateLoading = (state: RootState) =>
  state.templates.loading;
export const selectTemplateError = (state: RootState) => state.templates.error;
export const selectTotalTemplates = (state: RootState) =>
  state.templates.totalTemplates;
export const selectCurrentPage = (state: RootState) =>
  state.templates.currentPage;
export const selectTotalPages = (state: RootState) =>
  state.templates.totalPages;

export default templateSlice.reducer;
