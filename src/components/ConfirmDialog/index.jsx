export default function ConfirmDialog({ onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[1100] bg-black/40 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white border border-n-border p-6 max-w-[380px] w-full animate-slide-up">
        <h3 className="text-base font-bold text-n-text mb-2">Reset all history?</h3>
        <p className="text-sm text-n-text-2 mb-5 leading-relaxed">
          This deletes all past seating rounds and pairing data. This cannot be undone.
        </p>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-n-border text-sm font-semibold text-n-text-2 hover:bg-n-hover transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-n-accent text-white text-sm font-semibold hover:bg-neutral-800 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
