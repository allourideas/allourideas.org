import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionStats } from '../yp-collection-stats.js';
import '../yp-collection-stats.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionStats', () => {
  let element: YpCollectionStats;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const collectionType = 'domain';

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-stats
        .collection="${YpTestHelpers.getDomain()}"
        .collectionType="${collectionType}"></yp-collection-stats>
    `);
    await aTimeout(100)
  });
/*
  it('renders 3 icons', () => {
    const allIcons = element.shadowRoot!.querySelectorAll('mwc-icon')!;
    expect(allIcons.length).to.equal(3);
  });
*/
  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
