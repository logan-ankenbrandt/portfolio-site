'use client';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-full border border-accent px-4 py-1.5 text-sm font-medium text-accent hover:bg-accent hover:text-white print:hidden"
    >
      Print or save as PDF
    </button>
  );
}
