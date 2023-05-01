import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpApiActionDialog } from '../yp-api-action-dialog.js';
import '../yp-api-action-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpApiActionDialog', () => {
  let element: YpApiActionDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-api-action-dialog
        confirmationText="good morning">
      </yp-api-action-dialog>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
