import { html, fixture, expect, aTimeout } from '@open-wc/testing';

import { YpSurveyGroup } from '../yp-survey-group.js';
import '../yp-survey-group.js';
import { YpTestHelpers } from '../../common/test/setup-app.js';


describe('YpSurveyGroup', () => {
  let element: YpSurveyGroup;
  let fetchMock: any;

  before(async () => {
    fetchMock = YpTestHelpers.getFetchMock();
    await YpTestHelpers.setupApp();

    const group = {
      id: 1,
      name: 'Betri Reykjavik Test',
      objectives: '',
      counter_posts: 10,
      counter_points: 11,
      counter_users: 12,
      configuration: {
        structuredQuestionsJson: [
          {
            type: 'textfield',
            maxLength: 100,
            text: "Whats up"
          },
          {
            type: 'textfield',
            maxLength: 300,
            text: "Whats2 up"
          },
          {
            type: 'textfield',
            maxLength: 200,
            text: "Whats1 up"
          }
        ]
      }
    } as YpGroupData;

    fetchMock.get('/api/groups/1/survey', group, YpTestHelpers.fetchMockConfig);
  });

  beforeEach(async () => {

    element = await fixture(html`
      ${YpTestHelpers.renderCommonHeader()}
      <yp-survey-group
        surveyGroupId="1">
      </yp-survey-group>
    `);
    await aTimeout(100);
  });

  it('passes the a11y audit', async () => {
    debugger;
    await expect(element).shadowDom.to.be.accessible();
  });
});
