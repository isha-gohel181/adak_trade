import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export const RESOURCE_TYPES = [
  "SOP",
  "FORMAT",
  "CHECKLIST",
  "EBOOK",
  "LITERATURE",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export interface ResourceFileMeta {
  url: string;
  key: string;
  originalName: string;
  mimeType: string;
  extension: string;
  size: number;
}

export interface Resource {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  resourceType: ResourceType;
  category?: string;
  subCategory?: string;
  tags?: string[];
  language?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  author?: string;
  publisher?: string;
  version?: string;
  publishedDate?: string;
  lastReviewedDate?: string;
  estimatedReadTime?: number;
  pageCount?: number;
  thumbnail?: ResourceFileMeta;
  resourceFile?: ResourceFileMeta;
  previewImages?: ResourceFileMeta[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  downloadCount: number;
  viewCount: number;
  favoriteCount: number;
  averageRating: number;
  totalRatings: number;
  visibility?: "PUBLIC" | "PRIVATE" | "PREMIUM";
  isFeatured: boolean;
  isTrending: boolean;
  isRecommended: boolean;
  isDownloadable: boolean;
  isPrintable: boolean;
  isActive: boolean;
  content?: ResourceContent;
  createdAt: string;
  updatedAt: string;
}

export interface ResourceContent {
  _id?: string;
  resourceType: string;
  purpose?: string;
  scope?: string;
  responsibilities?: string[];
  steps?: Array<{ title: string; description: string; order: number }>;
  revisionHistory?: Array<{ version: string; date: string; changes: string }>;
  checklistItems?: Array<{ text: string; checked: boolean; order: number }>;
  templateSections?: Array<{ label: string; placeholder: string; order: number }>;
  body?: string;
  references?: Array<{ text: string; url: string }>;
  citations?: string[];
  pageCount?: number;
  isbn?: string;
  edition?: string;
  estimatedReadTime?: number;
}

export interface ResourcePayload {
  title: string;
  shortDescription?: string;
  description?: string;
  resourceType: ResourceType;
  category?: string;
  subCategory?: string;
  tags?: string[];
  language?: string;
  level?: string;
  author?: string;
  publisher?: string;
  version?: string;
  publishedDate?: string;
  lastReviewedDate?: string;
  estimatedReadTime?: number;
  pageCount?: number;
  thumbnail?: File;
  resourceFile?: File;
  previewImages?: File[];
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  visibility?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  isDownloadable?: boolean;
  isPrintable?: boolean;
  // Type-specific content
  purpose?: string;
  scope?: string;
  responsibilities?: string[];
  steps?: Array<{ title: string; description: string; order: number }>;
  revisionHistory?: Array<{ version: string; date: string; changes: string }>;
  checklistItems?: Array<{ text: string; checked: boolean; order: number }>;
  templateSections?: Array<{ label: string; placeholder: string; order: number }>;
  body?: string;
  references?: Array<{ text: string; url: string }>;
  citations?: string[];
  isbn?: string;
  edition?: string;
}

export interface ResourceState {
  loading: boolean;
  error: string | null;
  resources: Resource[];
  totalResources: number;
  currentPage: number;
  totalPages: number;
}

const initialState: ResourceState = {
  loading: false,
  error: null,
  resources: [],
  totalResources: 0,
  currentPage: 1,
  totalPages: 0,
};

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === "object" && error !== null) {
    const anyError = error as { response?: { data?: { message?: string } }; message?: string };
    return (
      anyError.response?.data?.message ||
      anyError.message ||
      fallback
    );
  }
  return fallback;
};

