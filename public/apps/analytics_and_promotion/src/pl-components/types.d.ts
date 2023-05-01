
interface PlausibleQueryFilters {
  goal?: string;
  props?: string;
  prop_key?: string;
  prop_value?: string;
  source?: string;
  utm_medium?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
  screen?: string;
  browser?: string;
  browser_version?: string;
  os?: string;
  os_version?: string;
  country?: string;
  region?: string;
  city?: string;
  page?: string;
  entry_page?: string;
  exit_page?: string;
}

interface PlausibleSiteData {
  domain: string;
  hasGoals: boolean;
  embedded: boolean;
  offset?: number;
  statsBegin: string;
  isDbip?: boolean;
  flags?: {
    custom_dimension_filter?: boolean;
  }
}

interface PlausibleQueryData {
  period: string;
  date?: Date;
  from?: Date;
  to?: Date;
  filters: PlausibleQueryFilters;
  with_imported?: boolean;
  auth?: string;
  country?: string;
  city?: string;
  region?: string;
  country_name?: string;
}

interface PlausibleQueryStringsData {
  date?: string;
  from?: string;
  to?: string;
  period: string;
  filters?: PlausibleQueryFilters;
  with_imported?: boolean;
  auth?: string;
}

interface PlausibleFilterValue {
  key: string;
  value: string;
}

interface PlausiblePropValueData {
  value: number;
  name: string;
  unique_conversions: number;
  total_conversions: number;
  conversion_rate: number;
}

interface PlausibleStatData {
  value: number;
  change?: number;
  name: string;
}

interface PlausibleAggregateResultsData {
  results: {
    visitors:  {
      value: number;
    }
  }
}

interface PlausibleTopStatsData {
  top_stats: PlausibleStatData[];
  sample_percent: number;
  imported_source: string;
  with_imported: boolean;
}

interface PlausibleGoalData {
  prop_names: string[];
  name: string;
  total_conversions: number;
  unique_conversions: number;
  conversion_rate: number;
}

interface PlausiblePageData {
  name: string;
}

interface PlausibleListItemData {
  percentage: number;
  conversion_rate: number;
  name: string;
  tooltipTextToken?: string;
  icon?: string;
}

interface PlausibleReferrerData {
  name: string;
  conversion_rate: number;
  visitors: number;
}

interface PlausibleUtmEntryData {
  label: string;
  shortLabel: string;
  endpoint: string;
}

interface PlausibleUtmTagsData {
  utm_source: PlausibleUtmEntryData;
  utm_medium: PlausibleUtmEntryData;
  utm_campaign: PlausibleUtmEntryData;
  utm_content: PlausibleUtmEntryData;
  utm_term: PlausibleUtmEntryData;
  [key: string]: any;
}

type PlausibleSourcesTabOptions = 'all' | 'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_content' | 'utm_term';

interface PlausibleCountryData {
  name: string;
  flag: string;
  visitors: number;
  alpha_3?: string;
  code: string;
}

interface PlausibleRegionData {
  name: string;
  country_flag: string;
}

interface PlausibleCityData {
  name: string;
  country_flag: string;
}


type PlausibleTimeseriesMetricsOptions = 'visitors'|'pageviews'|'bounce_rate'|'visit_duration'|'visits';




