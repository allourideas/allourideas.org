import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpRating } from '../yp-rating.js';
import '../yp-rating.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpRating', () => {
  let element: YpRating;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const alexo = {
      numberOf: 5,
      postId: 1,
      emoji: 'star',
      ratingIndex: 5,
    }

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-rating
        .alexo="${alexo}"
      ></yp-rating>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
