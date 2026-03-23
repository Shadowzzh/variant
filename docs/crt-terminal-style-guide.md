# CRT Terminal Style Guide

> 基于 `biometric-telemetry-monitor.html` 的复古 CRT 终端风格分析

## 风格概述

这是一个完整的**复古 CRT 显示器终端风格**实现，模拟了 80 年代单色 phosphor 显示器的视觉效果。

---

## 核心技巧

### 1. 字体系统

```css
@import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');

body {
  font-family: 'VT323', monospace;
  font-size: 22px;
  line-height: 1.2;
  -webkit-font-smoothing: none;  /* 关键：关闭字体平滑，保持像素感 */
}
```

| 技术 | 作用 |
|------|------|
| **VT323** | Google Fonts 提供的像素化终端字体 |
| **-webkit-font-smoothing: none** | 禁用抗锯齿，保留锐利像素边缘 |

---

### 2. 荧光文字发光

```css
.terminal {
  text-shadow:
    0 0 2px var(--phosphor-main),    /* 内层紧贴光晕 */
    0 0 8px var(--phosphor-glow);    /* 外层扩散光晕 */
}
```

模拟 CRT 屏幕上荧光粉被电子束激发后的发光效果。

---

### 3. 扫描线效果 (Scanlines)

```css
.crt-monitor::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%),
    linear-gradient(90deg,
      rgba(255, 0, 0, 0.06),
      rgba(0, 255, 0, 0.02),
      rgba(0, 0, 255, 0.06)
    );
  background-size:
    100% 4px,    /* 水平扫描线，每 4px 重复 */
    6px 100%;    /* RGB 子像素条纹 */
  z-index: 100;
  pointer-events: none;
}
```

**原理**：第一个渐变在垂直方向上创建"透明/半透明黑"交替的横条纹，模拟 CRT 物理扫描线。

---

### 4. 屏幕暗角 (Vignette)

```css
.crt-monitor::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, 0) 60%,
    rgba(0, 0, 0, 0.6) 100%
  );
  z-index: 101;
  pointer-events: none;
}
```

模拟 CRT 屏幕边缘因电子束衰减而变暗的物理现象。

---

### 5. 屏幕微闪烁 (Flicker)

```css
.flicker-layer {
  position: absolute;
  inset: 0;
  background: rgba(255, 179, 0, 0.02);
  opacity: 0;
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0%   { opacity: 0.01; }
  50%  { opacity: 0.05; }
  100% { opacity: 0.02; }
}
```

模拟旧式显示器不稳定的电压导致的轻微亮度波动。

---

### 6. 扫描线移动动画

```css
.scan-line {
  width: 100%;
  height: 100px;
  background: linear-gradient(
    to bottom,
    rgba(255, 179, 0, 0),
    rgba(255, 179, 0, 0.1) 50%,
    rgba(255, 179, 0, 0)
  );
  animation: scan 8s linear infinite;
}

@keyframes scan {
  0%   { top: -100px; }
  100% { top: 100vh; }
}
```

模拟电子束从上到下的扫描过程。

---

### 7. 开机动画

```css
@keyframes bootUp {
  0%   { opacity: 0; filter: brightness(2) blur(10px); }
  10%  { opacity: 1; filter: brightness(1) blur(0); }
  15%  { opacity: 0; }
  20%  { opacity: 1; }
  100% { opacity: 1; }
}
```

模拟 CRT 显像管预热阶段的闪烁和不稳定。

---

### 8. 光标闪烁

```css
.cursor {
  width: 12px;
  height: 20px;
  background-color: var(--phosphor-main);
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0; }
}
```

使用 `step-end` 产生硬切换效果，而非渐变。

---

### 9. 反色标题效果

```css
.title-inverted {
  background-color: var(--phosphor-main);
  color: var(--bg-deep);
  text-shadow: none;  /* 移除发光，保持清晰 */
}
```

---

## 配色方案

```css
:root {
  --phosphor-main: #ffb300;      /* 主色：磷光黄 */
  --phosphor-dim:  #8a6300;      /* 暗色：用于次要信息 */
  --phosphor-glow: rgba(255, 179, 0, 0.4);  /* 发光 */
  --bg-deep:      #050300;       /* 背景：深褐色，非纯黑 */
}
```

经典琥珀色单色显示器配色，比绿色更显温暖复古。

---

## 层叠结构 (Z-Index)

```
101:  暗角层 (::after)
100:  扫描线层 (::before)
 99:  闪烁层 (flicker-layer)
 98:  扫描移动层 (scan-line)
 10:  内容层 (terminal)
```

所有装饰层都使用 `pointer-events: none` 确保不影响交互。

---

## 可复用的组件模式

### 图表边框装饰

```css
.chart-frame::before,
.chart-frame::after {
  content: '';
  position: absolute;
  width: 4px;
  border-top: 1px solid var(--phosphor-main);
  border-bottom: 1px solid var(--phosphor-main);
}
```

### 进度条内部纹理

```css
.bar-fill::after {
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 2px,
    rgba(5, 3, 0, 0.3) 2px,
    rgba(5, 3, 0, 0.3) 4px
  );
}
```

---

## 资源链接

- **字体**: [VT323 - Google Fonts](https://fonts.google.com/specimen/VT323)
- **参考**: 原设计来源于 [OBSidian 特性追踪面板](https://github.com/jjdmol/OL-Habit-Tracker)
