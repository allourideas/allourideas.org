import { LitElement, css, html, nothing } from 'lit';
import {
  property,
  customElement,
  queryAll,
  queryAsync,
} from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import '@material/web/formfield/formfield.js';
import '@material/web/radio/radio.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/filled-button.js';

import '@material/web/checkbox/checkbox.js';

import '@material/web/iconbutton/standard-icon-button.js';

import { Dialog } from '@material/mwc-dialog';
import { TonalButton } from '@material/web/button/lib/tonal-button.js';
import { TextArea } from '@material/mwc-textarea/mwc-textarea.js';
import { OutlinedTextField } from '@material/web/textfield/lib/outlined-text-field';
import { Checkbox } from '@material/web/checkbox/lib/checkbox.js';

import { YpCollectionHelpers } from '../@yrpri/common/YpCollectionHelpers';

import '../@yrpri/common/yp-image.js';
import { YpFormattingHelpers } from '../@yrpri/common/YpFormattingHelpers';
import { YpCampaignApi } from '../yp-promotion/YpCampaignApi.js';
import { YpCampaign } from '../yp-promotion/yp-campaign';

@customElement('yp-campaign-analysis')
export class YpCampaignAnalysis extends YpCampaign {
  static get styles() {
    return [
      super.styles,
      css`
        .mediumImage {
          width: 42px;
          height: 42px;
          margin-top: 12px;
          margin-bottom: 16px;
        }

        .mainContainer {
          width: 1050px;
          height: 200px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        .mediumTopStats {
          font-size: 14px;
          text-align: left;
          width: 150px;
        }

        .mediumCard {
          width: 150px;
        }

        .mediumInnerCard {
          width: 150px;
        }

        .statValue {
          text-align: right;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .statLabel {
          text-align: left;
          margin-bottom: 2px;
          color: var(--md-sys-color-on-secondary-container);
        }

        .mediumsContainer {
          height: 220px;
        }
      `,
    ];
  }

  renderMediumTopStats(medium: YpCampaignAnalyticsMediumData) {
    return html`
      <div class="layout vertical mediumTopStats">
        ${medium.topStats.map(
          stat => html`
            <div class="layout horizontal">
              <div class="column self-start">
                <div class="statLabel">${this.t(stat.name)}</div>
              </div>
              <div class="flex"></div>
              <div class="column self-end">
                <div class="statValue">${stat.value}${stat.name==="Bounce rate" ? "%" : ""}</div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }

  renderMedium(medium: YpCampaignAnalyticsMediumData) {
    return html`
      <div class="mediumCard ${medium.active ? '' : 'disabledCard'}">
        <div class="layout vertical center-center mediumInnerCard">
          <div>${this.t(medium.utm_medium)}</div>
          <yp-image
            class="mediumImage"
            sizing="contain"
            .src="${this.getMediumImageUrl(medium.utm_medium)}"
          >
          </yp-image>

          ${this.renderMediumTopStats(medium)}
        </div>
      </div>
    `;
  }

  get orderedMedium() {
    return this.campaign.configuration.mediums.sort((a, b) => {
      return (
        (b as YpCampaignAnalyticsMediumData).topStats[0].value -
        (a as YpCampaignAnalyticsMediumData).topStats[0].value
      );
    });
  }

  render() {
    return html`
      <div class="layout vertical mainContainer">
        <div class="layout horizontal">
          <div class="campaignName">
            ${this.campaign.configuration.utm_campaign}
          </div>
        </div>
        <div class="layout horizontal mediumsContainer">
          ${this.orderedMedium.map(medium =>
            this.renderMedium(medium as YpCampaignAnalyticsMediumData)
          )}
        </div>
      </div>
    `;
  }
}
