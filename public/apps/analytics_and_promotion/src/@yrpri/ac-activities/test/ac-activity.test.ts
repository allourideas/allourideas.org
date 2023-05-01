import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcActivity } from '../ac-activity.js';
import '../ac-activity.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivity', () => {
  let element: AcActivity;
  let fetchMock:any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const activity = {
      type: 'activity.post.new',
      created_at: new Date().toISOString(),
      domain_id: 2,
      Point: YpTestHelpers.getPoint(),
      Post: YpTestHelpers.getPost(),
      User: YpTestHelpers.getUser(),
    } as AcActivityData

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <ac-activity
        .activity="${activity}">
      </ac-activity
      >
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
