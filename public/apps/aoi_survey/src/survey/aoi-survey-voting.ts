import { css, html, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../@yrpri/common/yp-base-element.js';
import { YpMediaHelpers } from '../@yrpri/common/YpMediaHelpers.js';

import '../@yrpri/common/yp-image.js';

import '@material/web/button/elevated-button.js';

@customElement('aoi-survey-voting')
export class AoiSurveyVoting extends YpBaseElement {
  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  prompt!: AoiPromptData;

  @property({ type: Number })
  voteCount = 0;

  @property({ type: String })
  leftAnswer: string | undefined;

  @property({ type: String })
  rightAnswer: string | undefined;

  timer: number;

  async connectedCallback() {
    super.connectedCallback();
    window.appGlobals.activity('open', 'surveyVoting');
    this.resetTimer();
    this.leftAnswer = this.prompt.left_choice_text;
    this.rightAnswer = this.prompt.right_choice_text;
  }

  resetTimer(){
    this.timer = new Date().getTime();
  }

  static get styles() {
    return [
      super.styles,
      css`
        .buttonContainer md-elevated-button {
          min-width: 100px;
          min-height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 8px;
        }

        .progressBarContainer {
          width: 100%;
          height: 10px;
          background-color: #f0f0f0;
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
        }

        .progressBar {
          height: 100%;
          background-color: #4caf50;
          transition: width 0.4s ease-in-out;
        }

        @media (max-width: 960px) {
        }
      `,
    ];
  }

  renderProgressBar() {
    if (this.earl.configuration) {
      const targetVotes = this.earl.configuration.targetVotes;
      const progressPercentage = Math.min(
        (this.voteCount / targetVotes) * 100,
        100
      );

      return html`
        <div class="progressBarContainer">
          <div class="progressBar" style="width: ${progressPercentage}%;"></div>
        </div>
      `;
    } else {
      return nothing;
    }
  }

  render() {
    return html`
      <div class="topContainer layout vertical wrap center-center">
        ${this.renderProgressBar()}
        <div class="question">
          ${this.question.name}
        </div>
        <div class="buttonContainer layout horizontal wrap center-center">
          ${this.renderProgressBar()}
          <md-elevated-button
            class="leftAnswer"
            @click=${() => this.voteForAnswer('left')}
          >
            ${this.leftAnswer}
          </md-elevated-button>
          <md-elevated-button
            class="rightAnswer"
            @click=${() => this.voteForAnswer('right')}
          >
            ${this.rightAnswer}
          </md-elevated-button>
        </div>
        <div class="layout horizontal wrap center-center">

        </div>
      </div>
    `;
  }

  async voteForAnswer(direction: 'left' | 'right') {
    const voteData: AoiVoteData = {
      time_viewed: new Date().getTime() - this.timer,
      prompt_id: this.prompt.id,
      direction,
      appearance_lookup: this.question.appearance_id
    };

    const postVoteResponse = await window.aoiServerApi.postVote(this.question.id, this.prompt.id, this.language, voteData);

    this.leftAnswer = postVoteResponse.newleft;
    this.rightAnswer = postVoteResponse.newright;

    this.resetTimer();
  }
}
