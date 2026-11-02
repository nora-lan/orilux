import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowRight, ArrowUpRight, Check, Play, Sparkles } from './icons'
import CreationShowcase from './CreationShowcase'

const creationModes = ['视频分镜', '图文创作', '营销文案'] as const
const assistantTasks = ['文档处理', '数据分析', '调研总结'] as const
type AssistantTask = typeof assistantTasks[number]

function WindowBar({ title }: { title: string }) {
  return <div className="ai-window-bar"><span className="ai-window-dots" aria-hidden="true"><i /><i /><i /></span><span>{title}</span><span className="ai-window-demo">DEMO</span></div>
}

function CreationPreview({ motionEnabled }: { motionEnabled: boolean }) {
  const [mode, setMode] = useState<typeof creationModes[number]>('视频分镜')
  const [prompt, setPrompt] = useState('')
  const [idea, setIdea] = useState('')
  const [playing, setPlaying] = useState(false)
  function preview(event: FormEvent) { event.preventDefault(); setIdea(prompt.trim()); setPlaying(false) }
  return <div className="ai-preview ai-creation-preview">
    <WindowBar title="曜境创作 · 灵感工作台" />
    <div className="ai-creation-workspace">
      <aside className="ai-creation-sidebar" aria-label="创作类型">{creationModes.map(item => <button key={item} aria-pressed={mode === item} onClick={() => { setMode(item); setPlaying(false) }}>{item}</button>)}<div className="ai-creation-spec"><span>画面比例</span><strong>16 : 9</strong><span>灵感风格</span><strong>电影叙事</strong></div></aside>
      <div className={`ai-creation-canvas ${playing && motionEnabled ? 'is-previewing' : ''}`}>
        <img src="/images/ai-creation.png" width="600" height="400" alt="蓝紫色星际城市与发光环形轨道的创意画面" loading="lazy" />
        <span className="ai-scene-label">CREATIVE EXPLORATION / 01</span>
        <div className="ai-scene-copy" aria-live="polite"><span>{idea ? '创意已加入示例' : '把想象，变成下一帧'}</span><strong>{idea || '下一站，无限可能。'}</strong></div>
        {mode === '视频分镜' ? <button className="ai-scene-play" disabled={!motionEnabled} aria-label={!motionEnabled ? '页面动效已关闭' : playing ? '暂停分镜动效' : '播放分镜动效'} aria-pressed={playing && motionEnabled} onClick={() => setPlaying(value => !value)}>{playing && motionEnabled ? 'Ⅱ' : <Play size={15} />}</button> : <div className="ai-copy-result" aria-live="polite">{mode === '图文创作' ? '灵感封面 + 主题标题' : '让想象启程，让未来发生。'}</div>}
        <div className="ai-scene-progress" aria-hidden="true"><i /><i /><i /></div>
      </div>
    </div>
    <form className="ai-demo-prompt" onSubmit={preview}><label className="sr-only" htmlFor="ai-creation-prompt">创作灵感</label><input id="ai-creation-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} required maxLength={60} placeholder="写下创意，预览你的创作示例" /><button type="submit" aria-label="预览创作示例" title="预览创作示例"><Sparkles size={17} /></button></form>
  </div>
}

