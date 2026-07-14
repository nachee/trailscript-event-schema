// Fixture builders for event-schema round-trip tests. Each event_type has one
// canonical valid fixture; tests verify it parses and that all event_types in
// the schema have a fixture (so the schema and the fixtures can't drift apart).

const baseEnvelope = {
  schema_version: 1,
  event_id: "11111111-1111-1111-1111-111111111111",
  session_id: "22222222-2222-2222-2222-222222222222",
  tab_id: "33333333-3333-3333-3333-333333333333",
  sequence: 0,
  timestamp: "2026-05-06T12:00:00.000Z",
  page: {
    url: "https://app.example.com/",
    title: "TrailScript test page",
    viewport: { width: 1280, height: 800 },
  },
} as const;

const baseTarget = {
  selectors: {
    css: "button.primary",
    xpath: "//button[1]",
    text: "Submit",
    role: { role: "button", name: "Submit" },
    testid: "submit-btn",
    nth: null,
    placeholder: null,
  },
  tag: "BUTTON",
  attributes: { id: "submit-btn", class: "primary" },
  text_content: "Submit",
  bounding_box: { x: 0, y: 0, width: 100, height: 40 },
  is_in_iframe: false,
  iframe_selector: null,
} as const;

const dropTargetSelectors = {
  css: "div.drop-zone",
  xpath: null,
  text: null,
  role: null,
  testid: null,
  nth: null,
  placeholder: null,
} as const;

export const eventFixtures = {
  click: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "click",
    payload: { button: "left", modifiers: ["Shift"] },
  },
  dblclick: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "dblclick",
    payload: {},
  },
  right_click: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "right_click",
    payload: {},
  },
  hover: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "hover",
    payload: { position: { x: 50, y: 20 } },
  },
  drag_drop: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "drag_drop",
    payload: { target_selectors: dropTargetSelectors },
  },
  scroll: {
    ...baseEnvelope,
    event_type: "scroll",
    payload: { x: 0, y: 500, delta_y: 300, direction: "down" },
  },
  fill: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "fill",
    payload: { value: "user@example.com" },
  },
  clear: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "clear",
    payload: { previous_value: "old text" },
  },
  press_key: {
    ...baseEnvelope,
    event_type: "press_key",
    payload: { key: "Enter" },
  },
  type_sequentially: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "type_sequentially",
    payload: { value: "hello", delay: 50 },
  },
  select_option: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "select_option",
    payload: { value: "us", label: "United States" },
  },
  check: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "check",
    payload: { checked: true },
  },
  focus: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "focus",
    payload: {},
  },
  clipboard: {
    ...baseEnvelope,
    event_type: "clipboard",
    payload: { action: "copy", text: "Submit" },
  },
  navigation: {
    ...baseEnvelope,
    event_type: "navigation",
    payload: {
      to_url: "https://app.example.com/next",
      from_url: "https://app.example.com/",
      trigger: "link_click",
    },
  },
  page_load: {
    ...baseEnvelope,
    event_type: "page_load",
    payload: { load_state: "load" },
  },
  reload: {
    ...baseEnvelope,
    event_type: "reload",
    payload: {},
  },
  tab_open: {
    ...baseEnvelope,
    event_type: "tab_open",
    payload: {
      url: "https://app.example.com/popup",
      opener_tab_id: "33333333-3333-3333-3333-333333333333",
    },
  },
  tab_close: {
    ...baseEnvelope,
    event_type: "tab_close",
    payload: {},
  },
  history_change: {
    ...baseEnvelope,
    event_type: "history_change",
    payload: { url: "https://app.example.com/page", type: "pushState" },
  },
  file_upload: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "file_upload",
    payload: {
      filenames: ["doc.pdf"],
      mimes: ["application/pdf"],
      sizes: [102400],
    },
  },
  download: {
    ...baseEnvelope,
    event_type: "download",
    payload: { filename: "export.csv", mime: "text/csv" },
  },
  media_play: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "media_play",
    payload: { element_type: "video", src: "/v.mp4", current_time: 0 },
  },
  media_pause: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "media_pause",
    payload: { element_type: "video", current_time: 12.5 },
  },
  dialog: {
    ...baseEnvelope,
    event_type: "dialog",
    payload: { dialog_type: "confirm", message: "Are you sure?", response: "OK" },
  },
  permission_prompt: {
    ...baseEnvelope,
    event_type: "permission_prompt",
    payload: { permission: "notifications", response: "grant" },
  },
  api_request: {
    ...baseEnvelope,
    event_type: "api_request",
    payload: { method: "GET", url: "/api/x", status: 200, duration_ms: 145 },
  },
  api_error: {
    ...baseEnvelope,
    event_type: "api_error",
    payload: { method: "POST", url: "/api/x", status: 500, error_message: "Server error" },
  },
  websocket_message: {
    ...baseEnvelope,
    event_type: "websocket_message",
    payload: { url: "wss://example.com/ws", direction: "received", data: "ping" },
  },
  tap: {
    ...baseEnvelope,
    target: baseTarget,
    event_type: "tap",
    payload: { position: { x: 10, y: 20 } },
  },
  swipe: {
    ...baseEnvelope,
    event_type: "swipe",
    payload: {
      direction: "left",
      start: { x: 100, y: 0 },
      end: { x: 0, y: 0 },
    },
  },
  pinch_zoom: {
    ...baseEnvelope,
    event_type: "pinch_zoom",
    payload: { scale: 1.5, center: { x: 50, y: 50 } },
  },
} as const;

export const checkpointFixture = {
  schema_version: 1,
  checkpoint_id: "44444444-4444-4444-4444-444444444444",
  session_id: "22222222-2222-2222-2222-222222222222",
  trigger_event_id: "11111111-1111-1111-1111-111111111111",
  timestamp: "2026-05-06T12:00:01.000Z",
  url: "https://app.example.com/settings",
  visible_elements: [
    {
      selectors: {
        css: "h1",
        xpath: null,
        text: "Settings",
        role: { role: "heading", name: "Settings" },
        testid: null,
        nth: null,
        placeholder: null,
      },
      tag: "H1",
      text_content: "Settings",
      is_visible: true,
      bounding_box: { x: 20, y: 80, width: 300, height: 40 },
      computed_styles: { color: "rgb(0, 0, 0)", "font-size": "24px" },
    },
  ],
  form_values: null,
  focused_element: null,
  page_title: "Settings — App",
  recent_api_calls: [
    {
      method: "POST",
      url: "/api/settings",
      status: 200,
      duration_ms: 145,
    },
  ],
  console_errors: null,
  full_snapshot_url: "s3://snapshots/x.json.gz",
} as const;
