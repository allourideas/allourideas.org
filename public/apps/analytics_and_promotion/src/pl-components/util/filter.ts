
import { parseQuery, formattedFilters } from '../query.js';
import * as api from '../api.js'
import {apiPath, siteBasePath} from '../util/url.js';

export const FILTER_GROUPS = {
  'page': ['page', 'entry_page', 'exit_page'],
  'source': ['source', 'referrer'],
  'location': ['country', 'region', 'city'],
  'screen': ['screen'],
  'browser': ['browser', 'browser_version'],
  'os': ['os', 'os_version'],
  'utm': ['utm_medium', 'utm_source', 'utm_campaign', 'utm_term', 'utm_content'],
  'goal': ['goal'],
  'props': ['prop_key', 'prop_value']
} as Record<string, string[]>;

export function getFormState(filterGroup: string, query: PlausibleQueryData) {
  if (filterGroup === 'props') {
    const propsObject = query.filters['props']
    const entries = propsObject && Object.entries(propsObject)

    if (entries && entries.length == 1) {
      const propKey = entries[0][0]
      const propValue = valueWithoutPrefix(entries[0][1])

      return {
        'prop_key': {name: propKey, value: propKey, type: FILTER_TYPES.is},
        'prop_value': {name: propValue, value: propValue, type: toFilterType(entries[0][1])}
      }
    }
  }

  return FILTER_GROUPS[filterGroup].reduce((result, filter) => {
    // @ts-ignore
    const rawFilterValue = query.filters[filter] || ''
    const type = toFilterType(rawFilterValue)
    const filterValue = valueWithoutPrefix(rawFilterValue)

    let filterName = filterValue

    if (filter === 'country' && filterValue !== '') {
      filterName = (new URLSearchParams(window.location.search)).get('country_name') as string
    }
    if (filter === 'region' && filterValue !== '') {
      filterName = (new URLSearchParams(window.location.search)).get('region_name') as string
    }
    if (filter === 'city' && filterValue !== '') {
      filterName = (new URLSearchParams(window.location.search)).get('city_name') as string
    }
    return Object.assign(result, {[filter]: {name: filterName, value: filterValue, type}})
  }, {})
}

const FILTER_TYPES = {
  isNot: 'is not',
  contains: 'contains',
  is: 'is'
};

const FILTER_PREFIXES = {
  [FILTER_TYPES.isNot]: '!',
  [FILTER_TYPES.contains]: '~',
  [FILTER_TYPES.is]: ''
};

export function toFilterType(value: string) {
  return Object.keys(FILTER_PREFIXES)
    .find(type => FILTER_PREFIXES[type] === value[0]) || FILTER_TYPES.is;
}

export function valueWithoutPrefix(value: string) {
  return [FILTER_TYPES.isNot, FILTER_TYPES.contains].includes(toFilterType(value))
    ? value.substring(1)
    : value;
}

export function toFilterQuery(value:string, type:string) {
  const prefix = FILTER_PREFIXES[type];
  return prefix + value.trim();
}

export function supportsContains(filterName: string) {
  return ['page', 'entry_page', 'exit_page'].includes(filterName)
}

export function supportsIsNot(filterName: string) {
  return !['goal', 'prop_key'].includes(filterName)
}

export function withIndefiniteArticle(word: string) {
  if (word.startsWith('UTM')) {
    return `a ${  word}`
  } if (['a', 'e', 'i', 'o', 'u'].some((vowel) => word.toLowerCase().startsWith(vowel))) {
    return `an ${  word}`
  }
    return `a ${  word}`

}

export function formatFilterGroup(filterGroup: string) {
  if (filterGroup === 'utm') {
    return 'UTM tags'
  } else if (filterGroup === 'location') {
    return 'Location'
  } else if (filterGroup === 'props') {
    return 'Property'
  } else {
    //@ts-ignore
    return this.t(formattedFilters[filterGroup])
  }
}

export function filterGroupForFilter(filter: string) {
  const map = Object.entries(FILTER_GROUPS).reduce((filterToGroupMap, [group, filtersInGroup]) => {
    const filtersToAdd = {}
    filtersInGroup.forEach((filterInGroup) => {
      //@ts-ignore
      filtersToAdd[filterInGroup] = group
    })
    return { ...filterToGroupMap, ...filtersToAdd}
  }, {})


    //@ts-ignore
    return map[filter] || filter
}