# 部署指南

## Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 Vercel 导入仓库
3. 框架预设选择 Next.js
4. 构建命令：`pnpm build`
5. 输出目录：`out`
6. 部署

## Cloudflare Pages 部署

1. 推送代码到 GitHub
2. 在 Cloudflare Pages 创建项目
3. 构建命令：`pnpm build`
4. 输出目录：`out`
5. 部署

## 本地验证

```bash
pnpm build
pnpm start
# 访问 http://localhost:3000
```

## 性能基线

- 首屏加载 ≤ 3s（PC Chrome）
- 3D 帧率 ≥ 60fps（PC）/ ≥ 30fps（移动端）
- 截图生成 ≤ 2s
