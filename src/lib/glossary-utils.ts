import { GlossaryItem, Glossary } from "./types";
import { load } from "@tauri-apps/plugin-store";

const GLOSSARY_STORE_KEY = "glossary";

/**
 * Get the current glossary from store
 */
export async function getGlossary(): Promise<Glossary> {
  const store = await load("store.json");
  const stored = await store.get(GLOSSARY_STORE_KEY);
  return (stored as Glossary) || { name: "默认词汇表", items: [] };
}

/**
 * Save glossary to store
 */
export async function saveGlossary(glossary: Glossary): Promise<void> {
  const store = await load("store.json");
  await store.set(GLOSSARY_STORE_KEY, glossary);
}

/**
 * Add a new item to the glossary
 */
export async function addGlossaryItem(
  item: Omit<GlossaryItem, "id">,
): Promise<void> {
  const glossary = await getGlossary();
  const newItem: GlossaryItem = {
    ...item,
    id: Date.now().toString(),
  };
  glossary.items.push(newItem);
  await saveGlossary(glossary);
}

/**
 * Update an existing glossary item
 */
export async function updateGlossaryItem(
  id: string,
  updates: Partial<Omit<GlossaryItem, "id">>,
): Promise<void> {
  const glossary = await getGlossary();
  const index = glossary.items.findIndex((item) => item.id === id);
  if (index >= 0) {
    glossary.items[index] = { ...glossary.items[index], ...updates };
    await saveGlossary(glossary);
  }
}

/**
 * Delete a glossary item
 */
export async function deleteGlossaryItem(id: string): Promise<void> {
  const glossary = await getGlossary();
  glossary.items = glossary.items.filter((item) => item.id !== id);
  await saveGlossary(glossary);
}

/**
 * Export glossary as JSON
 */
export async function exportGlossary(): Promise<string> {
  const glossary = await getGlossary();
  return JSON.stringify(glossary, null, 2);
}

/**
 * Import glossary from JSON
 */
export async function importGlossary(jsonData: string): Promise<void> {
  try {
    const parsed = JSON.parse(jsonData) as Glossary;

    // Validate the structure
    if (!parsed.name || !Array.isArray(parsed.items)) {
      throw new Error("Invalid glossary format");
    }

    // Ensure all items have required fields and add IDs if missing
    parsed.items = parsed.items.map((item) => ({
      ...item,
      id:
        item.id ||
        Date.now().toString() + Math.random().toString(36).substr(2, 9),
    }));

    // Append and deduplicate items by id
    const currentGlossary = await getGlossary();
    const existingIds = new Set(currentGlossary.items.map((i) => i.id));
    parsed.items = parsed.items.filter((item) => {
      if (existingIds.has(item.id)) {
        return false; // Skip existing items
      }
      existingIds.add(item.id); // Add new item ID to set
      return true; // Keep new item
    });
    currentGlossary.items.push(...parsed.items);
    await saveGlossary(currentGlossary);
  } catch (error) {
    throw new Error("Failed to import glossary: " + (error as Error).message);
  }
}

/**
 * Format glossary items for AI prompt
 */
export function formatGlossaryForPrompt(items: GlossaryItem[]): string {
  if (items.length === 0) {
    return "";
  }

  const glossaryText = items
    .map((item) => {
      let line = `${item.original} -> ${item.translation}`;
      if (item.explanation) {
        line += ` (${item.explanation})`;
      }
      return line;
    })
    .join("\n");

  return `\n\n请参考以下词汇表进行翻译：\n${glossaryText}`;
}
