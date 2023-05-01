interface YpCampaignConfigurationData {
  startDate?: string;
  endDate?: string;
  audience?: string;
  utm_campaign: string;
  utm_source: string;
  utm_content?: string;
  utm_term?: string;
  promotionText: string;
  language?: string;
  shareImageUrl?: string;
  mediums: YpCampaignMediumData[];
}

interface YpCampaignMediumData {
  utm_medium: string;
  finaUrl?: string;
  active: boolean;
}

interface YpCampaignData {
  id?: number;
  created_at?: string;
  updated_at?: string;
  post_id?: number;
  group_id?: number;
  community_id?: number;
  domain_id?: number;
  user_id?: number;
  email_list_id?: number;
  configuration: YpCampaignConfigurationData;
}

interface YpNewCampaignData {
  mediums: string[];
  targetAudience?: string;
  name: string;
  promotionText: string;
  shareImageUrl?: string;
}

interface YpCampaignAnalyticsMediumData extends YpCampaignMediumData {
  conversion_rate: number;
  visitors: number;
  topStats: PlausibleStatData[];
}

interface YpCampaignAnalyticsData extends YpCampaignData {
  hasData?: boolean;
  mediums: YpCampaignAnalyticsMediumData[];
}