const appScenarios = [
  { name: '数据看板', file: 'dashboard.tsx', rows: [['云服务', '运行中'], ['数据任务', '已完成'], ['AI 应用', '运行中']], metric: '业务概览' },
  { name: '项目管理', file: 'workspace.tsx', rows: [['需求梳理', '已完成'], ['界面设计', '进行中'], ['上线准备', '待开始']], metric: '项目进度' },
]
function CodePreview() {
  const [scenario, setScenario] = useState(0)
  const [view, setView] = useState<'code' | 'preview'>('code')
  const [prompt, setPrompt] = useState('')
  const [appName, setAppName] = useState('')
  const selected = appScenarios[scenario]
  const code = [
    <><b>import</b> {'{ createApp }'} <b>from</b> <em>'@yaojing/ai'</em>;</>,
    <>&nbsp;</>,
    <><b>const</b> app = <span>createApp</span>({'{'}</>,
    <>  name: <em>{JSON.stringify(appName || selected.name)}</em>,</>,
    <>  model: <em>'yaojing-studio'</em>,</>,
    <>  features: [<em>'协作'</em>, <em>'数据'</em>],</>,
    <>  theme: <em>'light'</em>,</>,
    <>{'}'});</>,
    <>&nbsp;</>,
    <><b>export default</b> app;</>,
  ]
  function showPreview(event: FormEvent) { event.preventDefault(); setAppName(prompt.trim()); setView('preview') }
  return <div className="ai-preview ai-code-preview">
    <WindowBar title={`曜境 Code · ${selected.file}`} />
    <div className="ai-code-toolbar"><div role="group" aria-label="应用示例类型">{appScenarios.map((item, index) => <button key={item.name} aria-pressed={scenario === index} onClick={() => { setScenario(index); setAppName('') }}>{item.name}</button>)}</div><button className="ai-preview-toggle" aria-label={view === 'code' ? '查看应用预览' : '查看示例代码'} onClick={() => setView(view === 'code' ? 'preview' : 'code')}>{view === 'code' ? '预览' : '代码'} <ArrowUpRight size={12} /></button></div>
    {view === 'code' ? <div className="ai-code-lines" aria-label="应用代码示例"><code>{code.map((line, index) => <span className="ai-code-line" key={index}><i aria-hidden="true">{index + 1}</i><span>{line}</span></span>)}</code><div className="ai-code-ready"><Check size={12} /> 需求 · 代码 · 应用</div></div> : <div className="ai-generated-app" aria-live="polite"><div className="ai-generated-heading"><span>YOUR WORKSPACE</span><strong>{appName || selected.name}</strong></div><div className="ai-app-summary"><span>{selected.metric}<strong>{scenario === 0 ? '128' : '3'}<small>{scenario === 0 ? '个活跃任务' : '个关键节点'}</small></strong></span><span className="ai-app-summary-badge">演示应用</span></div><div className="ai-app-rows">{selected.rows.map(([name, status]) => <div key={name}><span>{name}</span><span>{status}</span></div>)}</div></div>}
    <form className="ai-demo-prompt" onSubmit={showPreview}><label className="sr-only" htmlFor="ai-app-prompt">应用需求</label><input id="ai-app-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} required maxLength={32} placeholder="描述应用名称，查看交互原型" /><button type="submit" aria-label="预览应用示例" title="预览应用示例"><Sparkles size={17} /></button></form>
  </div>
}

