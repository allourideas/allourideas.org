import '@polymer/polymer/polymer-legacy.js';
import '@polymer/iron-flex-layout/iron-flex-layout-classes.js';
import 'lite-signal/lite-signal.js';
import { AccessHelpers } from '../yp-behaviors/access-helpers.js';
import '../yp-ajax/yp-ajax.js';
import '../yp-edit-dialog/yp-edit-dialog.js';
import { ypEditDialogBehavior } from '../yp-edit-dialog/yp-edit-dialog-behavior.js';
import { ypPostMoveBehavior } from './yp-post-move-behavior.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { html } from '@polymer/polymer/lib/utils/html-tag.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';

class YpPostMoveLit extends YpBaseElement {
  static get properties() {
    return {
      action: {
        type: String,
        value: "/api/posts"
      },

      post: {
        type: Object
      },

      selectedGroupId: Number

    }
  }

  static get styles() {
    return [
      css`

      .additionalSettings {
        padding-top: 16px;
      }

      paper-textarea {
        padding-top: 16px;
      }

      .groupName {
        cursor: pointer;
      }
    `, YpFlexLayout]
  }

  render() {
    return html`
    <yp-edit-dialog id="editDialog" title="${this.editHeaderText}" .icon="language" confirmation-text="${this.t('post.statusChangeConfirmText')}" action="${this.action}" method="${this.method}" params="${this.params}" save-text="${this.saveText}" .toastText="${this.toastText}">

      ${ this.availableGroups.map(group => html`
        <div class="groupName" @tap="${this._selectGroup}" data-args="${this.group.id}" data-args-name="${this.group.name}">${this.group.id} - ${this.group.name}</div>
      `)}

      <div class="layout horizontal center-center">
        <yp-ajax .method="GET" id="getAvailableGroupsAjax" url="/api/users/available/groups" @response="${this._getGroupsResponse}"></yp-ajax>
        <yp-ajax .method="PUT" id="movePostAjax" @response="${this._movePostResponse}"></yp-ajax>
      </div>
    </yp-edit-dialog>
    `
  }

/*
  behaviors: [
    ypEditDialogBehavior,
    AccessHelpers,
    ypPostMoveBehavior
  ],
*/

  _selectGroup(event) {
    this.selectedGroupId = event.target.getAttribute('data-args');
    const groupName = event.target.getAttribute('data-args-name');
    dom(document).querySelector('yp-app').getDialogAsync("confirmationDialog", function (dialog) {
      dialog.open(this.t('post.confirmMove')+' "'+this.post.name+'" '+this.t('to')+' "'+groupName+'"', this._reallyMove.bind(this));
    }.bind(this));
  }

  _reallyMove() {
    this.$$("#movePostAjax").url="/api/posts/"+this.post.id+'/'+this.selectedGroupId+'/move';
    this.$$("#movePostAjax").body = {};
    this.$$("#movePostAjax").generateRequest();
  }

  _movePostResponse() {
    location.reload();
  }

  _clear() {
    this.selectedGroupId = null;
    this.post = null;
  }

  setupAndOpen(post, refreshFunction) {
    this.post = post;
    this.refreshFunction = refreshFunction;
    this._setupTranslation();
    this.$$("#getAvailableGroupsAjax").generateRequest();
    this.open();
  }

  _setupTranslation() {
    this.editHeaderText = this.t('post.move');
    this.toastText = this.t('post.haveMovedPost');
    this.saveText = this.t('post.move');
  }
}


window.customElements.define('yp-post-move-lit', YpPostMoveLit)