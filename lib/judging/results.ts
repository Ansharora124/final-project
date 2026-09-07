import { Evaluation } from './rubric';

export interface JudgingEntry {
  id: string;
  fileName: string;
  addedAt: string;
  status: 'pending' | 'completed' | 'unscored' | 'failed';
  evaluation?: Evaluation;
  error?: string;
  model?: string;
  rubricVersion?: string;
  evaluatedAt?: string;
}

export function rankEntries(entries: JudgingEntry[]) {
  const scored = entries.filter(e => e.status === 'completed' && typeof e.evaluation?.finalScore === 'number')
    .sort((a, b) => b.evaluation!.finalScore! - a.evaluation!.finalScore! || a.id.localeCompare(b.id));
  let rank = 0;
  return scored.map((entry, index) => {
    if (index === 0 || entry.evaluation!.finalScore !== scored[index - 1].evaluation!.finalScore) rank = index + 1;
    return { ...entry, rank };
  });
}

export function scoreStatistics(entries: JudgingEntry[]) {
  const values = rankEntries(entries).map(e => e.evaluation!.finalScore!);
  if (!values.length) return { count: 0, mean: null, median: null, standardDeviation: null };
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const middle = Math.floor(values.length / 2);
  return { count: values.length, mean, median: values.length % 2 ? values[middle] : (values[middle - 1] + values[middle]) / 2,
    standardDeviation: Math.sqrt(values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length) };
}

export function resultsCsv(entries: JudgingEntry[]): string {
  const ranks = new Map(rankEntries(entries).map(e => [e.id, e.rank]));
  const columns = ['entryId', 'fileName', 'status', 'rank', 'compositionScore', 'lightingScore', 'technicalScore', 'creativityScore', 'impactScore', 'finalScore', 'strengths', 'weaknesses', 'improvementSuggestion', 'shortJudgement', 'model', 'rubricVersion', 'evaluatedAt', 'error'];
  const cell = (value: unknown) => {
    let text = Array.isArray(value) ? value.join(' | ') : String(value ?? '');
    if (/^[\s]*[=+\-@]/.test(text)) text = "'" + text;
    return `"${text.replace(/"/g, '""')}"`;
  };
  return [columns.join(','), ...entries.map(entry => {
    const row: Record<string, unknown> = { ...entry, ...entry.evaluation, entryId: entry.id, rank: ranks.get(entry.id) };
    return columns.map(key => cell(row[key])).join(',');
  })].join('\r\n');
}
