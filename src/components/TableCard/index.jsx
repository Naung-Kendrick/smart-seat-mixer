import { STUDENTS, TABLE_LABELS } from '../../students';

export default function TableCard({ tableIndex, studentIndices, animDelay = 0 }) {
  return (
    <div
      className="bg-white border border-n-border transition-colors duration-150 animate-card-in print-card"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      {/* Header — Full black background on white text */}
      <div className="flex items-center gap-3 px-4 py-3 bg-black text-white border-b border-black print-card-header">
        <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center text-white font-mono text-sm font-bold shrink-0">
          {String(tableIndex + 1).padStart(2, '0')}
        </div>
        <div>
          <div className="text-sm font-bold text-white leading-tight">
            Table {tableIndex + 1}
          </div>
          <div className="text-xs font-mono text-neutral-400">
            {TABLE_LABELS[tableIndex]}
          </div>
        </div>
      </div>

      {/* Student list */}
      <ul>
        {studentIndices.map((sIdx, pos) => (
          <li
            key={sIdx}
            className="flex items-center gap-3 px-4 py-2 font-myanmar text-sm text-n-text border-b border-n-border/50 last:border-b-0 transition-colors duration-100 hover:bg-n-hover"
          >
            <span className="font-mono text-[0.65rem] font-semibold text-n-text-2 w-5 text-right shrink-0 tabular-nums">
              {pos + 1}
            </span>
            {STUDENTS[sIdx]}
          </li>
        ))}
      </ul>
    </div>
  );
}
