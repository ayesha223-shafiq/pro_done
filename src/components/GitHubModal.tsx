import { useState } from 'react';
import { Github, Check, Copy, ExternalLink, Terminal, GitBranch, ShieldCheck } from 'lucide-react';

interface GitHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [repoName, setRepoName] = useState('agrihawk-pro');

  if (!isOpen) return null;

  const copyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Create a new repository on GitHub',
      desc: 'Go to GitHub and create a new public or private repository (without initializing README).',
      command: `https://github.com/new`,
      isLink: true,
    },
    {
      title: '2. Initialize Git and add files locally',
      desc: 'Run these commands in your project terminal to prepare your repository:',
      command: `git init\ngit add .\ngit commit -m "Initial commit: AgriHawk Pro with Firebase integration"`,
    },
    {
      title: '3. Link to your GitHub remote repository',
      desc: 'Replace YOUR_USERNAME with your GitHub username:',
      command: `git branch -M main\ngit remote add origin https://github.com/YOUR_USERNAME/${repoName}.git\ngit push -u origin main`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          ✕
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gray-900 text-white flex items-center justify-center text-2xl shadow-md">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Connect AgriHawk Pro to GitHub</h2>
            <p className="text-xs text-gray-500">Push your codebase, manage version control & collaborate</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 mb-5 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs text-emerald-900">
            <strong>Firebase & Secrets Protected:</strong> Your <code className="bg-white px-1 py-0.5 rounded text-emerald-800 font-mono">.gitignore</code> is configured so sensitive credentials and build artifacts are kept private.
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-700 mb-1.5">Repository Name</label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-mono">github.com/your-username/</span>
            <input
              type="text"
              value={repoName}
              onChange={(e) => setRepoName(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '-'))}
              className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>
        </div>

        <div className="space-y-3.5 max-h-[50vh] overflow-y-auto pr-1">
          {steps.map((step, idx) => (
            <div key={idx} className="border border-gray-100 bg-gray-50/70 rounded-xl p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-gray-900">{step.title}</span>
                {step.isLink ? (
                  <a
                    href={step.command}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-100/60 px-2 py-0.5 rounded"
                  >
                    Open GitHub <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <button
                    onClick={() => copyCommand(step.command, idx)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-600 hover:text-gray-900 bg-white border border-gray-200 px-2 py-0.5 rounded hover:bg-gray-50 transition"
                  >
                    {copiedIndex === idx ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-gray-600 mb-2">{step.desc}</p>
              {!step.isLink && (
                <div className="bg-gray-900 text-gray-100 p-2.5 rounded-lg text-[11px] font-mono whitespace-pre overflow-x-auto shadow-inner">
                  {step.command}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-gray-500">
            <GitBranch className="w-3.5 h-3.5 text-gray-400" />
            <span>Ready for CI/CD & GitHub Pages / Cloud Run</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-black transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
