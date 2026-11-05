import { useState } from 'react';

// --- 图标组件 ---
const IconArrowUpRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"></line>
    <polyline points="7 7 17 7 17 17"></polyline>
  </svg>
);

const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// --- 数据配置 ---
const NAV_ITEMS = [
  { id: '01', title: '互联网' },
  { id: '02', title: '零售与电商' },
  { id: '03', title: '智能制造' },
  { id: '04', title: '企业服务' },
];

export default function BusinessScenariosPage() {
  const [activeTab, setActiveTab] = useState('01');

  const styles = {
    pageWrapper: {
      width: '100%',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '60px 24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      display: 'flex',
      justifyContent: 'center',
    },
    container: {
      width: '100%',
      maxWidth: '1200px',
    },
    
    // --- 顶部标题区 ---
    headerSection: {
      marginBottom: '48px',
    },
    topLabel: {
      fontSize: '11px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      color: '#94a3b8',
      textTransform: 'uppercase' as const,
      marginBottom: '16px',
      display: 'block',
    },
    mainTitle: {
      fontSize: '32px',
      fontWeight: 800,
      color: '#0f172a',
      margin: '0 0 16px 0',
      letterSpacing: '-0.02em',
    },
    subTitle: {
      fontSize: '15px',
      color: '#64748b',
      margin: 0,
    },

    // --- 主体大卡片 ---
    mainCard: {
      backgroundColor: '#ffffff',
      borderRadius: '24px',
      boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.03), 0 0 0 1px rgba(0,0,0,0.02)',
      display: 'flex',
      overflow: 'hidden',
      minHeight: '520px',
    },

    // === 左侧导航 ===
    sidebar: {
      width: '200px',
      backgroundColor: '#f8fafc',
      padding: '32px 0',
      borderRight: '1px solid #f1f5f9',
      flexShrink: 0,
    },
    navItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px 32px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative' as const,
      color: '#94a3b8',
      fontSize: '14px',
      fontWeight: 500,
    },
    navItemActive: {
      backgroundColor: '#ffffff',
      color: '#0f172a',
      fontWeight: 600,
    },
    activeIndicator: {
      position: 'absolute' as const,
      left: 0,
      top: '20%',
      bottom: '20%',
      width: '4px',
      backgroundColor: '#3b82f6',
      borderTopRightRadius: '4px',
      borderBottomRightRadius: '4px',
    },
    navId: {
      fontSize: '12px',
      marginRight: '12px',
      opacity: 0.6,
      fontWeight: 400,
      fontFamily: 'monospace',
    },
    navArrow: {
      marginLeft: 'auto',
      color: '#3b82f6',
      opacity: 0,
      transition: 'opacity 0.2s',
    },

    // === 中间内容区 ===
    contentArea: {
      flex: 1,
      padding: '60px 48px',
      display: 'flex',
      flexDirection: 'column' as const,
      borderRight: '1px solid #f8fafc',
    },
    contentTag: {
      display: 'inline-block',
      backgroundColor: '#f0f9ff',
      color: '#0369a1',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: 600,
      marginBottom: '24px',
      width: 'fit-content',
    },
    contentTitle: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#0f172a',
      lineHeight: 1.3,
      marginBottom: '16px',
      letterSpacing: '-0.02em',
    },
    contentDesc: {
      fontSize: '14px',
      color: '#64748b',
      lineHeight: 1.6,
      marginBottom: '32px',
    },
    featureList: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '16px',
      marginBottom: '48px',
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      fontSize: '14px',
      color: '#475569',
    },
    ctaButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#2563eb',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      marginTop: 'auto',
      width: 'fit-content',
    },

    // === 右侧具体项目展示区 ===
    visualArea: {
      flex: 1.2,
      background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)', // 渐变背景
      padding: '48px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
    },
    
    // 应用窗口外壳
    appWindowMock: {
      width: '100%',
      maxWidth: '420px',
      backgroundColor: '#ffffff',
      borderRadius: '16px',
      boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0,0,0,0.05)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column' as const,
    },
    // 应用窗口顶部栏
    appWindowHeader: {
      height: '40px',
      borderBottom: '1px solid #f1f5f9',
      display: 'flex',
      alignItems: 'center',
      padding: '0 16px',
      gap: '6px',
      backgroundColor: '#ffffff',
    },
    windowDot: {
      width: '10px',
      height: '10px',
      borderRadius: '50%',
    },
    // 应用内部主体布局
    appWindowBody: {
      display: 'flex',
      height: '280px',
    },
    // 应用内部侧边栏
    appSide: {
      width: '80px',
      backgroundColor: '#f8fafc',
      borderRight: '1px solid #f1f5f9',
      padding: '16px 8px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    },
    appSideItem: {
      height: '8px',
      borderRadius: '4px',
      backgroundColor: '#e2e8f0',
    },
    // 应用内部主内容 (图表)
    appMain: {
      flex: 1,
      padding: '24px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '20px',
    },
    appMainTitle: {
      fontSize: '14px',
      fontWeight: 700,
      color: '#1e293b',
      marginBottom: '4px',
    },
    appMainSub: {
      fontSize: '11px',
      color: '#94a3b8',
    },
    chartContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      gap: '12px',
      height: '100px',
      marginTop: '10px',
      borderBottom: '1px solid #f1f5f9',
      paddingBottom: '8px',
    },
    barWrapper: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'center',
      gap: '6px',
    },
    bar: {
      width: '100%',
      backgroundColor: '#3b82f6',
      borderRadius: '4px 4px 0 0',
      opacity: 0.8,
    },
    barLabel: {
      fontSize: '9px',
      color: '#cbd5e1',
      fontWeight: 500,
    },
    // 悬浮的工作流标签
    workflowBadge: {
      position: 'absolute' as const,
      bottom: '40px',
      right: '30px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      padding: '8px 16px',
      borderRadius: '100px',
      boxShadow: '0 10px 20px -5px rgba(0,0,0,0.05)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#334155',
      zIndex: 10,
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.container}>
        
        {/* 顶部标题 */}
        <div style={styles.headerSection}>
          <span style={styles.topLabel}>SOLUTIONS FOR EVERY AMBITION</span>
          <h1 style={styles.mainTitle}>深入业务场景，让价值真正落地。</h1>
          <p style={styles.subTitle}>理解不同行业的挑战，探索更适合你的数字化路径。</p>
        </div>

        {/* 主体卡片 */}
        <div style={styles.mainCard}>
          
          {/* 左侧导航 */}
          <div style={styles.sidebar}>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <div 
                  key={item.id} 
                  style={{
                    ...styles.navItem, 
                    ...(isActive ? styles.navItemActive : {})
                  }}
                  onClick={() => setActiveTab(item.id)}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#64748b';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  {isActive && <div style={styles.activeIndicator} />}
                  <span style={styles.navId}>{item.id}</span>
                  {item.title}
                  <div style={{ ...styles.navArrow, opacity: isActive ? 1 : 0 }}>
                    <IconArrowUpRight />
                  </div>
                </div>
              );
            })}
          </div>

          {/* 中间内容区 (完全还原截图) */}
          <div style={styles.contentArea}>
            <div style={styles.contentTag}>互联网解决方案</div>
            <h2 style={styles.contentTitle}>让每一个好想法，快速成为好产品。</h2>
            <p style={styles.contentDesc}>
              覆盖应用开发、弹性部署与用户增长，将更多精力留给产品创新。
            </p>
            
            <div style={styles.featureList}>
              <div style={styles.featureItem}><IconCheck /> 弹性架构，适应业务波峰</div>
              <div style={styles.featureItem}><IconCheck /> 数据驱动，洞察用户需求</div>
              <div style={styles.featureItem}><IconCheck /> AI 融入，探索全新体验</div>
            </div>

            <div style={styles.ctaButton}>
              规划我的业务方案 <IconArrowRight />
            </div>
          </div>

          {/* 右侧：具体的项目/应用 UI 展示 (替代原有的架构图) */}
          <div style={styles.visualArea}>
            
            {/* 模拟一个真实的 SaaS 数据看板应用 */}
            <div style={styles.appWindowMock}>
              {/* 窗口顶部装饰栏 */}
              <div style={styles.appWindowHeader}>
                <div style={{...styles.windowDot, backgroundColor: '#fca5a5'}}></div>
                <div style={{...styles.windowDot, backgroundColor: '#fcd34d'}}></div>
                <div style={{...styles.windowDot, backgroundColor: '#86efac'}}></div>
              </div>

              <div style={styles.appWindowBody}>
                {/* 内部左侧菜单 */}
                <div style={styles.appSide}>
                  <div style={{...styles.appSideItem, backgroundColor: '#3b82f6', width: '32px'}}></div>
                  <div style={styles.appSideItem}></div>
                  <div style={styles.appSideItem}></div>
                  <div style={styles.appSideItem}></div>
                </div>

                {/* 内部主图表区 */}
                <div style={styles.appMain}>
                  <div>
                    <div style={styles.appMainTitle}>运营数据分析</div>
                    <div style={styles.appMainSub}>实时监控业务增长指标</div>
                  </div>

                  <div style={styles.chartContainer}>
                    {/* 画几条 CSS 柱状图 */}
                    <div style={styles.barWrapper}>
                      <div style={{...styles.bar, height: '40%'}}></div>
                      <span style={styles.barLabel}>MON</span>
                    </div>
                    <div style={styles.barWrapper}>
                      <div style={{...styles.bar, height: '70%'}}></div>
                      <span style={styles.barLabel}>TUE</span>
                    </div>
                    <div style={styles.barWrapper}>
                      <div style={{...styles.bar, height: '50%'}}></div>
                      <span style={styles.barLabel}>WED</span>
                    </div>
                    <div style={styles.barWrapper}>
                      <div style={{...styles.bar, height: '90%', backgroundColor: '#2563eb'}}></div>
                      <span style={styles.barLabel}>THU</span>
                    </div>
                    <div style={styles.barWrapper}>
                      <div style={{...styles.bar, height: '60%'}}></div>
                      <span style={styles.barLabel}>FRI</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                     <div style={{ flex: 1, height: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}></div>
                     <div style={{ flex: 1, height: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* 悬浮在右下角的工作流标记 */}
            <div style={styles.workflowBadge}>
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', backgroundColor: '#eff6ff', borderRadius: '50%', color: '#3b82f6' }}>
                <IconCheck />
              </span>
              弹性架构已部署
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}