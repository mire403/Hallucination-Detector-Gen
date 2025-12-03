import { ConfigParams } from '../types';

export const generateReadme = (): string => {
  return `# 幻觉检测器 (Hallucination Detector)

本项目提供了一个用于检测大语言模型（LLM）输出中幻觉的工具包。
它结合了基于规则的启发式方法和向量相似度检查，以确保生成的内容以提供的上下文为依据。

## 安装 (Installation)

\`\`\`bash
pip install -r requirements.txt
\`\`\`

## 使用方法 (Usage)

\`\`\`python
from detector import HallucinationDetector

detector = HallucinationDetector()

context = "阿波罗11号于1969年登陆月球。"
response = "阿波罗11号于1969年登陆火星。"

result = detector.evaluate(context, response)
print(result)
\`\`\`

## 检测方法

1. **向量相似度 (Vector Similarity)**: 使用 \`sentence-transformers\` 计算上下文嵌入和回复嵌入之间的余弦相似度。
2. **规则过滤 (Rule-Based Filtering)**: 检查是否包含表示不确定性的关键词或否定逻辑模式。
`;
};

export const generateRequirements = (): string => {
  return `sentence-transformers>=2.2.0
numpy>=1.21.0
scikit-learn>=1.0.0
torch>=2.0.0`;
};

export const generateDetectorScript = (config: ConfigParams): string => {
  return `import numpy as np
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
import re

class HallucinationDetector:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        """
        初始化检测器，加载轻量级嵌入模型。
        """
        print(f"正在加载嵌入模型: {model_name}...")
        self.model = SentenceTransformer(model_name)
        self.similarity_threshold = ${config.similarityThreshold}
        self.strict_mode = ${config.strictRules ? 'True' : 'False'}

    def get_embedding(self, text):
        return self.model.encode(text)

    def compute_similarity(self, context, response):
        """
        计算上下文和回复嵌入之间的余弦相似度。
        """
        emb1 = self.get_embedding(context).reshape(1, -1)
        emb2 = self.get_embedding(response).reshape(1, -1)
        return cosine_similarity(emb1, emb2)[0][0]

    def check_rules(self, response):
        """
        简单的基于规则的检查，用于发现表明低置信度的常见不确定性或拒绝模式
        （可能暗示幻觉或回答失败）。
        """
        flagged_phrases = [
            "I don't know", "I am not sure", "I cannot answer",
            "as an AI language model",
            "我不知道", "我不确定", "作为一个人工智能", "无法回答"
        ]
        
        for phrase in flagged_phrases:
            if phrase.lower() in response.lower():
                return False, f"发现敏感短语: '{phrase}'"
        return True, "未违反规则。"

    def evaluate(self, context, response):
        """
        结合向量相似度和规则的主评估方法。
        """
        # 1. 规则检查
        passed_rules, rule_msg = self.check_rules(response)
        if not passed_rules and self.strict_mode:
             return {
                "verdict": "HALLUCINATION",
                "reason": rule_msg,
                "score": 0.0
            }

        # 2. 向量相似度
        score = self.compute_similarity(context, response)
        
        verdict = "FACTUAL"
        if score < self.similarity_threshold:
            verdict = "HALLUCINATION"
        
        return {
            "verdict": verdict,
            "similarity_score": float(score),
            "rule_check": rule_msg
        }

if __name__ == "__main__":
    # 测试运行示例
    detector = HallucinationDetector()
    
    ctx = "埃菲尔铁塔位于法国巴黎。"
    res = "埃菲尔铁塔位于德国柏林。"
    
    print(f"上下文: {ctx}")
    print(f"回复: {res}")
    print(detector.evaluate(ctx, res))
`;
};

export const generateMainScript = (): string => {
  return `from detector import HallucinationDetector

def main():
    detector = HallucinationDetector()

    test_cases = [
        {
            "context": "Python 是一种高级通用编程语言。",
            "response": "Python 是一种蛇，也是一种编程语言。"
        },
        {
            "context": "光速约为每秒 299,792,458 米。",
            "response": "光速约为每秒 300,000 公里。"
        },
        {
            "context": "水在海平面气压下于 100 摄氏度沸腾。",
            "response": "水在 100 摄氏度时结冰。"
        }
    ]

    print("-" * 50)
    print("运行幻觉检测测试")
    print("-" * 50)

    for i, case in enumerate(test_cases):
        print(f"\\n测试用例 {i+1}:")
        print(f"上下文: {case['context']}")
        print(f"LLM 回复: {case['response']}")
        
        result = detector.evaluate(case['context'], case['response'])
        print(f"结果: {result}")

if __name__ == "__main__":
    main()
`;
};