import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPointCommentEdit } from '../yp-point-comment-edit.js';
import '../yp-point-comment-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPointCommentEdit', () => {
  let element: YpPointCommentEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-point-comment-edit
        .point="${YpTestHelpers.getPoint()}"
        .comment="${YpTestHelpers.getPoint()}"
      ></yp-point-comment-edit>
    `);
    await aTimeout(200);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
