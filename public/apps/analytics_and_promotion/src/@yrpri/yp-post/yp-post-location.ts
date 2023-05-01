/* eslint-disable @typescript-eslint/ban-ts-ignore */
import { html, css, nothing } from 'lit';
import { property, customElement } from 'lit/decorators.js';

import '@material/mwc-button';
import '@material/mwc-circular-progress-four-color';

import 'lit-google-map';

import { YpBaseElement } from '../common/yp-base-element.js';

import { TextField } from '@material/mwc-textfield';

@customElement('yp-post-location')
export class YpPostLocation extends YpBaseElement {
  @property({ type: Object })
  map: YpLitGoogleMapElement | undefined;

  @property({ type: Object })
  group: YpGroupData | undefined;

  @property({ type: Object })
  post: YpPostData | undefined;

  @property({ type: Number })
  defaultLatitude = 64.13897027178841;

  @property({ type: Number })
  defaultLongitude = -21.876912117004395;

  @property({ type: String })
  mapSearchString = '';

  @property({ type: String })
  mapSearchResultAddress = '';

  @property({ type: Object })
  location: YpLocationData | undefined;

  @property({ type: String })
  encodedLocation: string | undefined;

  @property({ type: Object })
  marker: HTMLElement | undefined;

  @property({ type: Boolean })
  active = false;

  @property({ type: Boolean })
  narrowPad = false;

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (changedProperties.has('group')) {
      this._groupChanged();
    }

    if (changedProperties.has('location')) {
      this._locationChanged();
    }

    if (changedProperties.has('post')) {
      this._postChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        .location-button {
        }

        #map {
          width: 100%;
          height: 100%;
        }

