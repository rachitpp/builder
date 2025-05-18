import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { resumeAPI } from "@/app/lib/apiClient";
import type { RootState } from "@/app/lib/store";

// Define types for resume
interface Education {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrentlyStudying?: boolean;
}

interface Experience {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  isCurrentJob?: boolean;
}

interface Skill {
  name: string;
  level?: "beginner" | "intermediate" | "advanced" | "expert";
}

interface Language {
  name: string;
  proficiency:
    | "elementary"
    | "limited_working"
    | "professional_working"
    | "full_professional"
    | "native";
}

interface Project {
  title: string;
  description: string;
  technologies?: string[];
  startDate?: string;
  endDate?: string;
  link?: string;
}

interface Certification {
  name: string;
  organization: string;
  issueDate: string;
  expiryDate?: string;
  credentialID?: string;
  credentialURL?: string;
}

interface Reference {
  name: string;
  position: string;
  company: string;
  email?: string;
  phone?: string;
}

interface CustomSection {
  title: string;
  content: string;
}

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  linkedIn?: string;
  website?: string;
  github?: string;
  summary?: string;
  jobTitle?: string;
}

export interface Resume {
  _id?: string;
  user?: string;
  title: string;
  templateId: string;
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  languages: Language[];
  projects: Project[];
  certifications: Certification[];
  references: Reference[];
  customSections: CustomSection[];
  isPublic: boolean;
  publicURL?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ResumeState {
  currentResume: Resume | null;
  resumes: Resume[];
  totalResumes: number;
  loading: boolean;
  error: string | null;
  success: boolean;
  currentPage: number;
  totalPages: number;
  pdfUrl: string | null;
}

// Initial state
const initialState: ResumeState = {
  currentResume: null,
  resumes: [],
  totalResumes: 0,
  loading: false,
  error: null,
  success: false,
  currentPage: 1,
  totalPages: 1,
  pdfUrl: null,
};

// Create empty resume template
export const createEmptyResume = (): Resume => ({
  title: "Untitled Resume",
  templateId: "",
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    linkedIn: "",
    website: "",
    github: "",
    summary: "",
    jobTitle: "",
  },
  education: [],
  experience: [],
  skills: [],
  languages: [],
  projects: [],
  certifications: [],
  references: [],
  customSections: [],
  isPublic: false,
});

// Async thunks
export const createResume = createAsyncThunk(
  "resume/create",
  async (resumeData: Resume, { rejectWithValue }) => {
    try {
      // Check if templateId is a mock ID (starts with "template")
      if (
        resumeData.templateId &&
        resumeData.templateId.startsWith("template")
      ) {
        console.log("Using mock template ID:", resumeData.templateId);
        // You could clone the resumeData and modify it here if needed
      }

      const response = await resumeAPI.createResume(resumeData);
      return response.data;
    } catch (error: any) {
      console.error("Resume creation error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to create resume";
      return rejectWithValue(errorMessage);
    }
  }
);

export const getResumes = createAsyncThunk(
  "resume/getAll",
  async (
    { page = 1, limit = 10 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await resumeAPI.getResumes(page, limit);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch resumes"
      );
    }
  }
);

export const getResumeById = createAsyncThunk(
  "resume/getById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.getResume(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch resume"
      );
    }
  }
);

export const updateResume = createAsyncThunk(
  "resume/update",
  async (
    { id, resumeData }: { id: string; resumeData: Resume },
    { rejectWithValue }
  ) => {
    try {
      const response = await resumeAPI.updateResume(id, resumeData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update resume"
      );
    }
  }
);

export const deleteResume = createAsyncThunk(
  "resume/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.deleteResume(id);
      return { id, ...response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete resume"
      );
    }
  }
);

export const toggleResumeVisibility = createAsyncThunk(
  "resume/toggleVisibility",
  async (
    { id, isPublic }: { id: string; isPublic: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await resumeAPI.toggleVisibility(id, isPublic);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to toggle resume visibility"
      );
    }
  }
);

export const getPublicResume = createAsyncThunk(
  "resume/getPublic",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.getPublicResume(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch public resume"
      );
    }
  }
);

