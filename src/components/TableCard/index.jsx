import { useState, useEffect } from 'react';
import { STUDENTS, TABLE_LABELS } from '../../students';

export default function TableCard({
  tableIndex,
  studentIndices,
  isRevealed = true,
  onReveal,
  onSpotlight,
  animDelay = 0,
}) {
  const [animating, setAnimating] = useState(false);
  const [shuffledNames, setShuffledNames] = useState(() =>
    studentIndices.map((idx) => STUDENTS[idx])
  );

  // When newly revealed, run a fast 0.6s suspense slot animation
  useEffect(() => {
    if (isRevealed) {
      setAnimating(true);
      let step = 0;
      const interval = setInterval(() => {
        step++;
        setShuffledNames(
          studentIndices.map(() => {
            const r = Math.floor(Math.random() * STUDENTS.length);
            return STUDENTS[r];
          })
        );
        if (step >= 5) {
          clearInterval(interval);
          setShuffledNames(studentIndices.map((idx) => STUDENTS[idx]));
          setAnimating(false);
        }
      }, 70);
      return () => clearInterval(interval);
    }
  }, [isRevealed, studentIndices]);

  return (
    <div
      className={`bg-white border transition-all duration-150 animate-card-in print-card relative flex flex-col justify-between ${
        isRevealed
          ? 'border-n-border hover:border-black'
          : 'border-dashed border-neutral-400 hover:border-black bg-neutral-50/60'
      }`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* ── Header — Full black background on white text ── */}
      <div className="flex items-center justify-between px-3.5 py-2.5 bg-black text-white border-b border-black print-card-header select-none">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono text-xs font-bold shrink-0">
            {String(tableIndex + 1).padStart(2, '0')}
          </div>
          <div>
            <div className="text-sm font-bold text-white leading-tight">
              Table {tableIndex + 1}
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              {TABLE_LABELS[tableIndex]}
            </div>
          </div>
        </div>

        {/* Status / Action Indicator */}
        <div className="no-print">
          {isRevealed ? (
            <button
              onClick={() => onSpotlight && onSpotlight(tableIndex)}
              title="Open large classroom spotlight for this table"
              className="text-[10px] font-mono font-bold px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-600 transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>🔍</span>
              <span className="hidden sm:inline">Spotlight</span>
            </button>
          ) : (
            <span className="text-[9px] font-mono tracking-widest uppercase bg-neutral-900 text-neutral-400 border border-neutral-800 px-1.5 py-0.5">
              Locked
            </span>
          )}
        </div>
      </div>

      {/* ── Screen: Locked / Unrevealed State ── */}
      {!isRevealed && (
        <div
          onClick={() => onReveal && onReveal(tableIndex)}
          className="no-print p-4 flex flex-col items-center justify-center min-h-[160px] cursor-pointer group bg-neutral-50 hover:bg-neutral-100/80 transition-colors text-center select-none"
        >
          {/* Mystery Redacted Placeholders */}
          <div className="w-full space-y-2 mb-4 opacity-40 group-hover:opacity-60 transition-opacity">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                <span className="w-4 text-right tabular-nums">{num}</span>
                <div className="h-3 bg-neutral-300 w-full rounded-[1px] animate-pulse" />
              </div>
            ))}
          </div>

          {/* Reveal Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReveal && onReveal(tableIndex);
            }}
            className="w-full py-2 px-3 bg-black text-white text-xs font-mono font-bold uppercase tracking-wider border border-black group-hover:bg-neutral-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>⚡ Click to Reveal</span>
          </button>
        </div>
      )}

      {/* ── Screen: Revealed Students List ── */}
      {isRevealed && (
        <ul className="no-print divide-y divide-neutral-100">
          {shuffledNames.map((name, pos) => (
            <li
              key={pos}
              className={`flex items-center gap-3 px-3.5 py-2 font-myanmar text-sm text-neutral-900 transition-colors duration-100 hover:bg-neutral-50 ${
                animating ? 'animate-pulse text-neutral-400' : ''
              }`}
            >
              <span className="font-mono text-[0.65rem] font-semibold text-neutral-400 w-4 text-right shrink-0 tabular-nums">
                {pos + 1}
              </span>
              <span className="truncate">{name}</span>
            </li>
          ))}
        </ul>
      )}

      {/* ── Print View: ALWAYS renders all 5 students regardless of screen reveal state ── */}
      <ul className="hidden print-only divide-y divide-neutral-200">
        {studentIndices.map((sIdx, pos) => (
          <li
            key={sIdx}
            className="flex items-center gap-3 px-3.5 py-2 font-myanmar text-sm text-black"
          >
            <span className="font-mono text-xs font-bold text-neutral-500 w-4 text-right shrink-0">
              {pos + 1}
            </span>
            <span>{STUDENTS[sIdx]}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
