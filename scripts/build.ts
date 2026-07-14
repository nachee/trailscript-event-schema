import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";

import { EventSchema } from "../src/event.js";
import { CheckpointSchema } from "../src/checkpoint.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

mkdirSync(distDir, { recursive: true });

// `name` puts the root schema under `definitions.<name>` and references it
// with a top-level $ref. Trade-off: downstream Pydantic codegen wraps the
// referenced schema in an outer `Model` class, but variant classes get
// readable names (Event1…Event32) instead of Model1…Model32. The outer
// wrapper is redundant — consumers use `Event` and `Checkpoint` directly.
const eventJsonSchema = zodToJsonSchema(EventSchema, {
  name: "Event",
  $refStrategy: "root",
});

const checkpointJsonSchema = zodToJsonSchema(CheckpointSchema, {
  name: "Checkpoint",
  $refStrategy: "root",
});

writeFileSync(
  join(distDir, "event.schema.json"),
  JSON.stringify(eventJsonSchema, null, 2) + "\n",
);

writeFileSync(
  join(distDir, "checkpoint.schema.json"),
  JSON.stringify(checkpointJsonSchema, null, 2) + "\n",
);

console.log("Wrote event.schema.json and checkpoint.schema.json to", distDir);
