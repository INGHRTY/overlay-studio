/**
 * 画布尺寸模型
 * ============
 *
 * 以前画布是写死的 16:9(1920×1080):导入 9:16 / 4:3 / 1:1 的口播,画面会被裁切
 * 或填黑边。现在画布跟着导入视频的**真实比例**走:
 *
 *   - 视频元数据到达前 → 用 `DEFAULT_STAGE`(16:9)占位
 *   - 元数据到达后     → 由 `stageFromVideo()` 按真实比例归一化,平滑切换过去
 *
 * 为什么不直接用视频的原始像素(比如 720×1280):
 * 卡片的所有尺寸都是按 1920 这一档调好的 —— 宽度写死 760/640px、锚点内边距 120px、
 * 字号也是按这个档位定的。直接拿 720×1280 当画布,一张 760px 的卡当场撑爆。
 * 归一化到**固定长边**后,同一个比例无论源视频是 720p 还是 4K,画布尺寸都一样,
 * 卡片布局因此是稳定可预期的。
 */

export type StageSize = { w: number; h: number };

/** 画布长边基准:任何比例都归一化到长边 = 1920(16:9 时正好是 1920×1080) */
export const STAGE_LONG_EDGE = 1920;

/** 占位比例:视频元数据到达前用这个(16:9) */
export const DEFAULT_STAGE: StageSize = { w: STAGE_LONG_EDGE, h: 1080 };

/**
 * 按视频真实像素归一化出画布尺寸:**保持原始比例**,长边对齐 `STAGE_LONG_EDGE`。
 *
 * 16:9 → 1920×1080 · 9:16 → 1080×1920 · 4:3 → 1920×1440
 * 1:1  → 1920×1920 · 21:9 → 1920×810
 *
 * 拿不到有效尺寸(还没加载 / 纯音频轨 / 异常值)时退回占位比例,不抛错。
 */
export function stageFromVideo(vw: number, vh: number): StageSize {
  if (!Number.isFinite(vw) || !Number.isFinite(vh) || vw <= 0 || vh <= 0) {
    return DEFAULT_STAGE;
  }
  const k = STAGE_LONG_EDGE / Math.max(vw, vh);
  return { w: Math.round(vw * k), h: Math.round(vh * k) };
}

/** 宽高比(w/h):给需要按比例而不是按绝对尺寸做判断的地方用 */
export function stageRatio(s: StageSize): number {
  return s.h > 0 ? s.w / s.h : 16 / 9;
}

/** 尺寸是否相同(比例没变就不触发重排) */
export function sameStage(a: StageSize, b: StageSize): boolean {
  return a.w === b.w && a.h === b.h;
}
