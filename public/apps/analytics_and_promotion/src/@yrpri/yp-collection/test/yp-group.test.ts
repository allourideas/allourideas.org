import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpGroup } from '../yp-group.js';
import '../yp-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpGroup', () => {
  let element: YpGroup;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/groups/1',YpTestHelpers.getGroupResults(), YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/groups/1/pages',[], YpTestHelpers.fetchMockConfig);

  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-group
        collectionId="1">
      </yp-group>
    `);
    await aTimeout(200);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
