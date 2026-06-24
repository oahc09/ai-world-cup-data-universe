import { test, expect } from '@playwright/test'

test('homepage loads and shows app title', async ({ page }) => {
  await page.goto('/')
  // The title appears in the top nav and sr-only h1
  await expect(page.locator('text=绿茵数据宇宙').first()).toBeVisible({ timeout: 15000 })
})

test('3D canvas renders', async ({ page }) => {
  await page.goto('/')
  // Wait for the WebGL canvas to appear
  await expect(page.locator('canvas')).toBeVisible({ timeout: 15000 })
})

test('view switching works', async ({ page }) => {
  await page.goto('/')
  // Click the radar tab
  await page.click('button:has-text("球队雷达")')
  // URL hash should update
  await expect(page).toHaveURL(/#view=radar/)
  // Click the path tab
  await page.click('button:has-text("夺冠路径")')
  await expect(page).toHaveURL(/#view=path/)
  // Click the map tab
  await page.click('button:has-text("历届地图")')
  await expect(page).toHaveURL(/#view=map/)
  // Back to timeline
  await page.click('button:has-text("3D 时间线")')
  await expect(page).toHaveURL(/#view=timeline/)
})

test('screenshot share button opens modal', async ({ page }) => {
  await page.goto('/')
  await page.click('button:has-text("截图分享")')
  // The modal should appear
  await expect(page.locator('text=截图分享').last()).toBeVisible({ timeout: 5000 })
})
