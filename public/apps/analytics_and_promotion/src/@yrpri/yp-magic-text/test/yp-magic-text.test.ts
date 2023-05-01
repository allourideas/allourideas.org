import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpMagicText } from '../yp-magic-text.js';
import '../yp-magic-text.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpMagicText', () => {
  let element: YpMagicText;
  let fetchMock: any

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-magic-text
        content='ALXOE'>
      </yp-magic-text>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
