import {css} from 'lit';

export const displayFlex = css`
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
`;

export const borderBox = css`
  box-sizing: border-box;
`;

export const displayInlineFlex = css`
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
`;

export const horizontal = css`
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
`;

export const vertical = css`
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
`;

export const wrap = css`
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
`;

export const noWrap = css`
  -ms-flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
`;

export const flexFactor = css`
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
`;

export const flexFactorAuto = css`
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
`;

export const flexFactorNone = css`
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
`;

export const displayNone = css`
  display: none !important;
`;

export const flex2 = css`
  -ms-flex: 2;
  -webkit-flex: 2;
  flex: 2;
`;

export const flex3 = css`
  -ms-flex: 3;
  -webkit-flex: 3;
  flex: 3;
`;

export const flex4 = css`
  -ms-flex: 4;
  -webkit-flex: 4;
  flex: 4;
`;

export const flex5 = css`
  -ms-flex: 5;
  -webkit-flex: 5;
  flex: 5;
`;

export const flex6 = css`
  -ms-flex: 6;
  -webkit-flex: 6;
  flex: 6;
`;

export const flex7 = css`
  -ms-flex: 7;
  -webkit-flex: 7;
  flex: 7;
`;

export const flex8 = css`
  -ms-flex: 8;
  -webkit-flex: 8;
  flex: 8;
`;

export const flex9 = css`
  -ms-flex: 9;
  -webkit-flex: 9;
  flex: 9;
`;

export const flex10 = css`
  -ms-flex: 10;
  -webkit-flex: 10;
  flex: 10;
`;

export const flex11 = css`
  -ms-flex: 11;
  -webkit-flex: 11;
  flex: 11;
`;

export const flex12 = css`
  -ms-flex: 12;
  -webkit-flex: 12;
  flex: 12;
`;

export const horizontalReverse = css`
  -ms-flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;
`;

export const verticalReverse = css`
  -ms-flex-direction: column-reverse;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;
`;

export const wrapReverse = css`
  -ms-flex-wrap: wrap-reverse;
  -webkit-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;
`;

export const displayBlock = css`
  display: block;
`;

export const invisible = css`
  visibility: hidden !important;
`;

export const relative = css`
  position: relative;
`;

export const fit = css`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const scroll = css`
  -webkit-overflow-scrolling: touch;
  overflow: auto;
`;

export const fixed = css`
  position: fixed;
`;

export const fixedTop = css`
  top: 0;
  left: 0;
  right: 0;
`;

export const fixedRight = css`
  top: 0;
  right: 0;
  bottom: 0;
`;

export const fixedLeft = css`
  top: 0;
  bottom: 0;
  left: 0;
`;

export const fixedBottom = css`
  right: 0;
  bottom: 0;
  left: 0;
`;

export const startAligned = css`
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
`;

export const centerAligned = css`
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
`;

export const endAligned = css`
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;
`;

export const baseline = css`
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;
`;

export const startJustified = css`
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
`;

export const centerJustified = css`
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
`;

export const endJustified = css`
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
`;

export const aroundJustified = css`
  -ms-flex-pack: distribute;
  -webkit-justify-content: space-around;
  justify-content: space-around;
`;

export const justified = css`
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
`;

export const selfStart = css`
  -ms-align-self: flex-start;
  -webkit-align-self: flex-start;
  align-self: flex-start;
`;

export const selfCenter = css`
  -ms-align-self: center;
  -webkit-align-self: center;
  align-self: center;
`;

export const selfEnd = css`
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;
`;

export const selfStretch = css`
  -ms-align-self: stretch;
  -webkit-align-self: stretch;
  align-self: stretch;
`;

export const selfBaseline = css`
  -ms-align-self: baseline;
  -webkit-align-self: baseline;
  align-self: baseline;
`;

export const startAlignedContent = css`
  -ms-flex-line-pack: start; /* IE10 */
  -ms-align-content: flex-start;
  -webkit-align-content: flex-start;
  align-content: flex-start;
`;

export const endAlignedContent = css`
  -ms-flex-line-pack: end; /* IE10 */
  -ms-align-content: flex-end;
  -webkit-align-content: flex-end;
  align-content: flex-end;
`;

export const centerAlignedContent = css`
  -ms-flex-line-pack: center; /* IE10 */
  -ms-align-content: center;
  -webkit-align-content: center;
  align-content: center;
`;

export const beteweenAlignedContent = css`
  -ms-flex-line-pack: justify; /* IE10 */
  -ms-align-content: space-between;
  -webkit-align-content: space-between;
  align-content: space-between;
`;

export const aroundAlignedContent = css`
  -ms-flex-line-pack: distribute; /* IE10 */
  -ms-align-content: space-around;
  -webkit-align-content: space-around;
  align-content: space-around;
`;