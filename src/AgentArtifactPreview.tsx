import { useEffect, useId, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { ArrowRight, BookOpen, Bot, Check, CheckCircle2, Clapperboard, Database, FileText, ListChecks, Palette, ShieldCheck } from 'lucide-react'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { AriaComponent, GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsOption } from 'echarts'
import type { AgentTask } from './agent-work-data'
import './agent-artifact-preview.css'

echarts.use([LineChart, GridComponent, LegendComponent, TooltipComponent, AriaComponent, CanvasRenderer])

export type ArtifactInteractionState = {
  knowledgeStep?: number
  completed?: boolean[]
  palette?: number
}

type InteractionProps = {
  interactionState?: ArtifactInteractionState
  onInteractionChange?: (state: ArtifactInteractionState) => void
}

type PreviewProps = InteractionProps & {
  task: AgentTask
  view?: 'preview' | 'data'
  compact?: boolean
}

function DataPreview({ task }: { task: AgentTask }) {
  return <div className="aap-data">
    <div className="aap-section-label"><FileText size={14} aria-hidden="true" /><span>结构化内容</span><small>{task.rows.length} 条记录</small></div>
    <table className="aap-data-table">
      <caption className="aap-sr-only">{task.file}的结构化内容</caption>
      <thead><tr>{task.columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
      <tbody>{task.rows.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
    </table>
    <p className="aap-data-summary">{task.summary}</p>
  </div>
}

function DocumentPreview({ task }: { task: AgentTask }) {
  const research = task.id === 'research'
  return <article className="aap-document">
    <div className="aap-section-label"><BookOpen size={14} aria-hidden="true" /><span>{research ? '研究摘要' : '观察笔记'}</span><small>可继续编辑的草稿</small></div>
    <div className="aap-document-intro">
      <h4>{research ? '从分散信息中，找到值得追问的线索。' : '把持续关注，变成有方法的观察。'}</h4>
      <p>{research ? '先整理变化，再对照判断；每一条结论都保留核验的入口。' : '围绕产品、应用与生态建立观察维度，让下一次阅读更有方向。'}</p>
    </div>
    <div className="aap-document-notes">{task.rows.map(([label, value], index) => <section className="aap-document-note" key={label}>
      <span className="aap-note-number" aria-hidden="true">0{index + 1}</span><div><h5>{label}</h5><p>{value}。</p></div>
    </section>)}</div>
    <div className="aap-document-foot"><span>{research ? '核对来源，再形成判断' : '持续记录，再验证变化'}</span><span>ORILUX NOTES</span></div>
  </article>
}

const dramaFrames = [
  { source: '/media/v2/drama-poster.jpg', position: '50% 38%', title: '入城', direction: '远景 · 缓慢推进' },
  { source: '/media/v2/drama-scene.png', position: '71% 42%', title: '转折', direction: '中景 · 跟随人物' },
  { source: '/media/v2/drama-scene.png', position: '91% 65%', title: '启程', direction: '近景 · 光影收束' },
]

function DramaPreview({ task }: { task: AgentTask }) {
  return <div className="aap-storyboard">
    <div className="aap-section-label"><Clapperboard size={14} aria-hidden="true" /><span>分镜预览</span><small>30 秒 · 3 个镜头</small></div>
    <div className="aap-story-grid">{task.rows.map(([time, description], index) => {
      const frame = dramaFrames[index]
      return <figure className="aap-story-frame" key={time}>
        <div className="aap-frame-image"><img src={frame.source} alt={`${frame.title}：古城场景参考画面`} style={{ objectPosition: frame.position }} loading="lazy" /><span>0{index + 1}</span></div>
        <figcaption><div><strong>{frame.title}</strong><time>{time}</time></div><p>{description}</p><small>{frame.direction}</small></figcaption>
      </figure>
    })}</div>
    <div className="aap-timeline" aria-label="分镜时间轴：开场 8 秒，转折 13 秒，结尾 9 秒"><span style={{ flex: 8 }}>开场</span><span style={{ flex: 13 }}>转折</span><span style={{ flex: 9 }}>结尾</span></div>
    <p className="aap-story-note">画面为场景参考，镜头安排以分镜脚本为准。</p>
  </div>
}

function AnalysisPreview({ compact }: { compact: boolean }) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = chartRef.current
    if (!element) return
    let chart: ReturnType<typeof echarts.init> | undefined
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const render = () => {
      if (!element.clientWidth || !element.clientHeight) return
      chart ??= echarts.init(element, undefined, { renderer: 'canvas' })
      const styles = getComputedStyle(element)
      const color = (name: string, fallback: string) => styles.getPropertyValue(name).trim() || fallback
      const blue = color('--aw-blue', '#2f66ea')
      const muted = color('--aw-muted', '#7b8ba0')
      const copy = color('--aw-copy', '#53647d')
      const line = color('--aw-line', '#e4eaf3')
      const option: EChartsOption = {
        animation: !reducedMotion.matches,
        animationDuration: 420,
        animationDurationUpdate: 250,
        color: [blue, muted],
        aria: { enabled: true, label: { description: '示例数据。一周需求订单合计 182 单，完成交付 155 单，交付率 85.2%。每日订单总体增加。' } },
        textStyle: { fontFamily: 'Inter, Microsoft YaHei, sans-serif' },
        grid: { top: 33, right: 12, bottom: 27, left: 30, containLabel: false },
        legend: { top: 0, right: 0, itemWidth: 13, itemHeight: 7, itemGap: 15, textStyle: { color: copy, fontSize: 11 }, data: ['需求订单', '完成交付'] },
        tooltip: { trigger: 'axis', confine: true, backgroundColor: '#fff', borderColor: line, textStyle: { color: copy, fontSize: 12 }, axisPointer: { type: 'line', lineStyle: { color: line } }, valueFormatter: value => `${value} 单` },
        xAxis: { type: 'category', boundaryGap: false, data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'], axisTick: { show: false }, axisLine: { lineStyle: { color: line } }, axisLabel: { color: muted, fontSize: 10, margin: 10 } },
        yAxis: { type: 'value', min: 0, max: 40, interval: 20, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: muted, fontSize: 10 }, splitLine: { lineStyle: { color: line, type: 'dashed' } } },
        series: [
          { name: '需求订单', type: 'line', data: [18, 22, 19, 27, 31, 29, 36], smooth: .25, symbol: 'circle', symbolSize: 5, lineStyle: { width: 2.5 }, areaStyle: { opacity: .07 } },
          { name: '完成交付', type: 'line', data: [13, 18, 16, 23, 27, 26, 32], smooth: .25, symbol: 'circle', symbolSize: 4, lineStyle: { width: 1.5, type: 'dashed' } },
        ],
      }
      chart.setOption(option)
      chart.resize()
    }
    render()
    const resize = new ResizeObserver(() => {
      if (!chart) render()
      else if (element.clientWidth && element.clientHeight) chart.resize()
    })
    resize.observe(element)
    const theme = new MutationObserver(render)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-site-theme'] })
    reducedMotion.addEventListener('change', render)
    return () => {
      resize.disconnect()
      theme.disconnect()
      reducedMotion.removeEventListener('change', render)
      chart?.dispose()
    }
  }, [])

  return <div className="aap-analysis">
    <div className="aap-section-label"><span>本周经营概览</span><small className="aap-demo-label">示例数据</small></div>
    <div className="aap-metrics">
      <div><span>需求订单</span><strong>182<small>单</small></strong></div>
      <div><span>完成交付</span><strong>155<small>单</small></strong></div>
      <div><span>交付率</span><strong>85.2<small>%</small></strong></div>
    </div>
    <div ref={chartRef} className={`aap-chart${compact ? ' aap-chart-compact' : ''}`} role="img" aria-label="示例经营趋势图，需求订单和完成交付的一周变化；悬停查看每日数据，点击图例切换系列。" />
    <p className="aap-chart-note">演示数据，不代表实际经营情况。可悬停查看、点击图例筛选。</p>
  </div>
}

