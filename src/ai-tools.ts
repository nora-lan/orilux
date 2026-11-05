export type AITool = {
  id: string
  name: string
  vendor: string
  category: string
  description: string
  features: string[]
  platform: string
  href: string
  downloadHref?: string
  logo: string
}

// Original brand assets come from the supplied OPC catalog; links were checked
// against the corresponding product websites. See public/media/tools/SOURCES.txt.
export const aiTools: AITool[] = [
  {
    id: 'codex', name: 'Codex', vendor: 'OpenAI', category: '编程开发',
    description: '从想法到可运行的产品，协助编写代码、修复问题与审查改动，让开发持续向前。',
    features: ['产品原型', '代码开发', '代码审查'], platform: '网页 / ChatGPT 桌面端',
    href: 'https://chatgpt.com/codex/', downloadHref: 'https://chatgpt.com/download/', logo: '/media/tools/codex.png',
  },
  {
    id: 'chatgpt', name: 'ChatGPT', vendor: 'OpenAI', category: '通用助手',
    description: '连接问题、资料与灵感，辅助梳理需求、撰写方案和分析文档，陪伴日常创作。',
    features: ['方案写作', '资料分析', '日常办公'], platform: '网页 / 桌面 / 移动端',
    href: 'https://chatgpt.com/', downloadHref: 'https://chatgpt.com/download/', logo: '/media/tools/chatgpt.png',
  },
  {
    id: 'doubao', name: '豆包', vendor: '字节跳动', category: '通用助手',
    description: '从日常问答到文案构思，帮助整理材料、激发创意，让中文写作和办公更轻松。',
    features: ['中文写作', '内容构思', '日常问答'], platform: '网页 / 桌面 / 移动端',
    href: 'https://www.doubao.com/chat/', downloadHref: 'https://www.doubao.com/download/', logo: '/media/tools/doubao.png',
  },
  {
    id: 'deepseek', name: 'DeepSeek', vendor: '深度求索', category: '通用助手',
    description: '一起拆解复杂问题，整理信息与代码思路，将深入思考连接到清晰的表达。',
    features: ['推理问答', '信息整理', '代码辅助'], platform: '网页 / 桌面 / 移动端',
    href: 'https://chat.deepseek.com/', downloadHref: 'https://www.deepseek.com/download/', logo: '/media/tools/deepseek.webp',
  },
  {
    id: 'cursor', name: 'Cursor', vendor: 'Cursor', category: '编程开发',
    description: '在编辑器中与 AI 协作，理解代码与项目上下文，从修改到实现，让开发更连贯。',
    features: ['AI 编辑器', '项目开发', '代码协作'], platform: '桌面端',
    href: 'https://cursor.com/download', downloadHref: 'https://cursor.com/download', logo: '/media/tools/cursor.png',
  },
  {
    id: 'claude', name: 'Claude', vendor: 'Anthropic', category: '通用助手',
    description: '围绕长文阅读、资料分析与方案打磨，协助写作、思考和创作，把复杂内容理清楚。',
    features: ['长文阅读', '方案打磨', '文档分析'], platform: '网页 / 桌面 / 移动端',
    href: 'https://claude.ai/', downloadHref: 'https://claude.com/download', logo: '/media/tools/claude.png',
  },
]

export const recommendedTools = ['codex', 'chatgpt', 'deepseek'].map(id => aiTools.find(tool => tool.id === id)!)
