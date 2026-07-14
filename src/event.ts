import { z } from "zod";
import { SCHEMA_VERSION } from "./version.js";
import { PageContextSchema, TargetSchema } from "./primitives.js";
import {
  ApiErrorPayload,
  ApiRequestPayload,
  CheckPayload,
  ClearPayload,
  ClickPayload,
  ClipboardPayload,
  DblclickPayload,
  DialogPayload,
  DownloadPayload,
  DragDropPayload,
  FileUploadPayload,
  FillPayload,
  FocusPayload,
  HistoryChangePayload,
  HoverPayload,
  MediaPausePayload,
  MediaPlayPayload,
  NavigationPayload,
  PageLoadPayload,
  PermissionPromptPayload,
  PinchZoomPayload,
  PressKeyPayload,
  ReloadPayload,
  RightClickPayload,
  ScrollPayload,
  SelectOptionPayload,
  SwipePayload,
  TabClosePayload,
  TabOpenPayload,
  TapPayload,
  TypeSequentiallyPayload,
  WebsocketMessagePayload,
} from "./payloads.js";

// =============================================================================
// Envelope
// =============================================================================

const baseEnvelope = z.object({
  schema_version: z.literal(SCHEMA_VERSION),
  event_id: z.string().uuid(),
  session_id: z.string().uuid(),
  tab_id: z.string().uuid(),
  sequence: z.number().int().nonnegative(),
  timestamp: z.string().datetime(),
  page: PageContextSchema,
});

// Interaction events have a target element.
const withTarget = baseEnvelope.extend({
  target: TargetSchema,
});

// Meta events (navigation, dialogs, network, tab lifecycle, history) have no
// interactable target; some carry a target as null.
const withoutTarget = baseEnvelope.extend({
  target: TargetSchema.nullable().optional(),
});

// =============================================================================
// Event variants — discriminator on event_type
// =============================================================================

const ClickEvent = withTarget.extend({
  event_type: z.literal("click"),
  payload: ClickPayload,
});
const DblclickEvent = withTarget.extend({
  event_type: z.literal("dblclick"),
  payload: DblclickPayload,
});
const RightClickEvent = withTarget.extend({
  event_type: z.literal("right_click"),
  payload: RightClickPayload,
});
const HoverEvent = withTarget.extend({
  event_type: z.literal("hover"),
  payload: HoverPayload,
});
const DragDropEvent = withTarget.extend({
  event_type: z.literal("drag_drop"),
  payload: DragDropPayload,
});
const ScrollEvent = withoutTarget.extend({
  event_type: z.literal("scroll"),
  payload: ScrollPayload,
});

const FillEvent = withTarget.extend({
  event_type: z.literal("fill"),
  payload: FillPayload,
});
const ClearEvent = withTarget.extend({
  event_type: z.literal("clear"),
  payload: ClearPayload,
});
const PressKeyEvent = withoutTarget.extend({
  event_type: z.literal("press_key"),
  payload: PressKeyPayload,
});
const TypeSequentiallyEvent = withTarget.extend({
  event_type: z.literal("type_sequentially"),
  payload: TypeSequentiallyPayload,
});
const SelectOptionEvent = withTarget.extend({
  event_type: z.literal("select_option"),
  payload: SelectOptionPayload,
});
const CheckEvent = withTarget.extend({
  event_type: z.literal("check"),
  payload: CheckPayload,
});
const FocusEvent = withTarget.extend({
  event_type: z.literal("focus"),
  payload: FocusPayload,
});
const ClipboardEvent = withoutTarget.extend({
  event_type: z.literal("clipboard"),
  payload: ClipboardPayload,
});

const NavigationEvent = withoutTarget.extend({
  event_type: z.literal("navigation"),
  payload: NavigationPayload,
});
const PageLoadEvent = withoutTarget.extend({
  event_type: z.literal("page_load"),
  payload: PageLoadPayload,
});
const ReloadEvent = withoutTarget.extend({
  event_type: z.literal("reload"),
  payload: ReloadPayload,
});
const TabOpenEvent = withoutTarget.extend({
  event_type: z.literal("tab_open"),
  payload: TabOpenPayload,
});
const TabCloseEvent = withoutTarget.extend({
  event_type: z.literal("tab_close"),
  payload: TabClosePayload,
});
const HistoryChangeEvent = withoutTarget.extend({
  event_type: z.literal("history_change"),
  payload: HistoryChangePayload,
});

const FileUploadEvent = withTarget.extend({
  event_type: z.literal("file_upload"),
  payload: FileUploadPayload,
});
const DownloadEvent = withoutTarget.extend({
  event_type: z.literal("download"),
  payload: DownloadPayload,
});
const MediaPlayEvent = withTarget.extend({
  event_type: z.literal("media_play"),
  payload: MediaPlayPayload,
});
const MediaPauseEvent = withTarget.extend({
  event_type: z.literal("media_pause"),
  payload: MediaPausePayload,
});

const DialogEvent = withoutTarget.extend({
  event_type: z.literal("dialog"),
  payload: DialogPayload,
});
const PermissionPromptEvent = withoutTarget.extend({
  event_type: z.literal("permission_prompt"),
  payload: PermissionPromptPayload,
});

const ApiRequestEvent = withoutTarget.extend({
  event_type: z.literal("api_request"),
  payload: ApiRequestPayload,
});
const ApiErrorEvent = withoutTarget.extend({
  event_type: z.literal("api_error"),
  payload: ApiErrorPayload,
});
const WebsocketMessageEvent = withoutTarget.extend({
  event_type: z.literal("websocket_message"),
  payload: WebsocketMessagePayload,
});

const TapEvent = withTarget.extend({
  event_type: z.literal("tap"),
  payload: TapPayload,
});
const SwipeEvent = withoutTarget.extend({
  event_type: z.literal("swipe"),
  payload: SwipePayload,
});
const PinchZoomEvent = withoutTarget.extend({
  event_type: z.literal("pinch_zoom"),
  payload: PinchZoomPayload,
});

// =============================================================================
// Discriminated union
// =============================================================================

export const EventSchema = z.discriminatedUnion("event_type", [
  ClickEvent,
  DblclickEvent,
  RightClickEvent,
  HoverEvent,
  DragDropEvent,
  ScrollEvent,
  FillEvent,
  ClearEvent,
  PressKeyEvent,
  TypeSequentiallyEvent,
  SelectOptionEvent,
  CheckEvent,
  FocusEvent,
  ClipboardEvent,
  NavigationEvent,
  PageLoadEvent,
  ReloadEvent,
  TabOpenEvent,
  TabCloseEvent,
  HistoryChangeEvent,
  FileUploadEvent,
  DownloadEvent,
  MediaPlayEvent,
  MediaPauseEvent,
  DialogEvent,
  PermissionPromptEvent,
  ApiRequestEvent,
  ApiErrorEvent,
  WebsocketMessageEvent,
  TapEvent,
  SwipeEvent,
  PinchZoomEvent,
]);

export type Event = z.infer<typeof EventSchema>;
export type EventType = Event["event_type"];

// Convenience: enumerate all known event_type strings (driven by the union so
// it can never drift from the schema).
export const EVENT_TYPES: readonly EventType[] = EventSchema.options.map(
  (variant) => variant.shape.event_type.value as EventType,
);

// Batch transport — the shape ingestion's POST /api/v1/events accepts.
export const EventBatchSchema = z.object({
  events: z.array(EventSchema).min(1).max(500),
});
export type EventBatch = z.infer<typeof EventBatchSchema>;
