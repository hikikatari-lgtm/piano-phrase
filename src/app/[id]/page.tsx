import { notFound } from "next/navigation";
import { getAllPhraseIds, getPhrase } from "@/lib/phrases";
import PhraseView from "@/components/PhraseView";

export function generateStaticParams() {
  return getAllPhraseIds().map((id) => ({ id }));
}

export default async function PhrasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const phrase = getPhrase(id);
  if (!phrase) notFound();
  return <PhraseView phrase={phrase} />;
}
