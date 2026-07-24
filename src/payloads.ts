import { z } from "zod";
import { ModifierSchema, PositionSchema, SelectorsSchema } from "./primitives.js";

// =============================================================================
// Mouse & Pointer
// =============================================================================

export const ClickPayload = z.object({
  modifiers: z.array(ModifierSchema).optional(),
  force: z.boolean().optional(),
  button: z.enum(["left", "right"]).optional(),
  position: PositionSchema.optional(),
});

export const DblclickPayload = z.object({
  modifiers: z.array(ModifierSchema).optional(),
  position: PositionSchema.optional(),
});

export const HoverPayload = z.object({
  position: PositionSchema.optional(),
});

export const DragDropPayload = z.object({
  target_selectors: SelectorsSchema,
  source_position: PositionSchema.optional(),
  target_position: PositionSchema.optional(),
});

export const ScrollPayload = z.object({
  x: z.number(),
  y: z.number(),
  delta_x: z.number().optional(),
  delta_y: z.number().optional(),
  direction: z.enum(["up", "down", "left", "right"]),
});

export const RightClickPayload = z.object({
  modifiers: z.array(ModifierSchema).optional(),
  position: PositionSchema.optional(),
});

// =============================================================================
// Keyboard & Input
// =============================================================================

export const FillPayload = z.object({
  // Tracker normalises real values into synthetic placeholders before send.
  value: z.string(),
});

export const ClearPayload = z.object({
  previous_value: z.string().optional(),
});

export const PressKeyPayload = z.object({
  key: z.string(),
  repeat: z.number().int().nonnegative().optional(),
});

export const TypeSequentiallyPayload = z.object({
  value: z.string(),
  delay: z.number().nonnegative().optional(),
});

export const SelectOptionPayload = z
  .object({
    value: z.string().optional(),
    label: z.string().optional(),
    index: z.number().int().nonnegative().optional(),
  })
  .refine((p) => p.value !== undefined || p.label !== undefined || p.index !== undefined, {
    message: "select_option payload must include at least one of value, label, or index",
  });

export const CheckPayload = z.object({
  checked: z.boolean(),
});

// `focus` has no payload-specific fields. Keep the empty object for forward
// compatibility (so additive fields don't require a discriminator change).
export const FocusPayload = z.object({});

export const ClipboardPayload = z.object({
  action: z.enum(["copy", "cut", "paste"]),
  text: z.string().optional(),
});

// =============================================================================
// Navigation & Page Lifecycle
// =============================================================================

export const NavigationPayload = z.object({
  to_url: z.string(),
  from_url: z.string().optional(),
  trigger: z.enum([
    "link_click",
    "form_submit",
    "js_redirect",
    "history_push",
    "history_pop",
  ]),
});

export const PageLoadPayload = z.object({
  load_state: z.enum(["domcontentloaded", "networkidle", "load"]),
});

export const ReloadPayload = z.object({});

export const TabOpenPayload = z.object({
  url: z.string(),
  opener_tab_id: z.string().uuid(),
});

export const TabClosePayload = z.object({});

export const HistoryChangePayload = z.object({
  url: z.string(),
  type: z.enum(["pushState", "replaceState", "popstate"]),
});

// =============================================================================
// File & Media
// =============================================================================

export const FileUploadPayload = z.object({
  filenames: z.array(z.string()),
  mimes: z.array(z.string()),
  sizes: z.array(z.number().nonnegative()).optional(),
});

export const DownloadPayload = z.object({
  filename: z.string(),
  url: z.string().optional(),
  mime: z.string().optional(),
});

export const MediaElementType = z.enum(["video", "audio"]);

export const MediaPlayPayload = z.object({
  element_type: MediaElementType,
  src: z.string(),
  current_time: z.number().nonnegative().optional(),
});

export const MediaPausePayload = z.object({
  element_type: MediaElementType,
  current_time: z.number().nonnegative(),
});

// =============================================================================
// Browser Dialogs & Popups
// =============================================================================

export const DialogPayload = z.object({
  dialog_type: z.enum(["alert", "confirm", "prompt", "beforeunload"]),
  message: z.string(),
  response: z.enum(["OK", "Cancel"]).optional(),
  input_value: z.string().optional(),
});

export const PermissionPromptPayload = z.object({
  permission: z.enum(["geolocation", "notifications", "camera", "microphone"]),
  response: z.enum(["grant", "deny"]),
});

// =============================================================================
// Network
// =============================================================================

export const HttpMethodSchema = z.enum([
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
  "HEAD",
  "OPTIONS",
]);

// P1-4: HTTP bodies are captured as bounded string summaries, never raw
// unbounded/untyped values (which permitted arbitrary-size PII to pass the
// schema). Mirrors the checkpoint `request_body_summary` shape.
export const MAX_BODY_SUMMARY_LEN = 2048;
// P1-4: websocket frame payloads are capped so a chatty socket can't stream an
// unbounded string through the schema.
export const MAX_WEBSOCKET_DATA_LEN = 8192;

export const ApiRequestPayload = z.object({
  method: HttpMethodSchema,
  url: z.string(),
  request_headers: z.record(z.string(), z.string()).optional(),
  request_body: z.string().max(MAX_BODY_SUMMARY_LEN).optional(),
  status: z.number().int().optional(),
  response_body: z.string().max(MAX_BODY_SUMMARY_LEN).optional(),
  duration_ms: z.number().nonnegative().optional(),
});

export const ApiErrorPayload = z.object({
  method: HttpMethodSchema,
  url: z.string(),
  status: z.number().int(),
  error_message: z.string().optional(),
  response_body: z.string().max(MAX_BODY_SUMMARY_LEN).optional(),
});

export const WebsocketMessagePayload = z.object({
  url: z.string(),
  direction: z.enum(["sent", "received"]),
  data: z.string().max(MAX_WEBSOCKET_DATA_LEN),
});

// =============================================================================
// Touch & Gesture
// =============================================================================

export const SwipeDirectionSchema = z.enum(["left", "right", "up", "down"]);

export const TapPayload = z.object({
  position: PositionSchema,
});

export const SwipePayload = z.object({
  direction: SwipeDirectionSchema,
  start: PositionSchema,
  end: PositionSchema,
});

export const PinchZoomPayload = z.object({
  scale: z.number().positive(),
  center: PositionSchema,
});
