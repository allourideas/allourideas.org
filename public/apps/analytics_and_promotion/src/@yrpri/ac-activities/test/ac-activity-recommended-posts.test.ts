import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { AcActivityRecommendedPosts } from '../ac-activity-recommended-posts.js';
import '../ac-activity-recommended-posts.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('AcActivityRecommendedPosts', () => {
  let element: AcActivityRecommendedPosts;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {
    const recommendedPost = {
        id: 1,
        location:{
            latitude: 2,
            longitude: 3
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
          makeMapViewDefault: false
          }
        }
      } as YpPostData;

      const recommendedPosts = [recommendedPost, recommendedPost]

    element = await fixture(html`
    ${YpTestHelpers.renderCommonHeader()}
      <ac-activity-recommended-posts
        .recommendedPosts ="${recommendedPosts}">
      </ac-activity-recommended-posts
      >
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