const knowledgeSteps = [
  { icon: Database, title: '知识准备', description: '先确定资料范围，让助手从可靠的内容出发。', fields: [['资料目录', '产品说明 / 常见问答 / 团队手册'], ['访问范围', '指定资料可检索，未授权内容不进入回答']] },
  { icon: Bot, title: '回答流程', description: '连接检索与回答，让信息来源保持可追溯。', fields: [['回答结构', '直接回答 + 相关资料段落'], ['不确定问题', '提示资料不足，并转交人工复核']] },
  { icon: ShieldCheck, title: '效果验证', description: '先用常见问题测试，再决定是否进入实际使用。', fields: [['测试内容', '常见问题 / 模糊问题 / 知识边界'], ['验证状态', '待配置与测试，通过后启用']] },
]

function KnowledgePreview({ interactionState, onInteractionChange }: InteractionProps) {
  const [internalActive, setInternalActive] = useState(0)
  const active = validSelection(interactionState?.knowledgeStep ?? internalActive, knowledgeSteps.length)
  const id = useId()
  const selected = knowledgeSteps[active]
  const select = (index: number) => {
    setInternalActive(index)
    onInteractionChange?.({ ...interactionState, knowledgeStep: index })
  }
  return <div className="aap-knowledge">
    <div className="aap-section-label"><span>知识助手配置草案</span><small>点击节点查看</small></div>
    <div className="aap-flow-nodes" role="group" aria-label="知识助手流程节点">{knowledgeSteps.map((step, index) => {
      const Icon = step.icon
      return <button key={step.title} type="button" className={`aap-flow-node${index === active ? ' is-active' : ''}`} aria-pressed={index === active} aria-controls={`${id}-detail`} onClick={() => select(index)}><Icon size={17} aria-hidden="true" /><span><small>STEP 0{index + 1}</small><strong>{step.title}</strong></span>{index < 2 && <ArrowRight className="aap-flow-arrow" size={12} aria-hidden="true" />}</button>
    })}</div>
    <div className="aap-flow-detail" id={`${id}-detail`}>
      <p>{selected.description}</p>
      <dl>{selected.fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    </div>
    <div className="aap-flow-foot"><CheckCircle2 size={12} aria-hidden="true" /><span>流程可讨论、可调整，当前为配置预览。</span></div>
  </div>
}

const weeklyActionLabels = ['汇总本周交付物', '确认需要协作的事项', '排定下周优先任务']
const initialCompleted = [true, false, false]

function WeeklyPreview({ task, interactionState, onInteractionChange }: { task: AgentTask } & InteractionProps) {
  const [internalChecked, setInternalChecked] = useState(initialCompleted)
  const checked = task.rows.map((_, index) => Boolean((interactionState?.completed ?? internalChecked)[index]))
  const completed = checked.filter(Boolean).length
  const id = useId()
  const toggle = (index: number) => {
    const next = task.rows.map((_, itemIndex) => itemIndex === index ? !checked[itemIndex] : Boolean(checked[itemIndex]))
    setInternalChecked(next)
    onInteractionChange?.({ ...interactionState, completed: next })
  }
  return <div className="aap-weekly">
    <div className="aap-section-label"><ListChecks size={14} aria-hidden="true" /><span>下周行动清单</span><small aria-live="polite">{completed} / {task.rows.length} 已完成</small></div>
    <div className="aap-completion" role="progressbar" aria-label="待办完成进度" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={task.rows.length}><span style={{ width: `${completed / task.rows.length * 100}%` }} /></div>
    <div className="aap-todos">{task.rows.map(([label, description], index) => <label htmlFor={`${id}-${index}`} className={`aap-todo${checked[index] ? ' is-done' : ''}`} key={label}>
      <input id={`${id}-${index}`} type="checkbox" checked={Boolean(checked[index])} onChange={() => toggle(index)} />
      <span><strong>{weeklyActionLabels[index]}</strong><small>{description}</small></span><span className="aap-todo-status">{checked[index] ? '已完成' : '待推进'}</span>
    </label>)}</div>
    <p className="aap-weekly-note">{completed === task.rows.length ? '行动已全部勾选完成，准备好开启下一轮协作。' : '点击勾选，一起把计划往前推进。'}</p>
  </div>
}

const brandPalettes = [
  { name: '自然森绿', theme: '森林绿 × 燕麦白 × 暖杏色', background: '#f1f2e9', ink: '#355e4a', colors: ['#355e4a', '#f1eee5', '#dfb489'], subtitle: '自然 · 轻盈 · 日常' },
  { name: '晨光暖杏', theme: '咖啡棕 × 奶油白 × 暖杏色', background: '#fff1e8', ink: '#7c4a31', colors: ['#7c4a31', '#fff5e8', '#cb8d5d'], subtitle: '温暖 · 松弛 · 陪伴' },
  { name: '清醒雾蓝', theme: '雾蓝色 × 云朵白 × 深海蓝', background: '#edf3fa', ink: '#284e79', colors: ['#284e79', '#f4f8fd', '#8cacd2'], subtitle: '清爽 · 自由 · 专注' },
]

function BrandPreview({ interactionState, onInteractionChange }: InteractionProps) {
  const [internalPaletteIndex, setInternalPaletteIndex] = useState(0)
  const paletteIndex = validSelection(interactionState?.palette ?? internalPaletteIndex, brandPalettes.length)
  const palette = brandPalettes[paletteIndex]
  const style = { '--aap-brand-background': palette.background, '--aap-brand-ink': palette.ink } as CSSProperties
  const select = (index: number) => {
    setInternalPaletteIndex(index)
    onInteractionChange?.({ ...interactionState, palette: index })
  }
  return <div className="aap-brand">
    <div className="aap-section-label"><Palette size={14} aria-hidden="true" /><span>轻醒咖啡 · 视觉方向</span><small>品牌提案示例</small></div>
    <div className="aap-brand-layout">
      <div className="aap-brand-preview" style={style}>
        <span className="aap-brand-wordmark">轻醒 <small>COFFEE</small></span><h4>把日常，<br />醒成喜欢的样子。</h4><p>{palette.subtitle}</p>
      </div>
      <div className="aap-palette-controls">
        <p>选择配色方向</p>
        <div className="aap-palette-list" role="group" aria-label="品牌配色方案">{brandPalettes.map((item, index) => <button key={item.name} type="button" className={`aap-palette-option${index === paletteIndex ? ' is-active' : ''}`} aria-pressed={index === paletteIndex} onClick={() => select(index)}><span className="aap-swatches" aria-hidden="true">{item.colors.map(color => <i key={color} style={{ backgroundColor: color }} />)}</span><span>{item.name}</span>{index === paletteIndex && <Check size={12} aria-hidden="true" />}</button>)}</div>
        <p className="aap-palette-description" aria-live="polite">{palette.theme}</p>
      </div>
    </div>
  </div>
}

function validSelection(value: number, length: number) {
  return Number.isInteger(value) && value >= 0 && value < length ? value : 0
}

// The download action shares the same selection definitions as the visible artifact.
// eslint-disable-next-line react-refresh/only-export-components
export function artifactInteractionMarkdown(task: AgentTask, state: ArtifactInteractionState): string {
  if (task.id === 'agent') {
    const selected = knowledgeSteps[validSelection(state.knowledgeStep ?? 0, knowledgeSteps.length)]
    return `## 当前知识流程节点：${selected.title}\n\n${selected.description}\n\n${selected.fields.map(([label, value]) => `- ${label}：${value}`).join('\n')}`
  }
  if (task.id === 'weekly') {
    const checked = state.completed ?? initialCompleted
    return `## 当前待办清单\n\n${task.rows.map(([, description], index) => `- [${checked[index] ? 'x' : ' '}] ${weeklyActionLabels[index]}：${description}`).join('\n')}`
  }
  if (task.id === 'brand') {
    const selected = brandPalettes[validSelection(state.palette ?? 0, brandPalettes.length)]
    return `## 当前品牌配色：${selected.name}\n\n${selected.theme}\n\n- 色值：${selected.colors.join(' / ')}\n- 文案：把日常，醒成喜欢的样子。\n- 表达关键词：${selected.subtitle}`
  }
  return ''
}

function ArtifactContent({ task, compact, interactionState, onInteractionChange }: { task: AgentTask; compact: boolean } & InteractionProps) {
  const interaction = { interactionState, onInteractionChange }
  if (task.id === 'drama') return <DramaPreview task={task} />
  if (task.id === 'analysis') return <AnalysisPreview compact={compact} />
  if (task.id === 'agent') return <KnowledgePreview {...interaction} />
  if (task.id === 'weekly') return <WeeklyPreview task={task} {...interaction} />
  if (task.id === 'brand') return <BrandPreview {...interaction} />
  return <DocumentPreview task={task} />
}

export default function AgentArtifactPreview({ task, view = 'preview', compact = false, interactionState, onInteractionChange }: PreviewProps) {
  return <div className={`aap-preview${compact ? ' aap-compact' : ''}`} data-artifact-kind={task.id}>
    {view === 'data' ? <DataPreview task={task} /> : <ArtifactContent key={task.id} task={task} compact={compact} interactionState={interactionState} onInteractionChange={onInteractionChange} />}
  </div>
}
