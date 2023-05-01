/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
Copyright (c) 2020 Citizens Foundation Iceland / Citizens Foundation USA LitElement Port. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';

/**
`yp-image` is an element for displaying an image that provides useful sizing and
preloading options not found on the standard `<img>` tag.

The `sizing` option allows the image to be either cropped (`cover`) or
letterboxed (`contain`) to fill a fixed user-size placed on the element.

The `preload` option prevents the browser from rendering the image until the
image is fully loaded.  In the interim, either the element's CSS `background-color`
can be be used as the placeholder, or the `placeholder` property can be
set to a URL (preferably a data-URI, for instant rendering) for an
placeholder image.

The `fade` option (only valid when `preload` is set) will cause the placeholder
image/color to be faded out once the image is rendered.

Examples:

  Basically identical to `<img src="...">` tag:

    <yp-image src="http://lorempixel.com/400/400"></yp-image>

  Will letterbox the image to fit:

    <yp-image style="width:400px; height:400px;" sizing="contain"
      src="http://lorempixel.com/600/400"></yp-image>

  Will crop the image to fit:

    <yp-image style="width:400px; height:400px;" sizing="cover"
      src="http://lorempixel.com/600/400"></yp-image>

  Will show light-gray background until the image loads:

    <yp-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload src="http://lorempixel.com/600/400"></yp-image>

  Will show a base-64 encoded placeholder image until the image loads:

    <yp-image style="width:400px; height:400px;" placeholder="data:image/gif;base64,..."
      sizing="cover" preload src="http://lorempixel.com/600/400"></yp-image>

  Will fade the light-gray background out once the image is loaded:

    <yp-image style="width:400px; height:400px; background-color: lightgray;"
      sizing="cover" preload fade src="http://lorempixel.com/600/400"></yp-image>

Custom property | Description | Default
----------------|-------------|----------
`--yp-image-placeholder` | Mixin applied to #placeholder | `{}`
`--yp-image-width` | Sets the width of the wrapped image | `auto`
`--yp-image-height` | Sets the height of the wrapped image | `auto`
*/

@customElement('yp-image')
export class YpImage extends LitElement {
  /**
   * The URL of an image.
   */
  @property({ type: String })
  src: string | undefined = '';

  /**
   * A short text alternative for the image.
   */
  @property({ type: String })
  alt: string | undefined = undefined;

  /**
   * CORS enabled images support:
   * https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image
   */
  @property({ type: String })
  crossorigin: string | undefined = undefined;

  /**
   * When true, the image is prevented from loading and any placeholder is
   * shown.  This may be useful when a binding to the src property is known to
   * be invalid, to prevent 404 requests.
   */
  @property({ type: Boolean })
  preventLoad = false;

  /**
   * Sets a sizing option for the image.  Valid values are `contain` (full
   * aspect ratio of the image is contained within the element and
   * letterboxed) or `cover` (image is cropped in order to fully cover the
   * bounds of the element), or `null` (default: image takes natural size).
   */
  @property({ type: String, reflect: true })
  sizing: string | undefined = undefined;

  /**
   * When a sizing option is used (`cover` or `contain`), this determines
   * how the image is aligned within the element bounds.
   */
  @property({ type: String })
  position = 'center';

  /**
   * When `true`, any change to the `src` property will cause the
   * `placeholder` image to be shown until the new image has loaded.
   */
  @property({ type: Boolean })
  preload = false;

  /**
   * This image will be used as a background/placeholder until the src image
   * has loaded.  Use of a data-URI for placeholder is encouraged for instant
   * rendering.
   */
  @property({ type: String })
  placeholder: string | undefined = undefined;

  /**
   * When `preload` is true, setting `fade` to true will cause the image to
   * fade into place.
   */
  @property({ type: Boolean })
  fade = false;

  /**
   * Read-only value that is true when the image is loaded.
   */
  @property({ type: Boolean })
  loaded = false;

