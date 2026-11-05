import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowUpRight, ArrowRight, X, Menu, Cpu, Sparkles, Check } from './icons'
import HeroV2 from './HeroV2'
import OPCProductShowcase from './OPCProductShowcase'
import AgentWorkShowcase from './AgentWorkShowcase'
import ThemeSwitcher from './ThemeSwitcher'
import { aiTools } from './ai-tools'
import { Sparkles as ProductSparkles, Network, BookOpen, TrendingUp, Users, Boxes, Cpu as ProductCpu, Database, ShieldCheck } from 'lucide-react'
import { products } from './products'
import type { Product } from './products'
import BrandLogoSvg from './BrandLogoSvg'
import BrandWordmark from './BrandWordmark'
import { usePageMotion } from './usePageMotion'
import AIProductivity from './AIProductivity'
import CommunitySection from './CommunitySection'
import ArticlePage from './ArticlePage'
import AccountPage from './AccountPage'
import JoinPage from './JoinPage'
import Once from "./Once"
import './user-avatar.css'
import './App.css'
import './motion.css'
import './brand-monogram.css'
import './ai-productivity.css'
import './community.css'
import './navigation.css'
import './solution-diagram.css'
import './about-section.css'
import './layout.css'
import './branding.css'
import './join.css'
import './product-catalog.css'
import './site-theme.css'
import './theme-showcase.css'
import './theme-blue-enhanced.css'
import './theme-blue-ways.css'
import './opc-gallery.css'

