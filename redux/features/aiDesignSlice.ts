import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// ============================================
// Types
// ============================================
export type AiDesignStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface AiDesign {
  id: string;
  userId: string;
  originalImage: string;
  generatedImage?: string;
  mockupImage?: string;
  styleType: string;
  prompt?: string;
  status: AiDesignStatus;
  resolution?: string;
  createdAt: string;
}

interface AiDesignState {
  activeDesign: AiDesign | null;
  selectedStyle: string;
  isGenerating: boolean;
  progress: number; // 0-100
}

// ============================================
// Slice
// ============================================
const initialState: AiDesignState = {
  activeDesign: null,
  selectedStyle: "anime",
  isGenerating: false,
  progress: 0,
};

const aiDesignSlice = createSlice({
  name: "aiDesign",
  initialState,
  reducers: {
    setActiveDesign(state, action: PayloadAction<AiDesign | null>) {
      state.activeDesign = action.payload;
    },

    setSelectedStyle(state, action: PayloadAction<string>) {
      state.selectedStyle = action.payload;
    },

    setIsGenerating(state, action: PayloadAction<boolean>) {
      state.isGenerating = action.payload;
      if (!action.payload) {
        state.progress = 0; // reset on stop
      }
    },

    setProgress(state, action: PayloadAction<number>) {
      state.progress = Math.min(100, Math.max(0, action.payload));
    },

    resetAiDesign(state) {
      state.activeDesign = null;
      state.isGenerating = false;
      state.progress = 0;
    },
  },
});

export const { setActiveDesign, setSelectedStyle, setIsGenerating, setProgress, resetAiDesign } =
  aiDesignSlice.actions;

export default aiDesignSlice.reducer;