        @media screen and (-ms-high-contrast: active),
          (-ms-high-contrast: none) {
          #map {
            min-height: 220px;
          }
        }

        .mapSearchInput {
          width: 100%;
          margin-top: 8px;
        }

        mwc-input {
          width: 250px;
        }

        .searchResultText {
          width: 100%;
          text-align: right;
          padding-top: 8px;
        }

        mwc-button {
          font-size: 16px;
          padding-top: 32px;
        }

        @media (max-width: 390px) {
          #map {
            max-height: 180px;
          }
        }

        @media (max-width: 320px) {
          #map {
            max-height: 160px;
          }
        }

        .mapContainer {
          width: 450px;
          height: 250px;
        }
      `,
    ];
  }

  render() {
    return this.group
      ? html`<div class="mapContainer">
            <lit-google-map
              id="map"
              @map-zoom-changed="${this._mapZoomChanged}"
              api-key="AIzaSyDkF_kak8BVZA5zfp5R4xRnrX8HP3hjiL0"
              version="weekly"
              @map-type-changed="${this._mapTypeChanged}"
              class="map"
              @zoom-changed="${this._zoomChanged}"
              fit-to-markers>
              <lit-google-map-marker
                slot="markers"
                .latitude="${this.location ? this.location.latitude : this.defaultLatitude}"
                .longitude="${this.location ? this.location.longitude : this.defaultLongitude}"
                id="marker"></lit-google-map-marker>
            </lit-google-map>
          </div>
          <div class="mapSearchInput layout vertical center-center">
            <div class="layout horizontal center-center wrap">
              <mwc-textfield
                maxlength="60"
                id="mapSearchInput"
                .label="${this.t('maps.searchInput')}"
                .value="${this.mapSearchString}"
                @keydown="${this._submitOnEnter}"></mwc-textfield>
              <mwc-button
                @click="${this._searchMap}"
                .label="${this.t('maps.search')}"></mwc-button>
            </div>
            <div class="searchResultText layout horizontal center-center">
              ${this.mapSearchResultAddress}
            </div>
            <mwc-circular-progress-four-color
              hidden
              id="spinner"></mwc-circular-progress-four-color>
          </div> `
      : nothing;
  }

  _mapZoomChanged(event: CustomEvent) {
    if (this.location) this.location.map_zoom = event.detail;
  }

  get mapZoom() {
    if (this.location && this.location.map_zoom) return this.location.map_zoom;
    else return 15;
  }

  _submitOnEnter(event: KeyboardEvent) {
    if (event.keyCode === 13) {
      this._searchMap();
    }
  }

  _searchMap() {
    const map = this.$$('#map') as YpLitGoogleMapElement;
    //@ts-ignore
    const service = new google.maps.places.PlacesService(map);

    (this.$$('#spinner') as HTMLElement).hidden = false;
    const request = {
      query: (this.$$("#mapSearchInput") as TextField).value,
      fields: ['name', 'geometry'],
    };

    //@ts-ignore
    service.findPlaceFromQuery(request, (results, status) => {
      //@ts-ignore
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        (this.$$('#spinner') as HTMLElement).hidden = true;
        if (results && results.length > 0) {
          this.mapSearchResultAddress = results[0].formatted_address;
          (this.$$('#map') as YpLitGoogleMapElement).zoom = 15;
          this.location = {
            latitude: results[0].geometry.location.lat(),
            longitude: results[0].geometry.location.lng(),
            map_zoom: 15,
          };
          (this.$$('#map') as YpLitGoogleMapElement).updateMarkers()
          //this.$$('#map').resize();
        }
      }
    });

    this.mapSearchResultAddress = '';
  }

  connectedCallback() {
    super.connectedCallback();
    if (!this.location) {
      setTimeout(() => {
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(position => {
            if (!this.location)
              this.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                map_zoom: 13,
              };
          });
        }
      }, 50);
    }
  }

  _zoomChanged(event: CustomEvent) {
    if (this.location && event.detail && event.detail.value) {
      this.location.map_zoom = event.detail.value;
    }
    this.encodedLocation = JSON.stringify(this.location);
  }

  _mapTypeChanged(event: CustomEvent) {
    if (this.location && event.detail && event.detail.value) {
      this.location.mapType = event.detail.value;
    }
    this.encodedLocation = JSON.stringify(this.location);
  }

  _locationChanged() {
    if (this.location) {
      const map = this.$$('#map') as YpLitGoogleMapElement
      if (this.location.map_zoom)
        map.zoom = this.location.map_zoom;
      if (this.location.mapType)
        map.mapType = this.location.mapType;

//      map.updateMarkers()
//      map.fitToMarkersChanged()
      map.requestUpdate()
      //TODO: See if this is needed
      //this.$$('#map').resize();
      this.encodedLocation = JSON.stringify(this.location);
    }
  }

  _setLocation(event: CustomEvent) {
    this.location = {
      latitude: event.detail.latLng.lat(),
      longitude: event.detail.latLng.lng(),
      mapType: (this.$$('#map') as YpLitGoogleMapElement).mapType,
      map_zoom: (this.$$('#map') as YpLitGoogleMapElement).zoom,
    };
  }

  _groupChanged() {
    const group = this.group;
    if (group) {
      let longLat;
      if (
        group.configuration &&
        group.configuration.defaultLocationLongLat &&
        group.configuration.defaultLocationLongLat != '' &&
        group.configuration.defaultLocationLongLat.split(',').length > 1
      ) {
        longLat = group.configuration.defaultLocationLongLat.trim().split(',');
        this.defaultLongitude = parseFloat(longLat[0]);
        this.defaultLatitude = parseFloat(longLat[1]);
      } else if (
        group.Community &&
        group.Community.configuration &&
        group.Community.configuration.defaultLocationLongLat &&
        group.Community.configuration.defaultLocationLongLat != '' &&
        group.Community.configuration.defaultLocationLongLat.split(',').length >
          1
      ) {
        longLat = group.Community.configuration.defaultLocationLongLat
          .trim()
          .split(',');
        this.defaultLongitude = parseFloat(longLat[0]);
        this.defaultLatitude = parseFloat(longLat[1]);
      }
    }
  }

  _postChanged() {
    if (!this.post) {
      this.location = undefined;
    }
  }
}
