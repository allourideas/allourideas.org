import { html, css, nothing } from 'lit';
import { property, customElement, state } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import 'lit-google-map';
import './yp-post-card.js';

import { ShadowStyles } from '../common/ShadowStyles.js';

@customElement('yp-post-map')
export class YpPostMap extends YpBaseElement {
  @property({ type: Array })
  posts: Array<YpPostData> | undefined;

  @property({ type: Number })
  groupId: number | undefined;

  @property({ type: Number })
  communityId: number | undefined;

  @property({ type: Boolean })
  noPosts = false;

  @property({ type: Object })
  selectedPost: YpPostData | undefined;

  @property({ type: Number })
  collectionId!: number

  @property({ type: String })
  collectionType!: string

  @state()
  skipFitToMarkersNext = false

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('groupId')) {
      this._groupChanged();
    }

    if (changedProperties.has('communityId')) {
      this._communityChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      ShadowStyles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .mapContainer {
          margin: 0;
          padding: 0;
          width: 960px;
          height: 500px;
          margin-top: 16px;
          margin-bottom: 48px;
        }

        .noMapContainer {
          padding: 32px;
          margin: 16px;
          background-color: #fff;
          font-size: 22px;
          color: #222;
        }

        #map {
        }

        a {
          color: var(--primary-color-700);
        }

        h1 {
          padding: 24px;
        }

        @media (max-width: 934px) {
          .mapContainer {
            margin: 16px;
            width: 800px;
            height: 400px;
          }
        }

        @media (max-width: 832px) {
          .mapContainer {
            margin: 8px;
            width: 600px;
            height: 340px;
          }
        }

        @media (max-width: 632px) {
          .mapContainer {
            margin: 8px;
            width: 400px;
            height: 300px;
          }
        }

        @media (max-width: 420px) {
          .mapContainer {
            margin: 8px;
            width: 330px;
            height: 250px;
          }
        }

        @media (max-width: 360px) {
          .mapContainer {
            margin: 8px;
            width: 280px;
            height: 200px;
          }
        }

        #myInfoCard {
          background-color: #000;
          padding: 0;
          margin: 0 !important;
          --yp-post-map-info-mixin: {
            padding: 0;
            margin: 0 !important;
            max-width: 100%;
            max-height: 100%;
          }
          --yp-post-map-info-beak-mixin: {
            color: #f57c00;
          }
        }
      `,
    ];
  }

  renderInfoCard(post: YpPostData) {
    return post //&& post.id==this.selectedPost.id
      ? html` <yp-post-card mini .post="${post}"></yp-post-card> `
      : nothing;
  }

  render() {
    return html`
      <div class="layout vertical center-center">
        ${this.posts
          ? html`
              <div
                id="mapContainer"
                class="mapContainer shadow-elevation-2dp shadow-transition">
                <lit-google-map
                  additionalMapOptions="{'keyboardShortcuts':false,'fullscreenControl': false}"
                  id="map"
                  version="weekly"
                  api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0"
                  fit-to-markers>
                  ${this.posts.map(
                    post => html`
                      <lit-google-map-marker
                        slot="markers"
                        .latitude="${post.location.latitude}"
                        .longitude="${post.location.longitude}"
                        click-events
                        class="marker"
                        @selector-item-activate="${() => {
                          this.markerClick(post);
                        }}">

                      </lit-google-map-marker>
                    `
                  )}
                </lit-google-map>
              </div>
            `
          : nothing}
        ${this.noPosts
          ? html`
              <div lass="noMapContainer shadow-elevation-2dp shadow-transition">
                <div>${this.t('posts.noMapPosts')}</div>
              </div>
            `
          : nothing}

        <div class="layout horizontal center-center">
          <yp-ajax id="ajax" @response="${this._response}"></yp-ajax>
        </div>
      </div>
    `;
  }

  resetMapHeight() {
    const map = this.$$('#mapContainer');
    if (map) {
      const windowHeight = window.innerHeight;
      let height;
      if (this.wide) {
        height = windowHeight / 1.5;
        //map.style.height = Math.max(Math.min(height, window.innerHeight)),  + 'px';
      } else {
        height = windowHeight / 1.5;
      }
      map.style.width =
        Math.min(window.innerWidth - (this.wide ? 96 : 32), 1920) + 'px';
      map.style.height = height + 'px';
      map.style.marginBottom = '64px';
      if (this.skipFitToMarkersNext===true) {
        this.skipFitToMarkersNext = false;
      } else {
        setTimeout(() => {
          const gMap = this.$$('#map') as YpLitGoogleMapElement;
          if (gMap) {
            gMap.fitToMarkers = true;
            setTimeout(() => {
              gMap.fitToMarkers = false;
            }, 1000);
          }
        });
      }
    }
  }

  connectedCallback() {
    super.connectedCallback()
    switch (this.collectionType) {
      case 'community':
        this.communityId = this.collectionId
        break
      case 'group':
        this.groupId = this.collectionId
        break
    }

    this.addGlobalListener("yp-refresh-group-posts", this._refreshAjax);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeGlobalListener("yp-refresh-group-posts", this._refreshAjax);
  }

  async _groupChanged() {
    if (this.groupId) {
      this.posts = undefined;

      this._response(
        await window.serverApi.getPostLocations('groups', this.groupId)
      );
    } else {
      this.posts = undefined;
    }
  }

  async _communityChanged() {
    if (this.communityId) {
      this.posts = undefined;
      this._response(
        await window.serverApi.getPostLocations('communities', this.communityId)
      );
    } else {
      this.posts = undefined;
    }
  }

  _refreshAjax() {
    if (this.groupId)
      this._groupChanged();
    else if (this.communityId)
      this._communityChanged();
    this.skipFitToMarkersNext = true;
  }

  _response(response: Array<YpPostData>) {
    if (response && response.length > 0) {
      this.noPosts = false;
      this.posts = response;
    } else {
      this.noPosts = true;
    }
    setTimeout(() => {
      this.resetMapHeight();
    });
  }

  markerClick(post: YpPostData) {
    debugger;
    //TODO: Review this, if this data handling with the click makes sense and is not too slow
    window.appGlobals.activity('clicked', 'marker');
    this.selectedPost = post;
    //TODO: Review and removed if the current infocard solution is working
    /*const a = this.selectedPost;
    if (e.srcElement) {
      this.$$('#myInfoCard').showInfoWindow(e.srcElement.marker);
    } else {
      this.$$('#myInfoCard').showInfoWindow(e.currentTarget.marker);
    }
    const infocardDiv = this.$$('#myInfoCard').$$('#infocarddiv');
    infocardDiv.children[1].style.zIndex = '20';
    */
  }
}
