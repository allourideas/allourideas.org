import { html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { YpBaseElement } from '../common/yp-base-element.js';

import '@material/mwc-select';
import '@material/mwc-list/mwc-list-item';


import { Select } from '@material/mwc-select';

@customElement('yp-theme-selector')
export class YpThemeSelector extends YpBaseElement {
  @property({ type: Number })
  selectedTheme: number | undefined;

  @property({ type: Object })
  themeObject: YpThemeContainerObject | undefined;

  @property({ type: Array })
  themes: Array<Record<string, boolean | string | Record<string, string>>> = [];

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    super.updated(changedProperties);

    if (changedProperties.has('selectedTheme')) {
      this._selectedThemeChanged();
      this.fire('yp-theme-changed', this.selectedTheme);
    }

    if (changedProperties.has('themeObject')) {
      this._objectChanged();
    }

    if (changedProperties.has('themes')) {
      this._objectChanged();
    }
  }

  static get styles() {
    return [
      super.styles,
      css`
        mwc-select {
          max-width: 250px;
          width: 250px;
        }
      `,
    ];
  }

  connectedCallback() {
    super.connectedCallback();
    this.themes = window.appGlobals.theme.themes;
  }

  _selectTheme(event: CustomEvent) {
    const target = event.target as HTMLElement;
    if (target.id) {
      this.selectedTheme = parseInt(target.id);
    }
  }

  render() {
    return this.themes
      ? html`
          <mwc-select
            id="select"
            .value="${this.selectedTheme
              ? this.selectedTheme.toString()
              : '0'}"
            .label="${this.t('theme.choose')}"
          >
            ${this.themes.map(
              (theme, index) => html`
                <mwc-list-item
                  @click="${this._selectTheme}"
                  id="${index}"
                  .value="${index.toString()}"
                  ?hidden="${theme.disabled as boolean}"
                  >${theme.name}</mwc-list-item
                >
              `
            )}
          </mwc-select>
        `
      : nothing;
  }

  _objectChanged() {
    if (this.themeObject && this.themeObject.theme_id) {
      this.selectedTheme = this.themeObject.theme_id;
    }
  }

  _selectedThemeChanged() {
    if (this.selectedTheme) {
      window.appGlobals.theme.setTheme(this.selectedTheme);
    }
  }
}
