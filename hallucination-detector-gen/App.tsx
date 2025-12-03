import React, { useState, useEffect } from 'react';
import { ConfigParams, PythonFile } from './types';
import { generateReadme, generateRequirements, generateDetectorScript, generateMainScript } from './utils/pythonTemplates';
import ProjectConfig from './components/ProjectConfig';
import Simulator from './components/Simulator';
import CodeViewer from './components/CodeViewer';
import { Download, Github, X } from 'lucide-react';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigParams>({
    similarityThreshold: 0.75,
    useVectorSearch: true,
    strictRules: false,
  });

  const [generatedFiles, setGeneratedFiles] = useState<PythonFile[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Re-generate files whenever config changes
  useEffect(() => {
    const files: PythonFile[] = [
      {
        name: 'README.md',
        language: 'markdown',
        content: generateReadme(),
      },
      {
        name: 'requirements.txt',
        language: 'text',
        content: generateRequirements(),
      },
      {
        name: 'detector.py',
        language: 'python',
        content: generateDetectorScript(config),
      },
      {
        name: 'main.py',
        language: 'python',
        content: generateMainScript(),
      }
    ];
    setGeneratedFiles(files);
  }, [config]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
      
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-white text-lg">H</span>
            </div>
            <h1 className="font-bold text-lg tracking-tight text-white">
              幻觉检测生成器 <span className="text-slate-500 font-normal ml-2 text-sm hidden sm:inline-block">Hallucination Detector Gen</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
            >
              <Download size={16} />
              导出项目
            </button>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
              <Github size={20} />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar: Config */}
          <div className="lg:col-span-4 space-y-6">
            <ProjectConfig config={config} setConfig={setConfig} />
            
            <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-2">如何工作？</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-4">
                此工具生成一个完整的 Python 项目，用于检测 LLM 幻觉。
                <br/><br/>
                1. 在此配置阈值和规则。<br/>
                2. 使用右侧的模拟器测试逻辑。<br/>
                3. 点击“导出项目”获取代码。
              </p>
            </div>
          </div>

          {/* Right Area: Simulator */}
          <div className="lg:col-span-8 h-[calc(100vh-12rem)] min-h-[500px]">
             <Simulator />
          </div>
        </div>
      </main>

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-800">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Download size={20} className="text-indigo-400"/> 
                导出代码 (Generated Code)
              </h3>
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden p-0">
              <CodeViewer files={generatedFiles} />
            </div>
            
            <div className="p-4 bg-slate-800 border-t border-slate-700 flex justify-end gap-3">
              <button 
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                关闭
              </button>
              <button 
                onClick={() => {
                   // Mock download behavior
                   alert("在实际应用中，这将下载一个 .zip 文件。现在您可以从上方复制文件内容。");
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-md shadow-lg"
              >
                下载 .zip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;