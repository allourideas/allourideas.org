import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import { YpBaseElementWithLogin } from '../@yrpri/common/yp-base-element-with-login';

import '@material/web/fab/fab-extended.js';
import './yp-new-campaign.js';
import './yp-campaign.js';
import { YpNewCampaign } from './yp-new-campaign.js';
import { YpCampaignApi } from './YpCampaignApi';
import { Dialog } from '@material/mwc-dialog';

@customElement('yp-campaign-manager')
export class YpCampaignManager extends YpBaseElementWithLogin {
  @property({ type: String })
  collectionType!: string;

  @property({ type: Number })
  collectionId!: number;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Array })
  campaigns: YpCampaignData[] | undefined;

  @query('yp-new-campaign')
  private newCampaignElement!: YpNewCampaign;

  campaignApi: YpCampaignApi = new YpCampaignApi();

  campaignToDelete: number | undefined;

  firstUpdated() {
    this.getCampaigns();
  }

  newCampaign() {
    this.newCampaignElement.open();
  }

  getTrackingUrl(campaign: YpCampaignData, medium: string) {
    const fullHost = location.protocol + '//' + location.host;
    const url = `${fullHost}/${this.collectionType}/${this.collectionId}?utm_source=${campaign.configuration.utm_source}&utm_medium=${medium}&utm_campaign=${campaign.configuration.utm_campaign}&utm_content=${campaign.id}`;
    const encodedUrl = encodeURI(url);
    return encodedUrl;
  }

  async createCampaign(event: CustomEvent) {
    const data = event.detail as YpNewCampaignData;

    const configuration = {
      utm_campaign: data.name,
      utm_source: this.collection!.name,
      audience: data.targetAudience,
      promotionText: data.promotionText,
      shareImageUrl: data.shareImageUrl,
      mediums: [] as YpCampaignMediumData[],
    } as YpCampaignConfigurationData;

    const campaign = (await this.campaignApi.createCampaign(
      this.collectionType,
      this.collectionId,
      {
        configuration,
      }
    )) as YpCampaignData;

    campaign.configuration.utm_content = `${campaign.id}`;

    const mediums: YpCampaignMediumData[] = [];

    for (let i = 0; i < data.mediums.length; i++) {
      const medium = data.mediums[i];
      mediums.push({
        utm_medium: medium,
        finaUrl: this.getTrackingUrl(campaign, medium),
        active: false,
      });
    }

    campaign.configuration.mediums = mediums;

    await this.campaignApi.updateCampaign(
      this.collectionType,
      this.collectionId,
      campaign.id!,
      {
        configuration: campaign.configuration,
      }
    );

    this.getCampaigns();
  }

  async campaignConfigurationUpdated(event: CustomEvent) {
    await this.campaignApi.updateCampaign(
      this.collectionType,
      this.collectionId,
      event.detail.campaignId,
      {
        configuration: event.detail.configuration,
      }
    );
  }

  async getCampaigns() {
    this.campaignToDelete = undefined;
    this.campaigns = await this.campaignApi.getCampaigns(
      this.collectionType,
      this.collectionId
    );
  }

  async reallyDeleteCampaign() {
    try {
      await this.campaignApi.deleteCampaign(
        this.collectionType,
        this.collectionId,
        this.campaignToDelete!
      );
    } catch (error) {
      this.campaignToDelete = undefined;
      console.error(error);
    }

    this.getCampaigns();
  }

  deleteCampaign(event: CustomEvent) {
    this.campaignToDelete = event.detail;
    (this.$$('#deleteConfirmationDialog') as Dialog).show();
  }

  cancelDeleteCampaign() {
    this.campaignToDelete = undefined;
  }

  static get styles() {
    return [
      super.styles,
      css`
        .mainContainer {
          width: 100%;
          margin-top: 32px;
        }

        @media (max-width: 1100px) {
          .mainContainer {
            width: 100%;
            max-width: calc(100vw - 80px);
          }
        }

        md-fab-extended {
          margin-top: 32px;
          margin-bottom: 0;
        }

        .fabContainer {
          width: 1000px;
        }

        @media (max-width: 1100px) {
          .fabContainer {
            width: 100%;
          }
        }
      `,
    ];
  }

  renderDeleteConfirmationDialog() {
    return html`
      <mwc-dialog id="deleteConfirmationDialog" crimClickAction escapeKeyAction>
        <div class="layout horizontal center-center">
          <div class="headerText">${this.t('reallyDeletePromotion')}</div>
        </div>
        <md-text-button
          .label="${this.t('cancel')}"
          class="button"
          dialogAction="cancel"
          @click="${this.cancelDeleteCampaign}"
          slot="secondaryAction"
        >
        </md-text-button>
        <md-tonal-button
          dialogAction="ok"
          class="button okButton"
          .label="${this.t('delete')}"
          @click="${this.reallyDeleteCampaign}"
          slot="primaryAction"
        >
        </md-tonal-button>
      </mwc-dialog>
    `;
  }

  renderCampaign(campaign: YpCampaignData) {
    return html`<yp-campaign
      @configurationUpdated="${this.campaignConfigurationUpdated}"
      .campaignApi="${this.campaignApi}"
      @deleteCampaign="${this.deleteCampaign}"
      .collectionType="${this.collectionType}"
      .collection="${this.collection}"
      .collectionId="${this.collectionId}"
      .campaign="${campaign}"
    ></yp-campaign>`;
  }

  render() {
    return html`
      <yp-new-campaign
        .collectionType="${this.collectionType}"
        .collection="${this.collection}"
        .collectionId="${this.collectionId}"
        @save="${this.createCampaign}"
      ></yp-new-campaign>
      <div class="layout horizontal center-center fabContainer">
        <md-fab-extended
          .label="${this.t('newTrackingPromotion')}"
          icon="add"
          @click="${this.newCampaign}"
        ></md-fab-extended>
      </div>
      <div class="layout vertical start mainContainer">
        <div class="layout vertical">
          ${this.campaigns?.map(campaign => this.renderCampaign(campaign))}
        </div>
      </div>
      ${this.renderDeleteConfirmationDialog()}
    `;
  }
}
