import type { Phrase } from "./types";
import { c7alt } from "./data/c7alt";

export const PHRASES: Phrase[] = [c7alt];

export function getPhrase(id: string): Phrase | undefined {
  return PHRASES.find((p) => p.id === id);
}

export function getAllPhraseIds(): string[] {
  return PHRASES.map((p) => p.id);
}
