import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';

import '../yp-magic-text/yp-magic-text.js';
import '@material/mwc-icon';

@customElement('yp-post-card-add')
export class YpPostCardAdd extends YpBaseElement {
  @property({ type: Boolean })
  disableNewPosts = false;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Number })
  index: number | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          margin-top: 8px;
          margin-bottom: 8px;
          width: 100%;
        }

        .postCard {
          width: 100%;
          min-height: 75px;
          margin-top: 8px;
          padding: 16px;
          background-color: var(--mdc-theme-secondary);
          color: var(--mdc-theme-on-secondary);
          font-size: var(--mdc-typography-headline1-font-size);
          cursor: pointer;
          margin-bottom: 8px;
          text-align: center;
          max-width: 310px;
        }

        mwc-icon {
          --mdc-icon-size: 64px;
          color: var(--mdc-theme-on-secondary);
        }

        .header {
          padding: 0;
          margin: 0;
          padding-top: 16px;
        }

        .half {
          width: 50%;
        }

        .addText {
          padding-left: 0;
          padding-right: 8px;
        }

        mwc-icon {
          width: 64px;
          height: 64px;
          margin-right: 8px;
          margin-left: 0;
        }

        .addNewIdeaText {
          font-size: 26px;
        }

        .closed {
          font-size: 22px;
        }

        div[disabled] {
          background-color: #888;
          cursor: initial;
        }

        mwc-icon[disabled] {
        }

        @media (max-width: 420px) {
          :host {
            margin-top: 0;
          }

          .postCard {
            width: 100%;
            margin-left: 0;
            margin-right: 0;
            margin-bottom: 4px;
            padding: 16px;
          }

          .addNewIdeaText {
            font-size: 24px;
            width: auto;
          }

          mwc-icon {
            height: 48px;
            width: 48px;
          }

          .closed {
            font-size: 20px;
          }
        }

        @media (max-width: 420px) {
          .postCard {
            max-width: 300px;
          }
        }

        .container {
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return this.group
      ? html`
          <div
            ?disabled="${this.disableNewPosts}"
            class="postCard shadow-elevation-8dp shadow-transaction layout vertical center-center"
            aria-disabled="${this.disableNewPosts}"
            role="button"
            aria-label="${this.t('post.add_new')}"
            tabindex="0"
            @keydown="${this._keyDown}"
            @click="${this._newPost}">
            <div class="layout horizontal center-center addNewIdeaText">
              <mwc-icon>lightbulb_outline</mwc-icon>
              ${this.disableNewPosts
                ? html`
                    <div class="flex addText closed">
                      ${!this.group.configuration
                        .alternativeTextForNewIdeaButtonClosed
                        ? html` ${this.t('closedForNewPosts')} `
                        : html`
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              text-only
                              .content="${this.group.configuration
                                .alternativeTextForNewIdeaButtonClosed}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButtonClosed"></yp-magic-text>
                          `}
                    </div>
                  `
                : html`
                    <div class="flex addText">
                      ${!this.group.configuration
                        .alternativeTextForNewIdeaButtonClosed
                        ? html` ${this.t('post.add_new')} `
                        : html`
                            <yp-magic-text
                              .contentId="${this.group.id}"
                              .extraId="${this.index}"
                              text-only
                              .content="${this.group.configuration
                                .alternativeTextForNewIdeaButton}"
                              .contentLanguage="${this.group.language}"
                              class="ratingName"
                              textType="alternativeTextForNewIdeaButton"></yp-magic-text>
                          `}
                    </div>
                  `}
            </div>
          </div>
        `
      : nothing;
  }

  _keyDown(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this._newPost();
    }
  }

  _newPost() {
    if (!this.disableNewPosts) {
      this.fire('new-post');
    }
  }
}
