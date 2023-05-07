import {css} from 'lit';

import {
  displayFlex,
  displayInlineFlex,
  horizontal,
  vertical,
  wrap,
  noWrap,
  flexFactor,
  flexFactorAuto,
  flexFactorNone,
  displayNone,
  flex2,
  flex3,
  flex4,
  flex5,
  flex6,
  flex7,
  flex8,
  flex9,
  flex10,
  flex11,
  flex12,
  horizontalReverse,
  verticalReverse,
  wrapReverse,
  displayBlock,
  invisible,
  relative,
  fit,
  scroll,
  fixed,
  fixedBottom,
  fixedLeft,
  fixedRight,
  fixedTop,
  startAligned,
  centerAligned,
  endAligned,
  baseline,
  startJustified,
  centerJustified,
  aroundJustified,
  endJustified,
  justified,
  selfStart,
  selfBaseline,
  selfCenter,
  selfEnd,
  selfStretch,
  startAlignedContent,
  centerAlignedContent,
  aroundAlignedContent,
  beteweenAlignedContent,
  endAlignedContent,
} from './literals';

export const Layouts = css`
  .layout.horizontal,
  .layout.vertical {
    ${displayFlex}
  }
  .layout.inline {
    ${displayInlineFlex}
  }
  .layout.horizontal {
    ${horizontal}
  }
  .layout.vertical {
    ${vertical}
  }
  .layout.wrap {
    ${wrap}
  }
  .layout.no-wrap {
    ${noWrap}
  }
  .layout.center,
  .layout.center-center {
    ${centerAligned}
  }
  .layout.center-justified,
  .layout.center-center {
    ${centerJustified}
  }
  .flex {
    ${flexFactor}
  }
  .flex-auto {
    ${flexFactorAuto}
  }
  .flex-none {
    ${flexFactorNone}
  }
  .none {
    ${displayNone}
  }
`;

export const Factors = css`
  .flex,
  .flex-1 {
    ${flexFactorAuto}
  }

  .flex-2 {
    ${flex2}
  }

  .flex-3 {
    ${flex3}
  }

  .flex-4 {
    ${flex4}
  }

  .flex-5 {
    ${flex5}
  }

  .flex-6 {
    ${flex6}
  }

  .flex-7 {
    ${flex7}
  }

  .flex-8 {
    ${flex8}
  }

  .flex-9 {
    ${flex9}
  }

  .flex-10 {
    ${flex10}
  }

  .flex-11 {
    ${flex11}
  }

  .flex-12 {
    ${flex12}
  }
`;

export const ReverseLayouts = css`
  .layout.horizontal-reverse,
  .layout.vertical-reverse {
    ${displayFlex}
  }

  .layout.horizontal-reverse {
    ${horizontalReverse}
  }

  .layout.vertical-reverse {
    ${verticalReverse}
  }

  .layout.wrap-reverse {
    ${wrapReverse}
  }
`;

export const Positioning = css`
  .block {
    ${displayBlock}
  }

  [hidden] {
    ${displayNone}
  }

  .invisible {
    ${invisible}
  }

  .relative {
    ${relative}
  }

  .fit {
    ${fit}
  }

  body.fullbleed {
    margin: 0;
    height: 100vh;
  }

  .scroll {
    ${scroll}
  }

  /* fixed position */
  .fixed-bottom,
  .fixed-left,
  .fixed-right,
  .fixed-top {
    ${fixed}
  }

  .fixed-top {
    ${fixedTop}
  }

  .fixed-right {
    ${fixedRight}
  }

  .fixed-bottom {
    ${fixedBottom}
  }

  .fixed-left {
    ${fixedLeft}
  }
`;

export const Alignment = css`
  .layout.start {
    ${startAligned}
  }

  .layout.center,
  .layout.center-center {
    ${centerAligned}
  }

  .layout.end {
    ${endAligned}
  }

  .layout.baseline {
    ${baseline}
  }

  .layout.start-justified {
    ${startJustified}
  }

  .layout.center-justified,
  .layout.center-center {
    ${centerJustified}
  }

  .layout.end-justified {
    ${endJustified}
  }

  .layout.around-justified {
    ${aroundJustified}
  }

  .layout.justified {
    ${justified}
  }

  .self-start {
   ${selfStart}

  .self-center {
   ${selfCenter}
  }

  .self-end {
    ${selfEnd}
  }

  .self-stretch {
   ${selfStretch}
  }

  .self-baseline {
   ${selfBaseline}
  }

  .layout.start-aligned {
   ${startAlignedContent}
  }

  .layout.end-aligned {
    ${endAlignedContent}
  }

  .layout.center-aligned {
   ${centerAlignedContent}
  }

  .layout.between-aligned {
    ${beteweenAlignedContent}
  }

  .layout.around-aligned {
    ${aroundAlignedContent}
  }
`;