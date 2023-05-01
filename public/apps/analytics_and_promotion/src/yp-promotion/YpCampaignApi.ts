import { YpServerApiBase } from '../@yrpri/common/YpServerApiBase';

export class YpCampaignApi extends YpServerApiBase {
  public createCampaign(
    collectionType: string,
    collectionId: number,
    body: YpCampaignData
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpCampaignApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/create_campaign`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public updateCampaign(
    collectionType: string,
    collectionId: number,
    campaignId: number,
    body: YpCampaignData
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpCampaignApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/${campaignId}/update_campaign`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
      false
    );
  }

  public deleteCampaign(
    collectionType: string,
    collectionId: number,
    campaignId: number
  ) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpCampaignApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/${campaignId}/delete_campaign`,
      {
        method: 'DELETE',
        body: JSON.stringify({}),
      },
      false
    );
  }

  public getCampaigns(collectionType: string, collectionId: number) {
    return this.fetchWrapper(
      this.baseUrlPath +
        `/${YpCampaignApi.transformCollectionTypeToApi(
          collectionType
        )}/${collectionId}/get_campaigns`
    );
  }
}
