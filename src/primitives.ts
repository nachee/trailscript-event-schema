import { z } from "zod";

export const ModifierSchema = z.enum(["Shift", "Ctrl", "Alt", "Meta"]);
export type Modifier = z.infer<typeof ModifierSchema>;

export const PositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});
export type Position = z.infer<typeof PositionSchema>;

export const BoundingBoxSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
});
export type BoundingBox = z.infer<typeof BoundingBoxSchema>;

export const RoleSelectorSchema = z.object({
  role: z.string(),
  name: z.string(),
});

export const NthSelectorSchema = z.object({
  selector: z.string(),
  index: z.number().int(),
});

export const SelectorsSchema = z.object({
  css: z.string().nullable(),
  xpath: z.string().nullable(),
  text: z.string().nullable(),
  role: RoleSelectorSchema.nullable(),
  testid: z.string().nullable(),
  nth: NthSelectorSchema.nullable(),
  placeholder: z.string().nullable(),
});
export type Selectors = z.infer<typeof SelectorsSchema>;

// Per markdown: attributes is a free-form map of element attributes (id, class,
// data-*, aria-*, href, etc.). String or null values.
// P1-4: bound each value (≤ 2048 chars) and cap the number of keys (≤ 50) so a
// malicious or runaway element can't smuggle an unbounded payload through the
// free-form map.
export const MAX_ATTRIBUTE_VALUE_LEN = 2048;
export const MAX_ATTRIBUTE_KEYS = 50;
export const AttributesSchema = z
  .record(z.string(), z.string().max(MAX_ATTRIBUTE_VALUE_LEN).nullable())
  .refine((attrs) => Object.keys(attrs).length <= MAX_ATTRIBUTE_KEYS, {
    message: `attributes may not exceed ${MAX_ATTRIBUTE_KEYS} keys`,
  });

// P1-4: captured free text is bounded. The tracker already truncates to 200
// chars at capture; 500 is a defensive ceiling that leaves headroom.
export const MAX_TEXT_CONTENT_LEN = 500;

export const TargetSchema = z.object({
  selectors: SelectorsSchema,
  tag: z.string(),
  attributes: AttributesSchema,
  text_content: z.string().max(MAX_TEXT_CONTENT_LEN).nullable(),
  bounding_box: BoundingBoxSchema.nullable(),
  is_in_iframe: z.boolean(),
  iframe_selector: z.string().nullable(),
});
export type Target = z.infer<typeof TargetSchema>;

export const ViewportSchema = z.object({
  width: z.number().int(),
  height: z.number().int(),
});
export type Viewport = z.infer<typeof ViewportSchema>;

export const PageContextSchema = z.object({
  url: z.string(),
  title: z.string().optional(),
  viewport: ViewportSchema.optional(),
});
export type PageContext = z.infer<typeof PageContextSchema>;
