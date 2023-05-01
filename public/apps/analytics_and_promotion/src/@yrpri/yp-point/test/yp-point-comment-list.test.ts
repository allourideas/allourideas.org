import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointCommentList } from '../yp-point-comment-list.js';
import '../yp-point-comment-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointCommentList', () => {
  let element: YpPointCommentList;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    const commentList = [YpTestHelpers.getPoint(), YpTestHelpers.getPoint(), YpTestHelpers.getPoint()];
  });

  fetchMock.get('/api/points/1/comments',YpTestHelpers.getPoint(), YpTestHelpers.fetchMockConfig);

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-comment-list
      ></yp-point-comment-list>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
