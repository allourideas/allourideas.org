import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcActivityPointNewsStory } from '../ac-activity-point-news-story.js';
import '../ac-activity-point-news-story.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivityPointNewsStory', () => {
  let element: AcActivityPointNewsStory;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const activity = {
        type: 'activity.point.newsStory.new',
        created_at: new Date().toISOString(),
        domain_id: 2,
        User: YpTestHelpers.getUser(),
        Point: YpTestHelpers.getPoint(),
        Post: YpTestHelpers.getPost(),
    } as AcActivityData

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-point-news-story
        .activity="${activity}">
      </ac-activity-point-news-story
      >
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
