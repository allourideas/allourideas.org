import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpFileUpload } from '../yp-file-upload.js';
import '../yp-file-upload.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpFileUpload', () => {
  let element: YpFileUpload;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <yp-file-upload
          .group="${YpTestHelpers.getGroup()}"
          subText="Test">
        </yp-file-upload>
      `);
      await aTimeout(100);
    });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
