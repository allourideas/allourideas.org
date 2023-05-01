import { html, fixture, expect, aTimeout, oneEvent, elementUpdated, fixtureCleanup, nextFrame } from '@open-wc/testing';

import { AcActivities } from '../ac-activities.js';
import '../ac-activities.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivities', () => {
  let element: AcActivities;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    const activity = {
      type: 'activity.post.new',
      created_at: new Date().toISOString(),
      domain_id: 2,
      User: YpTestHelpers.getUser(),
      Point: YpTestHelpers.getPoint(),
      Post: YpTestHelpers.getPost(),
    } as AcActivityData;

    const recommendedPost = {
      id: 1,
      location: {
        latitude: 2,
        longitude: 3,
      },
      name: 'Robert',
      group_id: 1,
      description: 'Post-Test',
      counter_endorsements_up: 2,
      counter_endorsements_down: 4,
      counter_points: 5,
      Group: {
        id: 1,
        name: 'Alex',
        community_id: 1,
        counter_points: 1,
        counter_users: 2,
        counter_posts: 1,
        configuration: {
          makeMapViewDefault: false,
        },
      },
    } as YpPostData;

    const activities = [activity, {...activity, id: 2},  {...activity, id: 3}];
    const recommendedPosts = [recommendedPost, recommendedPost];

    fetchMock.get('/api/activities/groups/1', { activities: activities }, YpTestHelpers.fetchMockConfig);
    fetchMock.get('/api/recommendations/groups/1',recommendedPosts, YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async() => {
    //TODO: Remove this hack when LitVirtualizer is ready
    (window as any).ResizeObserver = undefined;

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <ac-activities
        collectionId="1"
        collectionType="group">
      </ac-activities>
    `);

    await aTimeout(150);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });

  after(async () => {
    fetchMock.reset();
  });
});