const categories = ['精选产品', '曜境 OPC', 'AI 工具', '人工智能', '云基础设施', '数据智能', '安全与协同']
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
  if (kind === 'book' || kind === 'growth' || kind === 'people') return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'book' ? <><path d="M12 5C9 3 5 3 2 4v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1v15" /><path d="M5 8h3m8 0h3M5 12h3m8 0h3" /></> : kind === 'growth' ? <><path d="M4 3v18h17M8 16l4-5 4 2 5-7M17 6h4v4" /></> : <><circle cx="9" cy="7" r="3" /><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6m2 4a5 5 0 0 1 3 4v3" /></>}
  </svg>
  return <svg width={size} height={size} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
    {kind === 'data' ? <><ellipse cx="16" cy="7" rx="10" ry="4" /><path d="M6 7v18c0 5 20 5 20 0V7M6 16c0 5 20 5 20 0" /></> : kind === 'shield' ? <><path d="M16 3 27 7v8c0 7-5 11-11 14C10 26 5 22 5 15V7Z" /><path d="m11 15 4 4 7-8" /></> : kind === 'network' ? <><rect x="11" y="3" width="10" height="7" rx="1" /><rect x="2" y="23" width="10" height="7" rx="1" /><rect x="20" y="23" width="10" height="7" rx="1" /><path d="M16 10v7H7v6m9-6h9v6" /></> : <><path d="m16 2 13 7v14l-13 7L3 23V9Z" /><path d="m3 9 13 7 13-7M16 16v14M10 5l13 7v7" /></>}
  </svg>
}
function ProductCapabilityIcon({ kind }: { kind: string }) {
  const Icon = { spark: ProductSparkles, network: Network, book: BookOpen, growth: TrendingUp, people: Users, cube: Boxes, server: ProductCpu, data: Database, shield: ShieldCheck }[kind] || ProductSparkles
  return <Icon size={25} strokeWidth={1.6} aria-hidden="true" />
}
function SolutionDiagram({ solution }: { solution: typeof solutions[number] }) {
  return <div className="solution-diagram" role="group" aria-label={`${solution.name}能力协同架构`}>
    <div className="diagram-heading"><span className="diagram-caption">CONNECTED ARCHITECTURE</span><span className="diagram-heading-label"><i aria-hidden="true" />能力协同架构</span></div>
    <div className="diagram-nodes">
      <svg className="diagram-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path className="diagram-connection-base" d="M25 25H75V75H25Z M25 25L75 75 M75 25L25 75" />
        <path className="diagram-connection-flow" d="M25 25H75V75H25Z" />
      </svg>
      <span className="diagram-hub" aria-hidden="true"><Sparkles size={18} /></span>
      {solution.labels.map((label, index) => <div key={label} className={`diagram-node node-${index}`}>
        <span className="diagram-node-index" aria-hidden="true">0{index + 1}</span>
        <div className="diagram-node-icon"><Symbol kind={['network', 'spark', 'data', 'cube'][index]} size={32} /></div>
        <span className="diagram-node-label">{label}</span>
      </div>)}
    </div>
    <strong>{solution.metric}</strong><p>{solution.sub}</p>
  </div>
}
function Brand({ stacked = false }: { stacked?: boolean }) {
  return <span className={`brand${stacked ? ' brand-stacked' : ''}`} role="img" aria-label={stacked ? '曜境 · ORILUX AI' : 'ORILUX AI'}>
    <span className="brand-symbol"><BrandLogoSvg compact /></span>
    {stacked ? <span className="brand-lockup" aria-hidden="true"><span className="brand-name">曜境</span><BrandWordmark /></span> : <BrandWordmark />}
  </span>
}
function App() {
  const homeBase = '/'
  const isJoinPage = /^\/join(?:\/|$)/.test(window.location.pathname)
  const isAccountPage = /^\/account(?:\/|$)/.test(window.location.pathname)
  const isCommunityPage = /^\/community(?:\/|$)/.test(window.location.pathname)
  const isArticlePage = /^\/community\/article(?:\/|$)/.test(window.location.pathname)
  const isHomePage = !isJoinPage && !isAccountPage && !isCommunityPage
  const topHref = isJoinPage ? '#join-top' : isAccountPage ? '#account-top' : isArticlePage ? '#article-top' : isCommunityPage ? '#community' : '#home'
  const { enabled: motionEnabled, activeSection, progressRef } = usePageMotion()
  const activeNavHref = isJoinPage ? '/join/' : isCommunityPage ? '/community/' : isAccountPage ? '' : '#home'
  const [solution, setSolution] = useState(() => {
    const initial = Number(new URLSearchParams(window.location.search).get('solution'))
    return Number.isInteger(initial) && initial >= 0 && initial < solutions.length ? initial : 0
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [modal, setModal] = useState<'contact' | 'search' | Product | number | null>(null)
  const [query, setQuery] = useState('')
  const [summary, setSummary] = useState('')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const activeSolution = solutions[solution]
  const exploreCategory = () => { document.getElementById('products')?.scrollIntoView({ behavior: motionEnabled ? 'smooth' : 'instant', block: 'start' }) }
  useEffect(() => {
    const redirectLegacyCommunity = () => {
      if (!isCommunityPage && window.location.hash === '#community') window.location.replace('/community/')
    }
    redirectLegacyCommunity()
    // Cross-page anchors arrive before React mounts their target elements.
    const frame = requestAnimationFrame(() => {
      document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ behavior: 'instant', block: 'start' })
    })
    window.addEventListener('hashchange', redirectLegacyCommunity)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('hashchange', redirectLegacyCommunity) }
  }, [isCommunityPage])
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
    <div ref={progressRef} className="reading-progress" aria-hidden="true" /><header className={`site-header${isJoinPage ? ' join-header' : ''}`}><a href={`${homeBase}#home`} aria-label="曜境首页"><Brand /></a><nav aria-label="主导航" className={menuOpen ? 'main-nav is-open' : 'main-nav'}>{[['首页', '#home'], ['曜境AI工作手机', 'https://phone1.ydcq3.com/'], ['曜境OPC', 'https://opc.ydcq3.com/official/#capabilities'], ['社区动态', '/community/'], ['加入我们', '/join/']].map(([label, href]) => <a key={href} href={href.startsWith('#') ? `${homeBase}${href}` : href} target={href.startsWith('https://') ? '_blank' : undefined} rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined} title={href.startsWith('https://') ? `${label}（新标签页打开）` : undefined} className={href === activeNavHref ? 'nav-active' : ''} aria-current={href === activeNavHref ? (href.startsWith('#') ? 'location' : 'page') : undefined} onClick={() => setMenuOpen(false)}>{label}{href.startsWith('https://') && <ArrowUpRight size={12} className="nav-external-icon" />}</a>)}</nav><div className="header-actions"><ThemeSwitcher /><button className="search-button" aria-label="搜索产品" onClick={() => { setQuery(''); setModal('search') }}><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg></button><a className="button small" href="https://opc.ydcq3.com/app/#login" target="_blank" rel="noopener noreferrer" title="开始体验（新标签页打开）">开始体验 <ArrowUpRight size={14} /></a><button className="mobile-menu" aria-label={menuOpen ? '收起导航' : '展开导航'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button></div></header>
    <main className={isAccountPage ? 'account-page-main' : isCommunityPage ? 'community-page' : undefined}>
      {isJoinPage ? <JoinPage motionEnabled={motionEnabled} /> : isAccountPage ? <AccountPage /> : isArticlePage ? <ArticlePage /> : isCommunityPage ? <CommunitySection /> : <>
      <HeroV2 motionEnabled={motionEnabled} onContact={contact} onExplore={exploreCategory} />
      <div className="quick-links wrap">{[{ icon: 'spark', title: '让 AI 走进业务', desc: '从模型能力到场景应用', target: '#products' }, { icon: 'cube', title: '构建灵活的云底座', desc: '计算、容器与应用服务', target: '#products' }, { icon: 'data', title: '用数据发现新价值', desc: '连接洞察与每一次决策', target: '#solutions' }, { icon: 'network', title: '与创新者一起向前', desc: '探索技术与实践指南', target: '#resources' }].map(item => <a href={item.target} key={item.title}><span className="quick-icon"><Symbol kind={item.icon} size={25} /></span><div><h3>{item.title}</h3><p>{item.desc}</p></div><ArrowUpRight size={16} /></a>)}</div>
      <section className="section products-section wrap" id="products">
        <div className="section-heading">
          <div><p className="eyebrow">PRODUCTS & SERVICES</p><h2>从学习到交付，让创造力落地。</h2><p>以曜境 OPC 连接智能体、课程、项目与社区资源，把每一次探索变成下一步行动。</p></div>
          <button className="text-link" onClick={() => { setQuery(''); setModal('search') }}>发现全部产品 <ArrowRight size={17} /></button>
        </div>
       
        <OPCProductShowcase onExploreTools={() => { setQuery(''); setModal('search') }} />
           <Once/>

           
        {/* <div className="opc-gallery-heading" id="product-catalog"><div><p className="eyebrow">EXPLORE THE WORKSPACE</p><h3>曜境 OPC 能帮你做什么？</h3><p>从一个想法出发，连接学习、实践与协作。</p></div><span>01 — 06 / 六种可能</span></div> */}
        {/* <div className="opc-gallery">{products.filter(item => item.featured).map((item, index) => <article className="opc-gallery-card" key={item.name}>
          <button type="button" className={`opc-gallery-art art-${index + 1}`} onClick={() => setModal(item)} aria-label={`查看${item.name}详情`}>
            <span className="opc-gallery-art-index" aria-hidden="true">ORILUX OPC &nbsp; / &nbsp; 0{index + 1} &nbsp; · &nbsp; 界面示意</span>
            <div className="opc-gallery-window" aria-hidden="true">
              <div className="opc-gallery-window-bar"><span><i /><i /><i /></span><small>ORILUX WORKSPACE</small><span>✦</span></div>
              <div className="opc-gallery-window-body"><div className="opc-gallery-mini-nav"><span className="opc-gallery-mini-icon"><ProductCapabilityIcon kind={item.icon} /></span><i /><i /><i /></div><div className="opc-gallery-mini-content"><span className="opc-gallery-mini-label">{item.english}</span><strong>{item.name}</strong><div className="opc-gallery-mini-feature"><span><ProductCapabilityIcon kind={item.icon} /></span><div><b>{item.features[0]}</b><small>{item.features[1]}</small></div></div><div className="opc-gallery-mini-row">{item.features.slice(1).map(feature => <span key={feature}><i />{feature}</span>)}</div></div></div>
            </div>
            <span className="opc-gallery-art-action" aria-hidden="true">查看详情 <ArrowUpRight size={15} /></span>
          </button>
          <div className="opc-gallery-copy"><div><h3>{item.name}</h3><p>{item.description}</p></div><div className="opc-gallery-actions"><button type="button" onClick={() => setModal(item)}>了解详情 <ArrowRight size={15} /></button>{item.href && <a href={item.href} target="_blank" rel="noopener noreferrer">{item.icon === 'book' ? '开始学习' : '在线使用'} <ArrowUpRight size={14} /></a>}</div></div>
        </article>)}</div> */}
        <p className="catalog-note"><span>课程、订单及共享资源以平台实际开放情况与成员权限为准。</span><a href="https://opc.ydcq3.com/official/#community" target="_blank" rel="noopener noreferrer">了解平台与入驻条件 <ArrowUpRight size={13} /></a></p>
      </section>
      <AIProductivity onConsult={contact} motionEnabled={motionEnabled} /><section className="solutions-section" id="solutions"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">SOLUTIONS FOR EVERY AMBITION</p><h2>深入业务场景，让价值真正落地。</h2><p>理解不同行业的挑战，探索更适合你的数字化路径。</p></div></div><div className="solution-shell"><div className="solution-tabs" role="group" aria-label="行业解决方案">{solutions.map((item, index) => <button key={item.name} className={solution === index ? 'active' : ''} aria-pressed={solution === index} onClick={() => setSolution(index)}><span>0{index + 1}</span>{item.name}<ArrowUpRight size={17} /></button>)}</div><div className="solution-content" key={activeSolution.name}><span className="pill">{activeSolution.name}解决方案</span><h3>{activeSolution.title}</h3><p>{activeSolution.desc}</p><ul>{activeSolution.points.map(point => <li key={point}><Check size={15} />{point}</li>)}</ul><button className="text-link" onClick={contact}>规划我的业务方案 <ArrowRight size={17} /></button></div><SolutionDiagram key={activeSolution.name + 'diagram'} solution={activeSolution} /></div></div></section>
      <AgentWorkShowcase  />
      <section className="section resources-section" id="resources"><div className="wrap"><div className="section-heading"><div><p className="eyebrow">IDEAS INTO ACTION</p><h2>前沿视野，与实践同行。</h2></div><a className="text-link" href={`${homeBase}#about`}>认识曜境 <ArrowRight size={17} /></a></div><div className="resource-grid">{articles.map((article, index) => <button className="resource-card" key={article.title} onClick={() => setModal(index)}><div className={`resource-art ${article.color}`}><span className="article-index">INSIGHT / 0{index + 1}</span><div className={`article-shape shape-${index}`}><Symbol kind={['spark', 'cube', 'data'][index]} size={64} /></div><span className="art-word">{['Intelligence.', 'Build better.', 'Data matters.'][index]}</span></div><div className="resource-copy"><span>{article.tag}<i />阅读约 2 分钟</span><h3>{article.title}</h3><p>{article.desc}</p><span className="read-more">阅读全文 <ArrowUpRight size={16} /></span></div></button>)}</div></div></section>
      <section className="about-section" id="about" aria-labelledby="about-heading">
        <div className="about-inner wrap">
          <div className="about-intro">
            <p className="eyebrow">THIS IS ORILUX AI</p>
            <h2 id="about-heading">技术的意义，<br />是让更多可能<br className="about-title-break" />成为现实。</h2>
            <div className="about-values"><span>开放连接</span><span>持续创新</span><span>价值共创</span></div>
          </div>
          <div className="about-content">
            <p className="about-description">曜境关注云、数据与智能技术的连接，探索技术如何融入真实业务。我们相信，好的技术应该易于理解、易于使用，并在每一次应用中创造价值。</p>
            <div className="about-invitation">
              <h3>你的下一次突破，从这里开始。</h3>
              <p>聊聊你的想法，一起探索业务的更多可能。</p>
              <button className="button" onClick={contact}>与我们聊聊 <ArrowUpRight size={18} /></button>
            </div>
          </div>
        </div>
      </section>
      </>}
    </main>
    <footer><div className="footer-main wrap"><div className="footer-brand"><a href={`${homeBase}#home`} aria-label="曜境首页"><Brand stacked /></a><p>以智能，开启无限可能。</p><span>BUILD WHAT’S NEXT.</span></div><div><strong>产品与服务</strong>{products.filter(item => !item.featured).slice(0, 3).map(item => <button onClick={() => setModal(item)} key={item.name}>{item.name}</button>)}</div><div><strong>解决方案</strong>{solutions.slice(0, 3).map((item, index) => <a href={window.location.pathname !== '/' ? `/?solution=${index}#solutions` : `${homeBase}#solutions`} key={item.name} onClick={() => setSolution(index)}>{item.name}</a>)}</div><div><strong>探索更多</strong><a href={`${homeBase}#ai-productivity`}>AI 生产力</a><a href={`${homeBase}#resources`}>资源中心</a><a href={`${homeBase}#about`}>关于曜境</a><a href="/community/">社区动态</a><a href="/join/">加入我们</a></div><div><strong>连接曜境</strong><p>让每一个想法，都有向前的力量。</p><button className="text-link" onClick={contact}>业务咨询 <ArrowUpRight size={15} /></button></div></div><div className="footer-bottom wrap"><span>© 2026 曜境 ORILUX AI · 企业科技官网概念展示</span><span>中国大陆 · 简体中文</span><a href={topHref}>回到顶部 ↑</a></div></footer>
    <aside className={`site-tools${isHomePage && activeSection === 'home' ? ' v2-hero-tools' : ''}`} aria-label="页面快捷操作"><a href={topHref} className={activeSection === 'home' ? 'back-to-top' : 'back-to-top is-shown'} aria-label="返回顶部" tabIndex={activeSection === 'home' ? -1 : 0}>↑</a></aside>
    {modal !== null && <dialog ref={dialogRef} aria-label={modal === 'contact' ? '业务咨询' : modal === 'search' ? '搜索产品' : typeof modal === 'number' ? articles[modal].title : modal.name} className={`dialog ${modal === 'contact' ? 'contact-dialog' : ''}`} onCancel={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setModal(null) } }}><button className="dialog-close" aria-label="关闭弹窗" onClick={() => setModal(null)}><X size={22} /></button>
      {modal === 'search' ? <><p className="eyebrow">EXPLORE ORILUX AI</p><h2>发现适合你的产品</h2><input className="search-input" aria-label="输入产品关键词" placeholder="搜索智能体、课程、项目、工具、云服务…" autoFocus value={query} onChange={e => setQuery(e.target.value)} /><div className="search-results">{products.filter(item => `${item.name} ${item.english} ${item.category} ${item.description} ${item.features.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).map(item => <button key={item.name} onClick={() => setModal(item)}><Symbol kind={item.icon} size={24} /><span><strong>{item.name}</strong><small>{item.category}</small></span><ArrowUpRight size={18} /></button>)}{aiTools.filter(item => `${item.name} ${item.vendor} ${item.category} ${item.description} ${item.features.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).map(item => <a className="tool-search-result" key={item.id} href={item.href} target="_blank" rel="noopener noreferrer"><img src={item.logo} alt="" /><span><strong>{item.name}</strong><small>{item.category} · 官方网站</small></span><ArrowUpRight size={18} /></a>)}{products.filter(item => `${item.name} ${item.english} ${item.category} ${item.description} ${item.features.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).length === 0 && aiTools.filter(item => `${item.name} ${item.vendor} ${item.category} ${item.description} ${item.features.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())).length === 0 && <p className="empty-state">暂无匹配产品，请尝试“智能体”“学习”或“工具”。</p>}</div></> : modal === 'contact' ? <><p className="eyebrow">LET’S BUILD TOGETHER</p><h2>{summary ? '你的需求清单已准备好。' : '让我们从你的业务开始。'}</h2>{summary ? <><pre className="summary">{summary}</pre><button className="button" onClick={downloadSummary}>下载需求清单 <ArrowRight size={17} /></button><button className="text-link edit-summary" onClick={() => setSummary('')}>重新填写</button></> : <><p className="dialog-lead">选择关注的领域，梳理你的下一步计划。</p><form onSubmit={createSummary}><label>企业名称<input name="company" required maxLength={100} placeholder="请输入企业或团队名称" /></label><label>联系邮箱<input name="email" type="email" required maxLength={150} placeholder="name@company.com" /></label><label>关注领域<select name="interest">{categories.slice(1).map(item => <option key={item}>{item}</option>)}</select></label><label>业务需求<textarea name="message" maxLength={2000} rows={3} placeholder="你希望解决什么业务问题？" /></label><p className="form-note">当前为官网演示，信息仅用于在本页生成需求清单，不会发送或提交。</p><button className="button form-submit" type="submit">生成需求清单 <ArrowRight size={17} /></button></form></>}</> : typeof modal === 'number' ? <article className="article-dialog"><p className="eyebrow">{articles[modal].tag} / ORILUX AI INSIGHTS</p><h2>{articles[modal].title}</h2><p className="dialog-lead">{articles[modal].desc}</p>{articles[modal].body.map((paragraph, index) => <div key={paragraph}><span>0{index + 1}</span><p>{paragraph}</p></div>)}<button className="text-link" onClick={contact}>探索相关业务场景 <ArrowRight size={17} /></button></article> : <><span className="detail-icon"><Symbol kind={modal.icon} size={34} /></span><p className="eyebrow">{modal.english}</p><h2>{modal.name}</h2><p className="dialog-lead">{modal.description}</p><ul className="detail-features">{modal.features.map(feature => <li key={feature}><Check size={18} />{feature}</li>)}</ul><p className="detail-note">{modal.href ? '课程、项目与共享服务按平台实际开放情况及成员权限使用；完成课程不代表自动获得能力认证。' : '产品能力为官网方案展示，实际服务范围可根据业务需求进一步确定。'}</p>{modal.href ? <a className="button" href={modal.href} target="_blank" rel="noopener noreferrer">进入 OPC 平台 <ArrowUpRight size={17} /></a> : <button className="button" onClick={contact}>咨询产品方案 <ArrowUpRight size={17} /></button>}</>}
    </dialog>}
  </>
}
export default App


