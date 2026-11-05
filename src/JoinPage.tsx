import { useState } from 'react'
import { ArrowRight, ArrowUpRight } from './icons'
import BrandLogoSvg from './BrandLogoSvg'
import MemberPosterDialog from './MemberPosterDialog'
import ParticleLogo from './ParticleLogo'
import './member-poster.css'

const opcUrl = 'https://opc.ydcq3.com/official/#capabilities'
const filters = ['全部伙伴', '智能体召唤师', 'AI 影像炼金师', '提示法师', '更多创意'] as const
type Filter = typeof filters[number]

// Names, titles and mottos transcribed from the supplied nine-page member posters.
const members: { name: string; role: string; motto: string; group: Filter; page: number }[] = [
  { name: '温浩通', role: '智能体召唤师', motto: '业精于勤，行成于思。', group: '智能体召唤师', page: 1 },
  { name: '高紫慧', role: '模秘', motto: '不啻微芒，造炬成阳。', group: '更多创意', page: 2 },
  { name: '田子瑶', role: 'AI 影像炼金师', motto: '澹泊明志，宁静致远。', group: 'AI 影像炼金师', page: 3 },
  { name: '赵赛柯', role: '提示法师', motto: '驭势而行，逢时敢为。', group: '提示法师', page: 4 },
  { name: '谭紫佳', role: '提示法师', motto: '锲而不舍，金石可镂。', group: '提示法师', page: 5 },
  { name: '张莹', role: '价值解构师', motto: '山不让尘，川不辞盈。', group: '更多创意', page: 6 },
  { name: '李政杨', role: 'AI 影像炼金师', motto: '千里之行，始于足下。', group: 'AI 影像炼金师', page: 7 },
  { name: '孟令厚', role: '智能体召唤师', motto: '道阻且长，行则将至。', group: '智能体召唤师', page: 8 },
  { name: '张子怡', role: '故事织梦师', motto: '功不唐捐，玉汝于成。', group: '更多创意', page: 9 },
]

export default function JoinPage({ motionEnabled }: { motionEnabled: boolean }) {
  const [filter, setFilter] = useState<Filter>('全部伙伴')
  const [selectedPage, setSelectedPage] = useState<number | null>(null)
  const visibleMembers = members.filter(member => filter === '全部伙伴' || member.group === filter)
  const selectedIndex = visibleMembers.findIndex(member => member.page === selectedPage)

  return <div className="join-page">
    <section className="join-intro" id="join-top" aria-labelledby="join-title">
      <div className="join-aurora" aria-hidden="true" />
      <div className="join-heading wrap">
        <p className="join-kicker"><span /> ORILUX AI · OPC COMMUNITY</p>
        <h1 id="join-title">加入我们<span>让每一个想法，<br className="join-mobile-break" />都有同行者。</span></h1>
        <p className="join-lead">与超级个体相遇，让创造力彼此连接。</p>
        <a className="join-scroll" href="#opc-members">认识社区伙伴 <ArrowRight size={17} /></a>
      </div>
      <div className="join-feature wrap">
        <div className="join-feature-copy">
          <p className="join-kicker">INDEPENDENT MINDS. SHARED POSSIBILITIES.</p>
          <h2>曜境 OPC<br />超级个体共创中心</h2>
          <p>从一个灵感，到一次实践。<br />在这里，与有想法、有热爱的人，一起探索 AI 的更多可能。</p>
          <a href={opcUrl} target="_blank" rel="noopener noreferrer">探索曜境 OPC <ArrowUpRight size={18} /></a>
        </div>
        <div className="join-feature-art" aria-hidden="true">
          <span className="join-light-orbit orbit-one" /><span className="join-light-orbit orbit-two" /><span className="join-light-orbit orbit-three" />
          <div className="join-art-logo"><BrandLogoSvg /></div>
          <span className="join-art-label">ONE PERSON. INFINITE POSSIBILITIES.</span>
        </div>
      </div>
      <div className="join-bridge wrap"><span>独立创造</span><i /><span>彼此启发</span><i /><span>共同成长</span></div>
    </section>

    <section className="join-members" id="opc-members" aria-labelledby="join-members-title">
      <div className="wrap">
        <div className="join-members-heading">
          <div><p className="join-kicker">MEET OUR COMMUNITY</p><h2 id="join-members-title">和创造者，<span>一起向前。</span></h2><p>不同的热爱，同样的创造力。认识曜境 OPC 社区里的每一位伙伴。</p></div>
          <div className="join-member-count"><strong>09</strong><span>位社区伙伴<br />各有热爱，各自闪光</span></div>
        </div>
        <div className="join-filter-bar">
          <div className="join-filters" role="group" aria-label="按成员称号筛选">
            {filters.map(item => <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}
          </div>
          <p aria-live="polite" aria-atomic="true">展示 {visibleMembers.length} 位伙伴</p>
        </div>
        <div className="join-member-grid">
          {visibleMembers.map(member => <article className="join-member-card" key={member.page}>
            <button type="button" className="join-member-poster" data-selected={selectedPage === member.page} onClick={() => setSelectedPage(member.page)} aria-label={`放大查看${member.name}的个人海报`} aria-haspopup="dialog">
              <img src={`/media/opc-members/poster-${member.page}.jpg`} alt={`${member.name} · ${member.role}个人海报`} width="1123" height="1600" loading="lazy" decoding="async" />
              <span className="join-poster-action"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5" /></svg>查看个人海报</span>
            </button>
            <div className="join-member-info"><div><h3>{member.name}</h3><p>{member.role}</p></div><span className="join-member-index">{String(member.page).padStart(2, '0')}</span></div>
            <p className="join-member-motto">{member.motto}</p>
          </article>)}
        </div>
      </div>
    </section>

    <section className="join-invitation" id="join-invitation" aria-labelledby="join-invitation-title">
      <div className="wrap join-invitation-inner">
        <div className="join-invitation-copy">
          <p className="join-kicker"><span /> YOUR NEXT CHAPTER</p>
          <h2 id="join-invitation-title">让下一个名字，<br /><span>是你。</span></h2>
          <p className="join-invitation-description">带着你的想法与热爱，和我们一起，<br className="join-mobile-break" />把可能变成作品。</p>
          <a href={opcUrl} target="_blank" rel="noopener noreferrer">了解社区与入驻方式 <span><ArrowUpRight size={19} /></span></a>
        </div>
        <ParticleLogo motionEnabled={motionEnabled} />
      </div>
    </section>
    {selectedIndex >= 0 && <MemberPosterDialog members={visibleMembers} selectedIndex={selectedIndex} onSelect={setSelectedPage} onClose={() => setSelectedPage(null)} />}
  </div>
}
