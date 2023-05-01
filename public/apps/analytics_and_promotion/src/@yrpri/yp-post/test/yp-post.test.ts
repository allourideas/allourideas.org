import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPost } from '../yp-post.js';
import '../yp-post.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPost', () => {
  let element: YpPost;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    fetchMock.get('/api/post/1',YpTestHelpers.getPost(), YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-post
        collectionId="1"
      ></yp-post>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
