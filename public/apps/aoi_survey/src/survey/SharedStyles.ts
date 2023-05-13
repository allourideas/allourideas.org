import { css } from 'lit';

export const SharedStyles = css`
  .questionTitle {
    padding: 18px;
    font-size: 22px;
    background-color: var(--md-sys-color-primary);
    color: var(--md-sys-color-on-primary);
    padding: 16px;
    text-align: center;
    margin-top: 32px;
    border-radius: 16px;
    margin-bottom: 0px;
    margin-top: 16px;
    margin-left: 32px;
    margin-right: 32px;
    max-width: 632px;
  }

  [hidden] {
    display: none !important;
  }

  @media (max-width: 960px) {
    .questionTitle {
      margin-bottom: 16px;
    }

    .questionTitle[dark-mode] {

    }
}
`;
