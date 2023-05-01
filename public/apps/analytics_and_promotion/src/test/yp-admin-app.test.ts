/* eslint-disable @typescript-eslint/camelcase */
import { html, fixture, expect } from '@open-wc/testing';

import { YpPromotionApp } from '../yp-promotion-app.js';
import '../yp-admin-app.js';
import { YpTestHelpers } from '../@yrpri/common/test/setup-app.js';


describe('YpPromotionApp', () => {
  let element: YpPromotionApp;

  before(async () => {
    await YpTestHelpers.setupApp();
  });

  beforeEach(async () => {

    element = await fixture(html`
      <yp-promotion-app
        collectionId="1"
        collectionType="domain"></yp-promotion-app>
    `);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
