import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpStructuredQuestionEdit } from '../yp-structured-question-edit.js';
import '../yp-structured-question-edit.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpStructuredQuestionEdit', () => {
  let element: YpStructuredQuestionEdit;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const question = {
      text: 'ALEXO'
    } as YpStructuredQuestionData

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-structured-question-edit
        .question="${question}">
      </yp-structured-question-edit>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
