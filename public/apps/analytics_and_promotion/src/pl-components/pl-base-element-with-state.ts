import { LitElement, css } from 'lit';
import { property } from 'lit/decorators.js';
import { Layouts } from 'lit-flexbox-literals';
import { PlausibleStyles } from './plausibleStyles';
import { PlausibleBaseElement } from './pl-base-element';

export class PlausibleBaseElementWithState extends PlausibleBaseElement {
  @property({ type: Object })
  query!: PlausibleQueryData;

  @property({ type: Object })
  site!: PlausibleSiteData;

  @property({ type: String })
  proxyUrl: string | undefined

  @property({ type: String })
  proxyFaviconBaseUrl: string | undefined

  @property({ type: Object })
  timer: any;

  @property({ type: String })
  currentUserRole!: string;
}
