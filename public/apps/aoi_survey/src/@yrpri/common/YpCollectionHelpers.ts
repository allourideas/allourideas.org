import { YpMediaHelpers } from './YpMediaHelpers.js';

export class YpCollectionHelpers {
  static splitByStatus(
    items: Array<YpCollectionData>,
    containerConfig: YpCollectionConfiguration | undefined
  ): YpSplitCollectionsReturn {
    if (containerConfig && containerConfig.sortBySortOrder) {
      try {
        items = items.sort(item => {
          return item?.configuration?.optionalSortOrder || 100000;
        });
      } catch (e) {
        console.error(e);
      }
    }

    return {
      active: items.filter(o => {
        return o.status == 'active' || o.status == 'hidden';
      }),
      archived: items.filter(o => {
        return o.status == 'archived';
      }),
      featured: items.filter(o => {
        return o.status == 'featured';
      }),
    };
  }

  static logoImagePath(collectionType: string | undefined, collection: YpCollectionData): string | undefined {
    return YpMediaHelpers.getImageFormatUrl(this.logoImages(collectionType, collection), 0);
  }

  static logoImages(collectionType: string | undefined, collection: YpCollectionData): Array<YpImageData> | undefined {
    switch (collectionType) {
      case 'domain':
        return (collection as YpDomainData).DomainLogoImages;
      case 'community':
        return (collection as YpCommunityData).CommunityLogoImages;
      case 'groupCommunityLink':
        return (collection as YpGroupData).CommunityLink!.CommunityLogoImages;
      case 'group':
      case 'groupDataViz':
        return (collection as YpGroupData).GroupLogoImages;
    }
  }

  static nameTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainName';
      case 'community':
      case 'groupCommunityLink':
        return 'communityName';
      case 'group':
      case 'groupDataViz':
        return 'groupName';
    }
  }

  static descriptionTextType(collectionType: string | undefined): string | undefined {
    switch (collectionType) {
      case 'domain':
        return 'domainContent';
      case 'community':
      case 'groupCommunityLink':
        return 'communityContent';
      case 'group':
        return 'groupContent';
    }
  }
}
