// Version
export { SCHEMA_VERSION, type SchemaVersion } from "./version.js";

// Primitives
export {
  AttributesSchema,
  BoundingBoxSchema,
  ModifierSchema,
  NthSelectorSchema,
  PageContextSchema,
  PositionSchema,
  RoleSelectorSchema,
  SelectorsSchema,
  TargetSchema,
  ViewportSchema,
  type BoundingBox,
  type Modifier,
  type PageContext,
  type Position,
  type Selectors,
  type Target,
  type Viewport,
} from "./primitives.js";

// Payloads — exported for consumers that want the per-variant schemas (e.g.
// fixture builders, alternate dispatchers).
export * from "./payloads.js";

// Event
export {
  EVENT_TYPES,
  EventBatchSchema,
  EventSchema,
  type Event,
  type EventBatch,
  type EventType,
} from "./event.js";

// Checkpoint
export {
  CheckpointSchema,
  ConsoleErrorSchema,
  FocusedElementSchema,
  FormValueSchema,
  RecentApiCallSchema,
  VisibleElementSchema,
  type Checkpoint,
  type ConsoleError,
  type FocusedElement,
  type FormValue,
  type RecentApiCall,
  type VisibleElement,
} from "./checkpoint.js";