export const cloneResume = createAsyncThunk(
  "resume/clone",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await resumeAPI.cloneResume(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clone resume"
      );
    }
  }
);

export const downloadResumePdf = createAsyncThunk(
  "resume/downloadPdf",
  async (id: string, { rejectWithValue, getState }) => {
    try {
      // Get token from state to ensure proper authorization
      const state = getState() as RootState;
      const token = state.auth.token;

      if (!token) {
        throw new Error("Authentication required. Please log in.");
      }

      const response = await resumeAPI.downloadPdf(id);

      // Create a blob URL for the HTML content
      const blob = new Blob([response.data], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);

      // Open the HTML in a new window/tab for the user to print
      window.open(url, "_blank");

      // Clean up the URL after a short delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);

      return url; // Return the URL for potential use
    } catch (error: any) {
      console.error("Resume HTML generation error:", error);

      // Handle authentication error specifically
      if (error.response?.status === 401) {
        return rejectWithValue("Authentication required. Please log in again.");
      }

      return rejectWithValue(
        error.response?.data?.message || "Failed to generate resume"
      );
    }
  }
);

// Create the slice
const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
    resetResumeState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setPdfUrl: (state, action) => {
      state.pdfUrl = action.payload;
    },
    clearPdfUrl: (state) => {
      state.pdfUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create resume
      .addCase(createResume.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentResume = action.payload.data;
        state.resumes.unshift(action.payload.data);
        state.totalResumes += 1;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Get all resumes
      .addCase(getResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload.data;
        state.totalResumes = action.payload.total;
        state.currentPage = action.payload.pagination.page;
        state.totalPages = action.payload.pagination.pages;
      })
      .addCase(getResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get resume by ID
      .addCase(getResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload.data;
      })
      .addCase(getResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update resume
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.currentResume = action.payload.data;

        // Update resume in the list
        const index = state.resumes.findIndex(
          (resume) => resume._id === action.payload.data._id
        );
        if (index !== -1) {
          state.resumes[index] = action.payload.data;
        }
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Delete resume
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.filter(
          (resume) => resume._id !== action.payload.id
        );
        state.totalResumes -= 1;
        if (
          state.currentResume &&
          state.currentResume._id === action.payload.id
        ) {
          state.currentResume = null;
        }
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle visibility
      .addCase(toggleResumeVisibility.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleResumeVisibility.fulfilled, (state, action) => {
        state.loading = false;

        // Update current resume if it's the one being toggled
        if (
          state.currentResume &&
          state.currentResume._id === action.payload.data._id
        ) {
          state.currentResume = action.payload.data;
        }

        // Update in the list
        const index = state.resumes.findIndex(
          (resume) => resume._id === action.payload.data._id
        );
        if (index !== -1) {
          state.resumes[index] = action.payload.data;
        }
      })
      .addCase(toggleResumeVisibility.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get public resume
      .addCase(getPublicResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPublicResume.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload.data;
      })
      .addCase(getPublicResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Clone resume
      .addCase(cloneResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cloneResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.unshift(action.payload.data);
        state.totalResumes += 1;
      })
      .addCase(cloneResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions and selectors
export const {
  setCurrentResume,
  clearCurrentResume,
  resetResumeState,
  setPdfUrl,
  clearPdfUrl,
} = resumeSlice.actions;

export const selectCurrentResume = (state: RootState) =>
  state.resume.currentResume;
export const selectResumes = (state: RootState) => state.resume.resumes;
export const selectTotalResumes = (state: RootState) =>
  state.resume.totalResumes;
export const selectResumeLoading = (state: RootState) => state.resume.loading;
export const selectResumeError = (state: RootState) => state.resume.error;
export const selectResumeSuccess = (state: RootState) => state.resume.success;
export const selectCurrentPage = (state: RootState) => state.resume.currentPage;
export const selectTotalPages = (state: RootState) => state.resume.totalPages;
export const selectPdfUrl = (state: RootState) => state.resume.pdfUrl;

export default resumeSlice.reducer;