const assistantResponses: Record<AssistantTask, { title: string; lines: string[] }> = {
  文档处理: { title: '把信息整理成清晰的行动', lines: ['提取核心结论与关键事项', '按主题归纳，保留上下文', '整理负责人、时间与下一步'] },
  数据分析: { title: '让数据中的变化更容易看见', lines: ['明确指标与统计口径', '比较趋势，标记关键变化', '形成摘要与后续验证建议'] },
  调研总结: { title: '从繁杂资料中梳理重点', lines: ['拆解目标，列出调研维度', '整理观点及需要核实的信息', '形成结构化摘要与行动清单'] },
}
function AssistantPreview() {
  const [task, setTask] = useState<AssistantTask | null>(null)
  const [query, setQuery] = useState('')
  const [question, setQuestion] = useState('')
  const answerRef = useRef<HTMLDivElement>(null)
  const taskButtons = useRef<Partial<Record<AssistantTask, HTMLButtonElement | null>>>({})
  const lastTask = useRef<AssistantTask | null>(null)
  const queryRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (task) answerRef.current?.focus({ preventScroll: true })
  }, [task])
  function reset() {
    setTask(null); setQuestion('')
    requestAnimationFrame(() => {
      const target = lastTask.current ? taskButtons.current[lastTask.current] : queryRef.current
      target?.focus({ preventScroll: true })
    })
  }
  function ask(event: FormEvent) {
    event.preventDefault()
    const text = query.trim()
    if (!text) return
    lastTask.current = null
    setQuestion(text)
    setTask(/数据|指标|趋势|分析/.test(text) ? '数据分析' : /调研|研究|总结/.test(text) ? '调研总结' : '文档处理')
  }
  const result = task ? assistantResponses[task] : null
  return <div className={`ai-preview ai-assistant-preview ${result ? 'has-answer' : ''}`}>
    <img className="ai-assistant-image" src="/images/ai-assistant.png" width="600" height="400" alt="白色与冰蓝色的友好 AI 助手机器人" loading="lazy" />
    {!result ? <><span className="ai-assistant-greeting">你好，灵感搭档。</span><div className="ai-assistant-tasks" aria-label="助手任务示例">{assistantTasks.map((item, index) => <button key={item} ref={element => { taskButtons.current[item] = element }} className={`ai-task-${index}`} onClick={() => { lastTask.current = item; setQuestion(''); setTask(item) }}><Sparkles size={14} />{item}</button>)}</div></> : <div className="ai-assistant-answer" ref={answerRef} role="region" tabIndex={-1} aria-label={`${task}示例工作流`} aria-live="polite"><div><span><Sparkles size={14} />{task}</span><button aria-label="返回助手首页" onClick={reset}>返回</button></div>{question && <p className="ai-user-question">{question}</p>}<strong>{result.title}</strong><ul>{result.lines.map(line => <li key={line}><Check size={12} />{line}</li>)}</ul><span className="ai-answer-note">示例工作流 · 可按业务定制</span></div>}
    <form className="ai-demo-prompt" onSubmit={ask}><label className="sr-only" htmlFor="ai-assistant-query">助手任务需求</label><input ref={queryRef} id="ai-assistant-query" value={query} onChange={event => setQuery(event.target.value)} required maxLength={70} placeholder="输入任务，探索助手工作流" /><button type="submit" aria-label="查看助手任务示例" title="查看助手任务示例"><ArrowRight size={17} /></button></form>
  </div>
}

export default function AIProductivity({ onConsult, motionEnabled }: { onConsult: () => void; motionEnabled: boolean }) {
  return <section className="ai-productivity section" id="ai-productivity" aria-labelledby="ai-productivity-title">
    <div className="ai-productivity-wrap">
      <div className="section-heading ai-section-heading"><p className="eyebrow">FROM INTELLIGENCE TO IMPACT</p><h2 id="ai-productivity-title">不止模型，更有开箱即用的 <span>AI 生产力</span></h2><p>从内容创作到编码研发，让模型能力走进每一天的工作。</p></div>
      <div className="ai-app-grid">
        <article className="ai-app-card ai-create-card"><div className="ai-app-copy"><span className="ai-product-label">曜境 AI 创作平台</span><h3>智能创作，灵感一键成形</h3><p>从一句灵感到完整内容，连接图文创作、视频分镜与营销文案，让每个好想法都有表达。</p><button className="ai-app-link" onClick={onConsult}>探索创作方案 <ArrowUpRight size={15} /></button></div><CreationShowcase motionEnabled={motionEnabled}><CreationPreview motionEnabled={motionEnabled} /></CreationShowcase></article>
        <article className="ai-app-card ai-develop-card"><div className="ai-app-copy"><span className="ai-product-label">曜境 Code 应用开发</span><h3>从需求到应用，AI 一站协同</h3><p>理解业务需求，串联代码、组件与团队知识。从灵感原型出发，探索更高效的应用开发方式。</p><button className="ai-app-link" onClick={onConsult}>探索开发方案 <ArrowUpRight size={15} /></button></div><CodePreview /></article>
        <article className="ai-app-card ai-assist-card"><div className="ai-app-copy"><span className="ai-product-label">曜境 Mate 智能助手</span><h3>智能搭档，日常任务轻松处理</h3><p>覆盖文档处理、数据分析与调研总结，把重复工作交给助手，将更多时间留给思考与创造。</p><button className="ai-app-link" onClick={onConsult}>探索助手方案 <ArrowUpRight size={15} /></button></div><AssistantPreview /></article>
      </div>
      <p className="ai-demo-note">交互演示 · 展示预设创作素材、应用原型与助手工作流</p>
    </div>
  </section>
}
