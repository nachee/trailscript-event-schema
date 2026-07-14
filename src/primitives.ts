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
export const AttributesSchema = z.record(z.string(), z.string().nullable());

export const TargetSchema = z.object({
  selectors: SelectorsSchema,
  tag: z.string(),
  attributes: AttributesSchema,
  text_content: z.string().nullable(),
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
