import { ArrowUpRight } from 'lucide-react'
import { aiTools } from './ai-tools'
import type { AITool } from './ai-tools'
import './ai-tool-cards.css'

export default function AIToolCards({ tools = aiTools }: { tools?: AITool[] }) {
  return <div className="ai-tool-grid" aria-label="AI 工具目录">
    {tools.map(tool => <article className="ai-tool-card" key={tool.id}>
      <div className="ai-tool-card-heading">
        <span className={`ai-tool-logo ai-tool-logo-${tool.id}`}><img src={tool.logo} alt="" width="52" height="52" loading="lazy" /></span>
        <div className="ai-tool-title"><h3>{tool.name}</h3><p>{tool.vendor}</p></div>
        <span className="ai-tool-category">{tool.category}</span>
      </div>
      <p className="ai-tool-description">{tool.description}</p>
      <ul className="ai-tool-tags" aria-label={`${tool.name} 适用场景`}>{tool.features.map(feature => <li key={feature}>{feature}</li>)}</ul>
      <div className="ai-tool-card-footer">
        <p>{tool.platform}<span>官方入口</span></p>
        <div className="ai-tool-actions">
          {tool.href !== tool.downloadHref && <a href={tool.href} target="_blank" rel="noopener noreferrer" className="ai-tool-action-primary" title={`在线使用 ${tool.name}（新标签页）`}>在线使用<ArrowUpRight size={16} aria-hidden="true" /></a>}
          {tool.downloadHref && <a href={tool.downloadHref} target="_blank" rel="noopener noreferrer" className={tool.href === tool.downloadHref ? 'ai-tool-action-primary' : 'ai-tool-action-secondary'} title={`前往 ${tool.name} 官方下载页（新标签页）`}>官方下载<ArrowUpRight size={16} aria-hidden="true" /></a>}
        </div>
      </div>
    </article>)}
  </div>
}
