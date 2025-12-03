import React, { useState } from 'react';
import { PythonFile } from '../types';
import { Copy, Check, FileCode, Terminal, BookOpen } from 'lucide-react';

interface CodeViewerProps {
  files: PythonFile[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({ files }) => {
  // Use optional chaining to prevent crash if files is empty
  const [activeFile, setActiveFile] = useState<string>(files?.[0]?.name || '');
  const [copied, setCopied] = useState<string | null>(null);

  if (!files || files.length === 0) {
    return (
      <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 items-center justify-center text-slate-500">
        <p>未生成文件 (No files generated)</p>
      </div>
    );
  }

  const currentFile = files.find(f => f.name === activeFile) || files[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(activeFile || currentFile.name);
    setTimeout(() => setCopied(null), 2000);
  };

  const getIcon = (name: string) => {
    if (name.endsWith('.md')) return <BookOpen size={16} />;
    if (name.endsWith('.txt')) return <Terminal size={16} />;
    return <FileCode size={16} />;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-lg border border-slate-700 overflow-hidden shadow-xl">
      {/* File Tabs */}
      <div className="flex items-center bg-slate-800 border-b border-slate-700 overflow-x-auto">
        {files.map(file => (
          <button
            key={file.name}
            onClick={() => setActiveFile(file.name)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-r border-slate-700 ${
              currentFile.name === file.name
                ? 'bg-slate-900 text-indigo-400 border-b-2 border-b-indigo-500'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-750'
            }`}
          >
            {getIcon(file.name)}
            {file.name}
          </button>
        ))}
      </div>

      {/* Code Area */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden group">
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-md transition-all opacity-0 group-hover:opacity-100 border border-slate-700"
          title="复制代码"
        >
          {copied === currentFile.name ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
        
        <pre className="h-full p-6 overflow-auto text-sm font-mono leading-relaxed">
          <code className="text-slate-300">
            {currentFile.content}
          </code>
        </pre>
      </div>
    </div>
  );
};

export default CodeViewer;