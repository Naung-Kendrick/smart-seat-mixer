import { useState, useEffect } from 'react';
import { STUDENTS, TABLE_LABELS } from '../../students';

export default function SpotlightModal({
  tableIndex,
  studentIndices,
  onClose,
  onNextTable,
  hasNextTable,
  nextTableIndex,
}) {
  const [isRolling, setIsRolling] = useState(true);
  const [displayNames, setDisplayNames] = useState(
    () => studentIndices.map((idx) => STUDENTS[idx])
  );

  useEffect(() => {
    setIsRolling(true);
    let rolls = 0;
    const maxRolls = 8;
    const interval = setInterval(() => {
      rolls++;
      setDisplayNames(() =>
        studentIndices.map(() => {
          const randIdx = Math.floor(Math.random() * STUDENTS.length);
          return STUDENTS[randIdx];
        })
      );

      if (rolls >= maxRolls) {
        clearInterval(interval);
        setDisplayNames(studentIndices.map((idx) => STUDENTS[idx]));
        setIsRolling(false);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [tableIndex, studentIndices]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNextTable && onNextTable) onNextTable();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, onNextTable, hasNextTable]);

  return (
    <div
      className="fixed inset-0 z-[1200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in no-print"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border-2 border-black max-w-[560px] w-full shadow-2xl animate-slide-up flex flex-col">
        {/* Modal Header */}
        <div className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono text-base font-bold">
              {String(tableIndex + 1).padStart(2, '0')}
            </div>
            <div>
              <div className="text-[11px] font-mono text-neutral-400 uppercase tracking-widest leading-none mb-1">
                Spotlight Announcement
              </div>
              <h2 className="text-xl font-bold font-mono text-white tracking-tight leading-none uppercase">
                Table {tableIndex + 1} — {TABLE_LABELS[tableIndex]}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-white border border-neutral-700 hover:border-white transition-colors text-xl leading-none cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Status bar */}
        <div className="bg-neutral-100 border-b border-neutral-300 px-6 py-2 flex items-center justify-between font-mono text-xs text-neutral-600">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-black">
            <span className={`w-2 h-2 rounded-full ${isRolling ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
            {isRolling ? 'Shuffling & Assigning...' : 'Table Confirmed'}
          </span>
          <span className="uppercase text-[11px]">5 Assigned Seats</span>
        </div>

        {/* Students list with large, legible presentation */}
        <div className="p-6 bg-white space-y-2">
          {displayNames.map((name, pos) => (
            <div
              key={pos}
              style={{ animationDelay: `${pos * 100}ms` }}
              className={`flex items-center gap-4 px-4 py-3 border border-neutral-200 transition-all ${
                isRolling
                  ? 'bg-neutral-50 text-neutral-400 animate-pulse'
                  : 'bg-white text-black hover:border-black'
              }`}
            >
              <div className="w-7 h-7 bg-black text-white font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {pos + 1}
              </div>
              <span className="font-myanmar text-lg font-bold tracking-normal leading-tight text-neutral-900">
                {name}
              </span>
            </div>
          ))}
        </div>

        {/* Footer controls */}
        <div className="bg-neutral-50 border-t border-neutral-200 px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-200 text-neutral-800 text-sm font-mono font-semibold hover:bg-neutral-300 transition-colors cursor-pointer"
          >
            Close Spotlight
          </button>

          {hasNextTable ? (
            <button
              onClick={onNextTable}
              className="inline-flex items-center gap-2 px-5 py-2 bg-black text-white text-sm font-mono font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span>Reveal Next (Table {nextTableIndex + 1})</span>
              <span>→</span>
            </button>
          ) : (
            <span className="font-mono text-xs font-bold text-emerald-700 uppercase bg-emerald-50 border border-emerald-300 px-3 py-1.5">
              ✓ All 10 Tables Revealed!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
