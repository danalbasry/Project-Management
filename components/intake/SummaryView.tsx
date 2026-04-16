'use client';

import React, { useState } from 'react';

interface SummaryViewProps {
  markdown: string;
  readOnly?: boolean;
}

export default function SummaryView({ markdown, readOnly }: SummaryViewProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const download = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `gtm-intake-${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {readOnly ? 'Final Intake Summary' : 'Draft Summary'}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={copy}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
          >
            {copied ? 'Copied!' : 'Copy markdown'}
          </button>
          <button
            onClick={download}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
          >
            Download .md
          </button>
        </div>
      </div>
      <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-xl bg-black/30 p-4 text-sm leading-relaxed text-cosmic-primary-light/90 font-mono">
        {markdown}
      </pre>
    </div>
  );
}