const buildResourceFormData = (payload: ResourcePayload): FormData => {
  const formData = new FormData();
  const append = (key: string, value: string | number | undefined | null) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, String(value));
    }
  };
  const appendArray = (key: string, value?: string[]) => {
    if (value && value.length) formData.append(key, JSON.stringify(value));
  };

  append("title", payload.title);
  append("shortDescription", payload.shortDescription);
  append("description", payload.description);
  append("resourceType", payload.resourceType);
  append("category", payload.category);
  append("subCategory", payload.subCategory);
  appendArray("tags", payload.tags);
  append("language", payload.language);
  append("level", payload.level);
  append("author", payload.author);
  append("publisher", payload.publisher);
  append("version", payload.version);
  append("publishedDate", payload.publishedDate);
  append("lastReviewedDate", payload.lastReviewedDate);
  append("estimatedReadTime", payload.estimatedReadTime);
  append("pageCount", payload.pageCount);
  append("seoTitle", payload.seoTitle);
  append("seoDescription", payload.seoDescription);
  appendArray("seoKeywords", payload.seoKeywords);
  append("visibility", payload.visibility);
  append("isFeatured", payload.isFeatured ? "true" : "false");
  append("isTrending", payload.isTrending ? "true" : "false");
  append("isRecommended", payload.isRecommended ? "true" : "false");
  append("isDownloadable", payload.isDownloadable === false ? "false" : "true");
  append("isPrintable", payload.isPrintable === false ? "false" : "true");

  // Type-specific content
  if (payload.resourceType === "SOP") {
    append("purpose", payload.purpose);
    append("scope", payload.scope);
    appendArray("responsibilities", payload.responsibilities);
    append("estimatedReadTime", payload.estimatedReadTime);
    if (payload.steps) formData.append("steps", JSON.stringify(payload.steps));
    if (payload.revisionHistory)
      formData.append("revisionHistory", JSON.stringify(payload.revisionHistory));
  }

  if (payload.resourceType === "CHECKLIST") {
    append("estimatedReadTime", payload.estimatedReadTime);
    if (payload.checklistItems)
      formData.append("checklistItems", JSON.stringify(payload.checklistItems));
  }

  if (payload.resourceType === "FORMAT") {
    append("estimatedReadTime", payload.estimatedReadTime);
    if (payload.templateSections)
      formData.append("templateSections", JSON.stringify(payload.templateSections));
  }

  if (payload.resourceType === "EBOOK") {
    append("pageCount", payload.pageCount);
    append("isbn", payload.isbn);
    append("edition", payload.edition);
    append("estimatedReadTime", payload.estimatedReadTime);
  }

  if (payload.resourceType === "LITERATURE") {
    append("body", payload.body);
    appendArray("references", payload.references?.map((r) => r.text));
    appendArray("citations", payload.citations);
    append("estimatedReadTime", payload.estimatedReadTime);
  }

  if (payload.thumbnail) formData.append("thumbnail", payload.thumbnail);
  if (payload.resourceFile) formData.append("resourceFile", payload.resourceFile);
  if (payload.previewImages?.length) {
    payload.previewImages.forEach((file) => formData.append("previewImages", file));
  }
  return formData;
};

export const createResource = createAsyncThunk(
  "resource/createResource",
  async (payload: ResourcePayload, { rejectWithValue }) => {
    try {
      const formData = buildResourceFormData(payload);

      const response = await axiosInstance.post("/resources", formData, {
        headers: { "content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to create resource"));
    }
  }
);

export const fetchResources = createAsyncThunk(
  "resource/fetchResources",
  async (
    {
      page = 1,
      limit = 10,
      search,
      resourceType,
      category,
    }: {
      page?: number;
      limit?: number;
      search?: string;
      resourceType?: string;
      category?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const params = new URLSearchParams();
      params.append("page", String(page));
      params.append("limit", String(limit));
      if (search) params.append("search", search);
      if (resourceType) params.append("resourceType", resourceType);
      if (category) params.append("category", category);

      const response = await axiosInstance.get(`/resources?${params.toString()}`);
      return {
        resources: response.data.data?.data || [],
        totalResources: response.data.data?.total || 0,
        currentPage: response.data.data?.page || 1,
        totalPages: response.data.data?.totalPages || 1,
      };
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to fetch resources"));
    }
  }
);

export const updateResource = createAsyncThunk(
  "resource/updateResource",
  async (
    { id, payload }: { id: string; payload: ResourcePayload },
    { rejectWithValue }
  ) => {
    try {
      const formData = buildResourceFormData(payload);

      const response = await axiosInstance.put(`/resources/${id}`, formData, {
        headers: { "content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to update resource"));
    }
  }
);

export const deleteResource = createAsyncThunk(
  "resource/deleteResource",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/resources/${id}`);
      return id;
    } catch (error: unknown) {
      return rejectWithValue(getErrorMessage(error, "Failed to delete resource"));
    }
  }
);

const resourceSlice = createSlice({
  name: "resource",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResource.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchResources.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResources.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload.resources || [];
        state.totalResources = action.payload.totalResources || 0;
        state.currentPage = action.payload.currentPage || 1;
        state.totalPages = action.payload.totalPages || 0;
        state.error = null;
      })
      .addCase(fetchResources.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.resources = [];
      })
      .addCase(updateResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResource.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(updateResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteResource.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResource.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = state.resources.filter(
          (r) => r._id !== action.payload
        );
        state.totalResources = Math.max(0, state.totalResources - 1);
        state.error = null;
      })
      .addCase(deleteResource.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectResources = (state: { resource: ResourceState }) =>
  state.resource.resources;
export const selectResourceLoading = (state: { resource: ResourceState }) =>
  state.resource.loading;
export const selectResourceError = (state: { resource: ResourceState }) =>
  state.resource.error;
export const selectResourceTotal = (state: { resource: ResourceState }) =>
  state.resource.totalResources;
export const selectResourceTotalPages = (state: { resource: ResourceState }) =>
  state.resource.totalPages;

export default resourceSlice.reducer;
