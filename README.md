# 幻觉检测生成器 Hallucination Detector Gen

<div align="center">
  <img src="https://github.com/mire403/Hallucination-Detector-Gen/blob/main/hallucination-detector-gen/%E4%B8%BB%E9%A1%B5.png">
</div>

一个用于检测大语言模型（LLM）输出中幻觉内容的完整工具 🛠️

结合**规则过滤+向量相似度**方法，还附带前端工作台模拟器 💻

## 📖 项目概览（Overview）

LLM 输出往往可能包含**幻觉信息（hallucination）**，本项目提供：

**1.向量相似度检测（Semantic Similarity）**

使用 sentence-transformers 计算上下文与模型回复的余弦相似度。

**2.规则过滤（Rule-Based Filtering）**

检测低置信、不确定性或拒绝句式，例如：

"I don't know"

"作为一个人工智能"

"我不确定"

**3.严格模式（Strict Mode）**

启用后，发现低置信句式直接判定为 HALLUCINATION。

**4.前端工作台**

输入上下文 & LLM 输出，实时模拟分析 🖥️

可查看生成的 Python 代码、复制或导出 📂

## 🗂️ 项目结构（Project Structure）

```bash
hallucination-detector-gen/
├── frontend/                # React 前端源码
│   ├── App.tsx
│   ├── Simulator.tsx
│   ├── ProjectConfig.tsx
│   ├── CodeViewer.tsx
│   └── types.ts
├── backend/                 # 可选：服务端 API
├── detector.py              # 核心 Python 幻觉检测器
├── main.py                  # Python 测试示例脚本
├── requirements.txt         # Python 依赖
├── package.json             # 前端依赖（可选）
├── README.md                # 当前文件
└── manifest.json            # 可选：前端清单
```

## ⚡ 快速开始（Quickstart）
### 1️⃣ Python 检测器

1.创建虚拟环境：

```bash
python -m venv .venv
source .venv/bin/activate   # Mac / Linux
.venv\Scripts\activate      # Windows
```

2.安装依赖：

```bash
pip install -r requirements.txt
```

3.运行示例：

```bash
python main.py
```

**示例输出：**

```bash
{
  "verdict": "HALLUCINATION",
  "similarity_score": 0.12,
  "rule_check": "未违反规则。"
}
```

### 2️⃣ 前端模拟器（Simulator）

前端基于**React+TailwindCSS**，提供：

**Simulator 🕹️**

输入 context 与 response

点击“开始检测”，实时显示：

判定结果（FACTUAL / HALLUCINATION / UNCERTAIN）✅❌❔

语义相似度分数

规则检查信息

**ProjectConfig ⚙️**

可调参数：similarityThreshold, strictRules, useVectorSearch

**CodeViewer 📄**

查看并复制生成的 detector.py、README.md、main.py 等文件

⚠️ 注意：调用 Gemini API 的密钥需保存在服务端环境变量中，前端不要直接使用。

### 3️⃣ 前端快速启动

```bash
cd frontend
npm install
npm run dev
# 或者使用 pnpm / yarn
pnpm install
pnpm dev
```

浏览器打开显示**Simulator**工作台 🖥️

## 🛠️ Python Detector API

```python
from detector import HallucinationDetector

detector = HallucinationDetector(similarity_threshold=0.75, strict_mode=True)

context = "阿波罗11号于1969年登陆月球。"
response = "阿波罗11号于1969年登陆火星。"

result = detector.evaluate(context, response)
print(result)
```

返回字段说明：

| 字段 | 类型 | 描述 |
|------|------|------|
| verdict | str | 判定结果：FACTUAL / HALLUCINATION / UNCERTAIN |
| similarity_score | float | 上下文与回复的语义相似度（0.0 - 1.0） |
| rule_check / reason | str | 规则检查结果或原因 |		
		
## ⚙️ 配置参数（Configuration）

similarityThreshold：相似度阈值，小于则判为幻觉 🔻

strictRules：启用严格模式，低置信/拒绝句式直接判为幻觉 🛡️

useVectorSearch：是否使用向量检索（RAG） 🔍

## 🧪 开发者指南（Development）

**1.前端与后端分离**

前端只负责 UI 和数据展示

后端安全调用 Gemini API 或本地 Python 检测器

**2.后端示例**（Node + Express）：

```js
app.post("/api/analyze", async (req, res) => {
  const { context, response } = req.body;
  const analysis = await analyzeHallucination(context, response);
  res.json(analysis);
});
```

**3.共享类型**（TypeScript / Python 对应类型）

AnalysisResult / ConfigParams / AnalysisStatus

## 📊 提示与优化（Tips）

模型选择：all-MiniLM-L6-v2 快速且轻量，可替换更大模型提升精度。

阈值选择：严格模式 + 高相似度阈值可减少假阴性，但可能增加误报。

多步验证：对于重要事实，结合外部知识库或检索（RAG）更可靠。

## ❓ 常见问题（Troubleshooting）

**模型下载失败**：确保网络正常，sentence-transformers 可联网下载模型。

**前端调用失败**：检查 API Key 是否在后端环境变量中，确保请求发送到服务端。

**JSON 解析错误**：确保 responseSchema 与返回 JSON 匹配。

## 🔐 安全与隐私

不在客户端暴露 API Key

用户输入敏感数据前需提示并获得同意

对传输数据可进行脱敏或加密处理

## ⭐ Star Support

如果你觉得这个项目对你有帮助，请给仓库点一个 ⭐ Star！
你的鼓励是我继续优化此项目的最大动力 😊
