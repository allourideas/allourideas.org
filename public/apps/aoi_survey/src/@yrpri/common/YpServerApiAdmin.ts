import { YpServerApiBase } from './YpServerApiBase.js';

export class YpServerApiAdmin extends YpServerApiBase {
  public addCollectionItem(
    collectionId: number,
    collectionItemType: string,
    body: Record<string, unknown>
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionItemType
        )}/${collectionId}`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updateTranslation(
    collectionType: string,
    collectionId: number,
    body: YpTranslationTextData
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/update_translation`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getTextForTranslations(
    collectionType: string,
    collectionId: number,
    targetLocale: string
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpServerApiAdmin.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/get_translation_texts?targetLocale=${targetLocale}`
    );
  }

  public addVideoToCollection(collectionId: number, body: Record<string, unknown>, type: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/videos/${collectionId}/${type}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public getCommunityFolders(domainId: number) {
    return this.fetchWrapper(
      this.baseUrlPath + `/domains/${domainId}/availableCommunityFolders`
    );
  }

  public getAnalyticsData(communityId: number, type: string, params: string) {
    return this.fetchWrapper(
      this.baseUrlPath + `/communities/${communityId}/${type}/getPlausibleSeries?${params}`
    );
  }

  public getSsnListCount(communityId: number, ssnLoginListDataId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`
    );
  }

  public deleteSsnLoginList(communityId: number, ssnLoginListDataId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/communities/${communityId}/${ssnLoginListDataId}/ssn_login_list_count`,
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }
}
