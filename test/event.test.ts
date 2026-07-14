import { test } from "node:test";
import assert from "node:assert/strict";

import { EventSchema, EVENT_TYPES, EventBatchSchema } from "../src/index.js";
import { eventFixtures } from "./fixtures.js";

// Round-trip every event_type fixture through the discriminated union.
for (const [eventType, fixture] of Object.entries(eventFixtures)) {
  test(`EventSchema accepts ${eventType}`, () => {
    const result = EventSchema.safeParse(fixture);
    if (!result.success) {
      throw new Error(
        `${eventType} failed to parse:\n${JSON.stringify(result.error.format(), null, 2)}`,
      );
    }
    assert.equal(result.data.event_type, eventType);
  });
}

test("eventFixtures covers every event_type the schema declares", () => {
  const fixtureKeys = Object.keys(eventFixtures).sort();
  const eventTypes = [...EVENT_TYPES].sort();
  assert.deepEqual(fixtureKeys, eventTypes);
});

test("EventSchema rejects unknown event_type", () => {
  const result = EventSchema.safeParse({
    ...eventFixtures.click,
    event_type: "totally-not-real",
  });
  assert.equal(result.success, false);
});

test("EventSchema rejects schema_version: 2", () => {
  const result = EventSchema.safeParse({ ...eventFixtures.click, schema_version: 2 });
  assert.equal(result.success, false);
});

test("EventSchema rejects click without target", () => {
  const { target: _omit, ...withoutTarget } = eventFixtures.click;
  const result = EventSchema.safeParse(withoutTarget);
  assert.equal(result.success, false);
});

test("EventSchema rejects malformed UUIDs", () => {
  const result = EventSchema.safeParse({ ...eventFixtures.click, event_id: "not-a-uuid" });
  assert.equal(result.success, false);
});

test("EventSchema rejects negative sequence", () => {
  const result = EventSchema.safeParse({ ...eventFixtures.click, sequence: -1 });
  assert.equal(result.success, false);
});

test("EventBatchSchema accepts a non-empty array", () => {
  const result = EventBatchSchema.safeParse({ events: [eventFixtures.click] });
  assert.equal(result.success, true);
});

test("EventBatchSchema rejects empty array", () => {
  const result = EventBatchSchema.safeParse({ events: [] });
  assert.equal(result.success, false);
});

test("EventBatchSchema rejects more than 500 events", () => {
  const events = Array.from({ length: 501 }, (_, i) => ({
    ...eventFixtures.click,
    sequence: i,
  }));
  const result = EventBatchSchema.safeParse({ events });
  assert.equal(result.success, false);
});

test("select_option payload requires at least one of value/label/index", () => {
  const result = EventSchema.safeParse({
    ...eventFixtures.select_option,
    payload: {},
  });
  assert.equal(result.success, false);
});
