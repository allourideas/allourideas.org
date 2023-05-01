import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpAutoTranslateDialog} from '../yp-autotranslate-dialog.js';
import '../yp-autotranslate-dialog.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpAutoTranslateDialog', () => {
  let element: YpAutoTranslateDialog;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const translate = {
      confirmationText: 'Good-morning'
    }

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-autotranslate-dialog
        confirmationText="ALEXOSS">
      </yp-autotranslate-dialog>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
