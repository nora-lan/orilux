

const CSS_STYLES = `
  /* ================= 页面基础重置 ================= */
  .opc-page-wrapper {
    min-height: 100vh;
    background-color: #F8FAFC; /* 使用更偏冷的极浅灰，更能衬托卡片 */
    padding: 80px 24px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    box-sizing: border-box;
    color: #0f172a;
  }
  .opc-page-wrapper * {
    box-sizing: border-box;
  }
  .opc-container {
    max-width: 1280px;
    margin: 0 auto;
  }

  /* ================= 头部标题区 ================= */
  .opc-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 64px;
  }
  .opc-subtitle {
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    color: #64748b;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: block;
  }
  .opc-title {
    font-size: 48px;
    font-weight: 800;
    margin: 0 0 24px 0;
    letter-spacing: -0.03em;
    color: #0f172a;
  }
  .opc-desc {
    font-size: 16px;
    color: #475569;
    margin: 0;
    font-weight: 400;
  }
  .opc-count {
    font-size: 14px;
    color: #94a3b8;
    font-weight: 500;
    margin-bottom: 8px;
    font-variant-numeric: tabular-nums;
  }

  /* ================= 卡片网格 ================= */
  .opc-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 32px;
  }
  @media (min-width: 768px) {
    .opc-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (min-width: 1024px) {
    .opc-grid { grid-template-columns: repeat(3, 1fr); }
  }

  /* ================= 单张卡片 ================= */
  .opc-card {
    background: #ffffff;
    border-radius: 28px; /* 更克制的圆角，显得更高级 */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;
    /* 移除明显的边框，用阴影来界定边缘 */
  }
  .opc-card:hover {
    box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08), 0 8px 16px -8px rgba(0, 0, 0, 0.04);
    transform: translateY(-6px);
  }

  /* 卡片上半部：视觉区 */
  .opc-card-top {
    position: relative;
    height: 300px; /* 增加高度，让视觉更丰满 */
    overflow: hidden;
    padding: 24px 24px 0 24px; /* 给外层加一点内边距，让假窗口更像“悬浮”在上面的 */
  }

  /* 模拟 UI 窗口 (绝对定位) */
  .opc-mock-window {
    position: absolute;
    top: 48px;
    left: 32px;
    right: 0;
    bottom: 0;
    background: #ffffff;
    border-top-left-radius: 12px;
    border-top: 1px solid rgba(241, 245, 249, 0.8);
    border-left: 1px solid rgba(241, 245, 249, 0.8);
    box-shadow: -8px -8px 24px -12px rgba(0,0,0,0.08);
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
  .opc-card:hover .opc-mock-window {
    transform: translate(-6px, -6px);
  }

  /* 增加窗口顶部的控制栏（三个小圆点） */
  .opc-window-bar {
    height: 20px;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: #ffffff;
    border-bottom: 1px solid #f8fafc;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 4px;
    border-top-left-radius: 12px;
    z-index: 10;
  }
  .opc-window-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #e2e8f0;
  }

  /* UI 窗口内部：侧边栏 */
  .opc-window-sidebar {
    width: 56px;
    border-right: 1px solid #f8fafc;
    background: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px 0 24px 0; /* 留出顶部控制栏空间 */
    gap: 20px;
    flex-shrink: 0;
  }
  .opc-sb-icon {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .opc-sb-line {
    width: 20px;
    height: 4px;
    background: #f1f5f9;
    border-radius: 2px;
  }

  /* UI 窗口内部：主内容区 */
  .opc-window-content {
    flex: 1;
    padding: 40px 20px 20px 20px; /* 留出顶部控制栏空间 */
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #ffffff;
  }
  .opc-wc-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }
  .opc-wc-tag {
    font-size: 9px;
    color: #94a3b8;
    letter-spacing: 0.08em;
    font-weight: 600;
    text-transform: uppercase;
  }
  .opc-wc-title {
    font-size: 16px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 20px 0;
    letter-spacing: -0.01em;
  }

  /* 内部卡片 */
  .opc-inner-card {
    background: #f8fafc;
    border: 1px solid #f1f5f9;
    border-radius: 10px;
    padding: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
  }
  .opc-ic-icon {
    width: 32px;
    height: 32px;
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.02);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .opc-ic-text {
    min-width: 0;
  }
  .opc-ic-title {
    font-size: 12px;
    font-weight: 600;
    color: #334155;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .opc-ic-desc {
    font-size: 10px;
    color: #94a3b8;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* 底部小标签组 */
  .opc-tags-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .opc-mini-tag {
    background: #ffffff;
    border: 1px solid #f1f5f9;
    padding: 4px 10px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .opc-mt-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
  }
  .opc-mt-text {
    font-size: 10px;
    color: #64748b;
    font-weight: 500;
    white-space: nowrap;
  }

  /* 卡片下半部：文字说明 */
  .opc-card-bottom {
    padding: 32px;
    background: #ffffff;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .opc-cb-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 12px 0;
    transition: color 0.3s;
    letter-spacing: -0.01em;
  }
  .opc-card:hover .opc-cb-title {
    color: #2563eb;
  }
  .opc-cb-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.6;
    margin: 0;
    flex: 1;
  }
`;

