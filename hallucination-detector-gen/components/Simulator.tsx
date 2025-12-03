import React, { useState } from 'react';
import { analyzeHallucination } from '../services/geminiService';
import { AnalysisResult, AnalysisStatus } from '../types';
import { Play, Loader2, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';

const Simulator: React.FC = () => {
  // Use Chinese default examples
  const [context, setContext] = useState("杭州西湖位于浙江省杭州市西面，是中国大陆首批国家重点风景名胜区和中国十大风景名胜之一。它是中国大陆主要的观赏性淡水湖泊之一。");
  const [response, setResponse] = useState("杭州西湖位于广东省，是一个咸水湖，周围环绕着沙漠。");
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!context.trim() || !response.trim()) return;
    
    setStatus(AnalysisStatus.ANALYZING);
    try {
      const data = await analyzeHallucination(context, response);
      setResult(data);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (e) {
      console.error(e);
      setStatus(AnalysisStatus.ERROR);
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'FACTUAL': return 'text-green-400 border-green-400/30 bg-green-400/10';
      case 'HALLUCINATION': return 'text-red-400 border-red-400/30 bg-red-400/10';
      default: return 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10';
    }
  };

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'FACTUAL': return <CheckCircle size={24} />;
      case 'HALLUCINATION': return <AlertTriangle size={24} />;
      default: return <HelpCircle size={24} />;
    }
  };

  const getVerdictText = (verdict: string) => {
    switch (verdict) {
      case 'FACTUAL': return '符合事实 (FACTUAL)';
      case 'HALLUCINATION': return '发现幻觉 (HALLUCINATION)';
      default: return '不确定 (UNCERTAIN)';
    }
  }

  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Play size={20} className="text-indigo-400" /> 实时模拟 (Live Simulation)
          </h2>
          <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">
            由 Gemini 驱动
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">参考上下文 (Ground Truth)</label>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="请输入参考事实或背景信息..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">LLM 生成的回答</label>
            <textarea
              className="w-full h-32 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="请输入模型生成的文本..."
            />
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={status === AnalysisStatus.ANALYZING}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === AnalysisStatus.ANALYZING ? (
              <>
                <Loader2 size={18} className="animate-spin" /> 分析中...
              </>
            ) : (
              <>
                开始检测
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {status === AnalysisStatus.COMPLETED && result && (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex flex-col md:flex-row gap-6">
             
             {/* Verdict Card */}
             <div className={`flex-1 p-6 rounded-lg border flex flex-col items-center justify-center gap-3 ${getVerdictColor(result.verdict)}`}>
                {getVerdictIcon(result.verdict)}
                <h3 className="text-xl font-bold tracking-wider text-center">{getVerdictText(result.verdict)}</h3>
                <div className="text-sm opacity-80 uppercase font-semibold">检测结论</div>
             </div>

             {/* Metrics */}
             <div className="flex-[2] space-y-4">
               <div>
                 <div className="flex justify-between text-sm mb-1 text-slate-300">
                   <span>语义相似度得分</span>
                   <span className="font-mono">{result.similarityScore.toFixed(2)}</span>
                 </div>
                 <div className="w-full bg-slate-700 rounded-full h-2.5 overflow-hidden">
                   <div 
                      className={`h-2.5 rounded-full ${result.similarityScore > 0.7 ? 'bg-green-500' : 'bg-red-500'}`} 
                      style={{ width: `${result.similarityScore * 100}%` }}
                   ></div>
                 </div>
               </div>

               <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                 <h4 className="text-sm font-semibold text-slate-200 mb-2">推理分析</h4>
                 <p className="text-slate-400 text-sm leading-relaxed">
                   {result.reasoning}
                 </p>
               </div>

               <div className="flex gap-2">
                 {result.contradictionFound && (
                   <span className="px-3 py-1 bg-red-500/20 text-red-300 text-xs rounded-full border border-red-500/30">
                     发现直接矛盾
                   </span>
                 )}
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;