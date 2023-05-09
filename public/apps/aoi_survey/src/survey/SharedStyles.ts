import { css } from 'lit';

export const SharedStyles = css`
  .questionTitle {
    padding: 18px;
    font-size: 24px;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    padding: 16px;
    text-align: center;
    margin-top: 32px;
    border-radius: 16px;
    margin-bottom: 8px;
  }

  display[none] {
    display: none !important;
  }
`;
