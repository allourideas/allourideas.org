import {
  html,
  css,
  nothing,
  TemplateResult
} from 'lit';

import {
  property,
  customElement
} from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';
import { ShadowStyles } from '../common/ShadowStyles.js';
import { YpIronListHelpers } from '../common/YpIronListHelpers.js';
import { YpCollectionHelpers } from '../common/YpCollectionHelpers.js';
import { RangeChangedEvent } from '@lit-labs/virtualizer/Virtualizer.js';
import { LitVirtualizer } from '@lit-labs/virtualizer';
import { FlowLayout } from '@lit-labs/virtualizer/layouts/flow.js';
import { GridLayout } from '@lit-labs/virtualizer/layouts/grid.js';

import { YpCollectionItemCard } from './yp-collection-item-card.js';
import { YpServerApi } from '../common/YpServerApi.js';
import { ifDefined } from 'lit/directives/if-defined.js';

import './yp-collection-item-card.js';

@customElement('yp-collection-items-grid')
export class YpCollectionItemsGrid extends YpBaseElement {
  @property({ type: Object })
  collection: YpCollectionData | undefined;

  @property({ type: Array })
  collectionItems: Array<YpCollectionData> | undefined;

  @property({ type: String })
  collectionItemType!: string;

  @property({ type: Array })
  sortedCollectionItems: Array<YpCollectionData> | undefined;

  @property({ type: Boolean, reflect: true })
  grid = false;

  resetListSize: Function | undefined;
  skipIronListWidth = false;

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        .card {
          padding: 0;
          padding-top: 24px;
          width: 100%;
        }

        .card[wide-padding] {
          padding: 16px !important;
        }

        a {
          text-decoration: none;
          width: 100%;
        }
      `,
    ];
  }

  render() {
    return this.sortedCollectionItems
      ? html`
          <lit-virtualizer
            id="list"
            role="main"
            .layout="${this.grid ? GridLayout : FlowLayout}"
            aria-label="${this.t(this.pluralItemType)}"
            .items="${this.sortedCollectionItems}"
            .scrollTarget="${window}"
            .keyFunction="${(item: YpCollectionData) => item.id}"
            .renderItem="${this.renderItem.bind(this)}"></lit-virtualizer>
        `
      : nothing;
  }

  renderItem(item: YpCollectionData, index: number): TemplateResult {
    return html` <yp-collection-item-card
      class="card"
      aria-label="${item.name}"
      ariarole="listitem"
      .item="${item}"
      @keypress="${this._keypress.bind(this)}"
      @click="${this._selectedItemChanged.bind(
        this
      )}"></yp-collection-item-card>`;
  }

  get pluralItemType() {
    if (this.collectionItemType=='community') {
      return 'communities';
    } else if (this.collectionItemType=='group') {
      return 'groups';
    } else if (this.collectionItemType=='post') {
      return 'posts';
    } else {
      return 'unknownItemType';
    }
  }

  _keypress(event: KeyboardEvent) {
    if (event.keyCode==13) {
      this._selectedItemChanged(event as unknown as CustomEvent);
    }
  }

  async refresh() {}

  firstUpdated(changedProperties: Map<string | number | symbol, unknown>) {
    super.firstUpdated(changedProperties);
    YpIronListHelpers.attachListeners(this as YpElementWithIronList);
  }

  async connectedCallback() {
    super.connectedCallback();
    if (this.collection && this.collectionItems) {
      const splitCommunities = YpCollectionHelpers.splitByStatus(
        this.collectionItems,
        this.collection.configuration
      );

      this.sortedCollectionItems = splitCommunities.featured.concat(
        splitCommunities.active.concat(splitCommunities.archived)
      );
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    YpIronListHelpers.detachListeners(this as YpElementWithIronList);
  }

  // TODO: Make sure this fires each time on keyboard, mouse & phone - make sure back key on browser works also just with the A
  _selectedItemChanged(event: CustomEvent) {
    const item = (event.target as YpCollectionItemCard).item;

    if (this.collectionItemType && item) {
      window.appGlobals.activity(
        'open',
        this.collectionItemType,
        `/${this.collectionItemType}/${item.id}`,
        { id: item.id }
      );

      if (this.collectionItemType === 'community') {
        const community = item as YpCommunityData;
        if (community!=undefined) {
          window.appGlobals.cache.backToDomainCommunityItems[
            community.domain_id!
          ] = community;
        }
      } else if (this.collectionItemType === 'group' && item) {
        const group = item as YpGroupData;
        window.appGlobals.cache.backToCommunityGroupItems[
          group.community_id
        ] = group;
        window.appGlobals.cache.groupItemsCache[group.id] = group;
      }
    }
  }

  scrollToItem(item: YpDatabaseItem | undefined) {
    if (item && this.sortedCollectionItems) {
      for (let i = 0; i < this.sortedCollectionItems.length; i++) {
        if (this.sortedCollectionItems[i] == item) {
          (this.$$('#list') as LitVirtualizer).scrollToIndex(i);
          break;
        }
      }
      this.fireGlobal('yp-refresh-activities-scroll-threshold');
    } else {
      console.error('No item to scroll too');
    }
  }
}
