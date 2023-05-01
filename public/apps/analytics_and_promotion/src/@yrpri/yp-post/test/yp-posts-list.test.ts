import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpPostsList } from '../yp-posts-list.js';
import '../yp-posts-list.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';

describe('YpPostslist', () => {
  let element: YpPostsList;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    const posts = [
      {
        id: 1,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
      },
      {
        id: 2,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert 2',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
      },
      {
        id: 3,
        location:{
          latitude: 2,
          longitude: 3,
        },
        name: 'Robert 3',
        group_id: 1,
        description: 'Post-Test',
        counter_endorsements_up: 2,
        counter_endorsements_down: 4,
        counter_points: 5,
      },
    ] as Array<YpPostData>

    fetchMock.get('/api/groups/1/posts/newest/null/open?offset=0', posts, YpTestHelpers.fetchMockConfig);
  });

    beforeEach(async () => {
      element = await fixture(html`
        ${YpTestHelpers.renderCommonHeader()}
        <yp-posts-list
          .group="${YpTestHelpers.getGroup()}"
        ></yp-posts-list>
      `);
      await aTimeout(100);
    });

    it('passes the a11y audit', async () => {
      debugger;
      await expect(element).shadowDom.to.be.accessible();
    });
  });