// --- 极简 SVG 图标组件 ---
const IconAgent = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconProject = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const IconBook = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

// --- 数据配置 ---
const CARDS_DATA = [
  {
    id: '01',
    title: '智能体协作工作台',
    desc: '从一句需求开始，连接智能体、学习计划与作品反馈，让下一步行动更清晰。',
    bgColor: '#EFF6FF', 
    themeColor: '#3B82F6', 
    themeBg: '#DBEAFE', 
    windowTitle: 'OPC AGENT WORKSPACE',
    windowSubTitle: '智能体协作工作台',
    Icon: IconAgent,
    innerTitle: '目标理解与任务拆解',
    innerDesc: '学习、实践与反馈串联',
    tags: ['学习、实践与反馈串联', '个人工作记录沉淀'],
  },
  {
    id: '02',
    title: '需求订单与项目协作',
    desc: '围绕需求理解、报价与能力评审，衔接项目推进、成果交付和验收。',
    bgColor: '#EEF2FF', 
    themeColor: '#6366F1',
    themeBg: '#E0E7FF',
    windowTitle: 'OPC PROJECT WORKSPACE',
    windowSubTitle: '需求订单与项目协作',
    Icon: IconProject,
    innerTitle: '需求分类与状态筛选',
    innerDesc: '报价与承接方能力评审',
    tags: ['报价与承接方能力评审', '交付过程与验收记录'],
  },
  {
    id: '03',
    title: 'AI 学习地图',
    desc: '从基础课程到专项实践，按方向规划学习路径，在任务中把方法用起来。',
    bgColor: '#ECFDF5', 
    themeColor: '#10B981',
    themeBg: '#D1FAE5',
    windowTitle: 'OPC LEARNING MAP',
    windowSubTitle: 'AI 学习地图',
    Icon: IconBook,
    innerTitle: '智能体、漫剧等业务方向',
    innerDesc: '阶段课程与个人训练计划',
    tags: ['阶段课程与个人训练计划', '作业提交与反馈复核'],
  },
];

export default function WorkspaceShowcasePage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_STYLES }} />

      <div className="opc-page-wrapper">
        <div className="opc-container">
          
          {/* 头部区域 */}
          <div className="opc-header">
            <div>
              <span className="opc-subtitle">EXPLORE THE WORKSPACE</span>
              <h2 className="opc-title">曜境 OPC 能帮你做什么？</h2>
              <p className="opc-desc">从一个想法出发，连接学习、实践与协作。</p>
            </div>
            <div className="opc-count">01 — 06 / 六种可能</div>
          </div>

          {/* 卡片网格 */}
          <div className="opc-grid">
            {CARDS_DATA.map((card) => {
              const IconComponent = card.Icon;
              return (
                <div key={card.id} className="opc-card">
                  
                  {/* 上半部分：背景与 UI 窗口 */}
                  <div className="opc-card-top" style={{ backgroundColor: card.bgColor }}>
                    <div className="opc-mock-window">
                      
                      {/* 新增：模拟浏览器窗口的三颗小圆点 */}
                      <div className="opc-window-bar">
                        <div className="opc-window-dot"></div>
                        <div className="opc-window-dot"></div>
                        <div className="opc-window-dot"></div>
                      </div>

                      {/* 侧边栏 */}
                      <div className="opc-window-sidebar">
                        <div className="opc-sb-icon" style={{ backgroundColor: card.themeBg, color: card.themeColor }}>
                          <IconComponent />
                        </div>
                        <div className="opc-sb-line"></div>
                        <div className="opc-sb-line"></div>
                      </div>

                      {/* 主内容区 */}
                      <div className="opc-window-content">
                        <div className="opc-wc-header">
                          <span className="opc-wc-tag">{card.windowTitle}</span>
                          <span style={{ color: card.themeColor, fontSize: '10px' }}>✦</span>
                        </div>
                        <h4 className="opc-wc-title">{card.windowSubTitle}</h4>
                        
                        <div className="opc-inner-card">
                          <div className="opc-ic-icon" style={{ color: card.themeColor }}>
                            <IconComponent />
                          </div>
                          <div className="opc-ic-text">
                            <div className="opc-ic-title">{card.innerTitle}</div>
                            <div className="opc-ic-desc">{card.innerDesc}</div>
                          </div>
                        </div>

                        <div className="opc-tags-row">
                          {card.tags.map((tag, i) => (
                            <div key={i} className="opc-mini-tag">
                              <span className="opc-mt-dot" style={{ backgroundColor: card.themeColor }}></span>
                              <span className="opc-mt-text">{tag}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* 下半部分：文字说明 */}
                  <div className="opc-card-bottom">
                    <h3 className="opc-cb-title">{card.title}</h3>
                    <p className="opc-cb-desc">{card.desc}</p>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </>
  );
}