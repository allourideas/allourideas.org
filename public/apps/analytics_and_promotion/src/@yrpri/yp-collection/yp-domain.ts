import { YpAccessHelpers } from '../common/YpAccessHelpers.js';
import { YpMediaHelpers } from '../common/YpMediaHelpers.js';

import { YpCollection, CollectionTabTypes } from './yp-collection.js';
import { YpCollectionItemsGrid } from './yp-collection-items-grid.js';
import { customElement } from 'lit/decorators.js';
import { AcActivities } from '../ac-activities/ac-activities.js';

@customElement('yp-domain')
export class YpDomain extends YpCollection {
  constructor() {
    super("domain","community","edit",'community.add');
  }

  refresh() {
    super.refresh();

    const domain = this.collection as YpDomainData;

    if (domain) {
      window.appGlobals.domain = domain;
      window.appGlobals.analytics.setupGoogleAnalytics(domain);
      this.collectionItems = domain.Communities;
      this.setFabIconIfAccess(
        domain.only_admins_can_create_communities,
        YpAccessHelpers.checkDomainAccess(domain)
      );

      if (
        domain.DomainHeaderImages &&
        domain.DomainHeaderImages.length > 0
      ) {
        YpMediaHelpers.setupTopHeaderImage(
          this,
          domain.DomainHeaderImages as Array<YpImageData>
        );
      } else {
        YpMediaHelpers.setupTopHeaderImage(this, null);
      }
    }

    window.appGlobals.setAnonymousGroupStatus(undefined);
    window.appGlobals.setRegistrationQuestionGroup(undefined);
    window.appGlobals.disableFacebookLoginForGroup = false;
    window.appGlobals.externalGoalTriggerGroupId = undefined;
    window.appGlobals.currentForceSaml = false;
    window.appGlobals.currentSamlDeniedMessage = undefined;
    window.appGlobals.currentSamlLoginMessage = undefined;
    window.appGlobals.currentGroup = undefined;
    window.appGlobals.signupTermsPageId = undefined;
    window.appGlobals.setHighlightedLanguages(undefined);
  }

  scrollToCommunityItem() {
    if (this.selectedTab===CollectionTabTypes.Newsfeed && window.appGlobals.cache.cachedActivityItem) {
      const list = this.$$("#collectionActivities") as AcActivities;
      if (list) {
        list.scrollToItem(window.appGlobals.cache.cachedActivityItem);
        window.appGlobals.cache.cachedActivityItem = undefined;
      } else {
        console.warn("No domain activities for scroll to item");
      }
    } else if (this.selectedTab===CollectionTabTypes.Collection && this.collection) {
      if (window.appGlobals.cache.backToDomainCommunityItems &&
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]) {
          (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
            window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
          );
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id] = undefined;
      }
    }
  }

  scrollToCollectionItemSubClass() {
    if (
      this.collection &&
      window.appGlobals.cache.backToDomainCommunityItems &&
      window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
    ) {
      (this.$$('#collectionItems') as YpCollectionItemsGrid).scrollToItem(
        window.appGlobals.cache.backToDomainCommunityItems[this.collection.id]
      );
      window.appGlobals.cache.backToDomainCommunityItems[
        this.collection.id
      ] = undefined;
    }
  }
}
