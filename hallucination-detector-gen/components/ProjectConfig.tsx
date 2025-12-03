import React from 'react';
import { ConfigParams } from '../types';
import { Settings, Sliders, ShieldAlert } from 'lucide-react';

interface ProjectConfigProps {
  config: ConfigParams;
  setConfig: React.Dispatch<React.SetStateAction<ConfigParams>>;
}

const ProjectConfig: React.FC<ProjectConfigProps> = ({ config, setConfig }) => {
  
  const handleChange = (key: keyof ConfigParams, value: number | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="text-indigo-400" size={24} />
        <h2 className="text-xl font-bold text-white">项目配置</h2>
      </div>

      <div className="space-y-6">
        {/* Similarity Threshold */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <Sliders size={16} /> 相似度阈值 (Similarity Threshold)
            </label>
            <span className="text-xs font-mono bg-slate-900 px-2 py-1 rounded text-indigo-400">
              {config.similarityThreshold.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="0.95"
            step="0.05"
            value={config.similarityThreshold}
            onChange={(e) => handleChange('similarityThreshold', parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 hover:accent-indigo-400"
          />
          <p className="text-xs text-slate-500 mt-2">
            余弦相似度得分低于此值将在 Python 脚本中触发“幻觉”判定。
          </p>
        </div>

        {/* Strict Mode Toggle */}
        <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <ShieldAlert className={`${config.strictRules ? 'text-red-400' : 'text-slate-500'}`} size={20} />
            <div>
              <p className="text-sm font-medium text-slate-200">严格规则模式</p>
              <p className="text-xs text-slate-500">将不确定性短语（如“我不知道”）标记为失败。</p>
            </div>
          </div>
          <button
            onClick={() => handleChange('strictRules', !config.strictRules)}
            className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out ${
              config.strictRules ? 'bg-indigo-600' : 'bg-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                config.strictRules ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        
        <div className="p-3 bg-indigo-900/20 border border-indigo-900/50 rounded text-xs text-indigo-300">
          此配置会动态更新右侧“代码”标签页中生成的 Python 代码。
        </div>
      </div>
    </div>
  );
};

export default ProjectConfig;