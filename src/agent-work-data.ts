import { BarChart3, BookOpen, Clapperboard, FolderCheck, Network, Palette, Search } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type AgentTask = {
  id: string
  category: '效率' | '创作' | '开发'
  agentName: string
  tools: [string, string]
  followUps: [string, string]
  label: string
  title: string
  specialty: string
  icon: LucideIcon
  tone: string
  prompt: string
  response: string
  file: string
  format: string
  summary: string
  columns: [string, string]
  rows: [string, string][]
  steps: [string, string, string]
}

export const agentTasks: AgentTask[] = [
  { id: 'research', category: '效率', agentName: '资料研究 Agent', tools: ['资料阅读', '结构化整理'], followUps: ['把简报整理成三个要点', '补充下一步的调研方向'], label: '行业资料简报', title: '把行业资料整理成一份简报', specialty: '资料研究', icon: BookOpen, tone: 'blue', prompt: '帮我梳理这些行业资料，提取重要变化、不同观点与后续值得关注的问题。', response: '我会先按主题归类，再交叉整理观点与来源，把分散的信息变成清晰的阅读线索。', file: '行业资料研究简报', format: 'REPORT', summary: '从资料到洞察，保留结论，也保留核对线索。', columns: ['整理方向', '成果内容'], rows: [['重要变化', '按主题汇总趋势与关键事件'], ['观点对照', '并列呈现共识与不同判断'], ['来源索引', '保留出处，方便继续阅读与核验']], steps: ['理解资料', '整理观点', '形成简报'] },
  { id: 'drama', category: '创作', agentName: '漫剧编导 Agent', tools: ['故事编排', '镜头脚本'], followUps: ['细化每个镜头的提示词', '换一个故事结尾'], label: '30 秒漫剧脚本', title: '把灵感写成 30 秒漫剧脚本', specialty: 'AI 漫剧创作', icon: Clapperboard, tone: 'pink', prompt: '一个年轻人穿过古城，发现街角藏着未来。帮我写成一支 30 秒漫剧的分镜脚本。', response: '我会把故事拆成开场、转折与结尾，为每个镜头补齐画面、情绪与制作提示。', file: '古城里的未来 · 分镜脚本', format: 'STORY', summary: '三个段落，让一句灵感拥有可以继续制作的结构。', columns: ['镜头时间', '画面与叙事'], rows: [['00—08 秒', '晨雾中的古城，人物循着微光走入街巷'], ['08—21 秒', '转过街角，古老门廊显现未来城市倒影'], ['21—30 秒', '伸手触碰光点，新的旅程在眼前展开']], steps: ['拆解故事', '编排镜头', '输出分镜'] },
  { id: 'agent', category: '开发', agentName: '知识工程 Agent', tools: ['知识检索', '流程配置'], followUps: ['补充知识库资料清单', '设计一组测试问题'], label: '企业知识助手', title: '搭建一个企业知识助手', specialty: '智能体搭建', icon: Network, tone: 'violet', prompt: '团队资料分散，常见问题反复回答。请帮我规划一个能检索内部资料的知识助手。', response: '先明确使用对象与资料范围，再设计检索、回答和人工复核的流程，让每次回答有据可查。', file: '企业知识助手 · 搭建蓝图', format: 'WORKFLOW', summary: '围绕一个明确场景，连接知识、工具与复核。', columns: ['工作环节', '配置方向'], rows: [['知识准备', '整理资料目录，明确更新与访问范围'], ['回答流程', '检索相关段落，组织回答并附来源'], ['效果验证', '用常见问题测试，记录需要完善的答案']], steps: ['明确场景', '设计流程', '生成蓝图'] },
  { id: 'trends', category: '效率', agentName: '行业观察 Agent', tools: ['主题研究', '信息归类'], followUps: ['按应用场景细分观察主题', '生成每周观察清单'], label: '行业观察框架', title: '整理近期行业观察重点', specialty: '行业调研', icon: Search, tone: 'amber', prompt: '我想了解 AI 应用的变化。帮我搭一个可持续更新的行业观察框架。', response: '我会将观察分成产品、应用和生态三个方向，明确每个方向要记录的信息与值得追问的问题。', file: 'AI 应用 · 行业观察框架', format: 'RESEARCH', summary: '建立观察的方法，让持续阅读更有方向。', columns: ['观察主题', '重点记录'], rows: [['产品演进', '新能力、使用边界与适用场景'], ['应用实践', '业务问题、落地过程与验证方式'], ['生态协作', '工具连接、开发者实践与合作机会']], steps: ['确定主题', '建立维度', '整理框架'] },
  { id: 'brand', category: '创作', agentName: '品牌创意 Agent', tools: ['品牌定位', '视觉提案'], followUps: ['生成三条宣传文案', '尝试另一组品牌配色'], label: '品牌视觉提案', title: '为新品牌准备一套视觉提案', specialty: '品牌创意', icon: Palette, tone: 'mint', prompt: '为一个强调自然与活力的咖啡品牌，整理视觉方向、配色和宣传文案。', response: '我会先统一品牌表达，再把关键词转成配色、画面和文案方向，方便团队一起讨论。', file: '轻醒咖啡 · 品牌视觉提案', format: 'CREATIVE', summary: '示例品牌：轻醒咖啡。让创意从同一份方向出发。', columns: ['创意元素', '提案方向'], rows: [['视觉关键词', '晨光、植物、轻盈的日常'], ['色彩方向', '森林绿 × 燕麦白 × 暖杏色'], ['文案主题', '把日常，醒成喜欢的样子。']], steps: ['理解品牌', '探索方向', '整理提案'] },
  { id: 'analysis', category: '效率', agentName: '经营分析 Agent', tools: ['指标分析', '数据可视化'], followUps: ['列出需要核对的指标', '整理下次复盘议题'], label: '经营数据分析', title: '把经营数据变成行动线索', specialty: '经营分析', icon: BarChart3, tone: 'blue', prompt: '团队有一份经营报表。帮我设计分析顺序，并整理下一次复盘要讨论的问题。', response: '先核对指标口径，再观察变化与结构，最后把发现转成待验证的问题和后续行动。', file: '经营复盘 · 分析清单', format: 'TABLE', summary: '把报表读清楚，再决定下一步看什么、做什么。', columns: ['分析步骤', '复盘问题'], rows: [['指标核对', '统计时间、渠道与口径是否一致？'], ['变化定位', '哪些趋势或结构变化值得进一步查看？'], ['行动讨论', '下一步由谁验证，如何记录结果？']], steps: ['核对口径', '梳理维度', '输出清单'] },
  { id: 'weekly', category: '效率', agentName: '项目协作 Agent', tools: ['进度整理', '任务规划'], followUps: ['提炼本周的核心成果', '按优先级排列下周任务'], label: '项目周报协作', title: '整理项目周报与下周待办', specialty: '项目协作', icon: FolderCheck, tone: 'lavender', prompt: '把这周的项目进展整理成周报，并列出风险、需要协作的事项和下周行动。', response: '我会按照成果、待确认事项和下一步行动整理，让团队能快速理解当前进展。', file: '项目周报 · 团队协作模板', format: 'DOCUMENT', summary: '让已完成的工作可回顾，让未完成的事情有着落。', columns: ['周报模块', '记录内容'], rows: [['本周成果', '已完成事项、交付物与复核意见'], ['协作事项', '待确认的问题、相关伙伴与时间节点'], ['下周计划', '优先任务、负责人和预期成果']], steps: ['梳理进展', '提炼重点', '生成周报'] },
]

