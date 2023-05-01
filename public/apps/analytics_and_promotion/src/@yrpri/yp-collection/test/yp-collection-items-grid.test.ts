import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionItemsGrid } from '../yp-collection-items-grid.js';
import '../yp-collection-items-grid.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionItemsGrid', () => {
  let element: YpCollectionItemsGrid;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });


  beforeEach(async () => {
    const collectionType = 'domain';

    const collectionItems = YpTestHelpers.getDomain().Communities;

    const collectionItemType = 'community'


    element = await fixture(html`
    ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-items-grid
        .collection="${YpTestHelpers.getDomain()}"
        .collectionItems="${collectionItems}"
        .collectionType="${collectionType}"
        .collectionItemType="${collectionItemType}">
        </yp-collection-items-grid>
    `);
    await aTimeout(1000)
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
