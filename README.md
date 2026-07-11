# 绿茵数据宇宙 · World Cup Data Universe

一个沉浸式的世界杯数据可视化 Web 应用，以 3D 螺旋时间线为核心，融合雷达对比、夺冠路径、历届地图四大视图，呈现 1930–2022 共 23 届世界杯的完整数据。

## 功能特色

- **3D 螺旋时间线** — Three.js + R3F 构建，23 届世界杯以玻璃发光球体沿金色螺旋轨道排列，支持点击聚焦、自动旋转、陀螺仪控制
- **球队实力雷达** — 六维数据对比（攻击/防守/中场/速度/经验/主场），ECharts 雷达图实时切换球队
- **夺冠路径树状图** — 5 支冠军球队的经典夺冠之路，ECharts tree 可视化 + 统计面板
- **历届举办地地图** — 世界地图 + 金色定位标 + 绿色流动弧线，大洲举办次数统计
- **截图分享** — html2canvas 高清截图 + 二维码 + 水印
- **响应式设计** — 桌面端全功能体验，移动端降级优化（2D 时间轴 / 减少星点 / 关闭自动旋转）

## 技术栈

| 分类 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) + React 18 |
| 3D 渲染 | Three.js 0.142 + @react-three/fiber v8 + @react-three/drei v9 |
| 图表 | ECharts 6 |
| 样式 | Tailwind CSS 3 |
| 测试 | Vitest + Testing Library + Playwright |
| 截图 | html2canvas + qrcode |
| 语言 | TypeScript 5 |

## 快速开始

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 生产构建（输出到 out/）
pnpm build

# 单元测试
pnpm test

# E2E 测试
pnpm test:e2e

# 类型检查
pnpm typecheck
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 项目结构

```
src/
├── app/                 # Next.js App Router
│   ├── globals.css     # 全局样式（宇宙主题、玻璃拟态）
│   ├── layout.tsx      # 根布局 + SEO meta
│   └── page.tsx        # 主页面（视图切换 + 截图分享）
├── components/
│   ├── shell/          # 导航栏、视图切换、过渡动画
│   ├── timeline/       # 3D 时间线场景、节点、螺旋轨道、详情卡片
│   ├── radar/          # 球队雷达对比
│   ├── path/           # 夺冠路径树状图
│   ├── map/            # 历届举办地地图
│   └── share/          # 截图分享弹窗
├── hooks/              # WebGL 检测、移动端检测、自动旋转、视图状态
├── lib/                # 数据类型定义 + JSON 数据源
└── __tests__/          # 单元测试
```

## 数据来源

所有数据为静态 JSON，位于 `src/lib/data/`：
- `worldcups.json` — 23 届世界杯基本信息
- `teams.json` — 10 支球队六维数据
- `championPaths.json` — 5 条夺冠路径（每条 7 场比赛 + 关键事件）
- `hosts.json` — 20 个举办国/城市坐标

## 部署

支持 Vercel / Cloudflare Pages 静态部署，详见 [DEPLOY.md](./DEPLOY.md)。

## License

MIT
