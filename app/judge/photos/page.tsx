'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, Download, Play, Pause, Upload, ShieldCheck, Trash2, CheckCircle2, ImagePlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { CRITERIA, IMAGE_TYPES, MAX_IMAGE_BYTES, MAX_PHOTOS, RUBRIC_VERSION, SCORE_BANDS, validateEvaluation } from '@/lib/judging/rubric';
import { rankEntries, resultsCsv, scoreStatistics } from '@/lib/judging/results';
import { deleteEntry, loadEntries, saveEntry, StoredEntry } from '@/lib/judging/storage';

type Configuration = { configured: boolean; model: string; rubricVersion: string };
const card = 'rounded-2xl border border-white/10 bg-zinc-950';

function Photo({ blob, large = false }: { blob: Blob; large?: boolean }) {
  const [url, setUrl] = useState('');
  useEffect(() => { const next = URL.createObjectURL(blob); setUrl(next); return () => URL.revokeObjectURL(next); }, [blob]);
  // Local blobs are deliberately used instead of uploading photos to a public image host.
  return url ? <img src={url} alt="Submitted photograph" loading="lazy" className={large ? 'w-full max-h-[620px] object-contain' : 'h-12 w-12 rounded-lg object-cover'} /> : null;
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function PhotoJudgingPage() {
  const [entries, setEntries] = useState<StoredEntry[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [configuration, setConfiguration] = useState<Configuration | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [running, setRunning] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [notice, setNotice] = useState('');
  const [view, setView] = useState<'queue' | 'ranking'>('queue');
  const [showNames, setShowNames] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [pauseRequested, setPauseRequested] = useState(false);
  const stop = useRef(false);
  const input = useRef<HTMLInputElement>(null);
  const singleInput = useRef<HTMLInputElement>(null);

  async function refreshConfiguration() {
    const response = await fetch('/api/judging', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not check automatic judging setup.');
    const next: Configuration = await response.json();
    setConfiguration(next); return next;
  }

  useEffect(() => {
    Promise.all([loadEntries().then(setEntries), refreshConfiguration()])
      .catch(error => setNotice(error.message)).finally(() => setLoading(false));
    return () => { stop.current = true; };
  }, []);

  useEffect(() => {
    if (!running) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [running]);

  // One collection writer across browser tabs; reload inside the lock to avoid stale writes.
  async function exclusive(action: (fresh: StoredEntry[]) => Promise<void>) {
    if (busy || loading) return;
    setBusy(true); setNotice('');
    try {
      if (!navigator.locks) throw new Error('Use a browser with Web Locks support on localhost to save and evaluate photos.');
      await navigator.locks.request('pixel-prize-judging-writer', { ifAvailable: true }, async lock => {
        if (!lock) throw new Error('This collection is open for editing in another tab. Wait for that operation to finish.');
        const fresh = await loadEntries(); setEntries(fresh); await action(fresh);
      });
    } catch (error) { setNotice(error instanceof Error ? error.message : 'The operation could not be completed.'); }
    finally { setBusy(false); setRunning(false); setCurrentId(null); }
  }

  async function addPhotos(files: File[], singlePhoto = false) {
    await exclusive(async fresh => {
      const next = [...fresh]; const messages: string[] = []; let added = 0;
      for (const file of files) {
        if (next.length >= MAX_PHOTOS) { messages.push('The collection has reached its 200-photo limit.'); break; }
        if (!IMAGE_TYPES.includes(file.type) || !file.size || file.size > MAX_IMAGE_BYTES) { messages.push(`${file.name}: use JPEG, PNG or WebP, up to 20 MB.`); continue; }
        try {
          const bitmap = await createImageBitmap(file);
          const pixels = bitmap.width * bitmap.height; bitmap.close();
          if (pixels > 40_000_000) { messages.push(`${file.name}: use a photo of up to 40 megapixels.`); continue; }
          const hash = await crypto.subtle.digest('SHA-256', await file.arrayBuffer());
          const id = Array.from(new Uint8Array(hash), byte => byte.toString(16).padStart(2, '0')).join('');
          if (next.some(entry => entry.id === id)) {
            if (singlePhoto) { setSelectedId(id); setView('queue'); }
            messages.push(singlePhoto ? 'This photo is already in your collection. It is selected below.' : `${file.name}: duplicate skipped.`);
            continue;
          }
          const entry: StoredEntry = { id, fileName: file.name, addedAt: new Date().toISOString(), status: 'pending', photo: file };
          await saveEntry(entry); next.push(entry); added++;
          setEntries([...next]); setSelectedId(current => singlePhoto ? entry.id : current ?? entry.id);
          if (singlePhoto) setView('queue');
        } catch (error) {
          if (error instanceof Error && error.message.includes('storage')) throw error;
          messages.push(`${file.name}: could not read or save this photograph.`);
        }
      }
      setNotice(`${singlePhoto && added === 1 ? 'Your test photo is ready. Click “Evaluate photo” below to review just this image.' : `${added} photograph${added === 1 ? '' : 's'} added.`}${messages.length ? ' ' + messages.slice(0, 5).join(' ') + (messages.length > 5 ? ` (${messages.length - 5} more skipped.)` : '') : ''}`);
    });
  }

  async function evaluate(onlyId?: string) {
    await exclusive(async fresh => {
      const config = await refreshConfiguration();
      if (!config.configured) throw new Error('Add OPENAI_API_KEY to .env.local on the server and restart the app to enable automatic judging.');
      if (fresh.some(entry => entry.evaluation && (entry.model !== config.model || entry.rubricVersion !== config.rubricVersion))) throw new Error('The saved results use different judging settings. Restore their model and rubric before continuing this collection.');
      const queue = fresh.filter(entry => !entry.evaluation && (!onlyId || entry.id === onlyId));
      if (!queue.length) { setNotice('There are no pending photographs to evaluate.'); return; }
      stop.current = false; setPauseRequested(false); setRunning(true);
      let completed = 0;
      for (const entry of queue) {
        if (stop.current) break;
        setCurrentId(entry.id); setSelectedId(entry.id);
        let updated: StoredEntry;
        let stopBatch = false;
        try {
          const form = new FormData(); form.append('photo', entry.photo, 'photograph');
          form.append('model', config.model); form.append('rubricVersion', config.rubricVersion);
          const response = await fetch('/api/judging', { method: 'POST', headers: { 'X-Judging-Client': 'photo-workspace' }, body: form, signal: AbortSignal.timeout(150_000) });
          const body = await response.json();
          if (!response.ok) {
            stopBatch = [401, 403, 409, 429, 503, 504].includes(response.status);
            throw new Error(body.error || 'The photograph could not be evaluated.');
          }
          const evaluation = validateEvaluation(body);
          updated = { ...entry, evaluation, error: undefined, status: evaluation.finalScore === null ? 'unscored' : 'completed', model: config.model, rubricVersion: config.rubricVersion, evaluatedAt: new Date().toISOString() };
          completed++;
        } catch (error) {
          if (error instanceof DOMException) stopBatch = true;
          updated = { ...entry, status: 'failed', error: error instanceof Error ? error.message : 'Evaluation failed. Please retry.' };
        }
        // Save each result before moving on. A storage failure stops the queue.
        await saveEntry(updated);
        setEntries(previous => previous.map(item => item.id === updated.id ? updated : item));
        if (stopBatch) { setNotice(updated.error || 'The batch was paused.'); return; }
      }
      setNotice(`${stop.current ? 'Paused.' : 'Queue finished.'} ${completed} evaluation${completed === 1 ? '' : 's'} saved. Failed photos can be retried; completed results are kept.`);
    });
  }

  const ranked = useMemo(() => rankEntries(entries), [entries]);
  const stats = useMemo(() => scoreStatistics(entries), [entries]);
  const selected = entries.find(entry => entry.id === selectedId) ?? entries[0];
  const ordered = useMemo(() => [...entries].sort((a, b) => a.addedAt.localeCompare(b.addedAt) || a.id.localeCompare(b.id)), [entries]);
  const visibleEntries = view === 'ranking' ? ranked : ordered;
  const done = entries.filter(entry => entry.evaluation).length;
  const pending = entries.filter(entry => !entry.evaluation).length;
  const label = (entry: { id: string }) => `Entry ${String(ordered.findIndex(item => item.id === entry.id) + 1).padStart(3, '0')}`;
  const evaluation = selected?.evaluation;
  const exportJson = () => download('photography-results.json', JSON.stringify({ exportedAt: new Date().toISOString(), statistics: stats, entries: entries.map(({ photo, ...entry }) => ({ ...entry, rank: ranked.find(item => item.id === entry.id)?.rank ?? null })) }, null, 2), 'application/json');

  return <div className="space-y-6">
    <header className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">PixelPrize / Judging workspace</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Every photograph. A fair review.</h1>
        <p className="max-w-xl text-sm leading-relaxed text-zinc-400">Add your photographs when you’re ready. Each receives an independent review across the same five criteria, with a score out of 100.</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" disabled={!entries.length || busy} onClick={exportJson} leftIcon={<Download className="h-4 w-4" />}>Export JSON</Button>
        <Button variant="outline" size="sm" disabled={!entries.length || busy} onClick={() => download('photography-results.csv', '\uFEFF' + resultsCsv(entries), 'text/csv;charset=utf-8')}>CSV</Button>
      </div>
    </header>

    <div className="flex items-center gap-2 text-xs text-zinc-400"><ShieldCheck className="h-4 w-4 text-emerald-400" />Independent judging · Identity hidden · Fixed 100-point rubric</div>

    {configuration && !configuration.configured && <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-100">
      <strong>Photo uploads are ready. Automatic judging needs setup.</strong>
      <p className="mt-1 text-amber-100/75">Add your OpenAI API key as <code>OPENAI_API_KEY</code> in <code>.env.local</code>, then restart the app. Your key stays on the server.</p>
      <button className="mt-2 underline underline-offset-4" disabled={busy} onClick={() => refreshConfiguration().catch(error => setNotice(error.message))}>Check connection again</button>
    </div>}
    {notice && <div role="status" aria-live="polite" className="rounded-xl border border-white/15 bg-zinc-900 p-4 text-sm text-zinc-200 break-words">{notice}</div>}

    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      {[['Photographs', `${entries.length} / ${MAX_PHOTOS}`], ['Reviewed', `${done} / ${entries.length}`], ['Average score', stats.mean === null ? '—' : `${stats.mean.toFixed(1)} / 100`], ['Awaiting evaluation', pending]].map(([title, value]) => <div key={title} className={`${card} p-4`}><p className="text-xs text-zinc-400">{title}</p><p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p></div>)}
    </div>

    <section className={`${card} p-5 ${dragging ? 'ring-2 ring-amber-400' : ''}`} onDragOver={event => { event.preventDefault(); if (!busy) setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={event => { event.preventDefault(); setDragging(false); if (!busy) void addPhotos(Array.from(event.dataTransfer.files)); }}>
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4"><div className="rounded-xl bg-amber-500/10 p-3 text-amber-400"><ImagePlus className="h-6 w-6" /></div><div><h2 className="font-semibold">Your competition collection</h2><p className="text-xs text-zinc-400 mt-1">Drop photos here · JPEG, PNG or WebP · Up to 20 MB each</p></div></div>
        <div className="flex flex-wrap gap-2">
          <input ref={singleInput} className="sr-only" type="file" aria-label="Upload one test photograph" accept={IMAGE_TYPES.join(',')} disabled={busy || loading} onChange={event => { const file = event.target.files?.[0]; event.target.value = ''; if (file) void addPhotos([file], true); }} />
          <Button variant="gold" disabled={busy || loading || entries.length >= MAX_PHOTOS} onClick={() => singleInput.current?.click()} leftIcon={<Camera className="h-4 w-4" />}>Test one photo</Button>
          <input ref={input} className="sr-only" type="file" aria-label="Upload photographs" multiple accept={IMAGE_TYPES.join(',')} disabled={busy || loading} onChange={event => { const files = Array.from(event.target.files ?? []); event.target.value = ''; void addPhotos(files); }} />
          <Button variant="outline" disabled={busy || loading || entries.length >= MAX_PHOTOS} onClick={() => input.current?.click()} leftIcon={<Upload className="h-4 w-4" />}>Add a batch</Button>
          {running ? <Button variant="gold" disabled={pauseRequested} onClick={() => { stop.current = true; setPauseRequested(true); }} leftIcon={<Pause className="h-4 w-4" />}>{pauseRequested ? 'Finishing current photo…' : 'Pause after this photo'}</Button> : <Button variant="outline" disabled={busy || loading || !pending || !configuration?.configured} onClick={() => evaluate()} leftIcon={<Play className="h-4 w-4" />}>{pending === 1 ? 'Evaluate 1 photo' : pending ? `Evaluate all ${pending} photos` : 'Evaluate photos'}</Button>}
        </div>
      </div>
      <p className="mt-4 text-sm text-zinc-300">Just testing? Choose <strong>Test one photo</strong>, then click <strong>Evaluate photo</strong> on its preview. Only that image will be reviewed.</p>
      <p className="mt-2 text-xs text-zinc-500">Photos and results save in this browser. Export results for a separate copy. Evaluation sends each photo to OpenAI and uses your API account. Keep this page open while the queue runs.</p>
      {running && <div className="mt-4 space-y-2" role="status"><p className="text-xs text-amber-300">Evaluating {selected ? label(selected) : 'photograph'} · {done} of {entries.length} reviewed</p><progress aria-label="Review progress" max={entries.length} value={done} className="h-1.5 w-full accent-amber-400" /></div>}
    </section>

    {loading ? <p role="status" className="py-12 text-center text-zinc-400">Loading your saved photographs…</p> : !entries.length ? <div className={`${card} py-20 px-6 text-center`}><Camera className="mx-auto h-12 w-12 text-zinc-600" /><h2 className="mt-5 text-xl font-semibold">The next great photograph is yours to add.</h2><p className="mx-auto mt-2 max-w-md text-sm text-zinc-400">Your collection starts empty. Add one photo or a batch of up to 200, then review scores and specific feedback here.</p><Button className="mt-6" variant="gold" disabled={busy} onClick={() => input.current?.click()}>Choose photographs</Button></div> : <div className="grid xl:grid-cols-[300px_minmax(0,1fr)] gap-5 items-start">
      <section className={`${card} overflow-hidden`}>
        <div className="p-3 flex gap-2 border-b border-white/10" aria-label="Photo list view">{(['queue', 'ranking'] as const).map(tab => <button key={tab} aria-pressed={view === tab} onClick={() => setView(tab)} className={`flex-1 rounded-lg py-2 text-sm ${view === tab ? 'bg-amber-500/15 text-amber-300' : 'text-zinc-400'}`}>{tab === 'queue' ? 'All photos' : 'Rankings'}</button>)}</div>
        <label className="flex items-center gap-2 p-4 text-xs text-zinc-400"><input type="checkbox" checked={showNames} onChange={event => setShowNames(event.target.checked)} className="accent-amber-500" />Show filenames locally</label>
        <div className="max-h-[650px] overflow-y-auto p-2 space-y-1">
          {!visibleEntries.length && <p className="p-4 text-sm text-zinc-500">Rankings appear after a photo is scored.</p>}
          {visibleEntries.map(entry => <button key={entry.id} onClick={() => setSelectedId(entry.id)} className={`flex w-full items-center gap-3 rounded-xl p-3 text-left ${entry.id === selected?.id ? 'bg-white/10 ring-1 ring-inset ring-amber-400/30' : 'hover:bg-white/5'}`}>
            <Photo blob={entries.find(item => item.id === entry.id)!.photo} />
            <div className="min-w-0 flex-1"><p className="text-sm font-medium truncate">{view === 'ranking' ? `#${ranked.find(item => item.id === entry.id)?.rank} · ` : ''}{label(entry)}</p>{showNames && <p className="text-xs text-zinc-500 truncate">{entry.fileName}</p>}<p className={`text-xs mt-1 ${entry.status === 'failed' ? 'text-rose-400' : 'text-zinc-400'}`}>{entry.id === currentId ? 'Evaluating…' : entry.status === 'completed' ? 'Reviewed' : entry.status === 'unscored' ? 'Low confidence · unranked' : entry.status === 'failed' ? 'Failed · retry available' : 'Awaiting evaluation'}</p></div>
            <span className="text-lg font-semibold tabular-nums text-amber-300">{entry.evaluation?.finalScore ?? '—'}</span>
          </button>)}
        </div>
        {view === 'ranking' && <p className="p-4 border-t border-white/10 text-xs text-zinc-500">Equal scores share a rank. Unscored and failed photos are excluded. Rankings are provisional until every photo is reviewed.</p>}
      </section>

      {selected && <section className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-b border-white/10"><div><h2 className="font-semibold">{label(selected)}</h2>{showNames && <p className="text-xs text-zinc-400 break-all">{selected.fileName}</p>}</div><div className="flex gap-2">{!selected.evaluation && <Button size="sm" variant="gold" disabled={busy || !configuration?.configured} onClick={() => evaluate(selected.id)}>{selected.status === 'failed' ? 'Retry evaluation' : 'Evaluate photo'}</Button>}<Button size="sm" variant="ghost" disabled={busy} aria-label={`Remove ${label(selected)}`} onClick={() => { if (window.confirm(`Remove ${label(selected)} and its saved review from this browser?`)) void exclusive(async () => { await deleteEntry(selected.id); setEntries(previous => previous.filter(item => item.id !== selected.id)); setSelectedId(null); }); }} leftIcon={<Trash2 className="h-4 w-4" />}>Remove</Button></div></div>
        <div className="bg-black p-3"><Photo blob={selected.photo} large /></div>
        <div className="p-5 sm:p-6 space-y-5">
          {selected.error && <p role="alert" className="rounded-xl bg-rose-500/10 p-4 text-sm text-rose-300">{selected.error}</p>}
          {!evaluation ? <p className="text-sm text-zinc-400">{currentId === selected.id ? 'Reviewing this photograph against the fixed criteria…' : 'No score assigned yet. Evaluate this photo when you’re ready.'}</p> : <>
            <div className="flex items-center justify-between gap-4"><div><p className="text-xs text-zinc-400 uppercase tracking-wider">{evaluation.finalScore === null ? 'Low confidence' : 'Final score'}</p><p className="mt-1 text-4xl font-semibold text-amber-300">{evaluation.finalScore ?? 'Unscored'}{evaluation.finalScore !== null && <span className="text-base text-zinc-500"> / 100</span>}</p></div>{evaluation.finalScore !== null && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}</div>
            <p className="text-sm leading-relaxed text-zinc-300">{evaluation.shortJudgement}</p>
            <div className="space-y-3">{CRITERIA.map(criterion => <div key={criterion.key}><div className="mb-1.5 flex justify-between text-xs"><span className="text-zinc-400">{criterion.name}</span><span>{evaluation[criterion.key] ?? '—'} / {criterion.max}</span></div><div className="h-1.5 rounded-full bg-white/5"><div className="h-full rounded-full bg-amber-400/80" style={{ width: `${(evaluation[criterion.key] ?? 0) / criterion.max * 100}%` }} /></div></div>)}</div>
            <div className="grid sm:grid-cols-2 gap-4">{[['Strongest aspects', evaluation.strengths], ['Main weaknesses', evaluation.weaknesses]].map(([title, items]) => <div key={title as string} className="rounded-xl bg-white/[0.03] p-4"><h3 className="text-sm font-semibold mb-2">{title}</h3><ul className="list-disc pl-4 text-sm text-zinc-400 space-y-1">{(items as string[]).map((text, index) => <li key={index}>{text}</li>)}</ul>{!(items as string[]).length && <p className="text-sm text-zinc-500">Unable to assess reliably.</p>}</div>)}</div>
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4"><h3 className="text-sm font-semibold text-amber-200">One specific improvement</h3><p className="mt-2 text-sm text-zinc-300">{evaluation.improvementSuggestion}</p></div>
            <details><summary className="cursor-pointer text-xs text-zinc-400">Structured evaluation</summary><pre className="mt-3 max-h-80 overflow-auto rounded-lg bg-black p-4 text-xs text-zinc-300 whitespace-pre-wrap break-words">{JSON.stringify(evaluation, null, 2)}</pre><Button className="mt-3" size="sm" variant="outline" onClick={() => download(`${label(selected).replace(' ', '-')}-evaluation.json`, JSON.stringify(evaluation, null, 2), 'application/json')}>Download evaluation JSON</Button></details>
          </>}
        </div>
      </section>}
    </div>}

    <details className={`${card} p-5`}><summary className="cursor-pointer text-sm font-semibold">Judging criteria & consistency standard</summary><div className="mt-5 grid md:grid-cols-2 gap-6"><div className="space-y-4">{CRITERIA.map(criterion => <div key={criterion.key}><h3 className="text-sm font-semibold">{criterion.name} <span className="text-amber-300">/ {criterion.max}</span></h3><p className="text-xs text-zinc-400 mt-1">{criterion.description}</p></div>)}</div><div className="space-y-2 text-xs text-zinc-400">{SCORE_BANDS.map(band => <p key={band}>{band}</p>)}<p className="pt-3">The final score is the sum of all five categories. Unassessable photos receive no numeric score and are excluded from rankings and statistics. Intentional blur, grain and composition choices are considered on their merits.</p><p>Each photo is sent separately without names, captions, EXIF metadata or previous scores. A fixed model snapshot and rubric reduce variation; artistic evaluation remains subjective. Saved results are never automatically rescored.</p><p className="pt-2">Rubric: {RUBRIC_VERSION} · Model: {configuration?.model ?? 'Checking…'}</p>{stats.count > 0 && <p>Scored photos: {stats.count} · Median: {stats.median?.toFixed(1)} · Population standard deviation: {stats.standardDeviation?.toFixed(2)}</p>}</div></div></details>
  </div>;
}
