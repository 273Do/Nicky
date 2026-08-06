import { count } from "drizzle-orm";
import * as Crypto from "expo-crypto";

import type { FieldType } from "@/core/constants";

import { db } from "./client";
import { entries, entryValues, fields, journals } from "./schemas";

// ── ヘルパー ──

const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = <T>(arr: T[]): T => arr[rand(0, arr.length - 1)];
const uuid = () => Crypto.randomUUID();

// ── ジャーナル定義 ──

const JOURNALS = [
  { name: "Daily Journal", icon: "book.fill" as const, color: "#6366F1" },
  { name: "Workout Log", icon: "figure.run" as const, color: "#D256FD" },
  { name: "Reading Notes", icon: "pencil" as const, color: "#10B981" },
  { name: "Cooking Diary", icon: "fork.knife" as const, color: "#F59E0B" },
];

// ── フィールドテンプレート ──

type FieldTemplate = { type: FieldType; label: string };

const FIELD_POOL: Record<string, FieldTemplate[]> = {
  "Daily Journal": [
    { type: "text", label: "Title" },
    { type: "longText", label: "How was your day?" },
    { type: "check", label: "Morning Routine" },
    { type: "check", label: "Exercised" },
    { type: "number", label: "Mood (1-10)" },
    { type: "date", label: "Date" },
    { type: "time", label: "Wake Up Time" },
  ],
  "Workout Log": [
    { type: "text", label: "Exercise" },
    { type: "number", label: "Sets" },
    { type: "number", label: "Reps" },
    { type: "number", label: "Weight (kg)" },
    { type: "longText", label: "Notes" },
    { type: "check", label: "Stretched" },
    { type: "time", label: "Duration" },
  ],
  "Reading Notes": [
    { type: "text", label: "Book Title" },
    { type: "text", label: "Author" },
    { type: "number", label: "Pages Read" },
    { type: "longText", label: "Key Takeaways" },
    { type: "check", label: "Finished" },
    { type: "number", label: "Rating (1-5)" },
    { type: "date", label: "Date" },
  ],
  "Cooking Diary": [
    { type: "text", label: "Dish Name" },
    { type: "longText", label: "Recipe Notes" },
    { type: "number", label: "Servings" },
    { type: "number", label: "Prep Time (min)" },
    { type: "check", label: "Would Make Again" },
    { type: "check", label: "New Recipe" },
    { type: "time", label: "Cooking Time" },
  ],
};

// ── 値生成 ──

const TEXT_VALUES: Record<string, string[]> = {
  Title: [
    "Productive morning",
    "Lazy Sunday",
    "A great start",
    "Felt grateful today",
    "Rainy day thoughts",
    "Weekend plans",
    "Monday motivation",
    "Late night reflections",
    "Coffee and sunshine",
    "Back to basics",
  ],
  Exercise: [
    "Bench Press",
    "Squat",
    "Deadlift",
    "Pull-ups",
    "Running",
    "Plank",
    "Lunges",
    "Shoulder Press",
    "Rowing",
    "Burpees",
  ],
  "Book Title": [
    "Atomic Habits",
    "Deep Work",
    "The Pragmatic Programmer",
    "Sapiens",
    "Thinking, Fast and Slow",
    "The Design of Everyday Things",
    "Clean Code",
    "Shoe Dog",
    "Educated",
    "The Almanack of Naval",
  ],
  Author: [
    "James Clear",
    "Cal Newport",
    "David Thomas",
    "Yuval Noah Harari",
    "Daniel Kahneman",
    "Don Norman",
    "Robert C. Martin",
    "Phil Knight",
    "Tara Westover",
    "Eric Jorgenson",
  ],
  "Dish Name": [
    "Chicken Curry",
    "Pasta Carbonara",
    "Caesar Salad",
    "Miso Soup",
    "Tacos",
    "Fried Rice",
    "Pancakes",
    "Grilled Salmon",
    "Ramen",
    "Banana Bread",
  ],
};

