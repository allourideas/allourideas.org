import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { Menu } from '@material/mwc-menu';
import { YpCollectionHelpers } from '../common/YpCollectionHelpers.js';

import '../common/yp-image.js';
import '../yp-magic-text/yp-magic-text.js';
import './yp-collection-stats.js';
import { YpGroup } from './yp-group.js';
import { YpNavHelpers } from '../common/YpNavHelpers.js';

@customElement('yp-collection-item-card')
export class YpCollectionItemCard extends YpBaseElement {
  @property({ type: Object })
  item: YpCollectionData | undefined;

  @property({ type: String })
  itemType: string | undefined;

  @property({ type: Object })
  collection: YpCollectionData | undefined;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .description {
          line-height: var(--description-line-height, 1.3);
          font-size: 15px;
          padding: 8px;
          padding: 16px;
          font-family: var(--app-header-font-family, Roboto);
        }

        .description[widetext] {
          font-size: 14px;
        }

        .description[largefont] {
          font-size: 16px;
        }

        .stats {
          position: absolute;
          bottom: 0;
          right: 38px;
        }

        .post-image {
          width: 100%;
        }

        .collectionCard {
          width: 860px;
          background-color: var(--mdc-theme-surface);
          color: var(--mdc-theme-on-surface);
          margin: 0;
          position: relative;
        }

        .collectionCard[featured] {
        }

        yp-image {
          width: 320px !important;
          height: 180px !important;
        }

        yp-image[featured] {
        }

        .card-content {
          padding: 0;
          padding-bottom: 48px;
        }

        yp-image {
          padding: 0;
          margin: 0;
        }

        yp-image {
          padding: 0;
          margin: 0;
        }

        .collectionCard {
          vertical-align: text-top;
        }

        .informationText {
          vertical-align: text-top;
        }

        .collection-name {
          font-size: var(--mdc-typography-headline2-font-size);
          font-weight: var(--mdc-typography-headline2-font-weight);
          cursor: pointer;
          padding: 16px;
          padding-bottom: 0;
          vertical-align: middle;
          width: auto;
          font-family: var(--app-header-font-family, Roboto);
        }

        .collection-name[widetext] {
          font-size: 18px;
        }

        .collection-name[largefont] {
          font-size: 20px;
        }

        yp-image[archived] {
        }

