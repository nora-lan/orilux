import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, ArrowRight, X, Menu, Cpu, Sparkles, Check } from './icons'
import HeroExperience from './HeroExperience'
import BrandLogoSvg from './BrandLogoSvg'
import { usePageMotion } from './usePageMotion'
import AIProductivity from './AIProductivity'
import CommunitySection from './CommunitySection'
import './App.css'
import './motion.css'
import './brand-monogram.css'
import './ai-productivity.css'
import './community.css'

type Product = { name: string; english: string; category: string; description: string; features: string[]; icon: string; tag?: string }
const products: Product[] = [
  { name: '曜境大模型平台', english: 'Yaojing AI Studio', category: '人工智能', description: '从模型接入到应用编排，让企业 AI 创新更简单。', features: ['多模型统一接入与管理', '企业知识库与检索增强', '可视化智能体工作流'], icon: 'spark', tag: '热门' },
  { name: '弹性云服务器', english: 'Elastic Compute', category: '云基础设施', description: '灵活配置计算资源，从容应对每一次业务增长。', features: ['按需选择计算规格', '自动伸缩与资源编排', '统一管理运行状态'], icon: 'server' },
  { name: '智能数据平台', english: 'Data Intelligence', category: '数据智能', description: '打通数据采集、分析与应用，让每一个决策有据可依。', features: ['多源数据集成', '实时分析与可视化', '指标管理与数据治理'], icon: 'data', tag: '精选' },
  { name: '云原生容器服务', english: 'Cloud Native', category: '云基础设施', description: '从开发到交付，构建更敏捷、更易扩展的应用。', features: ['容器应用编排', '持续集成与发布', '服务观测与日志分析'], icon: 'cube' },
  { name: '企业安全中心', english: 'Security Center', category: '安全与协同', description: '以统一的安全视角，守护业务与数据的每一环。', features: ['访问权限统一管理', '风险监测与事件分析', '操作审计与策略管理'], icon: 'shield' },
  { name: '智能协同工作台', english: 'Intelligent Workspace', category: '安全与协同', description: '连接团队、流程与知识，让协作真正产生价值。', features: ['团队知识空间', '业务流程自动化', '跨应用信息协同'], icon: 'network' },
]
const categories = ['精选产品', '人工智能', '云基础设施', '数据智能', '安全与协同']
const solutions = [
  { name: '互联网', title: '让每一个好想法，快速成为好产品。', desc: '覆盖应用开发、弹性部署与用户增长，将更多精力留给产品创新。', points: ['弹性架构，适应业务波峰', '数据驱动，洞察用户需求', 'AI 融入，探索全新体验'], labels: ['业务应用', 'AI 能力', '数据服务', '弹性计算'], metric: '从想法到应用', sub: '构建 · 部署 · 观测 · 迭代' },
  { name: '零售与电商', title: '连接每一次触达，理解每一种需求。', desc: '让商品、渠道与用户数据相互连接，为精细化运营与智能服务提供基础。', points: ['统一数据，建立业务全景', '智能服务，提升购物体验', '灵活扩展，应对活动流量'], labels: ['全渠道零售', '智能客服', '经营分析', '云端资源'], metric: '让经营更有方向', sub: '连接 · 分析 · 运营 · 增长' },
  { name: '智能制造', title: '让数据流动，让生产更有智慧。', desc: '连接生产现场与业务系统，用数据与智能技术探索运营改善的新路径。', points: ['设备数据，统一接入管理', '实时分析，辅助运营决策', '知识沉淀，连接一线经验'], labels: ['生产场景', '知识助手', '实时分析', '边缘连接'], metric: '连接生产与决策', sub: '采集 · 洞察 · 协同 · 优化' },
  { name: '企业服务', title: '让协作更高效，让组织更敏捷。', desc: '将企业知识、流程与工具整合到工作中，让数字能力触达每一个团队。', points: ['企业知识，随时检索使用', '流程自动化，减少重复工作', '统一权限，建立清晰边界'], labels: ['业务工作台', '企业智能体', '知识资产', '安全底座'], metric: '释放团队创造力', sub: '知识 · 流程 · 工具 · 协同' },
]
const articles = [
  { tag: '技术洞察', title: '从大模型到业务应用，企业 AI 如何迈出第一步？', desc: '从场景选择、知识准备到效果评估，建立清晰的实施路径。', color: 'blue', body: ['先选择可验证的场景。知识检索、内容辅助和流程问答通常更容易明确输入、输出与使用边界。', '整理可信的业务资料。明确知识来源、更新责任和访问权限，让应用回答有据可查。', '建立评估机制。使用业务问题集评估准确率、可用性与成本，再决定是否逐步扩大使用范围。'] },
  { tag: '实践指南', title: '云原生架构，让应用迭代更从容', desc: '拆解从容器化到持续交付的关键环节。', color: 'lavender', body: ['从应用依赖和运行环境梳理开始，使用容器统一交付标准。', '为部署建立可回滚的流程，将配置与应用版本一起管理。', '通过指标、日志与链路跟踪了解运行情况，持续验证服务目标。'] },
  { tag: '产品观察', title: '让数据成为团队共同的语言', desc: '统一指标与数据口径，让洞察连接行动。', color: 'cyan', body: ['明确业务指标的定义、计算口径和负责人，减少理解差异。', '构建面向业务问题的数据视图，让团队可以追溯信息来源。', '将洞察嵌入日常工作，用定期回顾持续完善数据质量与决策流程。'] },
]
function Symbol({ kind, size = 27 }: { kind: string; size?: number }) {
  if (kind === 'spark') return <Sparkles size={size} />
  if (kind === 'server') return <Cpu size={size} />
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    {kind === 'data' ? <><ellipse cx="16" cy="7" rx="10" ry="4" /><path d="M6 7v18c0 5 20 5 20 0V7M6 16c0 5 20 5 20 0" /></> : kind === 'shield' ? <><path d="M16 3 27 7v8c0 7-5 11-11 14C10 26 5 22 5 15V7Z" /><path d="m11 15 4 4 7-8" /></> : kind === 'network' ? <><rect x="11" y="3" width="10" height="7" rx="1" /><rect x="2" y="23" width="10" height="7" rx="1" /><rect x="20" y="23" width="10" height="7" rx="1" /><path d="M16 10v7H7v6m9-6h9v6" /></> : <><path d="m16 2 13 7v14l-13 7L3 23V9Z" /><path d="m3 9 13 7 13-7M16 16v14M10 5l13 7v7" /></>}
  </svg>
}
function Brand() { return <span className="brand"><BrandLogoSvg compact /><strong>曜境<span>YAOJING</span></strong></span> }
function App() {
  const { enabled: motionEnabled, systemReduced, toggleMotion, activeSection, progressRef } = usePageMotion()
  const [category, setCategory] = useState('精选产品')
  const [solution, setSolution] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<'contact' | 'search' | Product | number | null>(null)
  const [query, setQuery] = useState('')
  const [summary, setSummary] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const activeSolution = solutions[solution]
  const exploreCategory = (nextCategory: string) => { setCategory(nextCategory); document.getElementById('products')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' }) }
  useEffect(() => {
    if (modal === null) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    dialog?.showModal()
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = oldOverflow; previous?.focus() }
  }, [modal])
  const contact = () => { setSummary(''); setModal('contact') }
  function createSummary(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSummary(`曜境业务需求清单\n\n企业名称：${data.get('company')}\n联系邮箱：${data.get('email')}\n关注领域：${data.get('interest')}\n需求描述：${data.get('message') || '待沟通'}\n\n此清单在本地生成，尚未提交给任何服务团队。`)
  }
  function downloadSummary() {
    const url = URL.createObjectURL(new Blob([summary], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = '曜境-业务需求清单.txt'; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <>
    <div ref={progressRef} className="reading-progress" aria-hidden="true" /><header className="site-header"><a href="#home" aria-label="曜境首页"><Brand /></a><nav aria-label="主导航" className={menuOpen ? 'main-nav is-open' : 'main-nav'}>{[['产品与服务', '#products'], ['AI 生产力', '#ai-productivity'], ['解决方案', '#solutions'], ['资源中心', '#resources'], ['关于曜境', '#about'], ['社区动态', '#community']].map(([label, href]) => <a key={href} href={href} className={href === `#${activeSection}` ? 'nav-active' : ''} aria-current={href === `#${activeSection}` ? 'location' : undefined} onClick={() => setMenuOpen(false)}>{label}{label === '产品与服务' && <span className="chevron">⌄</span>}</a>)}</nav><div className="header-actions"><button className="search-button" aria-label="搜索产品" onClick={() => { setQuery(''); setModal('search') }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></button><a className="header-link" href="#resources">开发者资源</a><button className="button small" onClick={contact}>联系我们 <ArrowUpRight size={14} /></button><button className="mobile-menu" aria-label="展开导航" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div></header>
    <main>
      <HeroExperience motionEnabled={motionEnabled} onContact={contact} onExplore={exploreCategory} />
      <div className="quick-links wrap">{[{ icon: 'spark', title: '让 AI 走进业务', desc: '从模型能力到场景应用', target: '#products' }, { icon: 'cube', title: '构建灵活的云底座', desc: '计算、容器与应用服务', target: '#products' }, { icon: 'data', title: '用数据发现新价值', desc: '连接洞察与每一次决策', target: '#solutions' }, { icon: 'network', title: '与创新者一起向前', desc: '探索技术与实践指南', target: '#resources' }].map(item => <a href={item.target} key={item.title}><span className="quick-icon"><Symbol kind={item.icon} size={25} /></span><div><h3>{item.title}</h3><p>{item.desc}</p></div><ArrowUpRight size={16} /></a>)}</div>
      <section className="section products-section wrap" id="products"><div className="section-heading"><div><p className="eyebrow">PRODUCTS & SERVICES</p><h2>为创新，提供每一份力量。</h2><p>从基础设施到智能应用，让技术成为业务向前的动力。</p></div><button className="text-link" onClick={() => { setQuery(''); setModal('search') }}>发现全部产品 <ArrowRight size={17} /></button></div><div className="product-tabs" role="group" aria-label="产品分类">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="product-grid">{products.filter(item => category === '精选产品' || item.category === category).map(item => <button className="product-card" key={category + item.name} onClick={() => setModal(item)}><div className="product-icon"><Symbol kind={item.icon} />{item.tag && <span>{item.tag}</span>}</div><h3>{item.name}</h3><span className="product-english">{item.english}</span><p>{item.description}</p><span className="product-more">了解产品 <ArrowUpRight size={16} /></span></button>)}</div><p className="catalog-note">围绕企业需求设计的产品能力展示，可进一步配置为您的实际产品与服务。</p></section>
      <AIProductivity onConsult={contact} motionEnabled={motionEnabled} /><section className="solutions-section" id="solutions"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">SOLUTIONS FOR EVERY AMBITION</p><h2>深入业务场景，让价值真正落地。</h2><p>理解不同行业的挑战，探索更适合你的数字化路径。</p></div></div><div className="solution-shell"><div className="solution-tabs" role="group" aria-label="行业解决方案">{solutions.map((item, index) => <button key={item.name} className={solution === index ? 'active' : ''} aria-pressed={solution === index} onClick={() => setSolution(index)}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={17} /></button>)}</div><div className="solution-content" key={activeSolution.name}><span className="pill">{activeSolution.name}解决方案</span><h3>{activeSolution.title}</h3><p>{activeSolution.desc}</p><ul>{activeSolution.points.map(point => <li key={point}><Check size={15} />{point}</li>)}</ul><button className="text-link" onClick={contact}>规划我的业务方案 <ArrowRight size={17} /></button></div><div className="solution-diagram" key={activeSolution.name + 'diagram'}><span className="diagram-caption">CONNECTED ARCHITECTURE</span><div className="diagram-nodes">{activeSolution.labels.map((label, index) => <div key={label} className={`diagram-node node-${index}`}><Symbol kind={['network', 'spark', 'data', 'cube'][index]} size={22} /><span>{label}</span>{index < 3 && <i>↓</i>}</div>)}</div><strong>{activeSolution.metric}</strong><p>{activeSolution.sub}</p></div></div></div></section>
      <section className="section resources-section" id="resources"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">IDEAS INTO ACTION</p><h2>前沿视野，与实践同行。</h2></div><a className="text-link" href="#about">认识曜境 <ArrowRight size={17} /></a></div><div className="resource-grid">{articles.map((article, index) => <button className="resource-card" key={article.title} onClick={() => setModal(index)}><div className={`resource-art ${article.color}`}><span className="article-index">INSIGHT / 0{index + 1}</span><div className={`article-shape shape-${index}`}><Symbol kind={['spark', 'cube', 'data'][index]} size={64} /></div><span className="art-word">{['Intelligence.', 'Build better.', 'Data matters.'][index]}</span></div><div className="resource-copy"><span>{article.tag}<i />阅读约 2 分钟</span><h3>{article.title}</h3><p>{article.desc}</p><span className="read-more">阅读全文 <ArrowUpRight size={16} /></span></div></button>)}</div></div></section>
      <section className="about-section wrap" id="about"><div><p className="eyebrow">THIS IS YAOJING</p><h2>技术的意义，<br />是让更多可能成为现实。</h2></div><div><p>曜境关注云、数据与智能技术的连接，探索技术如何融入真实业务。我们相信，好的技术应该易于理解、易于使用，并在每一次应用中创造价值。</p><div className="values"><span>开放连接</span><span>持续创新</span><span>价值共创</span></div></div></section>
      <CommunitySection />
      <section className="cta-section"><div className="wrap"><div><span>YOUR NEXT STARTS HERE</span><h2>你的下一次突破，从这里开始。</h2><p>聊聊你的想法，一起探索业务的更多可能。</p></div><button className="button" onClick={contact}>与我们聊聊 <ArrowUpRight size={18} /></button></div></section>
    </main>
    <footer><div className="footer-main wrap"><div className="footer-brand"><a href="#home" aria-label="曜境首页"><Brand /></a><p>以智能，开启无限可能。</p><span>BUILD WHAT’S NEXT.</span></div><div><strong>产品与服务</strong>{products.slice(0, 3).map(item => <button onClick={() => setModal(item)} key={item.name}>{item.name}</button>)}</div><div><strong>解决方案</strong>{solutions.slice(0, 3).map((item, index) => <a href="#solutions" key={item.name} onClick={() => setSolution(index)}>{item.name}</a>)}</div><div><strong>探索更多</strong><a href="#ai-productivity">AI 生产力</a><a href="#resources">资源中心</a><a href="#about">关于曜境</a><a href="#community">社区动态</a></div><div><strong>连接曜境</strong><p>让每一个想法，都有向前的力量。</p><button className="text-link" onClick={contact}>业务咨询 <ArrowUpRight size={15} /></button></div></div><div className="footer-bottom wrap"><span>© 2026 曜境 YAOJING · 企业科技官网概念展示</span><span>中国大陆 · 简体中文</span><a href="#home">回到顶部 ↑</a></div></footer>
    <aside className="site-tools" aria-label="页面快捷操作"><button className="motion-switch" aria-label={systemReduced ? '系统已设置减少动态效果' : motionEnabled ? '关闭页面动效' : '开启页面动效'} aria-pressed={motionEnabled} disabled={systemReduced} onClick={toggleMotion}><span className="motion-dot" />动效<span>{motionEnabled ? '开' : '关'}</span></button><button className="quick-contact" aria-label="业务咨询" onClick={contact}><Sparkles size={18} /></button><a href="#home" className={activeSection === 'home' ? 'back-to-top' : 'back-to-top is-shown'} aria-label="返回顶部" tabIndex={activeSection === 'home' ? -1 : 0}>↑</a></aside>
    {modal !== null && <dialog ref={dialogRef} aria-label={modal === 'contact' ? '业务咨询' : modal === 'search' ? '搜索产品' : typeof modal === 'number' ? articles[modal].title : modal.name} className={`dialog ${modal === 'contact' ? 'contact-dialog' : ''}`} onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setModal(null) } }}><button className="dialog-close" aria-label="关闭弹窗" onClick={() => setModal(null)}><X size={22} /></button>
      {modal === 'search' ? <><p className="eyebrow">EXPLORE YAOJING</p><h2>发现适合你的产品</h2><input className="search-input" aria-label="输入产品关键词" placeholder="搜索 AI、云服务器、数据、安全…" autoFocus value={query} onChange={e => setQuery(e.target.value)} /><div className="search-results">{products.filter(item => `${item.name} ${item.english} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())).map(item => <button key={item.name} onClick={() => setModal(item)}><Symbol kind={item.icon} size={24} /><span><strong>{item.name}</strong><small>{item.category}</small></span><ArrowUpRight size={18} /></button>)}{products.filter(item => `${item.name} ${item.english} ${item.category} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase())).length === 0 && <p className="empty-state">暂无匹配产品，请尝试“数据”“云”或“AI”。</p>}</div></> : modal === 'contact' ? <><p className="eyebrow">LET’S BUILD TOGETHER</p><h2>{summary ? '你的需求清单已准备好。' : '让我们从你的业务开始。'}</h2>{summary ? <><pre className="summary">{summary}</pre><button className="button" onClick={downloadSummary}>下载需求清单 <ArrowRight size={17} /></button><button className="text-link edit-summary" onClick={() => setSummary('')}>重新填写</button></> : <><p className="dialog-lead">选择关注的领域，梳理你的下一步计划。</p><form onSubmit={createSummary}><label>企业名称<input name="company" required maxLength={100} placeholder="请输入企业或团队名称" /></label><label>联系邮箱<input name="email" type="email" required maxLength={150} placeholder="name@company.com" /></label><label>关注领域<select name="interest">{categories.slice(1).map(item => <option key={item}>{item}</option>)}</select></label><label>业务需求<textarea name="message" maxLength={2000} rows={3} placeholder="你希望解决什么业务问题？" /></label><p className="form-note">当前为官网演示，信息仅用于在本页生成需求清单，不会发送或提交。</p><button className="button form-submit" type="submit">生成需求清单 <ArrowRight size={17} /></button></form></>}</> : typeof modal === 'number' ? <article className="article-dialog"><p className="eyebrow">{articles[modal].tag} / YAOJING INSIGHTS</p><h2>{articles[modal].title}</h2><p className="dialog-lead">{articles[modal].desc}</p>{articles[modal].body.map((paragraph, index) => <div key={paragraph}><span>0{index + 1}</span><p>{paragraph}</p></div>)}<button className="text-link" onClick={contact}>探索相关业务场景 <ArrowRight size={17} /></button></article> : <><span className="detail-icon"><Symbol kind={modal.icon} size={34} /></span><p className="eyebrow">{modal.english}</p><h2>{modal.name}</h2><p className="dialog-lead">{modal.description}</p><ul className="detail-features">{modal.features.map(feature => <li key={feature}><Check size={18} />{feature}</li>)}</ul><p className="detail-note">产品能力为官网方案展示，实际服务范围可根据业务需求进一步确定。</p><button className="button" onClick={contact}>咨询产品方案 <ArrowUpRight size={17} /></button></>}
    </dialog>}
  </>
}
export default App


