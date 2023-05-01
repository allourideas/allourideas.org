import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostMap } from '../yp-post-map.js';
import '../yp-post-map.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostMap', () => {
  let element: YpPostMap;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post-map
        .post="${YpTestHelpers.getPost()}"
        collectionId="1"
        collectionType="LEXO"
      ></yp-post-map>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
