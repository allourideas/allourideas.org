import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionItemCard } from '../yp-collection-item-card.js';
import '../yp-collection-item-card.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemCard', () => {
  let element: YpCollectionItemCard;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const itemType = 'community';

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-item-card
        .collection="${YpTestHelpers.getDomain()}"
        .item="${YpTestHelpers.getCommunity()}"
        .itemType="${itemType}"></yp-collection-item-card>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
