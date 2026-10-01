import { createContext, useContext, type ReactNode } from "react";
import { DEFAULT_STAGE, type StageSize } from "./stage";

/**
 * 画布尺寸下发通道
 * ----------------
 * 画布不再是常量:它跟着导入视频的真实比例变(见 stage.ts)。
 * Canvas、ExportView 以及卡片交互壳都要读同一份尺寸,所以走 Context 而不是
 * 各处 import 常量 —— 否则任何一处继续 import 静态值,就会出现「画布变了、
 * 某处还按 16:9 算」的错位。
 */
const StageCtx = createContext<StageSize>(DEFAULT_STAGE);

export function StageProvider({
  size,
  children,
}: {
  size: StageSize;
  children: ReactNode;
}) {
  return <StageCtx.Provider value={size}>{children}</StageCtx.Provider>;
}

/** 当前画布尺寸(逻辑像素)。没包 Provider 时退回占位 16:9。 */
export function useStage(): StageSize {
  return useContext(StageCtx);
}
