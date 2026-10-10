import type { ResourceType } from "../../store/slices/resource";

export type FieldGroup =
  | "basics"
  | "content"
  | "bookDetails"
  | "media"
  | "seo"
  | "flags";

// Which field groups to show for each resource type
export const FIELD_GROUPS_BY_TYPE: Record<ResourceType, FieldGroup[]> = {
  SOP: ["basics", "content", "media", "seo", "flags"],
  FORMAT: ["basics", "content", "media", "seo", "flags"],
  CHECKLIST: ["basics", "content", "media", "seo", "flags"],
  LITERATURE: ["basics", "content", "media", "seo", "flags"],
  EBOOK: ["basics", "bookDetails", "content", "media", "seo", "flags"],
};

export const LANGUAGES = [
  "English",
  "Hindi",
  "Spanish",
  "French",
  "German",
  "Chinese",
  "Arabic",
  "Portuguese",
  "Other",
];

export const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export const VISIBILITIES = ["PUBLIC", "PRIVATE", "PREMIUM"] as const;

export const splitTags = (value: string): string[] =>
  value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

export const joinTags = (value?: string[]): string =>
  (value || []).join(", ");
