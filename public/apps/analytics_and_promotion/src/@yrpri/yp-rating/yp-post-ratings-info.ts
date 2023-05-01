import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpFormattingHelpers } from '../common/YpFormattingHelpers.js';
import { YpDialogRatings } from './yp-dialog-ratings.js';

@customElement('yp-post-ratings-info')
export class YpPostRatingsInfo extends YpBaseElement {
  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Boolean })
  hasWidthA = false;

  @property({ type: Boolean })
  hasWidthB = false;

  @property({ type: Boolean })
  hasWidthC = false;

  @property({ type: Boolean })
  hasWidthD = false;

  @property({ type: Boolean })
  active = false;

  @property({ type: Boolean })
  allDisabled = false;

  @property({ type: Boolean })
  votingDisabled = false;

  @property({ type: Boolean })
  isEndorsed = false;

  @property({ type: Boolean })
  cardMode = false;

  @property({ type: Array })
  customRatings: Array<YpCustomRatingsData> | undefined;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('post')) {
      this._onPostChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
        }

        .ratingsCount {
          font-size: 0.6em;
          color: #aaa;
        }

        .ratingContainer {
          margin-left: 16px;
          margin-bottom: 4px;
        }

        .ratingContainer[widtha] {
          width: 125px;
        }

        .ratingContainer[widthb] {
          width: 110px;
        }

        .ratingContainer[widthc] {
          width: 100px;
        }

        .ratingContainer[widthd] {
          width: 90px;
        }

        .ratingContainerMain {
          text-align: right;
          margin-right: 8px;
          max-width: 230px;
        }

        .topDiv {
          cursor: pointer;
        }

        .topDiv[voting-disabled] {
          cursor: initial;
        }

        [hidden] {
          display: none !important;
        }
      `,
    ];
  }

  render() {
    return html`
      <div
        class="layout vertical center-center topDiv"
        votingDisabled="${this.votingDisabled}"
        .ariaLabel="${this.t('evaluatePost')}"
        .title="${this.t('evaluatePost')}"
        on-tap="openRatingsDialog">
        ${this.post
          ? html`
              <div
                id="ratingContainerMain"
                class="ratingContainerMain layout horizontal center-center  wrap"
                style="display: flex; justify-content: flex-end"
                .cardMode="${this.cardMode}">
                ${this.customRatings?.map(
                  (rating, index) => html`
                    <div
                      class="layout horizontal ratingContainer"
                      widtha="${this.hasWidthA}"
                      widthb="${this.hasWidthB}"
                      widthc="${this.hasWidthC}"
                      widthd="${this.hasWidthD}">
                      <yp-rating
                        .title="${rating.name}"
                        readOnly
                        postId="${this.post!.id}"
                        ratingIndex="${index}"
                        .votingDisabled="${this.votingDisabled}"
                        .emoji="${rating.emoji}"
                        .rate="${this.getRating(index)}"
                        .numberOf="${rating.numberOf}"></yp-rating>
                      <div class="ratingsCount">
                        ${this.getRatingsCount(index)}
                      </div>
                    </div>
                  `
                )}
              </div>
            `
          : nothing}
      </div>
    `;
  }

  getRating(ratingIndex: number) {
    if (
      this.post &&
      this.post.public_data &&
      this.post.public_data.ratings &&
      this.post.public_data.ratings[ratingIndex]
    )
      return this.post.public_data.ratings[ratingIndex].averageRating;
    else return 0;
  }

  getRatingsCount(ratingIndex: number) {
    if (
      this.post &&
      this.post.public_data &&
      this.post.public_data.ratings &&
      this.post.public_data.ratings[ratingIndex]
    )
      return YpFormattingHelpers.number(
        this.post.public_data.ratings[ratingIndex].count
      );
    //          return this.formatNumber(1*(Math.floor(Math.random() * 10000) + 1)) //this.formatNumber(this.post.public_data.ratings[ratingIndex].count);
    else return 0;
  }

  _fireRefresh() {
    this.fire('refresh', { id: this.post?.id });
  }

  openRatingsDialog() {
    if (this.post && !this.post.Group.configuration.canVote === false) {
      window.appGlobals.activity('open', 'post.ratings');
      if (window.appUser.loggedIn() === true) {
        window.appDialogs.getRatingsDialogAsync((dialog: YpDialogRatings) => {
          dialog.open(this.post!, this._fireRefresh.bind(this));
        });
      } else {
        window.appUser.loginForRatings(this);
      }
    }
  }

  _onPostChanged() {
    this.isEndorsed = false;
    if (this.post && this.post.Group) {
      if (
        this.post.Group.configuration &&
        this.post.Group.configuration.customRatings
      ) {
        if (this.post.Group.configuration.canVote === false) {
          this.votingDisabled = true;
        } else {
          this.votingDisabled = false;
        }

        this.customRatings = [];
        setTimeout(() => {
          this.customRatings = this.post!.Group!.configuration!.customRatings!.slice(
            0,
            4
          );
        });

        let maxCount = 0;
        if (this.post.public_data && this.post.public_data.ratings) {
          if (this.post.public_data && this.post.public_data.ratings) {
            for (const item in this.post.public_data.ratings) {
              // eslint-disable-next-line no-prototype-builtins
              if (this.post.public_data.ratings.hasOwnProperty(item)) {
                if (this.post.public_data.ratings[item].count > maxCount) {
                  maxCount = this.post.public_data.ratings[item].count;
                }
              }
            }
          }
        }

        if (maxCount > 100000) {
          this.hasWidthA = true;
          this.hasWidthB = false;
          this.hasWidthC = false;
          this.hasWidthD = false;
          (this.$$('#ratingContainerMain') as HTMLElement).style.maxWidth =
            '285px';
        } else if (maxCount > 1000) {
          this.hasWidthA = false;
          this.hasWidthB = true;
          this.hasWidthC = false;
          this.hasWidthD = false;
          (this.$$('#ratingContainerMain') as HTMLElement).style.maxWidth =
            '255px';
        } else if (maxCount > 10) {
          this.hasWidthA = false;
          this.hasWidthB = false;
          this.hasWidthC = true;
          this.hasWidthD = false;
          (this.$$('#ratingContainerMain') as HTMLElement).style.maxWidth =
            '235px';
        } else {
          this.hasWidthA = false;
          this.hasWidthB = false;
          this.hasWidthC = false;
          this.hasWidthD = true;
          (this.$$('#ratingContainerMain') as HTMLElement).style.maxWidth =
            '215px';
        }
      }
      if (
        this.post &&
        this.post.Group &&
        this.post.Group.configuration &&
        this.post.Group.configuration.canVote != undefined &&
        this.post.Group.configuration.canVote == false
      ) {
        this.votingDisabled = true;
        this.allDisabled = true;
        this.title = this.t('votingDisabled');
      } else {
        this.title = '';
        this.votingDisabled = false;
        this.allDisabled = false;
      }

      if (this.post.Group.configuration) {
        this.post.Group.configuration.originalHideVoteCount = this.post.Group.configuration.hideVoteCount;
        if (this.post.Group.configuration.hideVoteCountUntilVoteCompleted) {
          this.post.Group.configuration.hideVoteCount = true;
        }
      }
    } else {
      this.customRatings = [];
      console.warn('No post found for post actions');
    }
  }
}
