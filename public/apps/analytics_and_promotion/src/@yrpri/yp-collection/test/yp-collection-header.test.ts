import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpCollectionHeader } from '../yp-collection-header.js';
import '../yp-collection-header.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpCollectionHeader', () => {
  let element: YpCollectionHeader;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const collectionType = 'domain';

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-collection-header
        .collection="${YpTestHelpers.getDomain()}"
        .collectionType="${collectionType}"></yp-collection-header>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
