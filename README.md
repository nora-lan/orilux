# 曜境 YAOJING · 科技手机概念官网

基于 React、TypeScript、Vite 和 ECharts 的响应式官网。产品、价格与性能参数均为概念演示。

## 本地运行

```sh
npm install
npm run dev
```

## 生产构建

```sh
npm run build
npm run preview
```

## 功能

- CSS 绘制手机外观，支持三种配色切换。
- ECharts 模块化图表：游戏与续航切换、悬停提示、尺寸自适应。
- 三款产品展示，机型、配色、容量选择与价格联动。
- 收藏配置保存在 localStorage，不产生订单。
- 原生 dialog 弹窗、Escape 关闭、移动导航和减少动态效果支持。

## 主要文件

- src/App.tsx：页面、交互与图表逻辑。
- src/App.css：品牌视觉与响应式布局。
- src/index.css：全局样式与字体。

外部字体不可用时回退到系统字体，产品视觉不依赖外部图片服务。

