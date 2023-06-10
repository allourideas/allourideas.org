import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

import '@material/web/fab/fab.js';
import { SharedStyles } from './SharedStyles.js';

@customElement('aoi-survey-intro')
export class AoiSurveyIntro extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Boolean })
  themeHighContrast = false;

  private footer: Element | null = null;
  private footerEnd: Element | null = null;
  private footerTopObserver: IntersectionObserver | null = null;
  private footerEndObserver: IntersectionObserver | null = null;

  async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity('Intro - open');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    window.appGlobals.activity(`Intro - close`);

    if (this.footerTopObserver) {
      this.footerTopObserver.disconnect();
      this.footerTopObserver = null;
    }
    if (this.footerEndObserver) {
      this.footerEndObserver.disconnect();
      this.footerEndObserver = null;
    }
  }

  firstUpdated() {
    this.setupFooterObserver();
  }

  setupFooterObserver() {
    this.footer = this.shadowRoot?.querySelector('#footerStart');
    this.footerEnd = this.shadowRoot?.querySelector('#footerEnd');

    this.footerTopObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.appGlobals.activity('Footer - start is visible');
            this.footerTopObserver?.disconnect();
          }
        });
      },
      { rootMargin: '-200px 0px' }
    );

    this.footerEndObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            window.appGlobals.activity('Footer - end is visible');
            this.footerEndObserver?.disconnect();
          }
        });
      },
      { rootMargin: '0px' }
    );

    if (this.footer) this.footerTopObserver.observe(this.footer);
    if (this.footerEnd) this.footerEndObserver.observe(this.footerEnd);
  }

  get formattedDescription() {
    return (this.earl.welcome_message || '').replace(/(\n)/g, '<br>');
  }

  clickStart() {
    this.fire('startVoting');
    window.appGlobals.activity('Intro - click start');
  }

  clickResults() {
    this.fire('openResults');
  }

  static get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        .footerHtml {
          margin: 16px;
          max-width: 600px;
          line-height: 1.5;
          color: var(--md-sys-color-on-background);
        }

        .footerHtml a {
          color: var(--md-sys-color-on-background);
        }

        .fab {
          margin-top: 16px;
          margin-bottom: 8px;
          cursor: pointer !important;
        }

        .description {
          font-size: 16px;
          letter-spacing: 0.04em;
          line-height: 1.5;
          border-radius: 8px;
          max-width: 600px;
          vertical-align: center;
          margin-bottom: 32px;
          margin-top: 8px;
          padding: 24px;
          color: var(--md-sys-color-primary);
          background-color: var(--md-sys-color-on-primary);
        }

        :host {
        }

        .image {
          width: 632px;
          height: 356px;
          margin-top: 32px;
        }

        .questionTitle[dark-mode] {
          margin-top: 24px;
        }

        @media (max-width: 960px) {
          .image {
            width: 332px;
            height: 187px;
          }

          .description {
            max-width: 300px;
          }

          .footerHtml {
            max-width: 100%;
          }

          .questionTitle[dark-mode] {
          }

          .darkModeButton {
            margin-left: 12px;
            margin-right: 12px;
          }
        }
      `,
    ];
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <yp-image
          class="column image"
          sizing="contain"
          src="${this.earl.logo_url}"
        ></yp-image>
        <div class="questionTitle" ?dark-mode="${this.themeDarkMode}">
          ${this.question.name}
        </div>
        ${this.earl.active
          ? html`
          <md-fab
            extended
            variant="primary"
            class="fab"
            @click="${this.clickStart}"
            .label="${this.t('Start Voting')}"
          ><md-icon slot="icon">thumbs_up_down</md-fab>
        `
          : html`
          <md-fab
            extended
            variant="primary"
            class="fab"
            @click="${this.clickResults}"
            .label="${this.t('Open Results')}"
          ><md-icon slot="icon">grading</md-fab>
        `}
        <div class="description">${this.formattedDescription}</div>
        ${!this.wide
          ? html`
              <div class="layout horizontal center-center">
                ${!this.themeDarkMode
                  ? html`
                      <md-outlined-icon-button
                        class="darkModeButton"
                        @click="${() => this.fire('toggle-dark-mode')}"
                        ><md-icon>dark_mode</md-icon></md-outlined-icon-button
                      >
                    `
                  : html`
                      <md-outlined-icon-button
                        class="darkModeButton"
                        @click="${() => this.fire('toggle-dark-mode')}"
                        ><md-icon>light_mode</md-icon></md-outlined-icon-button
                      >
                    `}
                ${!this.themeHighContrast
                  ? html`
                      <md-outlined-icon-button
                        class="darkModeButton"
                        @click="${() => this.fire('toggle-high-contrast-mode')}"
                        ><md-icon>contrast</md-icon></md-outlined-icon-button
                      >
                    `
                  : html`
                      <md-outlined-icon-button
                        class="darkModeButton"
                        @click="${() => this.fire('toggle-high-contrast-mode')}"
                        ><md-icon
                          >contrast_rtl_off</md-icon
                        ></md-outlined-icon-button
                      >
                    `}
              </div>
            `
          : nothing}
        <div id="footerStart" class="footerHtml">
          ${this.earl.configuration && this.earl.configuration.welcome_html
            ? unsafeHTML(this.earl.configuration.welcome_html)
            : nothing}
        </div>
        <div id="footerEnd"> &nbsp; </div>
      </div>
    `;
  }
}
