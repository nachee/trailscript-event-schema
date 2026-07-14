import { test } from "node:test";
import assert from "node:assert/strict";

import { CheckpointSchema } from "../src/index.js";
import { checkpointFixture } from "./fixtures.js";

test("CheckpointSchema accepts a fully-populated checkpoint", () => {
  const result = CheckpointSchema.safeParse(checkpointFixture);
  if (!result.success) {
    throw new Error(JSON.stringify(result.error.format(), null, 2));
  }
  assert.equal(result.success, true);
});

test("CheckpointSchema accepts a minimal checkpoint", () => {
  const minimal = {
    schema_version: 1,
    checkpoint_id: "44444444-4444-4444-4444-444444444444",
    session_id: "22222222-2222-2222-2222-222222222222",
    trigger_event_id: "11111111-1111-1111-1111-111111111111",
    timestamp: "2026-05-06T12:00:01.000Z",
    url: "https://app.example.com/",
  };
  const result = CheckpointSchema.safeParse(minimal);
  assert.equal(result.success, true);
});

test("CheckpointSchema rejects missing checkpoint_id", () => {
  const { checkpoint_id: _omit, ...rest } = checkpointFixture;
  const result = CheckpointSchema.safeParse(rest);
  assert.equal(result.success, false);
});

test("CheckpointSchema rejects malformed trigger_event_id", () => {
  const result = CheckpointSchema.safeParse({
    ...checkpointFixture,
    trigger_event_id: "not-a-uuid",
  });
  assert.equal(result.success, false);
});

test("CheckpointSchema rejects schema_version: 2", () => {
  const result = CheckpointSchema.safeParse({
    ...checkpointFixture,
    schema_version: 2,
  });
  assert.equal(result.success, false);
});
