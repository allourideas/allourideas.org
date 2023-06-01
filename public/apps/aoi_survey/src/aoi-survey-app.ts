import { html, css, nothing } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';

import '@material/web/navigationbar/navigation-bar.js';
import '@material/web/navigationtab/navigation-tab.js';
//import '@material/web/navigationdrawer/lib/navigation-drawer-styles.css.js';
import '@material/web/navigationdrawer/navigation-drawer.js';
import '@material/web/list/list-item.js';
import '@material/web/list/list.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/mwc-snackbar/mwc-snackbar.js';
import { argbFromHex } from '@material/material-color-utilities';

import '@material/web/menu/menu.js';
import { cache } from 'lit/directives/cache.js';

import './@yrpri/common/yp-image.js';
import { YpBaseElement } from './@yrpri/common/yp-base-element.js';

//import './chat/yp-chat-assistant.js';
import { Layouts } from './flexbox-literals/classes.js';

import './survey/aoi-survey-intro.js';
import './survey/aoi-survey-voting.js';
import './survey/aoi-survey-results.js';
import './survey/aoi-survey-analysis.js';
import { AoiServerApi } from './survey/AoiServerApi.js';
import { AoiAppGlobals } from './AoiAppGlobals.js';
import { NavigationDrawer } from '@material/web/navigationdrawer/lib/navigation-drawer.js';
import { Snackbar } from '@material/mwc-snackbar/mwc-snackbar.js';
import { NavigationTab } from '@material/web/navigationtab/lib/navigation-tab.js';
import { NavigationBar } from '@material/web/navigationbar/lib/navigation-bar.js';
import {
  Scheme,
  applyTheme,
  themeFromSourceColor,
} from './@yrpri/common/YpMaterialThemeHelper.js';
import { YpAppUser } from './@yrpri/yp-app/YpAppUser.js';
import { AoiAppUser } from './AoiAppUser.js';

const PagesTypes = {
  Introduction: 1,
  Voting: 2,
  Results: 3,
  Analysis: 4,
  Share: 5,
};

declare global {
  interface Window {
    appGlobals: any /*AoiAppGlobals*/;
    aoiServerApi: AoiServerApi;
    needsNewEarl: boolean;
    csrfToken: string;
  }
}

@customElement('aoi-survey-app')
export class AoiSurveyApp extends YpBaseElement {
  @property({ type: Number })
  pageIndex = 1;

  @property({ type: Number })
  totalNumberOfVotes = 0;

  @property({ type: String })
  lastSnackbarText: string | undefined;

  @property({ type: String })
  collectionType = 'domain';

  @property({ type: String })
  earlName!: string;

  @property({ type: String })
  currentError: string | undefined;

  @property({ type: String })
  themeColor = '#0489cf';

  @property({ type: String })
  themePrimaryColor = '#000000';

  @property({ type: String })
  themeSecondaryColor = '#000000';

  @property({ type: String })
  themeTertiaryColor = '#000000';

  @property({ type: String })
  themeNeutralColor = '#000000';

  @property({ type: String })
  themeScheme: Scheme = 'tonal';

  @property({ type: Number })
  themeContrastBalance = 0.0;

  @property({ type: Object })
  earl!: AoiEarlData;

  @property({ type: Object })
  question!: AoiQuestionData;

  @property({ type: Object })
  prompt!: AoiPromptData;

  @property({ type: Boolean })
  isAdmin = false;

  @property({ type: Boolean })
  surveyClosed = false;

  @property({ type: String })
  appearanceLookup!: string;

  @property({ type: String })
  currentLeftAnswer: string;

  @property({ type: String })
  currentRightAnswer: string;

  @property({ type: String })
  currentPromptId: number;

  drawer: NavigationDrawer;