const LONG_TEXT_VALUES: Record<string, string[]> = {
  "How was your day?": [
    "Today was really productive. Finished the project I've been working on and had a nice walk in the park.",
    "Spent most of the day reading and relaxing. Sometimes you need a slow day to recharge.",
    "Had a challenging meeting at work but it ended up going well. Feeling accomplished.",
    "Woke up early and went for a run. The rest of the day flew by with errands and cooking dinner.",
    "A quiet day at home. Organized my desk, did some journaling, and watched a documentary.",
  ],
  Notes: [
    "Form felt good today. Need to focus on keeping core tight during heavy sets.",
    "Took it easy today, still recovering from yesterday's session.",
    "New personal best! Felt strong and well-rested going in.",
    "Focused on technique over weight. Slow reps with full range of motion.",
    "Quick session before work. Got the essentials in.",
  ],
  "Key Takeaways": [
    "The compound effect of small habits is remarkable. 1% better every day really adds up over time.",
    "Deep focus requires eliminating distractions. Block scheduling works well for this.",
    "Good code should read like well-written prose. Naming things clearly is half the battle.",
    "History is shaped by collective myths and shared beliefs. Fascinating perspective on human civilization.",
    "System 1 thinking is fast but error-prone. Being aware of cognitive biases is the first step.",
  ],
  "Recipe Notes": [
    "Added extra garlic and a splash of lemon juice. The secret is to let it simmer on low heat for at least 30 minutes.",
    "Used fresh pasta instead of dried — huge difference in texture. Will always do this from now on.",
    "Kept it simple with just salt, pepper, and olive oil. Sometimes less is more.",
    "Substituted cream with coconut milk for a lighter version. Turned out surprisingly well.",
    "Mom's recipe with a twist — added smoked paprika. Family loved it!",
  ],
};

function generateValue(fieldType: FieldType, label: string): string | null {
  switch (fieldType) {
    case "text":
      return pick(TEXT_VALUES[label] ?? ["Sample text", "Another entry", "Notes for today"]);
    case "longText":
      return pick(
        LONG_TEXT_VALUES[label] ?? [
          "Some detailed notes about this entry.",
          "Nothing special to note today.",
        ],
      );
    case "number": {
      const ranges: Record<string, [number, number]> = {
        "Mood (1-10)": [4, 10],
        Sets: [2, 5],
        Reps: [5, 15],
        "Weight (kg)": [20, 100],
        "Pages Read": [5, 80],
        "Rating (1-5)": [2, 5],
        Servings: [1, 6],
        "Prep Time (min)": [5, 60],
      };
      const [min, max] = ranges[label] ?? [1, 100];
      return String(rand(min, max));
    }
    case "check":
      return Math.random() > 0.4 ? "true" : "false";
    case "date": {
      const now = Date.now();
      const daysAgo = rand(0, 90);
      return String(now - daysAgo * 86400000);
    }
    case "time": {
      const hours = rand(5, 22);
      const minutes = rand(0, 59);
      const d = new Date();
      d.setHours(hours, minutes, 0, 0);
      return String(d.getTime());
    }
    default:
      return null;
  }
}

// ── シード実行 ──

export async function seed() {
  const [{ value }] = await db.select({ value: count() }).from(journals);
  if (value > 0) return;

  await db.transaction(async (tx) => {
    for (const journal of JOURNALS) {
      const journalId = uuid();
      const now = Date.now();

      await tx.insert(journals).values({
        id: journalId,
        name: journal.name,
        icon: journal.icon,
        color: journal.color,
        createdAt: now,
        updatedAt: now,
      });

      // フィールドをランダムに 3〜7 個選択
      const pool = FIELD_POOL[journal.name];
      const fieldCount = rand(3, Math.min(7, pool.length));
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      const selectedFields = shuffled.slice(0, fieldCount);

      const fieldRows = selectedFields.map((f, i) => ({
        id: uuid(),
        journalId,
        type: f.type,
        label: f.label,
        sortOrder: i,
      }));

      await tx.insert(fields).values(fieldRows);

      // エントリーをランダムに 5〜20 個作成
      const entryCount = rand(5, 20);

      for (let e = 0; e < entryCount; e++) {
        const entryId = uuid();
        const daysAgo = rand(0, 120);
        const createdAt = now - daysAgo * 86400000 + rand(0, 86400000);

        await tx.insert(entries).values({
          id: entryId,
          journalId,
          bookmark: Math.random() > 0.8,
          createdAt,
          updatedAt: createdAt,
        });

        const valueRows = fieldRows.map((field) => ({
          id: uuid(),
          entryId,
          fieldId: field.id,
          value: generateValue(field.type as FieldType, field.label),
        }));

        await tx.insert(entryValues).values(valueRows);
      }
    }
  });

  console.log("Seed completed");
}