        yp-membership-button {
          position: absolute;
          top: 159px;
          right: 24px;
          width: 30px;
          height: 30px;
          color: var(--icon-general-color, #fff);
        }

        .edit {
          color: #888;
          position: absolute;
          bottom: 0;
          right: 0;
          padding-right: 0;
          margin-right: 0;
          text-align: right;
        }

        .collection-name[featured] {
          background-color: var(--accent-color);
        }

        .collection-name[archived] {
          background-color: #aaa;
        }

        .collection-name[has-data-viz] {
          padding-top: 26px;
        }

        yp-membership-button[archived] {
          display: none;
        }

        .collectionNameFontSize4Wide {
          font-size: 30px;
        }

        .collectionNameFontSize3Wide {
          font-size: 26px;
        }

        .collectionNameFontSize2Wide {
          font-size: 24px;
        }

        .collectionNameFontSize1Wide {
          font-size: 22px;
        }

        .collectionNameFontSize4Mobile {
          font-size: 28px;
        }

        .collectionNameFontSize3Mobile {
          font-size: 24px;
        }

        .collectionNameFontSize2Mobile {
          font-size: 22px;
        }

        .collectionNameFontSize1Mobile {
          font-size: 19px;
        }

        .collectionNameFontSize4Wide[widetext] {
          font-size: 26px;
        }

        .collectionNameFontSize3Wide[widetext] {
          font-size: 22px;
        }

        .collectionNameFontSize2Wide[widetext] {
          font-size: 20px;
        }

        .collectionNameFontSize1Wide[widetext] {
          font-size: 18px;
        }

        .collectionNameFontSize4Mobile[widetext] {
          font-size: 26px;
        }

        .collectionNameFontSize3Mobile[widetext] {
          font-size: 22px;
        }

        .collectionNameFontSize2Mobile[widetext] {
          font-size: 20px;
        }

        .collectionNameFontSize1Mobile[widetext] {
          font-size: 18px;
        }

        @media (max-width: 960px) {
          :host {
            max-width: 423px;
            width: 100%;
            padding-top: 0 !important;
          }

          yp-membership-button {
            top: 205px;
          }

          .collectionCard {
            margin-left: 0;
            margin-right: 0;
            padding-left: 0;
            padding-right: 0;
            width: 100%;
            height: 100%;
            padding-bottom: 8px;
          }

          yp-image {
            width: 100%;
            height: 230px;
          }

          yp-image[featured] {
          }

          .description {
            margin-bottom: 32px;
          }
        }

        @media (max-width: 420px) {
          yp-image {
            height: 225px;
          }

          yp-membership-button {
            top: 205px;
          }
        }

        @media (max-width: 375px) {
          yp-image {
            height: 207px;
          }

          yp-membership-button {
            top: 185px;
          }
        }

        @media (max-width: 360px) {
          yp-image {
            height: 200px;
          }
        }

        @media (max-width: 320px) {
          yp-image {
            height: 180px;
          }

          yp-membership-button {
            top: 155px;
          }
        }

        .withPointer {
          cursor: pointer;
        }

        [hidden] {
          display: none !important;
        }

        a {
          text-decoration: none;
        }
      `,
    ];
  }

  get archived(): boolean {
    return this.item?.status === 'archived';
  }

  get featured(): boolean {
    return this.item?.status === 'featured';
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.item && (this.item as YpGroupData).Community) {
      this.collection = (this.item as YpGroupData).Community;
      const group = this.collection as YpGroupData;

      if (group.CommunityLink) {
        this.itemType = 'groupCommunityLink';
      } else if (group.configuration.dataForVisualizationJson) {
        this.itemType = 'groupDataViz';
      } else {
        this.itemType = 'group';
      }
    } else if (this.item && (this.item as YpCommunityData).Domain) {
      this.collection = (this.item as YpCommunityData).Domain;
      this.itemType = 'community';
    }
  }

  goToItem(event: CustomEvent) {
    event.preventDefault();
    if (event.currentTarget && event.currentTarget) {
      const href = (event.currentTarget as HTMLElement).getAttribute('href');
      if (href) {
        YpNavHelpers.redirectTo(href);
      }
    }
  }

  _setupFontNameFontSize() {
    const collectionName = this.$$('#collectionName') as HTMLElement;
    if (collectionName && this.collection) {
      let classNames = 'collection-name ';
      if (this.wide) {
        if (this.collection.name.length <= 18) {
          classNames += 'collectionNameFontSize4Wide';
        } else if (this.collection.name.length > 40) {
          classNames += 'collectionNameFontSize1Wide';
        } else if (this.collection.name.length > 30) {
          classNames += 'collectionNameFontSize2Wide';
        } else if (this.collection.name.length > 18) {
          classNames += 'collectionNameFontSize3Wide';
        }
      } else {
        if (this.collection.name.length <= 18) {
          classNames += 'collectionNameFontSize4Mobile';
        } else if (this.collection.name.length > 40) {
          classNames += 'collectionNameFontSize1Mobile';
        } else if (this.collection.name.length > 30) {
          classNames += 'collectionNameFontSize2Mobile';
        } else if (this.collection.name.length > 18) {
          classNames += 'collectionNameFontSize3Mobile';
        }
      }

      collectionName.className = classNames;
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('collection') && this.collection) {
      //TODO: Check if we need to setTimeout here
      this._setupFontNameFontSize();
    }
  }

  renderLogoImage() {
    return html`
      ${YpCollectionHelpers.logoImagePath(this.itemType, this.item!)
        ? html`
            <yp-image
              sizing="cover"
              ?archived="${this.archived}"
              alt="${this.collection!.name}"
              ?featured="${this.featured}"
              preload
              .src="${YpCollectionHelpers.logoImagePath(
                this.itemType,
                this.item!
              )}"
              class="post-image withPointer"
            ></yp-image>
          `
        : html`
            <yp-image
              ?archived="${this.archived}"
              sizing="cover"
              class="main-image withPointer"
              src="https://i.imgur.com/sdsFAoT.png"
            ></yp-image>
          `}
    `;
  }

  renderDataViz() {
    return html`
      <yp-data-visualization
        small
        .data="${(this.item as YpGroupData).configuration
          .dataForVisualizationJson}"
      ></yp-data-visualization>
    `;
  }

  renderCardInfo() {
    return html`
      <div class="layout horizontal">
        ${this.itemType === 'groupDataViz'
          ? html` ${this.renderDataViz()} `
          : html` ${this.renderLogoImage()} `}
      </div>
      <div class="informationText">
        <yp-magic-text
          id="collectionName"
          class="collection-name"
          ?archived="${this.archived}"
          ?featured="${this.featured}"
          ?largefont="${this.largeFont}"
          @click="${this.goToItem}"
          .textType="${YpCollectionHelpers.nameTextType(this.itemType)}"
          .contentLanguage="${this.contentLanguage}"
          ?disableTranslation="${this.collection!.configuration
            ?.disableNameAutoTranslation}"
          text-only
          .content="${this.contentName}"
          .contentId="${this.contentId}"
        ></yp-magic-text>
        <yp-magic-text
          id="description"
          class="description layout vertical withPointer"
          ?featured="${this.featured}"
          ?largefont="${this.largeFont}"
          textType="collectionContent"
          .textType="${YpCollectionHelpers.descriptionTextType(this.itemType)}"
          .contentLanguage="${this.contentLanguage}"
          textOnly
          removeUrls
          .content="${this.contentDescription}"
          .contentId="${this.contentId}"
          truncate="300"
        >
        </yp-magic-text>
      </div>

      <div class="stats layout horizontal">
        <yp-collection-stats
          .collectionType="${this.statsCollectionType}"
          .collection="${this.statsCollection}"
        ></yp-collection-stats>
      </div>

      ${!this.collection
        ? html`
            <yp-membership-button
              .archived="${this.archived}"
              .featured="${this.featured}"
              .collection="${this.collection}"
            ></yp-membership-button>
          `
        : html``}
    `;
  }

  get statsCollection() {
    if (this.itemType === 'groupCommunityLink') {
      return (this.item as YpGroupData).CommunityLink!;
    } else {
      return this.item!;
    }
  }

  get statsCollectionType() {
    if (this.itemType === 'groupCommunityLink') {
      return 'communtiy';
    } else if (this.itemType === 'groupDataViz') {
      return 'group';
    } else {
      return this.itemType!;
    }
  }

  get contentDescription() {
    if (this.itemType === 'groupCommunityLink') {
      return (this.item as YpGroupData).CommunityLink!.description;
    } else {
      return this.item!.description || this.item!.objectives;
    }
  }

  get contentName() {
    if (this.itemType === 'groupCommunityLink') {
      return (this.item as YpGroupData).CommunityLink!.name;
    } else {
      return this.item!.name;
    }
  }

  get contentId() {
    if (this.itemType === 'groupCommunityLink') {
      return (this.item as YpGroupData).CommunityLink!.id;
    } else {
      return this.item!.id;
    }
  }

  get contentLanguage() {
    if (this.itemType === 'groupCommunityLink') {
      return (this.item as YpGroupData).CommunityLink!.language;
    } else {
      return this.item!.language;
    }
  }

  get contentUrlBase() {
    if (this.itemType === 'groupCommunityLink') {
      return 'community';
    } else if (this.itemType === 'groupDataViz') {
      return 'group_data_viz';
    } else {
      return this.itemType;
    }
  }

  render() {
    return this.item && this.collection
      ? html`
          <a
            href="/${this.contentUrlBase}/${this.contentId}"
            @click="${this.goToItem}"
            class="layout vertical center-center"
          >
            <div
              ?featured="${this.featured}"
              class="collectionCard shadow-elevation-4dp shadow-transaction layout horizontal"
            >
              ${this.renderCardInfo()}
            </div>
          </a>
        `
      : nothing;
  }
}
