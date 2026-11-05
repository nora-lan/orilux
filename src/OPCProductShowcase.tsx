import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { ArrowRight, ArrowUp, ArrowUpRight, BookOpen, Check, Clapperboard, Copy, LoaderCircle, Network, PanelLeft, Plus, RotateCcw, Sparkles } from 'lucide-react'
import { recommendedTools } from './ai-tools'
import './opc-product-showcase.css'
import Loommy from './Loommy'

const scenarios = [
  {
    id: 'film', label: '创作品牌短片', icon: Clapperboard,
    prompt: '我想做一支 30 秒的 AI 品牌短片',
    title: '先把灵感，变成一份分镜计划。',
    steps: [
      { title: '明确故事', text: '先确定品牌、目标观众和一句核心表达。' },
      { title: '拆解分镜', text: '按「吸引注意 5 秒 → 展示价值 20 秒 → 品牌收尾 5 秒」安排镜头。' },
      { title: '制作与复核', text: '生成画面并配音剪辑，检查角色一致性、字幕与品牌信息。' },
    ],
  },
  {
    id: 'knowledge', label: '搭建知识助手', icon: Network,
    prompt: '帮我规划一个能回答团队常见问题的知识助手',
    title: '让团队的知识，随问随用。',
    steps: [
      { title: '整理知识', text: '收集常见问题与有效文档，标注来源、版本和访问范围。' },
      { title: '建立问答', text: '配置检索与回答流程，让答案附带来源，缺少依据时明确提示。' },
      { title: '验证效果', text: '用真实问题检查准确性与权限，再根据反馈补充知识。' },
    ],
  },
  {
    id: 'learning', label: '规划学习路径', icon: BookOpen,
    prompt: '我是 AI 新手，想用两周时间做出第一件作品',
    title: '从零开始，也有清晰的下一步。',
    steps: [
      { title: '第 1–3 天 · 找到方向', text: '选择一个小项目，学习提示词、常用工具与基础工作流程。' },
      { title: '第 4–10 天 · 动手实践', text: '将作品拆成小任务，每天完成一部分，记录尝试与问题。' },
      { title: '第 11–14 天 · 完成作品', text: '整理成果、收集反馈并迭代，留下一份可展示的作品。' },
    ],
  },
] as const

const generalScenario = {
  id: 'general', title: '把目标拆小，让行动开始。',
  steps: [
    { title: '确认需求', text: '说明成果给谁使用、希望解决什么问题，以及时间和资源限制。' },
    { title: '拆解行动', text: '准备所需资料，选择合适的工具，先完成一个可验证的小版本。' },
    { title: '检查与改进', text: '对照目标检查结果，记录反馈，再确定下一轮需要优化的内容。' },
  ],
}

function selectScenario(goal: string) {
  if (/知识|文档|问答|客服/.test(goal)) return scenarios[1]
  if (/学习|新手|入门|两周|课程/.test(goal)) return scenarios[2]
  if (/视频|短片|品牌|分镜|漫剧/.test(goal)) return scenarios[0]
  return generalScenario
}

const stageLabels = ['正在理解目标', '正在拆解任务', '正在整理方案']
const toolDescriptions: Record<string, string> = {
  codex: '把需求落到代码，推进原型与产品开发。',
  chatgpt: '梳理思路、分析资料，让创作更有方向。',
  deepseek: '拆解复杂问题，连接推理与清晰表达。',
}

