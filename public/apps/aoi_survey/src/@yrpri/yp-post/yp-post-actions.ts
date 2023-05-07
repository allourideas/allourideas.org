import { html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/iconbutton/filled-tonal-link-icon-button.js';


import { ifDefined } from 'lit/directives/if-defined.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';
import { MdOutlinedIconButton } from '@material/web/iconbutton/outlined-icon-button.js';
import { Layouts } from '../../flexbox-literals/classes.js';

@customElement('yp-post-actions')
export class YpPostActions extends YpBaseElement {
  @property({ type: Object })
  post!: YpPostData;

  @property({ type: String })
  endorsementButtons = 'hearts';

  @property({ type: Boolean })
  headerMode = false;

  @property({ type: Boolean })
  forceSmall = false;

  @property({ type: Number })
  endorseValue = 0;

  @property({ type: Boolean })
  allDisabled = false;

  @property({ type: String })
  disabledTitle: string | undefined;

  @property({ type: Boolean })
  floating = false;

  @property({ type: Boolean })
  votingDisabled = false;

  @property({ type: Boolean })
  smallerIcons = false;

  @property({ type: Number })
  maxNumberOfGroupVotes: number | undefined;

  @property({ type: Number })
  numberOfGroupVotes: number | undefined;

  @property({ type: Boolean })
  forceShowDebate = false;

  connectedCallback() {
    super.connectedCallback();
    this.addGlobalListener(
      'yp-got-endorsements-and-qualities',
      this._updateEndorsementsFromSignal.bind(this)
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener(
      'yp-got-endorsements-and-qualities',
      this._updateEndorsementsFromSignal.bind(this)
    );
  }

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    if (this.endorsementButtons) {
      this.$$('#actionDown')!.className += ' ' + 'default-buttons-color';
      this.$$('#actionUp')!.className += ' ' + 'default-buttons-color';
    }
  }

  static get styles() {
    return [
      super.styles,
      Layouts,
      css`
        :host {
          display: block;
        }

        .action-bar {
          position: absolute;
        }

        .action-bar[floating] {
          position: relative;
        }

        .action-bar-small {
          margin-top: 8px;
          position: absolute;
          width: 100%;
          bottom: -32px;
          vertical-align: bottom !important;
        }

        .action-text {
          font-size: 16px;
          text-align: left;
          vertical-align: bottom;
          padding-top: 8px;
          margin-top: 4px;
        }

        .action-icon {
        }

        .action-up {
          color: var(--primary-up-color-lighter, rgba(0, 153, 0, 0.55));
        }

        .action-down {
          color: var(--primary-down-color-lighter, rgba(153, 0, 0, 0.55));
        }

        .default-buttons-color {
          color: var(--default-endorsement-buttons-color, #656565);
        }

        .default-buttons-up-selected {
          color: var(--accent-color, rgba(0, 0, 0, 1));
        }

        .default-buttons-down-selected {
          color: var(--accent-color, rgba(0, 0, 0, 1));
        }

        .hearts-up-selected {
          color: var(--primary-hearts-color-up, rgba(168, 0, 0, 0.72));
        }

        .hearts-down-selected {
          color: var(--primary-hearts-color-up, rgba(168, 0, 0, 0.72));
        }

        .action-debate {
          color: #757575;
        }

        .debate-text {
          padding-top: 10px;
          padding-right: 6px;
          color: #757575;
        }

        .down-text {
          padding-right: 0px;
          padding-top: 0px;
          padding-left: 4px;
          padding-bottom: 7px;
        }

        .up-text {
          padding-top: 10px;
          margin-right: 12px;
          padding-left: 4px;
          padding-bottom: 8px;
        }

        .up-text[rtl] {
          margin-right: -8px;
        }

        .down-vote-icon {
          margin-right: 0px;
        }

        md-filled-tonal-link-icon-button.mainIcons {
          width: 48px;
          height: 48px;
        }

        md-filled-tonal-link-icon-button.debateIcon {
          width: 46px;
          height: 46px;
          margin-top: 2px;
        }

        md-filled-tonal-link-icon-button[smaller-icons] {
          height: 48px;
          width: 48px;
        }

        .debate-icon {
          color: #757575;
        }

        .up-vote-icon {
          margin-left: 8px;
        }

        @media (max-width: 320px) {
          :host {
            width: 250px;
          }
        }

        .shareButtonContainer {
          position: absolute;
          bottom: 55px;
          right: -32px;
          padding: 0;
          margin: 0;
          margin-bottom: 8px;
        }

        .shareButton {
          padding: 2px;
        }

        .shareShare {
          padding: 0;
          margin: 0;
          background-color: #fff;
        }

        @media screen and (-ms-high-contrast: active),
          (-ms-high-contrast: none) {
          .action-debate {
            display: none;
          }
        }

        [hidden] {
          display: none !important;
        }

        div[rtl] {
          direction: rtl;
        }

        action-up[only-up-vote-showing] {
          margin-right: -16px;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        ?rtl="${this.rtl}"
        title="${ifDefined(this.disabledTitle)}"
        floating="${this.floating}"
        class="action-bar layout horizontal center-center"
      >
        <div
          id="actionUp"
          ?only-up-vote-showing="${this.onlyUpVoteShowing}"
          class="action-up layout horizontal layout start justified"
        >
          <md-filled-tonal-link-icon-button
            id="iconUpButton"
            .smaller-icons="${this.smallerIcons}"
            ?disabled="${true || this.votingStateDisabled}"
            .title="${this.customVoteUpHoverText}"
            icon="${ifDefined(
              this.endorseModeIcon(this.endorsementButtons, 'up')
            )}"
            class="action-icon up-vote-icon largeButton"
            @click="${this.upVote}"
          >favorite</md-filled-tonal-link-icon-button>
          <div
            ?rtl="${this.rtl}"
            class="action-text up-text"
            ?hidden="${this.post.Group.configuration.hideVoteCount}"
          >
            ${YpFormattingHelpers.number(this.post.counter_endorsements_up)}
          </div>
        </div>

        <div
          class="action-debate layout horizontal"
          ?hidden="${true || this.hideDebate}"
        >
          <md-filled-tonal-link-icon-button
            ?disabled="${this.allDisabled}"
            title="${this.t('post.debate')}"
            icon="chat_bubble_outline"
            class="action-icon debate-icon mainIcons debateIcon"
            @click="${this._goToPostIfNotHeader}"
          >front_hand</md-filled-tonal-link-icon-button>
          <div class="action-text debate-text">
            ${YpFormattingHelpers.number(this.post.counter_points)}
          </div>
        </div>

        <div
          id="actionDown"
          class="action-down layout horizontal layout center justified"
          ?hidden="${this.post.Group.configuration.hideDownVoteForPost}"
        >
          <md-filled-tonal-link-icon-button
            smaller-icons="${this.smallerIcons}"
            ?disabled="${true || this.votingStateDisabled}"
            title="${this.customVoteDownHoverText}"
            icon="${ifDefined(this.endorseModeIconDown)}"
            class="action-icon down-vote-icon mainIcons"
            @click="${this.downVote}"
          >block</md-filled-tonal-link-icon-button>
          <div
            class="action-text down-text"
            ?hidden="${this.post.Group.configuration.hideVoteCount}"
          >
            ${YpFormattingHelpers.number(this.post.counter_endorsements_down)}
          </div>
        </div>
      </div>
    `;
  }

  get isEndorsed() {
    return this.endorseValue > 0;
  }

  get votingStateDisabled() {
    if (this.allDisabled) {
      return true;
    } else if (
      !this.isEndorsed &&
      this.maxNumberOfGroupVotes &&
      this.numberOfGroupVotes
    ) {
      return this.maxNumberOfGroupVotes <= this.numberOfGroupVotes;
    } else {
      return false;
    }
  }

  get onlyUpVoteShowing() {
    if (this.post && this.post.Group && this.post.Group.configuration) {
      return (
        this.post.Group.configuration.hideDownVoteForPost &&
        this.post.Group.configuration.hideDebateIcon
      );
    } else {
      return false;
    }
  }

  get endorseModeIconUp() {
    return this.endorseModeIcon(this.endorsementButtons, 'up');
  }

  get endorseModeIconDown() {
    return this.endorseModeIcon(this.endorsementButtons, 'down');
  }

  get customVoteUpHoverText() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.customVoteUpHoverText
    ) {
      return this.post.Group.configuration.customVoteUpHoverText;
    } else {
      return this.t('post.up_vote');
    }
  }

  get customVoteDownHoverText() {
    if (
      this.post &&
      this.post.Group &&
      this.post.Group.configuration &&
      this.post.Group.configuration.customVoteDownHoverText
    ) {
      return this.post.Group.configuration.customVoteDownHoverText;
    } else {
      return this.t('post.down_vote');
    }
  }

  _goToPostIfNotHeader() {
    if (!this.headerMode) {
      YpNavHelpers.goToPost(this.post.id);
    }
  }

  get hideDebate() {
    return (
      !this.forceShowDebate && (
      !this.wide ||
      this.forceSmall ||
      this.headerMode ||
      (this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.hideDebateIcon)
    ));
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    // TODO: Test this well is it working as expected
    if (changedProperties.has('post') && this.post) {
      YpFormattingHelpers.removeClass(
        this.$$('#actionUp'),
        'hearts-up-selected'
      );
      YpFormattingHelpers.removeClass(
        this.$$('#actionDown'),
        'hearts-down-selected'
      );
      YpFormattingHelpers.removeClass(
        this.$$('#actionUp'),
        'default-buttons-up-selected'
      );
      YpFormattingHelpers.removeClass(
        this.$$('#actionDown'),
        'default-buttons-down-selected'
      );
      this.endorseValue = 0;

      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.canVote != undefined &&
        this.post.Group.configuration.canVote == false
      ) {
        this.votingDisabled = true;
        this.allDisabled = true;
        this.disabledTitle = this.t('votingDisabled');
      } else {
        this.votingDisabled = false;
        this.allDisabled = false;
      }
      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.endorsementButtons != undefined
      ) {
        this.endorsementButtons = this.post.Group.configuration.endorsementButtons;
      } else {
        this.endorsementButtons = 'hearts';
      }

      if (this.post.Group.configuration) {
        this.post.Group.configuration.originalHideVoteCount = this.post.Group.configuration.hideVoteCount;
        if (this.post.Group.configuration.hideVoteCountUntilVoteCompleted) {
          this.post.Group.configuration.hideVoteCount = true;
          this.requestUpdate();
        }
      }

      if (this.post.Group.configuration.maxNumberOfGroupVotes) {
        this.maxNumberOfGroupVotes = this.post.Group.configuration.maxNumberOfGroupVotes;
        this.numberOfGroupVotes =
          window.appUser.groupCurrentVoteCountIndex[this.post.Group.id];
      } else {
        this.maxNumberOfGroupVotes = undefined;
        this.numberOfGroupVotes = undefined;
      }

      this._updateEndorsements();
    }
  }

  _updateEndorsementsFromSignal(event: CustomEvent) {
    if (this.post) {
      this._updateEndorsements(event);
    }
  }

  _updateEndorsements(event: CustomEvent | undefined = undefined) {
    if (
      window.appUser &&
      window.appUser.loggedIn() &&
      window.appUser.user &&
      window.appUser.user.Endorsements
    ) {
      const thisPostsEndorsement =
        window.appUser.endorsementPostsIndex[this.post.id];
      if (thisPostsEndorsement)
        this._setEndorsement(thisPostsEndorsement.value);
      else this._setEndorsement(0);

      if (event && event.detail && event.detail.maxGroupId === this.post.Group.id) {
        this.numberOfGroupVotes = event.detail.groupCurrentVoteCount;
      }
    }
  }

  endorseModeIcon(endorsementButtons: string, upDown: string) {
    if (endorsementButtons != 'hearts' && endorsementButtons != 'hats') {
      this.smallerIcons = true;
    } else {
      this.smallerIcons = false;
    }
    if (endorsementButtons == 'thumbs' && upDown == 'up') {
      return 'thumb_up';
    } else if (endorsementButtons == 'thumbs' && upDown == 'down') {
      return 'thumb_down';
    } else if (endorsementButtons == 'hearts' && upDown == 'up') {
      return 'favorite_border';
    } else if (endorsementButtons == 'hearts' && upDown == 'down') {
      return 'do_not_disturb';
    } else if (endorsementButtons == 'hats' && upDown == 'up') {
      return 'keyboard_arrow_up';
    } else if (endorsementButtons == 'hats' && upDown == 'down') {
      return 'keyboard_arrow_down';
    } else if (endorsementButtons == 'arrows' && upDown == 'up') {
      return 'arrow_upward';
    } else if (endorsementButtons == 'arrows' && upDown == 'down') {
      return 'arrow_downward';
    }
  }

  _setEndorsement(value: number) {
    this.endorseValue = value;

    if (
      value !== 0 &&
      this.post.Group.configuration &&
      this.post.Group.configuration.hideVoteCount &&
      !this.post.Group.configuration.originalHideVoteCount
    ) {
      this.post.Group.configuration.hideVoteCount = false;
    }

    if (this.endorsementButtons == 'hearts') {
      if (value > 0) {
        this.$$('#actionUp')!.className += ' ' + 'hearts-up-selected';
        YpFormattingHelpers.removeClass(
          this.$$('#actionDown'),
          'hearts-down-selected'
        );
        (this.$$('#iconUpButton') as MdOutlinedIconButton).innerHTML = 'favorite';
      } else if (value < 0) {
        this.$$('#actionDown')!.className += ' ' + 'hearts-down-selected';
        YpFormattingHelpers.removeClass(
          this.$$('#actionUp'),
          'hearts-up-selected'
        );
        (this.$$('#iconUpButton') as MdOutlinedIconButton).innerHTML = 'favoriate_border';
      } else {
        YpFormattingHelpers.removeClass(
          this.$$('#actionUp'),
          'hearts-up-selected'
        );
        YpFormattingHelpers.removeClass(
          this.$$('#actionDown'),
          'hearts-down-selected'
        );
        (this.$$('#iconUpButton') as MdOutlinedIconButton).innerHTML = 'favorite_border';
      }
    } else {
      if (value > 0) {
        this.$$('#actionUp')!.className += ' ' + 'default-buttons-up-selected';
        YpFormattingHelpers.removeClass(
          this.$$('#actionDown'),
          'default-buttons-down-selected'
        );
      } else if (value < 0) {
        this.$$('#actionDown')!.className +=
          ' ' + 'default-buttons-down-selected';
        YpFormattingHelpers.removeClass(
          this.$$('#actionUp'),
          'default-buttons-up-selected'
        );
      } else {
        YpFormattingHelpers.removeClass(
          this.$$('#actionUp'),
          'default-buttons-up-selected'
        );
        YpFormattingHelpers.removeClass(
          this.$$('#actionDown'),
          'default-buttons-down-selected'
        );
      }
    }
  }

  _enableVoting() {
    if (!this.votingDisabled) {
      this.allDisabled = false;
    }
  }

  generateEndorsementFromLogin(value: number) {
    if (!window.appUser.endorsementPostsIndex[this.post.id]) {
      this.generateEndorsement(value);
    }
  }

  async generateEndorsement(value: number) {
    if (window.appUser.loggedIn() === true) {
      let method: string;

      if (this.endorseValue === value) {
        method = 'DELETE';
      } else {
        method = 'POST';
      }

      const endorseResponse = (await window.serverApi.endorsePost(
        this.post.id,
        method,
        { post_id: this.post.id, value: value }
      )) as YpEndorseResponse | void;

      if (endorseResponse) {
        this._enableVoting();
        const endorsement = endorseResponse.endorsement;
        const oldEndorsementValue = endorseResponse.oldEndorsementValue;
        window.appUser.updateEndorsementForPost(this.post.id, endorsement, this.post.Group);
        this._setEndorsement(endorsement.value);
        if (oldEndorsementValue) {
          if (oldEndorsementValue > 0)
            this.post.counter_endorsements_up =
              this.post.counter_endorsements_up - 1;
          else if (oldEndorsementValue < 0)
            this.post.counter_endorsements_down =
              this.post.counter_endorsements_down - 1;
        }
        if (endorsement.value > 0)
          this.post.counter_endorsements_up =
            this.post.counter_endorsements_up + 1;
        else if (endorsement.value < 0)
          this.post.counter_endorsements_down =
            this.post.counter_endorsements_down + 1;
      }
    } else {
      this._enableVoting();
      window.appUser.loginForEndorse(this, { value: value });
    }
  }

  upVote() {
    this.allDisabled = true;
    this.generateEndorsement(1);
    window.appGlobals.activity(
      'clicked',
      'endorse_up',
      this.post ? this.post.id : -1
    );
    this._setVoteHidingStatus();
  }

  downVote() {
    this.allDisabled = true;
    this.generateEndorsement(-1);
    window.appGlobals.activity(
      'clicked',
      'endorse_down',
      this.post ? this.post.id : -1
    );
    this._setVoteHidingStatus();
  }

  _setVoteHidingStatus() {
    if (
      this.post.Group.configuration &&
      this.post.Group.configuration.hideVoteCountUntilVoteCompleted &&
      !this.post.Group.configuration.originalHideVoteCount
    ) {
      this.post.Group.configuration.hideVoteCount = false;
      this.requestUpdate();
    }
  }
}
