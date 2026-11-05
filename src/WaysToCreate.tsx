import { ArrowRight, ArrowUpRight, BookOpen, Bot, Building2, Check, FolderKanban, Layers3, Network, ShieldCheck, Sparkles, UsersRound } from 'lucide-react'
import './ways-to-create.css'

const paths = [
  {
    id: 'personal', label: '个人使用', english: 'FOR INDIVIDUALS',
    description: '从一个想法开始，让 AI 成为学习与创作的日常伙伴。',
    headline: '随时开始', caption: '把灵感，变成第一件作品。',
    features: ['智能体陪伴，拆解目标与下一步行动', '按学习地图实践，积累自己的作品', '连接工具与资源，让创作更顺手'],
    action: '开始体验', href: 'https://opc.ydcq3.com/app/#login',
  },
  {
    id: 'team', label: '团队协作', english: 'FOR TEAMS',
    description: '找到同路的伙伴，在共同的项目里，让不同能力彼此成就。',
    headline: '共同创造', caption: '让一个人的想法，有一群人的回应。',
    features: ['发现社区伙伴，连接互补的专业能力', '围绕需求与项目，一起推进成果交付', '交流作品与经验，在共创中持续成长'],
    action: '认识共创伙伴', href: '/join/#opc-members',
  },
  {
    id: 'business', label: '企业应用', english: 'FOR BUSINESS',
    description: '围绕真实业务，探索智能体、知识与工作流程的协同应用。',
    headline: '从场景出发', caption: '让智能，融入每一天的业务。',
    features: ['梳理业务需求，选择可验证的应用场景', '连接企业知识，探索智能体工作流程', '明确协作与交付目标，规划实施路径'],
    action: '咨询应用方案',
  },
] as const

function CollaborationVisual({ kind }: { kind: typeof paths[number]['id'] }) {
  const icons = kind === 'personal' ? [Bot, BookOpen, Sparkles] : kind === 'team' ? [FolderKanban, Sparkles, Network] : [ShieldCheck, Layers3, Network]
  return <div className="create-collaboration" aria-hidden="true">
    <span className="create-persona">{kind === 'personal' ? <span>你</span> : kind === 'team' ? <UsersRound size={19} /> : <Building2 size={19} />}</span>
    <span className="create-connector"><i /><ArrowRight size={13} /><i /></span>
    <div className="create-assistants">{icons.map((Icon, index) => <span className={`create-assistant assistant-${index}`} key={index}><Icon size={19} strokeWidth={1.7} /></span>)}</div>
    <span className="create-live-dot" />
  </div>
}

export default function WaysToCreate({ onConsult }: { onConsult: () => void }) {
  return <section className="ways-to-create" id="ways-to-create" aria-labelledby="ways-to-create-title">
    <div className="wrap">
      <div className="create-section-heading">
        <p className="eyebrow">CREATE ON YOUR OWN. GROW TOGETHER.</p>
        <h2 id="ways-to-create-title">一个人可以开始，<span>一群人可以走得更远。</span></h2>
        <p>无论独自创作、与伙伴共创，还是探索企业应用，都能在曜境找到下一步。</p>
      </div>
      <div className="create-paths">
        {paths.map((path, index) => <article className={`create-path create-path-${path.id}`} key={path.id}>
          <div className="create-path-heading"><span className="create-path-eyebrow">{path.english}</span><span className="create-path-number">0{index + 1}</span></div>
          <h3>{path.label}</h3>
          <p className="create-path-description">{path.description}</p>
          <div className="create-path-visual">
            <CollaborationVisual kind={path.id} />
            <strong>{path.headline}</strong>
            <p>{path.caption}</p>
          </div>
          <ul>{path.features.map(feature => <li key={feature}><Check size={13} strokeWidth={2.2} aria-hidden="true" /><span>{feature}</span></li>)}</ul>
          {'href' in path ? <a className="create-path-action" href={path.href} target={path.id === 'personal' ? '_blank' : undefined} rel={path.id === 'personal' ? 'noopener noreferrer' : undefined} title={path.id === 'personal' ? '开始体验（新标签页打开）' : undefined}>{path.action}{path.id === 'personal' ? <ArrowUpRight size={16} /> : <ArrowRight size={16} />}</a> : <button className="create-path-action" onClick={onConsult}>{path.action}<ArrowRight size={16} /></button>}
        </article>)}
      </div>
    </div>
  </section>
}