export default function OPCProductShowcase({ onExploreTools }: { onExploreTools: () => void }) {
  const inputId = useId()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const restoreInputFocusRef = useRef(false)
  const [prompt, setPrompt] = useState('')
  const [goal, setGoal] = useState('')
  const [stage, setStage] = useState(-1)
  const [run, setRun] = useState(0)
  const [copyNotice, setCopyNotice] = useState('')
  const scenario = selectScenario(goal)
  const running = stage >= 0 && stage < 3
  const complete = stage === 3

  useEffect(() => {
    if (run === 0) return
    bodyRef.current?.scrollTo({ top: 0 })
    if (restoreInputFocusRef.current) {
      inputRef.current?.focus({ preventScroll: true })
      restoreInputFocusRef.current = false
    }
  }, [run])

  function newTask() {
    setPrompt(''); setGoal(''); setStage(-1); setCopyNotice('')
    requestAnimationFrame(() => inputRef.current?.focus({ preventScroll: true }))
  }

  useEffect(() => {
    if (stage < 0 || stage >= 3) return
    const timer = window.setTimeout(() => setStage(value => value + 1), 700)
    return () => window.clearTimeout(timer)
  }, [stage, run])

  useEffect(() => {
    if (!copyNotice) return
    const timer = window.setTimeout(() => setCopyNotice(''), 3000)
    return () => window.clearTimeout(timer)
  }, [copyNotice])

  function start(nextPrompt = prompt) {
    const value = nextPrompt.trim()
    if (!value) return
    setPrompt(value)
    setGoal(value)
    setCopyNotice('')
    setRun(value => value + 1)
    setStage(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 3 : 0)
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    restoreInputFocusRef.current = true
    start()
  }

  function inputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      if (!running) { restoreInputFocusRef.current = true; start() }
    }
  }

  async function copyPlan() {
    const plan = `目标：${goal}\n\n${scenario.title}\n${scenario.steps.map((step, index) => `${index + 1}. ${step.title}\n${step.text}`).join('\n\n')}\n\nORILUX Agent · 场景方案示例`
    try { await navigator.clipboard.writeText(plan); setCopyNotice('已复制行动清单') }
    catch { setCopyNotice('未能复制，请选中方案文字复制。') }
  }

  const composer = <form className="opc-agent-composer" onSubmit={submit}>
        <label className="opc-agent-input-label" htmlFor={inputId}>告诉智能体你的目标</label>
        <textarea ref={inputRef} id={inputId} rows={stage < 0 ? 3 : 1} maxLength={300} value={prompt} placeholder={stage < 0 ? '今天想做点什么？说说你的想法…' : '继续描述你的目标，生成新的行动方案…'} onKeyDown={inputKeyDown} onChange={event => { setPrompt(event.target.value); setCopyNotice('') }} />
        <div className="opc-agent-composer-bottom"><span><Sparkles size={13} />{running ? '正在为你规划下一步' : '理解想法 · 拆解行动'}</span><button type="submit" disabled={!prompt.trim() || running} aria-label={running ? '正在生成方案' : '生成行动方案'}>{running ? <LoaderCircle size={17} className="opc-agent-spinner" /> : <ArrowUp size={19} />}</button></div>
      </form>

  return <div className="opc-agent-showcase">
    {/* <section className={`opc-studio-frame${running ? ' is-working' : ''}`} aria-label="ORILUX 智能体工作台">
      <div className="opc-studio-window">
        <aside className="opc-studio-sidebar" aria-label="智能体导航">
          <div className="opc-studio-brand"><img src="/favicon.svg" width="30" height="30" alt="" /><div><strong>ORILUX</strong><small>你的 AI 工作伙伴</small></div></div>
          <button type="button" className="opc-studio-new" onClick={newTask}><Plus size={15} />新建任务<ArrowUpRight size={13} /></button>
          <nav className="opc-studio-nav" aria-label="协作方向">
            <button type="button" aria-pressed={stage < 0 || !['knowledge', 'learning'].includes(scenario.id)} onClick={newTask}><Sparkles size={15} />智能协作</button>
            <button type="button" aria-pressed={stage >= 0 && scenario.id === 'knowledge'} onClick={() => start(scenarios[1].prompt)}><Network size={15} />知识助手</button>
            <button type="button" aria-pressed={stage >= 0 && scenario.id === 'learning'} onClick={() => start(scenarios[2].prompt)}><BookOpen size={15} />学习计划</button>
          </nav>
          <div className="opc-studio-recents"><span>试试这些任务</span>{scenarios.map(item => <button type="button" key={item.id} className={goal === item.prompt && stage >= 0 ? 'is-active' : ''} onClick={() => start(item.prompt)}>{item.label}</button>)}</div>
          <a className="opc-studio-enter" href="https://opc.ydcq3.com/app/#login" target="_blank" rel="noopener noreferrer"><Sparkles size={15} /><span>进入完整工作台</span><ArrowUpRight size={14} /></a>
        </aside>
        <div className="opc-studio-main">
          <div className="opc-studio-bar"><span><PanelLeft size={14} />智能协作</span><button type="button" className="opc-studio-mobile-new" onClick={newTask}><Plus size={14} />新任务</button><span className="opc-agent-demo"><i />交互演示</span></div>
          <div className={`opc-studio-body${stage >= 0 ? ' has-result' : ''}`} ref={bodyRef}>
            {stage < 0 ? <>
              <div className="opc-studio-greeting"><div><span>ORILUX AGENT</span><h3>你好，<br />想一起完成什么？</h3><p>把想法交给我，从第一步开始。</p></div><img src="/images/ai-assistant.png" width="112" height="112" alt="蓝白色的 AI 机器人伙伴" /></div>
              <div className="opc-studio-capabilities" aria-label="快捷任务">{scenarios.map(item => { const Icon = item.icon; return <button type="button" key={item.id} onClick={() => start(item.prompt)}><Icon size={14} />{item.label}</button> })}</div>
              {composer}
              <p className="opc-studio-hint">从一个小目标开始，让灵感落地。</p>
            </> : <>
              <div className="opc-studio-request"><span>你的目标</span><p>{goal}</p></div>
              <div className="opc-agent-output" aria-busy={running}>
                <div className="opc-agent-status" role="status"><span className={`opc-agent-status-icon${complete ? ' is-complete' : ''}`}>{complete ? <Check size={15} /> : <LoaderCircle size={15} className="opc-agent-spinner" />}</span><span>{complete ? scenario.title : stageLabels[stage]}</span>{complete && <small>方案示例</small>}</div>
                <ol className="opc-agent-plan" key={run}>{scenario.steps.map((step, index) => <li key={step.title} className={index < stage ? 'is-done' : index === stage ? 'is-current' : 'is-pending'}><span className="opc-agent-step-icon">{index < stage ? <Check size={13} /> : index === stage ? <span className="opc-agent-step-dot" /> : `0${index + 1}`}</span><div><strong>{step.title}</strong><p>{step.text}</p></div></li>)}</ol>
                {complete && <div className="opc-agent-result-actions"><button type="button" onClick={copyPlan}><Copy size={13} />复制清单</button><button type="button" onClick={() => start(goal)}><RotateCcw size={13} />重新演示</button><span role="status">{copyNotice}</span></div>}
              </div>
            </>}
          </div>
          {stage >= 0 && <div className="opc-studio-compose-area">{composer}</div>}
          <div className="opc-studio-bottomline"><span>预设场景体验</span><a href="https://opc.ydcq3.com/app/#login" target="_blank" rel="noopener noreferrer">开始体验<ArrowUpRight size={12} /></a></div>
        </div>
      </div>
    </section> */}
<Loommy/>
    <aside className="opc-agent-tools" aria-label="精选 AI 工具">
      <div className="opc-agent-tools-heading"><span>让灵感，多一种可能。</span><small>精选 AI 工具</small></div>
      {recommendedTools.map(tool => <a className="opc-agent-tool" key={tool.id} href={tool.href} target="_blank" rel="noopener noreferrer" aria-label={`打开 ${tool.name} 官方网站（新标签页）`}>
        <div className="opc-agent-tool-head"><span className="opc-agent-tool-logo"><img src={tool.logo} alt="" width="36" height="36" /></span><div><h3>{tool.name}</h3><span>{tool.category}</span></div><ArrowUpRight size={17} /></div>
        <p>{toolDescriptions[tool.id]}</p><span className="opc-agent-tool-use">{tool.features.slice(0, 2).join(' / ')}<ArrowRight size={14} /></span>
      </a>)}
      <button className="opc-agent-more-tools" onClick={onExploreTools}>发现更多 AI 工具<ArrowRight size={15} /></button>
    </aside>
  </div>
}
