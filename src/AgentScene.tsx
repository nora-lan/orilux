import { useEffect, useState } from 'react'
import { ArrowRight, Check, Cpu, Sparkles } from './icons'
import './agent-scene.css'

const scenarios = [
  { label: '经营分析', request: '分析本周经营数据，给我一份行动建议。', plan: '拆解分析目标', knowledge: '读取经营资料', tool: '调用数据分析', sources: ['企业知识库', '数据分析', '报告生成'], output: '本周经营简报', detail: '趋势洞察 · 关键变化 · 下一步建议', tag: '分析报告', bars: [34, 51, 44, 69, 61, 85, 76], lines: ['汇总核心经营指标', '定位变化，生成行动建议'] },
  { label: '客户跟进', request: '梳理客户沟通记录，整理下一步跟进计划。', plan: '识别跟进目标', knowledge: '检索沟通记录', tool: '生成跟进清单', sources: ['客户资料', '沟通记录', '任务规划'], output: '客户跟进计划', detail: '需求摘要 · 沟通重点 · 待办事项', tag: '任务清单', bars: [43, 60, 48, 78, 63, 81, 94], lines: ['提炼客户需求与关注点', '整理待办，交由团队确认'] },
  { label: '内容创作', request: '结合品牌资料，写一份新品推广内容方案。', plan: '明确创作方向', knowledge: '检索品牌资料', tool: '编排内容方案', sources: ['品牌知识库', '内容创作', '文档生成'], output: '新品推广方案', detail: '传播主题 · 内容大纲 · 渠道建议', tag: '内容文档', bars: [36, 57, 73, 49, 82, 66, 91], lines: ['对齐品牌表达与产品卖点', '生成内容大纲，等待审阅'] },
] as const

function DataIcon({ document = false }: { document?: boolean }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {document ? <><path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6" /></> : <><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0" /></>}
  </svg>
}

export default function AgentScene({ running, motionEnabled }: { running: boolean; motionEnabled: boolean }) {
  const [scenario, setScenario] = useState(0)
  const [phase, setPhase] = useState(0)
  const currentPhase = motionEnabled ? phase : 3
  const current = scenarios[scenario]
  const complete = currentPhase === 3
  const steps = [current.plan, current.knowledge, current.tool]

  useEffect(() => {
    if (!running || !motionEnabled) return
    const timer = window.setTimeout(() => setPhase(value => (value + 1) % 4), [1800, 2000, 2200, 4600][phase])
    return () => window.clearTimeout(timer)
  }, [running, motionEnabled, phase, scenario])

  return <div className="agent-demo" data-phase={currentPhase} role="group" aria-label="智能体任务执行演示">
    <div className="agent-demo-aura" aria-hidden="true" />
    <div className="agent-scenario-bar">
      <span>试试交给 AI</span>
      <div role="group" aria-label="选择智能体演示场景">{scenarios.map((item, index) => <button key={item.label} type="button" aria-pressed={scenario === index} onClick={() => { setScenario(index); setPhase(0) }}>{item.label}</button>)}</div>
    </div>
    <div className="agent-console">
      <div className="agent-console-head">
        <div className="agent-identity"><span className="agent-avatar"><Sparkles size={23} /></span><div><strong>ORILUX <span>AGENT</span></strong><small>你的目标，智能协同完成</small></div></div>
        <span className={`agent-state${complete ? ' is-complete' : ''}`}><i />{complete ? '任务已完成' : '正在执行'}</span>
      </div>

      <div className="agent-goal"><span className="agent-goal-label">任务目标 <ArrowRight size={13} /></span><p key={scenario}>{current.request}</p><span className="agent-goal-corner" aria-hidden="true" /></div>

      <div className="agent-workflow" aria-label="执行步骤">
        {steps.map((step, index) => <div key={index} className={`agent-step${currentPhase === index ? ' is-working' : ''}${currentPhase > index ? ' is-done' : ''}`}>
          <div className="agent-step-top"><span className="agent-step-icon">{index === 0 ? <Sparkles size={19} /> : index === 1 ? <DataIcon /> : <Cpu size={19} />}</span><span className="agent-step-indicator">{currentPhase > index ? <Check size={12} /> : `0${index + 1}`}</span></div>
          <strong>{['规划任务', '连接知识', '调用工具'][index]}</strong><small>{step}</small>
          {index < 2 && <span className="agent-step-connector" aria-hidden="true"><ArrowRight size={13} /></span>}
        </div>)}
      </div>

      <div className={`agent-output${complete ? ' is-ready' : ''}`}>
        <div className="agent-output-head"><span><DataIcon document />{complete ? '成果已就绪' : ['正在规划执行路径', '正在检索相关资料', '正在生成任务成果'][currentPhase]}</span><small>{current.tag} · 演示</small></div>
        <div className="agent-output-body">
          <div className="agent-output-copy"><strong>{current.output}</strong><p>{current.detail}</p><div className="agent-output-checks">{current.lines.map(line => <span key={line}><Check size={12} />{line}</span>)}</div></div>
          <div className={`agent-result-visual result-${scenario}`} aria-hidden="true">
            {scenario === 0 ? <><div className="agent-result-bars">{current.bars.map((height, index) => <i key={index} style={{ height: `${height}%`, animationDelay: `${index * 80}ms` }} />)}</div><span>周度趋势 / 示例</span></> : scenario === 1 ? <div className="agent-result-tasks">{['需求确认', '方案准备', '安排回访'].map((label, index) => <span key={label}><i>{index + 1}</i>{label}<Check size={10} /></span>)}</div> : <div className="agent-result-document"><span>CONTENT PLAN</span><b>让新品被看见。</b><i /><i /><i /></div>}
          </div>
        </div>
        <div className="agent-output-progress" aria-hidden="true"><i style={{ width: `${[12, 36, 70, 100][currentPhase]}%` }} /></div>
      </div>

      <div className="agent-console-foot"><span className="agent-demo-disclaimer">场景演示 · 示例内容</span><button type="button" onClick={() => setPhase(0)} disabled={!motionEnabled || !complete} aria-label="重新播放智能体任务演示"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 10a8 8 0 1 1 0 5M4 3v7h7" /></svg>重新演示</button></div>
    </div>
    <div className="agent-connected-tools"><span><i />已连接能力</span>{current.sources.map((source, index) => <span key={source}>{index === 0 ? <DataIcon /> : index === 1 ? <Cpu size={13} /> : <DataIcon document />}{source}</span>)}</div>
  </div>
}
