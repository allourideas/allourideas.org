import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpLanguageSelector } from '../yp-language-selector.js';
import '../yp-language-selector.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpLanguageSelector', () => {
  let element: YpLanguageSelector;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-language-selector
      selectedLocale="en"
      ></yp-language-selector>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
