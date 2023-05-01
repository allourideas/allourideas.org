import {formatDay, formatMonthYYYY, nowForSite, parseUTCDate} from './util/date.js';
import * as storage from './util/storage.js';

const PERIODS = ['realtime', 'day', 'month', '7d', '30d', '6mo', '12mo', 'year', 'all', 'custom']

import './pl-link.js';
import { BrowserHistory } from './util/history.js';

export function parseQuery(querystring: string, site: PlausibleSiteData): PlausibleQueryData {
  const q = new URLSearchParams(querystring)
  let period = q.get('period')
  const periodKey = `period__${  site.domain}`

  if (PERIODS.includes(period!)) {
    if (period !== 'custom' && period !== 'realtime') storage.setItem(periodKey, period)
  } else if (storage.getItem(periodKey)) {
      period = storage.getItem(periodKey)
    } else {
      period = '30d'
    }

    return {
    period,
    date: q.get('date') ? parseUTCDate(q.get('date')) : nowForSite(site),
    from: q.get('from') ? parseUTCDate(q.get('from')) : undefined,
    to: q.get('to') ? parseUTCDate(q.get('to')) : undefined,
    with_imported: q.get('with_imported') ? q.get('with_imported') === 'true' : true,
    filters: {
      'goal': q.get('goal'),
      'props': JSON.parse(q.get('props')!),
      'source': q.get('source'),
      'utm_medium': q.get('utm_medium'),
      'utm_source': q.get('utm_source'),
      'utm_campaign': q.get('utm_campaign'),
      'utm_content': q.get('utm_content'),
      'utm_term': q.get('utm_term'),
      'referrer': q.get('referrer'),
      'screen': q.get('screen'),
      'browser': q.get('browser'),
      'browser_version': q.get('browser_version'),
      'os': q.get('os'),
      'os_version': q.get('os_version'),
      'country': q.get('country'),
      'region': q.get('region'),
      'city': q.get('city'),
      'page': q.get('page'),
      'entry_page': q.get('entry_page'),
      'exit_page': q.get('exit_page')
    }
  } as PlausibleQueryData
}

export function appliedFilters(query: PlausibleQueryData) {
  return Object.keys(query.filters!)
     //@ts-ignore
    .map((key: string) => [key, query.filters![key]])
    .filter(([_key, value]) => !!value);
}

export function generateQueryString(data: any) {
  const query = new URLSearchParams(window.location.search)
  Object.keys(data).forEach(key => {
    if (!data[key]) {
      query.delete(key)
      return
    }

    query.set(key, data[key])
  })
  return query.toString()
}

export function navigateToQuery(history: BrowserHistory, queryFrom: PlausibleQueryData, newData: PlausibleQueryData | PlausibleQueryStringsData) {
  // if we update any data that we store in localstorage, make sure going back in history will
  // revert them
  const newQueryString = generateQueryString(newData);
  if (newData.period && newData.period !== queryFrom.period) {
    const replaceQuery = new URLSearchParams(window.location.search)
    replaceQuery.set('period', queryFrom.period)
//    history.replace({ search: replaceQuery.toString() })
    const currentUri = `${location.pathname}?${replaceQuery.toString()}`;
    window.history.pushState({}, "", currentUri);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('popstate'));
    });
  } else {
    const currentUri = `${location.pathname}?${newQueryString}`;
    window.history.pushState({}, "", currentUri);
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('popstate'));
    });
  }

  // then push the new query to the history
  history.push({ search: newQueryString })
}

//TODO: Fix routing
//const QueryLinkWithRouter = withRouter(QueryLink)
//export { QueryLinkWithRouter as QueryLink };

//const QueryButtonWithRouter = withRouter(QueryButton)
//export { QueryButtonWithRouter as QueryButton };

export function toHuman(query: PlausibleQueryData) {
  if (query.period === 'day') {
    return `on ${formatDay(query.date)}`
  } if (query.period === 'month') {
    return `in ${formatMonthYYYY(query.date)}`
  } if (query.period === '7d') {
    return 'in the last 7 days'
  } if (query.period === '30d') {
    return 'in the last 30 days'
  } if (query.period === '6mo') {
    return 'in the last 6 months'
  } if (query.period === '12mo') {
    return 'in the last 12 months'
  }
  return ''
}

export function eventName(query: PlausibleQueryData) {
  if (query.filters?.goal) {
    if (query.filters.goal.startsWith('Visit ')) {
      return 'pageviews'
    }
    return 'events'
  }
  return 'pageviews'
}

export const formattedFilters = {
  'goal': 'Goal',
  'props': 'Property',
  'prop_key': 'Property',
  'prop_value': 'Value',
  'source': 'Source',
  'utm_medium': 'UTM Medium',
  'utm_source': 'UTM Source',
  'utm_campaign': 'UTM Campaign',
  'utm_content': 'UTM Content',
  'utm_term': 'UTM Term',
  'referrer': 'Referrer URL',
  'screen': 'Screen size',
  'browser': 'Browser',
  'browser_version': 'Browser Version',
  'os': 'Operating System',
  'os_version': 'Operating System Version',
  'country': 'Country',
  'region': 'Region',
  'city': 'City',
  'page': 'Page',
  'entry_page': 'Entry Page',
  'exit_page': 'Exit Page'
} as Record<string,string>;