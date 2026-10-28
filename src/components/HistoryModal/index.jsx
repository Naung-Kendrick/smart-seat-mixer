import { useState } from 'react';
import { STUDENTS } from '../../students';

export default function HistoryModal({ rounds, onClose }) {
  const [expandedIdx, setExpandedIdx] = useState(null);

  const toggle = (idx) => setExpandedIdx(expandedIdx === idx ? null : idx);

  return (
    <div
      className="fixed inset-0 z-[1000] bg-black/30 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white border border-n-border max-w-[700px] w-full max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-n-border">
          <h2 className="text-base font-bold text-n-text">Seating History</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center text-n-text-2 hover:text-n-text hover:bg-n-hover border border-n-border transition-colors text-lg leading-none"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4 overflow-y-auto flex-1">
          {rounds.length === 0 ? (
            <p className="text-center py-8 text-n-text-2 text-sm">
              No history yet. Generate your first seating.
            </p>
          ) : (
            [...rounds].reverse().map((round, revIdx) => {
              const rIdx = rounds.length - 1 - revIdx;
              const isOpen = expandedIdx === rIdx;
              const date = new Date(round.timestamp).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div key={rIdx} className="border border-n-border mb-2">
                  <button
                    onClick={() => toggle(rIdx)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-n-hover transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 text-sm font-semibold text-n-text">
                      <span className="bg-n-accent text-white font-mono text-[0.6rem] font-bold px-1.5 py-0.5 inline-block">
                        R{rIdx + 1}
                      </span>
                      Round {rIdx + 1}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-n-text-2 font-mono">{date}</span>
                      <svg
                        className={`w-3.5 h-3.5 text-n-text-2 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-3 border-t border-n-border pt-3 animate-fade-in">
                      {round.tables.map((table, tIdx) => (
                        <div key={tIdx} className="mb-2 last:mb-0">
                          <div className="inline-block text-[0.65rem] font-bold text-white bg-black px-2 py-0.5 font-mono mb-1.5">
                            Table {String(tIdx + 1).padStart(2, '0')}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {table.map((sIdx) => (
                              <span
                                key={sIdx}
                                className="font-myanmar text-xs bg-n-accent-bg border border-n-border px-2 py-0.5 text-n-text"
                              >
                                {STUDENTS[sIdx]}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
