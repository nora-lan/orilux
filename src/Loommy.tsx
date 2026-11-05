import React, { useState, useRef, useEffect } from 'react';

export default function OriluxShowcasePage() {
  const [inputValue, setInputValue] = useState('');
  const [chatState, setChatState] = useState<'idle' | 'thinking' | 'tool' | 'done'>('idle');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent'; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, chatState]);

  const handleSend = () => {
    if (!inputValue.trim() || (chatState !== 'idle' && chatState !== 'done')) return;
    const userText = inputValue;
    setMessages([{ role: 'user', text: userText }]);
    setInputValue('');
    setChatState('thinking');

    setTimeout(() => {
      setChatState('tool');
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: 'agent',
            text: `我已经为您调用了【深度调研】和【数据分析】技能。\n\n分析报告：\n1. 根据您的需求 "${userText}"，我抓取了最新的市场数据。\n2. 核心指标呈现上升趋势。\n3. 已为您自动生成了一份初步的推广方案文档。`,
          },
        ]);
        setChatState('done');
      }, 2000);
    }, 1500);
  };

  const globalStyles = `
    @keyframes float {
      0% { transform: translateY(0px) rotate(var(--rot)); }
      50% { transform: translateY(-6px) rotate(calc(var(--rot) + 1deg)); }
      100% { transform: translateY(0px) rotate(var(--rot)); }
    }
    @keyframes blink { 50% { opacity: 0; } }
    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
  `;

  const styles = {
    pageWrapper: {
      width: '100%',
      height: '100%',
      minHeight: '560px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative' as const,
      overflow: 'hidden',
      borderRadius: '24px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '40px 20px',
      background: `
        radial-gradient(circle at 10% 20%, rgba(253, 224, 71, 0.4) 0%, transparent 50%),
        radial-gradient(circle at 90% 80%, rgba(187, 247, 208, 0.6) 0%, transparent 50%),
        #f0fdf4
      `,
    },
    mainWindow: {
      position: 'relative' as const,
      zIndex: 10,
      width: '76%',
      maxWidth: '860px',
      height: '445px',
      backgroundColor: 'rgba(255, 255, 255, 0.75)', 
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '20px',
      boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(255,255,255,0.8) inset',
      display: 'flex',
      overflow: 'visible',
    },
    sidebar: {
      width: '170px',
      flexShrink: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRight: '1px solid rgba(226, 232, 240, 0.5)',
      display: 'flex',
      flexDirection: 'column' as const,
      padding: '16px 12px',
      borderTopLeftRadius: '20px',
      borderBottomLeftRadius: '20px',
    },
    logoArea: { display: 'flex', alignItems: 'center', marginBottom: '16px', paddingLeft: '4px' },
    logoText: { fontSize: '16px', fontWeight: 700, color: '#1e293b', letterSpacing: '0.05em', display: 'flex' },
    navItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', color: '#475569', cursor: 'pointer', marginBottom: '2px', transition: 'background 0.2s' },
    navItemActive: { backgroundColor: '#ffffff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', color: '#0f172a', fontWeight: 600 },
    navIcon: { display: 'flex', alignItems: 'center', gap: '6px' },
    
    mainContent: { flex: 1, display: 'flex', flexDirection: 'column' as const, position: 'relative' as const, minWidth: 0, borderTopRightRadius: '20px', borderBottomRightRadius: '20px', overflow: 'hidden' },
    chatArea: { flex: 1, overflowY: 'auto' as const, padding: '32px 32px 90px 32px' },
    inputArea: { position: 'absolute' as const, bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(255,255,255,0.9) 70%, transparent)', padding: '16px 32px 16px 32px', pointerEvents: 'none' },
    
    inputBox: { backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px', boxShadow: '0 2px 8px -2px rgba(0,0,0,0.03)', pointerEvents: 'auto' },
    textarea: { width: '100%', backgroundColor: 'transparent', border: 'none', outline: 'none', resize: 'none' as const, fontSize: '12px', color: '#1e293b', fontFamily: 'inherit', minHeight: '32px' },

    floatCard: {
      position: 'absolute' as const,
      zIndex: 30,
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(255,255,255,1)',
      padding: '12px',
      borderRadius: '14px',
      boxShadow: '0 8px 20px -5px rgba(0,0,0,0.08)',
      width: '130px',
      animation: 'float 6s ease-in-out infinite',
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={styles.pageWrapper}>
        
        <div style={styles.mainWindow}>
          
          {/* 左上角的“数据分析”卡片已删除 */}

          {/* 右上：撰写内容 */}
          <div style={{ ...styles.floatCard, top: '18%', right: '-12%', '--rot': '6deg', animationDelay: '1.5s' } as React.CSSProperties}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>撰写内容</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '8px' }}>从灵感到成稿一步完成</div>
            <div style={{ display: 'flex' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#D93F3F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 9, zIndex: 3 }}>W</div>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#2B579A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 9, zIndex: 2, marginLeft: '-4px' }}>X</div>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#F3A028', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: 9, zIndex: 1, marginLeft: '-4px' }}>P</div>
            </div>
          </div>

          {/* 左下：资料库 (为了平衡视觉，位置稍微上移) */}
          <div style={{ ...styles.floatCard, bottom: '25%', left: '-14%', '--rot': '4deg', animationDelay: '0.8s' } as React.CSSProperties}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>资料库</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '8px' }}>支持海量文件分析</div>
            <div style={{ display: 'flex', gap: '4px' }}>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white' }}>D</div>
              <div style={{ width: 20, height: 20, borderRadius: 4, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: 'white' }}>▶</div>
            </div>
          </div>

          {/* 右下：搭子团 */}
          <div style={{ ...styles.floatCard, bottom: '15%', right: '-12%', '--rot': '-3deg', animationDelay: '2.2s' } as React.CSSProperties}>
            <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1e293b', marginBottom: '2px' }}>搭子团</div>
            <div style={{ fontSize: '9px', color: '#64748b', marginBottom: '8px' }}>每个专业领域都对口</div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
               <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#e2e8f0', zIndex: 2 }}></div>
               <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#cbd5e1', zIndex: 1, marginLeft: '-6px' }}></div>
            </div>
          </div>

          <div style={styles.sidebar}>
            <div style={styles.logoArea}>
              <div style={styles.logoText}>
                ORILUX<span style={{fontWeight: 400, marginLeft: '3px'}}>AI</span>
              </div>
            </div>

            <div style={{ ...styles.navItem, ...styles.navItemActive }}>
              <div style={styles.navIcon}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                新任务
              </div>
              <span style={{ fontSize: 8, color: '#94a3b8', background: '#f1f5f9', padding: '1px 3px', borderRadius: 3 }}>⌘ K</span>
            </div>
            
            <div style={styles.navItem}>
              <div style={styles.navIcon}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v6m0 8v6M8 12h8m-8 4h8m-8-8h8"></path></svg> 搭子·技能·连接器</div>
            </div>
            <div style={styles.navItem}>
              <div style={styles.navIcon}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 定时任务</div>
            </div>
            <div style={styles.navItem}>
              <div style={styles.navIcon}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg> 资料库</div>
            </div>

            <div style={{ marginTop: 12, marginBottom: 4, paddingLeft: 8, display: 'flex', justifyContent: 'space-between', fontSize: 9, fontWeight: 600, color: '#94a3b8' }}>
              <span>任务</span><span>v</span>
            </div>
            <div style={{ paddingLeft: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span style={{ fontSize: 10, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>AI产品的推广方案</span>
              <span style={{ fontSize: 10, color: '#64748b', cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>摄影工作室网站搭建</span>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: 8, borderTop: '1px solid rgba(226, 232, 240, 0.6)', display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><span style={{ color: '#f43f5e' }}>♥</span> 爱运动的沸沸</div>
              <div style={{ cursor: 'pointer' }}>⚙</div>
            </div>
          </div>

          <div style={styles.mainContent}>
            <div style={{ position: 'absolute', top: '16px', left: '20px', color: '#94a3b8', cursor: 'pointer' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
            </div>

            <div style={styles.chatArea}>
              {messages.length === 0 ? (
                <div style={{ animation: 'fadeInUp 0.4s ease-out', position: 'relative' }}>
                  <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', marginBottom: '6px', display: 'flex', alignItems: 'center' }}>
                    好哒~我来帮你看看
                    <span style={{ width: '2px', height: '16px', backgroundColor: '#0f172a', marginLeft: '3px', animation: 'blink 1s step-end infinite' }}></span>
                  </h1>
                  <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px', maxWidth: '80%' }}>
                    我是 ORILUX AI 智能助手，软萌贴心、靠谱稳重，帮你温柔搞定办公任务
                  </p>
                  
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
                    <button style={{ padding: '5px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '10px', color: '#334155', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                       <span>📄</span> 文件处理
                    </button>
                    <button style={{ padding: '5px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '10px', color: '#334155', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                       <span style={{ color: '#10b981', fontWeight: 'bold' }}>X</span> Excel/数据处理
                    </button>
                    <button style={{ padding: '5px 10px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '100px', fontSize: '10px', color: '#334155', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.02)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                       <span>🔍</span> 深度调研
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {messages.map((msg, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', animation: 'fadeInUp 0.3s ease-out' }}>
                      <div style={{
                        maxWidth: '85%', padding: '8px 12px', borderRadius: '10px', fontSize: '11px', lineHeight: 1.5,
                        backgroundColor: msg.role === 'user' ? '#0f172a' : '#f8fafc',
                        color: msg.role === 'user' ? '#ffffff' : '#334155',
                        borderTopRightRadius: msg.role === 'user' ? '2px' : '10px',
                        borderTopLeftRadius: msg.role === 'agent' ? '2px' : '10px',
                        whiteSpace: 'pre-wrap',
                        border: msg.role === 'agent' ? '1px solid #f1f5f9' : 'none'
                      }}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {chatState === 'thinking' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b', background: '#f8fafc', padding: '6px 10px', borderRadius: '10px', borderTopLeftRadius: '2px', width: 'fit-content', border: '1px solid #f1f5f9', animation: 'fadeInUp 0.3s ease-out' }}>
                       <div style={{ display: 'flex', gap: '3px' }}>
                         <div style={{ width: '3px', height: '3px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.32s' }}></div>
                         <div style={{ width: '3px', height: '3px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both', animationDelay: '-0.16s' }}></div>
                         <div style={{ width: '3px', height: '3px', backgroundColor: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out both' }}></div>
                       </div>
                       ORILUX 正在思考...
                    </div>
                  )}

                  {chatState === 'tool' && (
                    <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', width: 'fit-content', animation: 'fadeInUp 0.3s ease-out' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#1e293b', fontWeight: 600, marginBottom: '6px' }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></span>
                        正在自动执行工作流
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                          <span style={{ color: '#10b981' }}>✓</span> 解析用户意图
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2563eb', fontWeight: 500 }}>
                          <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>↻</span> 调用工具: [数据分析] 与 [深度调研]
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div style={styles.inputArea}>
              <div style={styles.inputBox}>
                <textarea
                  style={styles.textarea}
                  placeholder="今天想做点什么？ /调用技能与指令"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2px' }}>
                  <div style={{ display: 'flex', gap: '10px', color: '#94a3b8' }}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: '#94a3b8' }}>
                    <button 
                      onClick={handleSend}
                      disabled={!inputValue.trim() || (chatState !== 'idle' && chatState !== 'done')}
                      style={{ 
                        padding: '4px', borderRadius: '4px', border: 'none', cursor: inputValue.trim() ? 'pointer' : 'not-allowed',
                        backgroundColor: inputValue.trim() ? '#0f172a' : '#e2e8f0',
                        color: inputValue.trim() ? 'white' : '#94a3b8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px', fontSize: '9px', color: '#94a3b8', padding: '0 4px' }}>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', gap: '3px', alignItems: 'center', padding: 0 }}>📁 选择工作目录 v</button>
                <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', display: 'flex', gap: '3px', alignItems: 'center', padding: 0 }}>⏱ 默认权限</button>
                <div style={{ flex: 1 }}></div>
                <div style={{ color: '#cbd5e1' }}>ORILUX 返回的内容由 AI 生成，请注意甄别</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}