  constructor() {
    super();

    window.aoiServerApi = new AoiServerApi();
    window.appGlobals = new AoiAppGlobals(window.aoiServerApi);
    window.appUser = new AoiAppUser(window.aoiServerApi);
    this.earlName = window.appGlobals.earlName;

    // Set this.themeDarkMode from localStorage or otherwise to true
    const savedDarkMode = localStorage.getItem('md3-aoi-dark-mode');
    if (savedDarkMode) {
      this.themeDarkMode = true;
    } else {
      this.themeDarkMode = false;
    }

    window.appGlobals.activity('pageview');
  }

  getServerUrlFromClusterId(clusterId: number) {
    if (clusterId == 1) {
      return 'https://betrireykjavik.is/api';
    } else if (clusterId == 3) {
      return 'https://ypus.org/api';
    } else {
      return 'https://yrpri.org/api';
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this._setupEventListeners();

    const savedColor = localStorage.getItem('md3-yrpri-promotion-color');
    if (savedColor) {
      this.fireGlobal('yp-theme-color', savedColor);
    }

    this.getEarl();
  }

  async getEarl() {
    const earlResponse = await window.aoiServerApi.getEarl(this.earlName);
    this.earl = earlResponse.earlContainer.earl;
    this.question = earlResponse.question;
    this.prompt = earlResponse.prompt;
    this.appearanceLookup = this.question.appearance_id;
    this.currentLeftAnswer = this.prompt.left_choice_text;
    this.currentRightAnswer = this.prompt.right_choice_text;
    this.currentPromptId = this.prompt.id;

    window.csrfToken = earlResponse.csrfToken;
    document.title = this.question.name;

    if (earlResponse.isAdmin === true) {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }

    if (this.earl.active) {
      this.surveyClosed = false;
    } else {
      this.surveyClosed = true;
    }

    if (this.earl.configuration.theme_color) {
      this.themeColor = this.earl.configuration.theme_color;
      this.themePrimaryColor = this.earl.configuration.theme_primary_color;
      this.themeSecondaryColor = this.earl.configuration.theme_secondary_color;
      this.themeTertiaryColor = this.earl.configuration.theme_tertiary_color;
      this.themeNeutralColor = this.earl.configuration.theme_neutral_color;

      this.themeScheme = this.earl.configuration.theme_scheme
        ? this.earl.configuration.theme_scheme.toLowerCase()
        : 'tonal';

      this.themeChanged();
    }

    this.fireGlobal('set-ids', {
      earlId: this.earl.id,
      questionId: this.question.id,
      promptId: this.prompt.id,
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._removeEventListeners();
  }

  getHexColor(color: string) {
    if (color) {
      // Replace all # with nothing
      color = color.replace(/#/g, '');
      if (color.length === 6) {
        return `#${color}`;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  }

  themeChanged(target: HTMLElement | undefined = undefined) {
    let themeCss = {} as any;

    const isDark =
      this.themeDarkMode === undefined
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
        : this.themeDarkMode;

    if (this.getHexColor(this.themeColor)) {
      themeCss = themeFromSourceColor(
        this.getHexColor(this.themeColor),
        isDark,
        this.themeScheme,
        this.themeContrastBalance
      );
    } else {
      themeCss = themeFromSourceColor(
        {
          primary: this.getHexColor(this.themePrimaryColor || "#000000"),
          secondary: this.getHexColor(this.themeSecondaryColor || "#000000"),
          tertiary: this.getHexColor(this.themeTertiaryColor || "#000000"),
          neutral: this.getHexColor(this.themeNeutralColor || "#000000"),
        },
        isDark,
        this.themeScheme,
        this.themeContrastBalance
      );
    }

    applyTheme(document, themeCss);
  }

  snackbarclosed() {
    this.lastSnackbarText = undefined;
  }

  tabChanged(event: CustomEvent) {
    if (event.detail.activeIndex == 0) {
      this.pageIndex = 1;
    } else if (event.detail.activeIndex == 1) {
      this.pageIndex = 2;
    } else if (event.detail.activeIndex == 2) {
      this.pageIndex = 3;
    } else if (event.detail.activeIndex == 3) {
      this.pageIndex = 4;
    }
  }

  exitToMainApp() {
    window.location.href = `/`;
  }

  async _displaySnackbar(event: CustomEvent) {
    this.lastSnackbarText = event.detail;
    await this.updateComplete;
    (this.$$('#snackbar') as Snackbar).show();
  }

  _setupEventListeners() {
    this.addListener('app-error', this._appError);
    this.addListener('display-snackbar', this._displaySnackbar);
    this.addListener('toggle-dark-mode', this.toggleDarkMode.bind(this));
  }

  _removeEventListeners() {
    this.removeListener('display-snackbar', this._displaySnackbar);
    this.removeListener('app-error', this._appError);
    this.removeListener('toggle-dark-mode', this.toggleDarkMode.bind(this));
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    super.updated(changedProperties);
    if (
      changedProperties.has('themeColor') ||
      changedProperties.has('themeDarkMode')
    ) {
      this.themeChanged();
    }
  }

  _appError(event: CustomEvent) {
    console.error(event.detail.message);
    this.currentError = event.detail.message;
    //(this.$$('#errorDialog') as Dialog).open = true;
  }

  get adminConfirmed() {
    return true;
  }

  _settingsColorChanged(event: CustomEvent) {
    this.fireGlobal('yp-theme-color', event.detail.value);
  }

  static get styles() {
    return [
      Layouts,
      css`
        :host {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        :host {
          --md-fab-container-color: var(--md-sys-color-surface);
        }

        body {
          background-color: var(--md-sys-color-surface, #fefefe);
        }

        .analyticsHeaderText {
          font-size: var(--md-sys-typescale-headline-large-size, 18px);
          margin-top: 16px;
          margin-bottom: 16px;
        }

        .ypLogo {
          margin-top: 16px;
        }

        .rightPanel {
          width: 100%;
        }

        .drawer {
          margin-left: 16px;
          padding-left: 8px;
          margin-right: 16px;
          padding-bottom: 560px;
        }

        md-list-item {
          --md-list-list-item-container-color: var(--md-sys-color-surface);
          color: var(--md-sys-color-on-surface);
          --md-list-list-item-label-text-color: var(--md-sys-color-on-surface);
        }

        .selectedContainer {
          --md-list-list-item-container-color: var(
            --md-sys-color-secondary-container
          );
          color: var(--md-sys-color-on-secondary-container);
          --md-list-list-item-label-text-color: var(
            --md-sys-color-on-secondary-container
          );
        }

        md-navigation-drawer {
          --md-navigation-drawer-container-color: var(--md-sys-color-surface);
        }

        md-list {
          --md-list-container-color: var(--md-sys-color-surface);
        }

        md-navigation-bar {
          --md-navigation-bar-container-color: var(--md-sys-color-surface);
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100vh;
        }

        .topAppBar {
          border-radius: 48px;
          background-color: var(--md-sys-color-primary-container);
          color: var(--md-sys-color-on-primary-container);
          margin-top: 32px;
          padding: 0px;
          padding-left: 32px;
          padding-right: 32px;
          text-align: center;
        }

        .collectionLogoImage {
          width: 60px;
          height: 60px;
          margin-left: 64px;
        }

        .mainPageContainer {
          margin-top: 16px;
        }

        .navContainer {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          z-index: 7;
        }

        .darkModeButton {
          margin-top: 16px;
          margin-left: 80px;
        }

        [hidden] {
          display: none !important;
        }

        @media (max-width: 960px) {
          .mainPageContainer {
            max-width: 100%;
            width: 100%;
            margin-bottom: 96px;
            margin-top: 0;
          }

          prompt-promotion-dashboard {
            max-width: 100%;
          }
        }
      `,
    ];
  }

  changeTabTo(tabId: number) {
    this.tabChanged({ detail: { activeIndex: tabId } } as CustomEvent);
  }

  updateThemeColor(event: CustomEvent) {
    this.themeColor = event.detail;
  }

  sendVoteAnalytics() {
    if (this.totalNumberOfVotes % 10 === 0) {
      window.appGlobals.activity(`User voted ${this.totalNumberOfVotes} times`);
    }
  }

  updateappearanceLookup(event: CustomEvent) {
    this.appearanceLookup = event.detail.appearanceLookup;
    this.currentPromptId = event.detail.promptId;
    this.currentLeftAnswer = event.detail.leftAnswer;
    this.currentRightAnswer = event.detail.rightAnswer;

    this.totalNumberOfVotes++;
    this.sendVoteAnalytics();
  }

  renderIntroduction() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  renderShare() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  toggleDarkMode() {
    this.themeDarkMode = !this.themeDarkMode;
    if (this.themeDarkMode) {
      window.appGlobals.activity('Settings - dark mode');
      localStorage.removeItem('md3-aoi-dark-mode');
    } else {
      window.appGlobals.activity('Settings - light mode');
      localStorage.setItem('md3-aoi-dark-mode', 'true');
    }
    this.themeChanged();
  }

  startVoting() {
    this.pageIndex = 2;
    if (this.$$('#navBar') as NavigationBar) {
      (this.$$('#navBar') as NavigationBar).activeIndex = 1;
    }
  }

  openResults() {
    this.pageIndex = 3;
    if (this.$$('#navBar') as NavigationBar) {
      (this.$$('#navBar') as NavigationBar).activeIndex = 2;
    }
  }

  openAnalytics() {
    window.location.href = `/${this.earl.name}/analytics`;
  }

  goToAdmin() {
    window.location.href = `/${this.earl.name}/admin`;
  }

  _renderPage() {
    if (this.earl) {
      switch (this.pageIndex) {
        case PagesTypes.Introduction:
          return html`<aoi-survey-intro
            .earl="${this.earl}"
            .question="${this.question}"
            @startVoting="${this.startVoting}"
            @openResults="${this.openResults}"
            .themeDarkMode="${this.themeDarkMode}"
          ></aoi-survey-intro>`;
        case PagesTypes.Voting:
          return cache(html`<aoi-survey-voting
            .earl="${this.earl}"
            .question="${this.question}"
            .leftAnswer="${this.currentLeftAnswer}"
            .rightAnswer="${this.currentRightAnswer}"
            .promptId="${this.currentPromptId}"
            .appearanceLookup="${this.appearanceLookup}"
            @update-appearance-lookup="${this.updateappearanceLookup}"
          ></aoi-survey-voting>`);
        case PagesTypes.Results:
          return html`<aoi-survey-results
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-results>`;
        case PagesTypes.Analysis:
          return html`<aoi-survey-analysis
            .earl="${this.earl}"
            .question="${this.question}"
          ></aoi-survey-analysis>`;
        case PagesTypes.Share:
          return html` ${this.renderShare()} `;
        default:
          return html`
            <p>Page not found try going to <a href="#main">Main</a></p>
          `;
      }
    } else {
      return html` <div class="loading">
        <md-circular-progress indeterminate></md-circular-progress>
      </div>`;
    }
  }

  renderScore() {
    return html` <div class="layout vertical center-center"></div> `;
  }

  renderNavigationBar() {
    if (this.wide) {
      return html`
        <div class="drawer">
          <div class="layout horizontal headerContainer">
            <div class="analyticsHeaderText layout horizontal center-center">
              <yp-image
                class="collectionLogoImage"
                sizing="contain"
                src="https://raw.githubusercontent.com/allourideas/allourideas.org/master/public/images/favicon.png"
              ></yp-image>
            </div>
          </div>

          <md-list>
            <md-list-item
              class="${this.pageIndex == PagesTypes.Introduction &&
              'selectedContainer'}"
              headline="${this.t('Introduction')}"
              @click="${() => this.changeTabTo(0)}"
              supportingText="${this.t('Why you should participate')}"
            >
              <md-list-item-icon slot="start">
                <md-icon>info</md-icon>
              </md-list-item-icon></md-list-item
            >
            <md-list-divider></md-list-divider>
            <md-list-item
              ?hidden="${this.surveyClosed}"
              class="${this.pageIndex == PagesTypes.Voting &&
              'selectedContainer'}"
              @click="${() => this.changeTabTo(1)}"
              headline="${this.t('Pairwise Voting')}"
              supportingText="${this.t('Vote on pairs of ideas')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>thumb_up</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-divider></md-list-divider>
            <md-list-item
              class="${this.pageIndex == PagesTypes.Results &&
              'selectedContainer'}"
              @click="${() => this.changeTabTo(2)}"
              headline="${this.t('Voting Results')}"
              supportingText="${this.t('Voting results from all')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>grading</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              class="${this.pageIndex == PagesTypes.Analysis &&
              'selectedContainer'}"
              @click="${() => this.changeTabTo(3)}"
              headline="${this.t('Vote Analysis')}"
              supportingText="${this.t('Analysis of the voting results')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>insights</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              ?hidden="${!this.isAdmin}"
              @click="${this.openAnalytics}"
              headline="${this.t('Analytics & Marketing')}"
              supportingText="${this.t('Promote your survey')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>monitoring</md-icon></md-list-item-icon
              ></md-list-item
            >
            <md-list-item
              ?hidden="${!this.isAdmin}"
              @click="${this.goToAdmin}"
              headline="${this.t('Survey Administration')}"
              supportingText="${this.t('Administer this survey')}"
            >
              <md-list-item-icon slot="start"
                ><md-icon>settings</md-icon></md-list-item-icon
              ></md-list-item
            >

            ${!this.themeDarkMode
              ? html`
                  <md-outlined-icon-button
                    class="darkModeButton"
                    @click="${this.toggleDarkMode}"
                    >dark_mode</md-outlined-icon-button
                  >
                `
              : html`
                  <md-outlined-icon-button
                    class="darkModeButton"
                    @click="${this.toggleDarkMode}"
                    >light_mode</md-outlined-icon-button
                  >
                `}
            ${this.renderScore()}
          </md-list>
        </div>
      `;
    } else {
      return html`
        <div class="navContainer">
          <md-navigation-bar
            id="navBar"
            @navigation-bar-activated="${this.tabChanged}"
          >
            <md-navigation-tab .label="${this.t('Intro')}"
              ><md-icon slot="activeIcon">info</md-icon>
              <md-icon slot="inactiveIcon">info</md-icon></md-navigation-tab
            >
            <md-navigation-tab
              ?hidden="${this.surveyClosed}"
              id="votingTab"
              .label="${this.t('Voting')}"
            >
              <md-icon slot="activeIcon">thumb_up</md-icon>
              <md-icon slot="inactiveIcon">thumb_up</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t('Results')}">
              <md-icon slot="activeIcon">grading</md-icon>
              <md-icon slot="inactiveIcon">grading</md-icon>
            </md-navigation-tab>
            <md-navigation-tab .label="${this.t('Analysis')}">
              <md-icon slot="activeIcon">insights</md-icon>
              <md-icon slot="inactiveIcon">insights</md-icon>
            </md-navigation-tab>
          </md-navigation-bar>
        </div>
      `;
    }
  }

  render() {
    return html`<div class="layout horizontal">
      ${this.renderNavigationBar()}
      <div class="rightPanel">
        <main>
          <div class="mainPageContainer">${this._renderPage()}</div>
        </main>
      </div>
    </div>

    </div>
      ${
        this.lastSnackbarText
          ? html`
              <mwc-snackbar
                id="snackbar"
                @MDCSnackbar:closed="${this.snackbarclosed}"
                style="text-align: center;"
                .labelText="${this.lastSnackbarText}"
              ></mwc-snackbar>
            `
          : nothing
      }`;
  }
}
