import { z } from "zod";
import { SCHEMA_VERSION } from "./version.js";
import { BoundingBoxSchema, SelectorsSchema } from "./primitives.js";

// =============================================================================
// Component schemas
// =============================================================================

export const VisibleElementSchema = z.object({
  selectors: SelectorsSchema,
  tag: z.string(),
  text_content: z.string().nullable(),
  is_visible: z.boolean(),
  bounding_box: BoundingBoxSchema.nullable(),
  computed_styles: z.record(z.string(), z.string()).nullable(),
});
export type VisibleElement = z.infer<typeof VisibleElementSchema>;

export const FormValueSchema = z.object({
  selectors: SelectorsSchema,
  value: z.string(),
  checked: z.boolean().nullable(),
  disabled: z.boolean(),
  type: z.string(),
});
export type FormValue = z.infer<typeof FormValueSchema>;

export const FocusedElementSchema = z.object({
  selectors: SelectorsSchema,
});
export type FocusedElement = z.infer<typeof FocusedElementSchema>;

export const RecentApiCallSchema = z.object({
  method: z.string(),
  url: z.string(),
  status: z.number().int(),
  duration_ms: z.number().nonnegative().optional(),
  request_body_summary: z.string().optional(),
  response_body_summary: z.string().optional(),
});
export type RecentApiCall = z.infer<typeof RecentApiCallSchema>;

export const ConsoleErrorSchema = z.object({
  level: z.string(),
  message: z.string(),
  source: z.string().optional(),
});
export type ConsoleError = z.infer<typeof ConsoleErrorSchema>;

// =============================================================================
// Checkpoint
// =============================================================================

// Note on field naming: the canonical contract uses `full_snapshot_url` (matches
// docs/event-schema.md and the dom_checkpoints DB column). The current tracker
// emits `full_snapshot` instead — to be reconciled in Phase 3 (ingestion swap)
// either by renaming the tracker field or by adding a translation step.
export const CheckpointSchema = z.object({
  schema_version: z.literal(SCHEMA_VERSION),
  checkpoint_id: z.string().uuid(),
  session_id: z.string().uuid(),
  trigger_event_id: z.string().uuid(),
  timestamp: z.string().datetime(),
  url: z.string(),
  visible_elements: z.array(VisibleElementSchema).nullable().optional(),
  form_values: z.array(FormValueSchema).nullable().optional(),
  focused_element: FocusedElementSchema.nullable().optional(),
  page_title: z.string().nullable().optional(),
  recent_api_calls: z.array(RecentApiCallSchema).nullable().optional(),
  console_errors: z.array(ConsoleErrorSchema).nullable().optional(),
  full_snapshot_url: z.string().nullable().optional(),
});

export type Checkpoint = z.infer<typeof CheckpointSchema>;
