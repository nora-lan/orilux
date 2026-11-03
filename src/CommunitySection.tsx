import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ArrowUpRight, X } from './icons'

const categories = ['全部动态', '技术分享', '产品更新', '社区活动'] as const
type Category = typeof categories[number]
type CommunityPost = {
  id: string
  category: Exclude<Category, '全部动态'>
  title: string
  summary: string
  readTime: string
  sections: { title: string; text: string }[]
}

const posts: CommunityPost[] = [
  {
    id: 'idea-to-prototype', category: '技术分享', readTime: '约 3 分钟',
    title: '把第一个 AI 想法，变成可验证的原型',
    summary: '从一个具体问题出发，在小范围内尝试，让每一次实践都成为下一次创新的起点。',
    sections: [
      { title: '先找到一个清晰的问题', text: '不用一开始就构建完整平台。试着描述一个经常发生的任务：谁会使用、现在怎样完成、哪一步最费时间。将目标写成一句能够验证的话，例如“从一份会议记录中整理出待办事项”。' },
      { title: '用最小的原型检验想法', text: '准备几份脱敏的示例资料，明确预期输出，再串联输入、处理和结果展示。先验证这个过程是否能解决问题，再逐步补充编辑、反馈和历史记录等能力。' },
      { title: '分享过程，也分享边界', text: '记录有效的提示方式、失败的例子和仍需人工确认的环节。分享时说明适用场景，避免上传个人信息、内部凭证或不应公开的业务数据。一次真实的实践，比一个宏大的设想更容易引发有价值的交流。' },
    ],
  },
  {
    id: 'creative-code-showcase', category: '产品更新', readTime: '约 2 分钟',
    title: 'AI 创作与 Code 开发演示，双双上线',
    summary: '从灵感画面到应用代码，探索两条可交互的 AI 工作路径。',
    sections: [
      { title: '让创作流程看得见', text: 'AI 创作卡片增加了连续动画，展示提示词浮层与创意画面的变化。可以独立暂停、重播，也可以进入“创作体验”，选择分镜、图文或文案示例。' },
      { title: '从需求走向应用预览', text: 'Code 卡片加入开发流程动画。“开发体验”保留了应用名称输入、数据看板与项目管理场景，以及代码和应用预览的切换。切换回动画后，当前页面内填写的内容仍会保留。' },
      { title: '按自己的节奏浏览', text: '两张卡片进入屏幕时播放，离开时暂停；页面右侧的动效开关可以统一控制。它们是官网中的交互演示，不会调用真实模型或部署应用。' },
    ],
  },
  {
    id: 'community-open-topic', category: '社区活动', readTime: '共创议题',
    title: '开放议题：你想交给 AI 的第一件事',
    summary: '带着一个真实场景，聊聊重复工作、理想体验，以及值得尝试的小改变。',
    sections: [
      { title: '一个可以一起讨论的主题', text: '这是一份社区活动内容示例。我们希望从具体的工作片段开始交流：一项重复的整理工作、一段需要不断修改的内容，或一个尚未被满足的小需求。' },
      { title: '准备你的场景卡片', text: '可以按“使用者、任务、目前做法、理想结果”四个部分记录想法。只需说明问题本身，不必提前设计完整的技术方案。用公开资料或虚构样例表达场景，更方便交流。' },
      { title: '把讨论留在可验证的范围', text: '可以一起思考：哪些步骤适合自动化，哪些需要人工确认，怎样判断结果有帮助。本页暂未开放活动报名或评论，具体活动安排将在正式发布后补充。' },
    ],
  },
  {
    id: 'knowledge-first-document', category: '技术分享', readTime: '约 2 分钟',
    title: '让知识库更好用，从整理第一份文档开始',
    summary: '让标题、来源和更新责任清晰起来，为后续检索与协作打好基础。',
    sections: [
      { title: '让文档回答一个明确的问题', text: '用能够被理解的标题说明内容，按主题拆分过长的段落。补充适用范围、必要背景和常见问题，让首次阅读的人也能判断这份资料是否适合当前任务。' },
      { title: '保留来源与更新线索', text: '为资料记录来源、负责人和更新时间。对于有多个版本的内容，明确当前有效版本，并将已失效的信息单独标记，避免相互矛盾的说明混在一起。' },
      { title: '用实际问题检验整理结果', text: '挑选团队经常提出的问题，看看是否能找到对应资料、理解答案并追溯来源。根据这些问题继续改进文档，比单纯增加资料数量更容易发现整理方向。' },
    ],
  },
]

const storageKey = 'yaojing-community-saved'
function readSaved(): string[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '[]')
    return Array.isArray(saved) ? [...new Set(saved.filter((id): id is string => typeof id === 'string' && posts.some(post => post.id === id)))] : []
  } catch { return [] }
}

function Bookmark({ filled }: { filled: boolean }) {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4V4Z" /></svg>
}

