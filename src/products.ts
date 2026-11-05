export type Product = {
  name: string
  english: string
  category: string
  description: string
  features: string[]
  icon: string
  tag?: string
  featured?: boolean
  href?: string
}

// OPC capabilities summarized from its official site and supplied product screens.
export const products: Product[] = [
  { name: '智能体协作工作台', english: 'OPC Agent Workspace', category: '曜境 OPC', description: '从一句需求开始，连接智能体、学习计划与作品反馈，让下一步行动更清晰。', features: ['目标理解与任务拆解', '学习、实践与反馈串联', '个人工作记录沉淀'], icon: 'spark', tag: '智能协作', featured: true, href: 'https://opc.ydcq3.com/app/#login' },
  { name: '需求订单与项目协作', english: 'OPC Project Workspace', category: '曜境 OPC', description: '围绕需求理解、报价与能力评审，衔接项目推进、成果交付和验收。', features: ['需求分类与状态筛选', '报价与承接方案准备', '交付过程与验收记录'], icon: 'network', tag: '项目实践', featured: true, href: 'https://opc.ydcq3.com/app/#login' },
  { name: 'AI 学习地图', english: 'OPC Learning Map', category: '曜境 OPC', description: '从基础课程到专项实践，按方向规划学习路径，在任务中把方法用起来。', features: ['智能体、漫剧等业务方向', '阶段课程与个人训练计划', '作业提交与反馈复核'], icon: 'book', tag: '能力成长', featured: true, href: 'https://opc.ydcq3.com/app/#learning' },
  { name: '作品与成长档案', english: 'OPC Growth Portfolio', category: '曜境 OPC', description: '记录学习、作品与修改过程，让每次实践都能回看，让成长留下具体成果。', features: ['学习与作品记录', '反馈意见与迭代过程', '认证与成长进度查看'], icon: 'growth', featured: true, href: 'https://opc.ydcq3.com/app/#login' },
  { name: '成员能力与共创', english: 'OPC Creator Community', category: '曜境 OPC', description: '通过成员能力库认识社区伙伴，围绕作品与项目连接彼此，探索协作机会。', features: ['成员能力信息', '作品与实践交流', '社区服务与运营支持'], icon: 'people', featured: true, href: 'https://opc.ydcq3.com/app/#login' },
  { name: '工具模型与共享资源', english: 'OPC Resource Hub', category: '曜境 OPC', description: '汇集 AI 工具与模型资料，连接空间、设备等共享资源，按实际需要申请使用。', features: ['通用助手、开发与智能体工具', '文本、图像、视频与语音模型', '共享空间与设备服务'], icon: 'cube', featured: true, href: 'https://opc.ydcq3.com/app/#login' },
  { name: '曜境大模型平台', english: 'ORILUX AI Studio', category: '人工智能', description: '从模型接入到应用编排，让企业 AI 创新更简单。', features: ['多模型统一接入与管理', '企业知识库与检索增强', '可视化智能体工作流'], icon: 'spark', tag: '热门' },
  { name: '弹性云服务器', english: 'Elastic Compute', category: '云基础设施', description: '灵活配置计算资源，从容应对每一次业务增长。', features: ['按需选择计算规格', '自动伸缩与资源编排', '统一管理运行状态'], icon: 'server' },
  { name: '智能数据平台', english: 'Data Intelligence', category: '数据智能', description: '打通数据采集、分析与应用，让每一个决策有据可依。', features: ['多源数据集成', '实时分析与可视化', '指标管理与数据治理'], icon: 'data', tag: '精选' },
  { name: '云原生容器服务', english: 'Cloud Native', category: '云基础设施', description: '从开发到交付，构建更敏捷、更易扩展的应用。', features: ['容器应用编排', '持续集成与发布', '服务观测与日志分析'], icon: 'cube' },
  { name: '企业安全中心', english: 'Security Center', category: '安全与协同', description: '以统一的安全视角，守护业务与数据的每一环。', features: ['访问权限统一管理', '风险监测与事件分析', '操作审计与策略管理'], icon: 'shield' },
  { name: '智能协同工作台', english: 'Intelligent Workspace', category: '安全与协同', description: '连接团队、流程与知识，让协作真正产生价值。', features: ['团队知识空间', '业务流程自动化', '跨应用信息协同'], icon: 'network' },
]
