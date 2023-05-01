import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcActivityPoint } from '../ac-activity-point.js';
import '../ac-activity-point.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivityPoint', () => {
  let element: AcActivityPoint;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const activity = {
        type: 'activity.point.new',
        created_at: new Date().toISOString(),
        domain_id: 2,
        Point: YpTestHelpers.getPoint(),
        Post: YpTestHelpers.getPost(),
        User: YpTestHelpers.getUser(),
    } as AcActivityData

    element = await fixture(html`
    ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-point
        .activity="${activity}">
      </ac-activity-point
      >
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