export default function CommunitySection() {
  const [category, setCategory] = useState<Category>('全部动态')
  const [saved, setSaved] = useState(readSaved)
  const [savedOnly, setSavedOnly] = useState(false)
  const [selected, setSelected] = useState<CommunityPost | null>(null)
  const [storageNotice, setStorageNotice] = useState('收藏仅保存在此浏览器。')
  const dialogRef = useRef<HTMLDialogElement>(null)
  const savedFilterRef = useRef<HTMLButtonElement>(null)
  const allFilterRef = useRef<HTMLButtonElement>(null)
  const filtered = posts.filter(post => (category === '全部动态' || post.category === category) && (!savedOnly || saved.includes(post.id)))

  useEffect(() => {
    if (!selected) return
    const previous = document.activeElement as HTMLElement | null
    const dialog = dialogRef.current
    dialog?.showModal()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      if (previous?.isConnected) previous.focus({ preventScroll: true })
      else savedFilterRef.current?.focus({ preventScroll: true })
    }
  }, [selected])

  function toggleSave(id: string) {
    const removing = saved.includes(id)
    const next = removing ? saved.filter(item => item !== id) : [...saved, id]
    setSaved(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) }
    catch { setStorageNotice('浏览器未允许保存，收藏仅在当前页面保留。') }
    if (removing && savedOnly && !selected) requestAnimationFrame(() => savedFilterRef.current?.focus({ preventScroll: true }))
  }

  function saveButton(post: CommunityPost) {
    const isSaved = saved.includes(post.id)
    return <button className="community-bookmark" aria-pressed={isSaved} aria-label={`${isSaved ? '取消收藏' : '收藏'}：${post.title}`} onClick={() => toggleSave(post.id)}><Bookmark filled={isSaved} /><span>{isSaved ? '已收藏' : '收藏'}</span></button>
  }

  function browseAll() {
    setSavedOnly(false)
    setCategory('全部动态')
    requestAnimationFrame(() => allFilterRef.current?.focus({ preventScroll: true }))
  }

  function postCard(post: CommunityPost, featured = false) {
    return <article className={featured ? 'community-feature' : 'community-feed-card'} key={post.id}>
      {featured && <div className="community-feature-art" aria-hidden="true"><div className="community-art-grid" /><div className="community-art-orbit" /><span className="community-art-mark">{'{ YJ }'}</span><span className="community-art-chip chip-idea">01 / IDEA</span><span className="community-art-chip chip-build">02 / BUILD</span><span className="community-art-chip chip-share">03 / SHARE</span></div>}
      <div className="community-post-meta"><span className="community-category">{post.category}</span><span className="community-readtime">{post.readTime}</span></div>
      <button className="community-post-open" onClick={() => setSelected(post)} aria-label={`阅读：${post.title}`}><h3>{post.title}</h3><p>{post.summary}</p><span className="community-read-link">阅读全文 <ArrowUpRight size={15} /></span></button>
      <div className="community-post-footer"><span className="community-author"><span aria-hidden="true">Y</span>曜境社区 · 内容示例</span>{saveButton(post)}</div>
    </article>
  }

  return <section className="community-section section" id="community" aria-labelledby="community-title">
    <div className="wrap">
      <nav className="community-breadcrumb" aria-label="面包屑"><a href="/#home">首页</a><span aria-hidden="true">/</span><span aria-current="page">社区动态</span></nav>
      <div className="section-heading community-page-heading"><div><p className="eyebrow">YAOJING COMMUNITY</p><h1 id="community-title">社区动态</h1><p className="community-page-intro">与创造者同行，让灵感持续发生。</p><p>分享每一次探索，连接每一个想法。这里，有技术、有实践，也有同路人。</p></div><a className="community-return" href="/#home">返回首页 <ArrowUpRight size={16} /></a></div>
      <div className="community-toolbar"><div className="community-filters" role="group" aria-label="社区动态分类">{categories.map(item => <button key={item} ref={item === '全部动态' ? allFilterRef : undefined} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="community-saved-filter" ref={savedFilterRef} aria-pressed={savedOnly} onClick={() => setSavedOnly(value => !value)}><Bookmark filled={savedOnly} />我的收藏 <span>{saved.length}</span></button></div>
      <p className="community-result-note" role="status">{savedOnly ? '已收藏' : category} · {filtered.length} 条动态</p>
      {filtered.length ? <div className="community-layout">{postCard(filtered[0], true)}{filtered.length > 1 && <div className="community-feed">{filtered.slice(1).map(post => postCard(post))}</div>}</div> : <div className="community-empty"><Bookmark filled={false} /><h3>{savedOnly ? '这里还没有收藏的动态' : '暂时没有相关动态'}</h3><p>发现感兴趣的内容时，点击收藏，方便下次继续阅读。</p><button onClick={browseAll}>浏览全部动态 <ArrowRight size={16} /></button></div>}
      <p className="community-note">当前为社区内容示例。<span role="status">{storageNotice}</span></p>
    </div>
    {selected && <dialog ref={dialogRef} className="dialog community-dialog" aria-labelledby="community-detail-title" onCancel={() => setSelected(null)} onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) setSelected(null)
    }}><button className="dialog-close" aria-label="关闭社区动态" onClick={() => setSelected(null)}><X size={22} /></button><p className="eyebrow">YAOJING COMMUNITY / {selected.category}</p><h2 id="community-detail-title">{selected.title}</h2><div className="community-detail-meta"><span>曜境社区 · 内容示例</span><span>{selected.readTime}</span></div><p className="community-detail-lead">{selected.summary}</p>{selected.sections.map((part, index) => <div className="community-detail-section" key={part.title}><h3><span>0{index + 1}</span>{part.title}</h3><p>{part.text}</p></div>)}<div className="community-detail-footer">{saveButton(selected)}<span>{storageNotice}</span></div></dialog>}
  </section>
}
