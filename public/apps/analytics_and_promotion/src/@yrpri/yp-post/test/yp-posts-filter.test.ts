import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostsFilter } from '../yp-posts-filter.js';
import '../yp-posts-filter.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostsFilter', () => {
  let element: YpPostsFilter;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-posts-filter
        .group="${YpTestHelpers.getGroup()}"
      ></yp-posts-filter>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