  /**
   * Read-only value that tracks the loading state of the image when the
   * `preload` option is used.
   */
  @property({ type: Boolean })
  loading = false;

  /**
   * Read-only value that indicates that the last set `src` failed to load.
   */
  @property({ type: Boolean })
  error = false;

  /**
   * Can be used to set the width of image (e.g. via binding); size may also
   * be set via CSS.
   */
  @property({ type: String })
  width: string | undefined = undefined;

  /**
   * Can be used to set the height of image (e.g. via binding); size may also
   * be set via CSS.
   * @type number
   * @default null
   */
  @property({ type: String })
  height: string | undefined = undefined;

  _resolvedSrc: string | undefined = undefined;

  ABS_URL = /(^\/[^\/])|(^#)|(^[\w-\d]*:)/;
  workingURL: boolean | undefined = undefined;
  resolveDoc: HTMLDocument | undefined = undefined;

  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
          overflow: hidden;
          position: relative;
        }

        #baseURIAnchor {
          display: none;
        }

        #sizedImgDiv {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          display: none;
        }

        #img {
          display: block;
          width: var(--yp-image-width, auto);
          height: var(--yp-image-height, auto);
        }

        :host([sizing]) #sizedImgDiv {
          display: block;
        }

        :host([sizing]) #img {
          display: none;
        }

        #placeholder {
          position: absolute;
          top: 0px;
          right: 0px;
          bottom: 0px;
          left: 0px;

          background-color: inherit;
          opacity: 1;
        }

        #placeholder.faded-out {
          transition: opacity 0.5s linear;
          opacity: 0;
        }
      `,
    ];
  }

  render() {
    return html`
      <a id="baseURIAnchor" href="#"></a>
      <div
        id="sizedImgDiv"
        role="img"
        ?hidden="${this._computeImgDivHidden}"
        aria-hidden="${this._computeImgDivARIAHidden}"
        aria-label="${ifDefined(this._computeImgDivARIALabel)}"></div>
      <img
        id="img"
        alt="${this.alt ? this.alt : ''}"
        ?hidden="${this._computeImgHidden}"
        crossorigin="${ifDefined(this.crossorigin)}"
        @load="${this._imgOnLoad}"
        @error="${this._imgOnError}" />
      <div
        id="placeholder"
        ?hidden="${this.computePlaceholderHidden}"
        class="${this._computePlaceholderClassName}"></div>
    `;
  }

  $$(id: string): HTMLElement | null {
    return this.shadowRoot ? this.shadowRoot.querySelector(id) : null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._resolvedSrc = '';
  }

  _imgOnLoad() {
    if (
      (this.$$('img') as HTMLImageElement).src !== this._resolveSrc(this.src!)
    ) {
      return;
    }

    this.loading = false;
    this.loaded = true;
    this.error = false;
  }

  _imgOnError() {
    if (
      (this.$$('img') as HTMLImageElement).src !== this._resolveSrc(this.src!)
    ) {
      return;
    }

    this.$$('img')!.removeAttribute('src');
    this.$$('#sizedImgDiv')!.style.backgroundImage = '';

    this.loading = false;
    this.loaded = false;
    this.error = true;
  }

  get computePlaceholderHidden(): boolean {
    return !this.preload || (!this.fade && !this.loading && this.loaded);
  }

  _computePlaceholderClassName() {
    return this.preload && this.fade && !this.loading && this.loaded
      ? 'faded-out'
      : '';
  }

  get _computeImgDivHidden() {
    return !this.sizing;
  }

  get _computeImgDivARIAHidden() {
    return this.alt === '' ? true : false;
  }

  get _computeImgDivARIALabel() {
    if (this.alt !== null) {
      return this.alt;
    }

    // Polymer.ResolveUrl.resolveUrl will resolve '' relative to a URL x to
    // that URL x, but '' is the default for src.
    if (this.src === '') {
      return '';
    }

    // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.
    const resolved = this._resolveSrc(this.src!);
    // Remove query parts, get file name.
    if (resolved)
      return resolved
        .replace(/[?|#].*/g, '')
        .split('/')
        .pop();
    else return '';
  }

  get _computeImgHidden() {
    return !!this.sizing;
  }

  _widthChanged() {
    if (this.width) {
      this.style.width = this.width + 'px';
    }
  }

  _heightChanged() {
    this.style.height = this.height + 'px';
  }

  _loadStateObserver() {
    const newResolvedSrc = this._resolveSrc(this.src!);
    if (newResolvedSrc === this._resolvedSrc) {
      return;
    }

    this._resolvedSrc = '';
    this.$$('img')!.removeAttribute('src');
    this.$$('#sizedImgDiv')!.style.backgroundImage = '';

    if (this.src === '' || this.preventLoad) {
      this.loading = false;
      this.loaded = false;
      this.error = false;
    } else {
      this._resolvedSrc = newResolvedSrc;
      if (this._resolvedSrc)
        (this.$$('img') as HTMLImageElement).src = this._resolvedSrc;
      this.$$('#sizedImgDiv')!.style.backgroundImage =
        'url("' + this._resolvedSrc + '")';

      this.loading = true;
      this.loaded = false;
      this.error = false;
    }
  }

  _placeholderChanged() {
    this.$$('#placeholder')!.style.backgroundImage = this.placeholder
      ? 'url("' + this.placeholder + '")'
      : '';
  }

  _transformChanged() {
    const sizedImgDivStyle = this.$$('#sizedImgDiv')!.style;
    const placeholderStyle = this.$$('#placeholder')!.style;

    if (this.sizing) {
      sizedImgDivStyle.backgroundSize = placeholderStyle.backgroundSize = this.sizing;
    }

    sizedImgDivStyle.backgroundPosition = placeholderStyle.backgroundPosition = this
      .sizing
      ? this.position
      : '';

    sizedImgDivStyle.backgroundRepeat = placeholderStyle.backgroundRepeat = this
      .sizing
      ? 'no-repeat'
      : '';
  }

  _resolveSrc(testSrc: string) {
    let resolved = this.resolveUrl(
      testSrc,
      (this.$$('#baseURIAnchor') as HTMLAnchorElement).href
    );
    // NOTE: Use of `URL` was removed here because IE11 doesn't support
    // constructing it. If this ends up being problematic, we should
    // consider reverting and adding the URL polyfill as a dev dependency.
    if (resolved && resolved.length >= 2 && resolved[0] === '/' && resolved[1] !== '/') {
      // In IE location.origin might not work
      // https://connect.microsoft.com/IE/feedback/details/1763802/location-origin-is-undefined-in-ie-11-on-windows-10-but-works-on-windows-7
      resolved =
        (location.origin || location.protocol + '//' + location.host) +
        resolved;
    }
    return resolved;
  }

  resolveUrl(url: string, baseURI: string) {
    if (url && this.ABS_URL.test(url)) {
      return url;
    }
    if (url === '//') {
      return url;
    }
    // Lazy feature detection.
    if (this.workingURL === undefined) {
      this.workingURL = false;
      try {
        const u = new URL('b', 'http://a');
        u.pathname = 'c%20d';
        this.workingURL = u.href === 'http://a/c%20d';
      } catch (e) {
        // silently fail
      }
    }
    if (!baseURI) {
      baseURI = document.baseURI || window.location.href;
    }
    if (this.workingURL) {
      try {
        return new URL(url, baseURI).href;
      } catch (e) {
        // Bad url or baseURI structure. Do not attempt to resolve.
        return url;
      }
    }
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('placeHolder')) {
      this._placeholderChanged();
    }

    if (changedProperties.has('width')) {
      this._widthChanged();
    }

    if (changedProperties.has('height')) {
      this._widthChanged();
    }

    if (changedProperties.has('sizing') || changedProperties.has('position')) {
      this._transformChanged();
    }

    if (changedProperties.has('src') || changedProperties.has('preventLoad')) {
      this._loadStateObserver();
    }
  }
}
