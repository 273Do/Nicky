import { count } from "drizzle-orm";
import * as Crypto from "expo-crypto";

import type { FieldType } from "@/constants/journal";

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
    { type: "location", label: "Location" },
  ],
  "Reading Notes": [
    { type: "text", label: "Book Title" },
    { type: "text", label: "Author" },
    { type: "number", label: "Pages Read" },
    { type: "longText", label: "Key Takeaways" },
    { type: "check", label: "Finished" },
    { type: "rating", label: JSON.stringify({ name: "Rating", min: 1, max: 5 }) },
    { type: "link", label: "Link" },
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
    { type: "link", label: "Reference Link" },
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
    "# Productive Day\n\nFinished the project I've been working on.\n\n## Highlights\n- Completed the **API integration**\n- Had a nice walk in the park\n- Read 30 pages of *Atomic Habits*",
    "## Slow Sunday\n\nSpent most of the day reading and relaxing.\n\n> Sometimes you need a slow day to recharge.\n\nWatched a documentary about `machine learning` — fascinating stuff.",
    "Had a **challenging meeting** at work but it ended up going well.\n\n### Action Items\n1. Follow up with design team\n2. Update the ~~old~~ new spec doc\n3. Review [PR #42](https://github.com)",
    "Woke up early and went for a run.\n\n## Todo\n- Cleaned the kitchen\n- Did laundry\n- Organize bookshelf\n\nThe rest of the day flew by with errands and *cooking dinner*.",
    "# Quiet Day\n\nA quiet day at home. Organized my desk, did some journaling.\n\n**Note to self:** Try the `pomodoro technique` tomorrow.\n\n---\n\nOverall mood: *calm and content*.",
  ],
  Notes: [
    "## Form Check\n\nForm felt good today.\n\n**Focus areas:**\n- Keep core tight during heavy sets\n- Don't rush the eccentric phase\n- Breathe at the top of each rep",
    "Took it easy today, *still recovering* from yesterday's session.\n\n> Rest is part of the program.\n\nDid some light stretching and ~~skipped cardio~~ 10 min walk instead.",
    "# New PR!\n\nFelt **strong** and well-rested going in.\n\n- Squat: `120kg` x 5\n- Bench: `80kg` x 8\n- Deadlift: `140kg` x 3",
    "## Technique Day\n\nFocused on *technique* over weight.\n\n1. Slow reps with full range of motion\n2. Paused at the bottom for `2 seconds`\n3. Controlled the **negative**",
    "Quick session before work. Got the essentials in.\n\n- Deadlift: 3x5 @ 100kg\n- Pull-ups: 4x8\n- Plank: 3x60s\n\n*Total time: 35 min*",
  ],
  "Key Takeaways": [
    "# The Power of Habits\n\nThe **compound effect** of small habits is remarkable.\n\n> 1% better every day = 37x better in a year.\n\n## Key Principles\n- Start *small*\n- Be **consistent**\n- Track progress with `measurable` goals",
    "## Deep Work\n\nDeep focus requires eliminating distractions.\n\n### Strategies\n1. `Block scheduling` — dedicate 2-4 hour blocks\n2. **No notifications** during focus time\n3. Have a [shutdown ritual](https://calnewport.com) at end of day",
    "Good code should read like well-written prose.\n\n**Naming things clearly** is half the battle:\n- Use *descriptive* variable names\n- Avoid abbreviations\n- Functions should do ~~many things~~ one thing",
    "# Sapiens\n\nHistory is shaped by *collective myths* and shared beliefs.\n\n## Three Revolutions\n1. **Cognitive** — language and imagination\n2. **Agricultural** — settled civilizations\n3. **Scientific** — progress through ignorance",
    "## Thinking, Fast and Slow\n\nSystem 1 thinking is fast but error-prone.\n\n> Being aware of [cognitive biases](https://en.wikipedia.org/wiki/Cognitive_bias) is the first step.\n\n**Common traps:**\n- Anchoring effect\n- ~~Sunk cost~~ Sunk cost *fallacy*\n- Confirmation bias",
  ],
  "Recipe Notes": [
    "# Chicken Curry\n\nAdded extra garlic and a splash of **lemon juice**.\n\n## Tips\n- Simmer on *low heat* for at least `30 minutes`\n- Toast the spices first\n- Finish with fresh cilantro",
    "## Fresh Pasta\n\nUsed *fresh pasta* instead of dried — **huge difference** in texture.\n\n### Ingredients\n- 200g flour\n- 2 eggs\n- Pinch of salt\n- 1 tbsp olive oil\n\n> Will always make fresh from now on.",
    "Kept it simple with just salt, pepper, and olive oil.\n\n*Sometimes less is more.*\n\n---\n\n**Verdict:** Perfect weeknight dinner. Ready in `15 minutes`.",
    "## Lighter Version\n\nSubstituted cream with **coconut milk** for a lighter version.\n\n1. Sauté onions and garlic\n2. Add coconut milk + curry paste\n3. Simmer for 20 min\n\nTurned out *surprisingly* well!",
    "# Mom's Recipe\n\nAdded ~~cayenne pepper~~ **smoked paprika** instead.\n\n## Changes\n- Swapped butter for olive oil\n- Added `roasted garlic`\n- Used [this technique](https://example.com/cooking-tips)\n\nFamily **loved** it!",
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
    case "rating": {
      const parsed = JSON.parse(label);
      return String(rand(parsed.min, parsed.max));
    }
    case "link":
      return pick([
        "https://example.com/article/1",
        "https://example.com/recipe/pasta",
        "https://en.wikipedia.org/wiki/Main_Page",
        "https://developer.mozilla.org/en-US/docs/Web",
        "https://github.com",
      ]);
    case "location":
      return pick([
        JSON.stringify({ address: "Shibuya, Tokyo", lat: 35.6595, lng: 139.7004 }),
        JSON.stringify({ address: "Shinjuku, Tokyo", lat: 35.6938, lng: 139.7034 }),
        JSON.stringify({ address: "Osaka Station", lat: 34.7024, lng: 135.4959 }),
        JSON.stringify({ address: "Kyoto Tower", lat: 34.9875, lng: 135.7592 }),
        JSON.stringify({ address: "Yokohama, Kanagawa", lat: 35.4437, lng: 139.638 }),
      ]);
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
        const daysAgo = rand(0, 9);
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
