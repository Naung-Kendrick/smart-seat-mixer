import { useState, useCallback, useEffect } from 'react';
import { MAX_PAIRS } from './students';
import { smartAssign, addPairings, countUniquePairings } from './seatingEngine';
import { loadState, saveState, resetState } from './storage';
import TableCard from './components/TableCard';
import HistoryModal from './components/HistoryModal';
import ConfirmDialog from './components/ConfirmDialog';
import logo from './assets/logo.png';

// ── Icons (stroke-only SVG, matching architectural weight) ───

const IconShuffle = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <path d="M1 4v6h6" /><path d="M23 20v-6h-6" />
    <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
  </svg>
);
const IconClock = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <circle cx={12} cy={12} r={10} /><polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconPrint = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x={6} y={14} width={12} height={8} />
  </svg>
);
const IconTrash = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

// ── Toast ────────────────────────────────────────────────

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className="bg-n-accent text-white text-sm font-medium px-4 py-2.5 border border-neutral-700 animate-slide-up">
      {message}
    </div>
  );
}

// ── Main App ─────────────────────────────────────────────

export default function App() {
  const [state, setState] = useState(loadState);
  const [showHistory, setShowHistory] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [currentTables, setCurrentTables] = useState(() => {
    const s = loadState();
    return s.rounds.length > 0 ? s.rounds[s.rounds.length - 1].tables : null;
  });

  useEffect(() => { saveState(state); }, [state]);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        setShowHistory(false);
        setShowConfirm(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const addToast = useCallback((message) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Generate ───────────────────────────────────────────

  const handleGenerate = useCallback(() => {
    setState((prev) => {
      const tables = smartAssign(prev.pairMatrix, prev.lastTableMap);

      let newMatrix = { ...prev.pairMatrix };
      tables.forEach((table) => {
        newMatrix = addPairings(newMatrix, table);
      });

      const newLastTable = {};
      tables.forEach((table, tIdx) => {
        table.forEach((sIdx) => { newLastTable[sIdx] = tIdx; });
      });

      const newRound = { tables, timestamp: new Date().toISOString() };
      setCurrentTables(tables);

      const next = {
        rounds: [...prev.rounds, newRound],
        pairMatrix: newMatrix,
        lastTableMap: newLastTable,
      };

      queueMicrotask(() => addToast(`Round ${next.rounds.length} generated`));
      return next;
    });
  }, [addToast]);

  // ── Reset ──────────────────────────────────────────────

  const handleReset = useCallback(() => {
    const fresh = resetState();
    setState(fresh);
    setCurrentTables(null);
    setShowConfirm(false);
    addToast('History reset');
  }, [addToast]);

  // ── Print ──────────────────────────────────────────────

  const handlePrint = useCallback(() => {
    if (!currentTables) {
      addToast('Generate a seating first');
      return;
    }
    window.print();
  }, [currentTables, addToast]);

  // ── Derived ────────────────────────────────────────────

  const roundCount = state.rounds.length;
  const uniquePairs = countUniquePairings(state.pairMatrix);
  const mixingPct = MAX_PAIRS > 0 ? Math.round((uniquePairs / MAX_PAIRS) * 100) : 0;

  return (
    <div className="tps-page-enter">
      {/* ─── HEADER ─── */}
      <header className="max-w-[1200px] mx-auto px-5 pt-8 pb-6 no-print">
        <div className="border-b border-n-border pb-6 flex items-center justify-between gap-5">
          {/* Brand & Identity Unit */}
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={logo}
              alt="TLG Immigration Crest"
              className="h-16 sm:h-20 w-auto object-contain mix-blend-multiply select-none flex-shrink-0"
            />
            <div className="h-14 sm:h-16 w-px bg-neutral-300 hidden sm:block" />
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="bg-black text-white font-mono text-[10px] sm:text-[11px] font-bold px-2 py-0.5 tracking-wider uppercase select-none">
                  TLG IMMIGRATION
                </span>
                <span className="font-mono text-[11px] text-neutral-500 tracking-widest uppercase font-semibold">
                  SMART CLASSROOM
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-mono text-black tracking-tight leading-none uppercase">
                Seat Mixer
              </h1>
              <p className="font-mono text-xs text-neutral-600 font-semibold tracking-wide mt-1.5 uppercase">
                FOR THE TA'ANG LAND IMMIGRATION BATCH 2 STUDENTS
              </p>
            </div>
          </div>

          {/* Right Agency System Meta */}
          <div className="hidden md:flex flex-col items-end justify-center border-l border-neutral-300 pl-6 text-right">
            <span className="font-mono text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
              COHORT SPECIFICATION
            </span>
            <span className="font-mono text-sm font-extrabold text-black tracking-tight uppercase">
              Batch 2 · 50 Students
            </span>
            <span className="font-mono text-[10px] font-medium text-neutral-500 mt-0.5">
              10 Tables · 5 Seats/Table
            </span>
          </div>
        </div>
      </header>

      {/* ─── Print header ─── */}
      <div className="hidden print-only max-w-[1200px] mx-auto px-5 pb-4 border-b-2 border-black mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="TLG Immigration Crest" className="h-16 w-auto object-contain mix-blend-multiply" />
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest font-bold text-black">
                TLG IMMIGRATION · SMART CLASSROOM
              </p>
              <h1 className="text-xl font-bold font-mono text-black uppercase">
                Seating Chart — Round {roundCount}
              </h1>
              <p className="text-xs font-mono text-neutral-600 mt-0.5">
                FOR THE TA'ANG LAND IMMIGRATION BATCH 2 STUDENTS
              </p>
            </div>
          </div>
          <div className="text-right font-mono text-xs text-neutral-600">
            <p className="font-bold text-black uppercase">{roundCount > 0 ? `Day ${roundCount}` : 'Seating Plan'}</p>
            <p>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>
      </div>

      {/* ─── CONTROLS ─── */}
      <div className="max-w-[1200px] mx-auto px-5 mb-6 no-print">
        <div className="flex flex-wrap items-center gap-3">
          {/* Round indicator */}
          <div className="flex items-center gap-2.5 border border-black bg-black text-white px-3.5 py-2 mr-auto select-none">
            <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono text-base font-bold">
              {roundCount}
            </div>
            <div>
              <div className="text-[0.6rem] text-neutral-400 font-mono tracking-widest uppercase leading-none">
                Round
              </div>
              <div className="text-sm font-extrabold text-white font-mono leading-tight">
                {roundCount > 0 ? `Day ${roundCount}` : '—'}
              </div>
            </div>
          </div>

          {/* Generate — full black bg, white text */}
          <button
            id="btn-generate"
            onClick={handleGenerate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-sm font-bold font-mono tracking-wide border border-black hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer"
          >
            <IconShuffle />
            Generate new seating
          </button>

          {/* History — full black bg, white text */}
          <button
            id="btn-history"
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold font-mono border border-black hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer"
          >
            <IconClock />
            History
          </button>

          {/* Print — full black bg, white text */}
          <button
            id="btn-print"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold font-mono border border-black hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer"
          >
            <IconPrint />
            Print
          </button>

          {/* Reset — full black bg, white text */}
          <button
            id="btn-reset"
            onClick={() => setShowConfirm(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-semibold font-mono border border-black hover:bg-neutral-800 active:bg-neutral-900 transition-colors cursor-pointer"
          >
            <IconTrash />
            Reset
          </button>
        </div>
      </div>

      {/* ─── STATS ─── */}
      {currentTables && (
        <div className="max-w-[1200px] mx-auto px-5 mb-5 no-print">
          <div className="flex flex-wrap gap-px border border-n-border bg-n-border w-fit">
            <Stat label="Students" value="50" />
            <Stat label="Tables" value="10" />
            <Stat label="Unique pairings" value={`${uniquePairs} / ${MAX_PAIRS}`} />
            <Stat label="Mixing" value={`${mixingPct}%`} />
          </div>
        </div>
      )}

      {/* ─── TABLE GRID ─── */}
      <div className="max-w-[1200px] mx-auto px-5 pb-10">
        {currentTables ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-px bg-n-border border border-n-border table-grid-print">
            {currentTables.map((students, tIdx) => (
              <TableCard
                key={`${roundCount}-${tIdx}`}
                tableIndex={tIdx}
                studentIndices={students}
                animDelay={tIdx * 30}
              />
            ))}
          </div>
        ) : (
          <div className="border border-n-border bg-white py-16 text-center">
            <div className="text-4xl mb-4 opacity-30">⬚</div>
            <h2 className="text-base font-bold text-n-text mb-1">Ready to generate</h2>
            <p className="text-sm text-n-text-2">
              Click <span className="font-semibold text-n-text">Generate new seating</span> to create the first round.
            </p>
          </div>
        )}
      </div>

      {/* ─── MODALS ─── */}
      {showHistory && (
        <HistoryModal rounds={state.rounds} onClose={() => setShowHistory(false)} />
      )}
      {showConfirm && (
        <ConfirmDialog onConfirm={handleReset} onCancel={() => setShowConfirm(false)} />
      )}

      {/* ─── TOASTS ─── */}
      <div className="fixed bottom-5 right-5 z-[2000] flex flex-col gap-1.5 no-print">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} onDone={() => removeToast(t.id)} />
        ))}
      </div>
    </div>
  );
}

// ── Stat cell ────────────────────────────────────────────

function Stat({ label, value }) {
  return (
    <div className="bg-white px-4 py-2">
      <div className="text-[0.6rem] font-mono text-n-text-2 tracking-wide leading-none mb-0.5">
        {label}
      </div>
      <div className="text-sm font-bold font-mono text-n-text tabular-nums">
        {value}
      </div>
    </div>
  );
}
