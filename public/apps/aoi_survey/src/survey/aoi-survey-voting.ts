import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';

import { SharedStyles } from './SharedStyles.js';

@customElement('aoi-survey-voting')
export class AoiSurveyVoting extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  firstPrompt!: AoiPromptData;

  @property({ type: Number })
  promptId!: number;

  @property({ type: Number })
  voteCount = 0;

  @property({ type: String })
  leftAnswer: string | undefined;

  @property({ type: String })
  rightAnswer: string | undefined;

  @property({ type: String })
  appearanceLookup!: string;

  timer: number;

  async connectedCallback() {
    this.leftAnswer = this.firstPrompt.left_choice_text;
    this.rightAnswer = this.firstPrompt.right_choice_text;
    this.promptId = this.firstPrompt.id;
    this.appearanceLookup = this.question.appearance_id;

    super.connectedCallback();
    window.appGlobals.activity('open', 'surveyVoting');
    this.resetTimer();
  }

  resetTimer() {
    this.timer = new Date().getTime();
  }

  static get styles() {
    return [
      super.styles,
      SharedStyles,
      css`
        :host {
          --md-elevated-button-container-color: var(--md-sys-color-surface);
        }

        .buttonContainer md-elevated-button {
          margin: 8px;
          width: 400px;
          --md-elevated-button-container-height: 120px;
        }

        .progressBarContainer {
          width: 450px;
          height: 10px;
          background-color: var(--md-sys-color-on-primary);
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
          margin-top: 0px;
        }

        .progressBar {
          height: 100%;
          background-color: var(--md-sys-color-primary);
          transition: width 0.4s ease-in-out;
        }

        .progressBarText {
          font-size: 12px;
          text-align: right;
          padding-top: 4px;
          color: var(--md-sys-color-secondary);
          width: 450px;
        }

        .or {
          font-size: 22px;
          padding: 8px;
          color: var(--md-sys-color-secondary);
        }

        .questionTitle {
          margin-bottom: 16px;
          margin-top: 16px;
          margin-left: 32px;
          margin-right: 32px;
        }

        .newIdeaButton {
          margin-top: 16px;
        }

        .buttonContainer {
          margin-top: 16px;
        }

        @media (max-width: 960px) {
          .buttonContainer md-elevated-button {
            margin: 8px;
            width: 100%;
            margin-right: 32px;
            margin-left: 32px;
            --md-elevated-button-container-height: 100px;
          }

          .progressBarContainer {
            width: 80%;
          }

          .progressBarText {
            width: 80%;
          }

          .or {
            font-size: 22px;
            padding: 4px;
            color: var(--md-sys-color-secondary);
          }
        }
      `,
    ];
  }

  renderProgressBar() {
    if (this.earl.configuration) {
      const targetVotes = this.earl.configuration.targetVotes;
      const progressPercentage = Math.min(
        (this.question.visitor_votes / targetVotes) * 100,
        100
      );

      return html`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${progressPercentage}%;"></div>
        </div>
        <div class="progressBarText">
          ${this.question.visitor_votes} ${this.t('votes of')} ${targetVotes}
          ${this.t('target')}
        </div>
      `;
    } else {
      return nothing;
    }
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        <div class="questionTitle">${this.question.name}</div>
        ${this.renderProgressBar()}
        <div class="buttonContainer layout horizontal wrap center-center">
          <md-elevated-button
            class="leftAnswer"
            @click=${() => this.voteForAnswer('left')}
          >
            ${this.leftAnswer}
          </md-elevated-button>
          <span class="or">${this.t('or')}</span>
          <md-elevated-button
            class="rightAnswer"
            @click=${() => this.voteForAnswer('right')}
          >
            ${this.rightAnswer}
          </md-elevated-button>
        </div>
        <md-outlined-button class="newIdeaButton">
          ${this.t('Add your own answer')}
        </md-outlined-button>
        <div class="layout horizontal wrap center-center"></div>
      </div>
    `;
  }

  async voteForAnswer(direction: 'left' | 'right') {
    const voteData: AoiVoteData = {
      time_viewed: new Date().getTime() - this.timer,
      prompt_id: this.promptId,
      direction,
      appearance_lookup: this.appearanceLookup,
    };

    const postVoteResponse = await window.aoiServerApi.postVote(
      this.question.id,
      this.promptId,
      this.language,
      voteData
    );

    this.leftAnswer = postVoteResponse.newleft;
    this.rightAnswer = postVoteResponse.newright;

    this.promptId = postVoteResponse.prompt_id;
    this.appearanceLookup = postVoteResponse.appearance_lookup;

    this.question.visitor_votes += 1;
    this.requestUpdate();

    this.resetTimer();
  }
}
