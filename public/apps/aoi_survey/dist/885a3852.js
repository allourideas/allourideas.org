function t(t,e,i,a){var o,r=arguments.length,n=r<3?e:null===a?a=Object.getOwnPropertyDescriptor(e,i):a;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)n=Reflect.decorate(t,e,i,a);else for(var s=t.length-1;s>=0;s--)(o=t[s])&&(n=(r<3?o(n):r>3?o(e,i,n):o(e,i))||n);return r>3&&n&&Object.defineProperty(e,i,n),n}function e(t,e){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(t,e)}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const i=window,a=i.ShadowRoot&&(void 0===i.ShadyCSS||i.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),r=new WeakMap;class n{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(a&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=r.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&r.set(e,t))}return t}toString(){return this.cssText}}const s=(t,...e)=>{const i=1===t.length?t[0]:e.reduce(((e,i,a)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[a+1]),t[0]);return new n(i,t,o)},l=a?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;var c;const d=window,h=d.trustedTypes,p=h?h.emptyScript:"",u=d.reactiveElementPolyfillSupport,m={toAttribute(t,e){switch(e){case Boolean:t=t?p:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},v=(t,e)=>e!==t&&(e==e||t==t),g={attribute:!0,type:String,converter:m,reflect:!1,hasChanged:v};class f extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(t){var e;this.finalize(),(null!==(e=this.h)&&void 0!==e?e:this.h=[]).push(t)}static get observedAttributes(){this.finalize();const t=[];return this.elementProperties.forEach(((e,i)=>{const a=this._$Ep(i,e);void 0!==a&&(this._$Ev.set(a,i),t.push(a))})),t}static createProperty(t,e=g){if(e.state&&(e.attribute=!1),this.finalize(),this.elementProperties.set(t,e),!e.noAccessor&&!this.prototype.hasOwnProperty(t)){const i="symbol"==typeof t?Symbol():"__"+t,a=this.getPropertyDescriptor(t,i,e);void 0!==a&&Object.defineProperty(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){return{get(){return this[e]},set(a){const o=this[t];this[e]=a,this.requestUpdate(t,o,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)||g}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const t=Object.getPrototypeOf(this);if(t.finalize(),void 0!==t.h&&(this.h=[...t.h]),this.elementProperties=new Map(t.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const t=this.properties,e=[...Object.getOwnPropertyNames(t),...Object.getOwnPropertySymbols(t)];for(const i of e)this.createProperty(i,t[i])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(l(t))}else void 0!==t&&e.push(l(t));return e}static _$Ep(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}u(){var t;this._$E_=new Promise((t=>this.enableUpdating=t)),this._$AL=new Map,this._$Eg(),this.requestUpdate(),null===(t=this.constructor.h)||void 0===t||t.forEach((t=>t(this)))}addController(t){var e,i;(null!==(e=this._$ES)&&void 0!==e?e:this._$ES=[]).push(t),void 0!==this.renderRoot&&this.isConnected&&(null===(i=t.hostConnected)||void 0===i||i.call(t))}removeController(t){var e;null===(e=this._$ES)||void 0===e||e.splice(this._$ES.indexOf(t)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach(((t,e)=>{this.hasOwnProperty(e)&&(this._$Ei.set(e,this[e]),delete this[e])}))}createRenderRoot(){var t;const e=null!==(t=this.shadowRoot)&&void 0!==t?t:this.attachShadow(this.constructor.shadowRootOptions);return((t,e)=>{a?t.adoptedStyleSheets=e.map((t=>t instanceof CSSStyleSheet?t:t.styleSheet)):e.forEach((e=>{const a=document.createElement("style"),o=i.litNonce;void 0!==o&&a.setAttribute("nonce",o),a.textContent=e.cssText,t.appendChild(a)}))})(e,this.constructor.elementStyles),e}connectedCallback(){var t;void 0===this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostConnected)||void 0===e?void 0:e.call(t)}))}enableUpdating(t){}disconnectedCallback(){var t;null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostDisconnected)||void 0===e?void 0:e.call(t)}))}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$EO(t,e,i=g){var a;const o=this.constructor._$Ep(t,i);if(void 0!==o&&!0===i.reflect){const r=(void 0!==(null===(a=i.converter)||void 0===a?void 0:a.toAttribute)?i.converter:m).toAttribute(e,i.type);this._$El=t,null==r?this.removeAttribute(o):this.setAttribute(o,r),this._$El=null}}_$AK(t,e){var i;const a=this.constructor,o=a._$Ev.get(t);if(void 0!==o&&this._$El!==o){const t=a.getPropertyOptions(o),r="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==(null===(i=t.converter)||void 0===i?void 0:i.fromAttribute)?t.converter:m;this._$El=o,this[o]=r.fromAttribute(e,t.type),this._$El=null}}requestUpdate(t,e,i){let a=!0;void 0!==t&&(((i=i||this.constructor.getPropertyOptions(t)).hasChanged||v)(this[t],e)?(this._$AL.has(t)||this._$AL.set(t,e),!0===i.reflect&&this._$El!==t&&(void 0===this._$EC&&(this._$EC=new Map),this._$EC.set(t,i))):a=!1),!this.isUpdatePending&&a&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach(((t,e)=>this[e]=t)),this._$Ei=void 0);let e=!1;const i=this._$AL;try{e=this.shouldUpdate(i),e?(this.willUpdate(i),null===(t=this._$ES)||void 0===t||t.forEach((t=>{var e;return null===(e=t.hostUpdate)||void 0===e?void 0:e.call(t)})),this.update(i)):this._$Ek()}catch(t){throw e=!1,this._$Ek(),t}e&&this._$AE(i)}willUpdate(t){}_$AE(t){var e;null===(e=this._$ES)||void 0===e||e.forEach((t=>{var e;return null===(e=t.hostUpdated)||void 0===e?void 0:e.call(t)})),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(t){return!0}update(t){void 0!==this._$EC&&(this._$EC.forEach(((t,e)=>this._$EO(e,this[e],t))),this._$EC=void 0),this._$Ek()}updated(t){}firstUpdated(t){}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var b;f.finalized=!0,f.elementProperties=new Map,f.elementStyles=[],f.shadowRootOptions={mode:"open"},null==u||u({ReactiveElement:f}),(null!==(c=d.reactiveElementVersions)&&void 0!==c?c:d.reactiveElementVersions=[]).push("1.6.1");const y=window,_=y.trustedTypes,x=_?_.createPolicy("lit-html",{createHTML:t=>t}):void 0,w="$lit$",$=`lit$${(Math.random()+"").slice(9)}$`,k="?"+$,C=`<${k}>`,A=document,P=()=>A.createComment(""),S=t=>null===t||"object"!=typeof t&&"function"!=typeof t,T=Array.isArray,I="[ \t\n\f\r]",E=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,L=/-->/g,R=/>/g,M=RegExp(`>|${I}(?:([^\\s"'>=/]+)(${I}*=${I}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),D=/'/g,O=/"/g,z=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),U=Symbol.for("lit-noChange"),B=Symbol.for("lit-nothing"),N=new WeakMap,j=A.createTreeWalker(A,129,null,!1),H=(t,e)=>{const i=t.length-1,a=[];let o,r=2===e?"<svg>":"",n=E;for(let e=0;e<i;e++){const i=t[e];let s,l,c=-1,d=0;for(;d<i.length&&(n.lastIndex=d,l=n.exec(i),null!==l);)d=n.lastIndex,n===E?"!--"===l[1]?n=L:void 0!==l[1]?n=R:void 0!==l[2]?(z.test(l[2])&&(o=RegExp("</"+l[2],"g")),n=M):void 0!==l[3]&&(n=M):n===M?">"===l[0]?(n=null!=o?o:E,c=-1):void 0===l[1]?c=-2:(c=n.lastIndex-l[2].length,s=l[1],n=void 0===l[3]?M:'"'===l[3]?O:D):n===O||n===D?n=M:n===L||n===R?n=E:(n=M,o=void 0);const h=n===M&&t[e+1].startsWith("/>")?" ":"";r+=n===E?i+C:c>=0?(a.push(s),i.slice(0,c)+w+i.slice(c)+$+h):i+$+(-2===c?(a.push(void 0),e):h)}const s=r+(t[i]||"<?>")+(2===e?"</svg>":"");if(!Array.isArray(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return[void 0!==x?x.createHTML(s):s,a]};class V{constructor({strings:t,_$litType$:e},i){let a;this.parts=[];let o=0,r=0;const n=t.length-1,s=this.parts,[l,c]=H(t,e);if(this.el=V.createElement(l,i),j.currentNode=this.el.content,2===e){const t=this.el.content,e=t.firstChild;e.remove(),t.append(...e.childNodes)}for(;null!==(a=j.nextNode())&&s.length<n;){if(1===a.nodeType){if(a.hasAttributes()){const t=[];for(const e of a.getAttributeNames())if(e.endsWith(w)||e.startsWith($)){const i=c[r++];if(t.push(e),void 0!==i){const t=a.getAttribute(i.toLowerCase()+w).split($),e=/([.?@])?(.*)/.exec(i);s.push({type:1,index:o,name:e[2],strings:t,ctor:"."===e[1]?K:"?"===e[1]?X:"@"===e[1]?Z:Y})}else s.push({type:6,index:o})}for(const e of t)a.removeAttribute(e)}if(z.test(a.tagName)){const t=a.textContent.split($),e=t.length-1;if(e>0){a.textContent=_?_.emptyScript:"";for(let i=0;i<e;i++)a.append(t[i],P()),j.nextNode(),s.push({type:2,index:++o});a.append(t[e],P())}}}else if(8===a.nodeType)if(a.data===k)s.push({type:2,index:o});else{let t=-1;for(;-1!==(t=a.data.indexOf($,t+1));)s.push({type:7,index:o}),t+=$.length-1}o++}}static createElement(t,e){const i=A.createElement("template");return i.innerHTML=t,i}}function G(t,e,i=t,a){var o,r,n,s;if(e===U)return e;let l=void 0!==a?null===(o=i._$Co)||void 0===o?void 0:o[a]:i._$Cl;const c=S(e)?void 0:e._$litDirective$;return(null==l?void 0:l.constructor)!==c&&(null===(r=null==l?void 0:l._$AO)||void 0===r||r.call(l,!1),void 0===c?l=void 0:(l=new c(t),l._$AT(t,i,a)),void 0!==a?(null!==(n=(s=i)._$Co)&&void 0!==n?n:s._$Co=[])[a]=l:i._$Cl=l),void 0!==l&&(e=G(t,l._$AS(t,e.values),l,a)),e}class q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var e;const{el:{content:i},parts:a}=this._$AD,o=(null!==(e=null==t?void 0:t.creationScope)&&void 0!==e?e:A).importNode(i,!0);j.currentNode=o;let r=j.nextNode(),n=0,s=0,l=a[0];for(;void 0!==l;){if(n===l.index){let e;2===l.type?e=new W(r,r.nextSibling,this,t):1===l.type?e=new l.ctor(r,l.name,l.strings,this,t):6===l.type&&(e=new Q(r,this,t)),this._$AV.push(e),l=a[++s]}n!==(null==l?void 0:l.index)&&(r=j.nextNode(),n++)}return o}v(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class W{constructor(t,e,i,a){var o;this.type=2,this._$AH=B,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this._$Cp=null===(o=null==a?void 0:a.isConnected)||void 0===o||o}get _$AU(){var t,e;return null!==(e=null===(t=this._$AM)||void 0===t?void 0:t._$AU)&&void 0!==e?e:this._$Cp}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===(null==t?void 0:t.nodeType)&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=G(this,t,e),S(t)?t===B||null==t||""===t?(this._$AH!==B&&this._$AR(),this._$AH=B):t!==this._$AH&&t!==U&&this._(t):void 0!==t._$litType$?this.g(t):void 0!==t.nodeType?this.$(t):(t=>T(t)||"function"==typeof(null==t?void 0:t[Symbol.iterator]))(t)?this.T(t):this._(t)}k(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}$(t){this._$AH!==t&&(this._$AR(),this._$AH=this.k(t))}_(t){this._$AH!==B&&S(this._$AH)?this._$AA.nextSibling.data=t:this.$(A.createTextNode(t)),this._$AH=t}g(t){var e;const{values:i,_$litType$:a}=t,o="number"==typeof a?this._$AC(t):(void 0===a.el&&(a.el=V.createElement(a.h,this.options)),a);if((null===(e=this._$AH)||void 0===e?void 0:e._$AD)===o)this._$AH.v(i);else{const t=new q(o,this),e=t.u(this.options);t.v(i),this.$(e),this._$AH=t}}_$AC(t){let e=N.get(t.strings);return void 0===e&&N.set(t.strings,e=new V(t)),e}T(t){T(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,a=0;for(const o of t)a===e.length?e.push(i=new W(this.k(P()),this.k(P()),this,this.options)):i=e[a],i._$AI(o),a++;a<e.length&&(this._$AR(i&&i._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){var i;for(null===(i=this._$AP)||void 0===i||i.call(this,!1,!0,e);t&&t!==this._$AB;){const e=t.nextSibling;t.remove(),t=e}}setConnected(t){var e;void 0===this._$AM&&(this._$Cp=t,null===(e=this._$AP)||void 0===e||e.call(this,t))}}class Y{constructor(t,e,i,a,o){this.type=1,this._$AH=B,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=o,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=B}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(t,e=this,i,a){const o=this.strings;let r=!1;if(void 0===o)t=G(this,t,e,0),r=!S(t)||t!==this._$AH&&t!==U,r&&(this._$AH=t);else{const a=t;let n,s;for(t=o[0],n=0;n<o.length-1;n++)s=G(this,a[i+n],e,n),s===U&&(s=this._$AH[n]),r||(r=!S(s)||s!==this._$AH[n]),s===B?t=B:t!==B&&(t+=(null!=s?s:"")+o[n+1]),this._$AH[n]=s}r&&!a&&this.j(t)}j(t){t===B?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=t?t:"")}}class K extends Y{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===B?void 0:t}}const J=_?_.emptyScript:"";class X extends Y{constructor(){super(...arguments),this.type=4}j(t){t&&t!==B?this.element.setAttribute(this.name,J):this.element.removeAttribute(this.name)}}class Z extends Y{constructor(t,e,i,a,o){super(t,e,i,a,o),this.type=5}_$AI(t,e=this){var i;if((t=null!==(i=G(this,t,e,0))&&void 0!==i?i:B)===U)return;const a=this._$AH,o=t===B&&a!==B||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,r=t!==B&&(a===B||o);o&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e,i;"function"==typeof this._$AH?this._$AH.call(null!==(i=null===(e=this.options)||void 0===e?void 0:e.host)&&void 0!==i?i:this.element,t):this._$AH.handleEvent(t)}}class Q{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){G(this,t)}}const tt=y.litHtmlPolyfillSupport;null==tt||tt(V,W),(null!==(b=y.litHtmlVersions)&&void 0!==b?b:y.litHtmlVersions=[]).push("2.7.3");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var et,it;class at extends f{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t,e;const i=super.createRenderRoot();return null!==(t=(e=this.renderOptions).renderBefore)&&void 0!==t||(e.renderBefore=i.firstChild),i}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{var a,o;const r=null!==(a=null==i?void 0:i.renderBefore)&&void 0!==a?a:e;let n=r._$litPart$;if(void 0===n){const t=null!==(o=null==i?void 0:i.renderBefore)&&void 0!==o?o:null;r._$litPart$=n=new W(e.insertBefore(P(),t),t,void 0,null!=i?i:{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),null===(t=this._$Do)||void 0===t||t.setConnected(!1)}render(){return U}}at.finalized=!0,at._$litElement$=!0,null===(et=globalThis.litElementHydrateSupport)||void 0===et||et.call(globalThis,{LitElement:at});const ot=globalThis.litElementPolyfillSupport;null==ot||ot({LitElement:at}),(null!==(it=globalThis.litElementVersions)&&void 0!==it?it:globalThis.litElementVersions=[]).push("3.3.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const rt=t=>e=>"function"==typeof e?((t,e)=>(customElements.define(t,e),e))(t,e):((t,e)=>{const{kind:i,elements:a}=e;return{kind:i,elements:a,finisher(e){customElements.define(t,e)}}})(t,e)
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,nt=(t,e)=>"method"===e.kind&&e.descriptor&&!("value"in e.descriptor)?{...e,finisher(i){i.createProperty(e.key,t)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:e.key,initializer(){"function"==typeof e.initializer&&(this[e.key]=e.initializer.call(this))},finisher(i){i.createProperty(e.key,t)}};function st(t){return(e,i)=>void 0!==i?((t,e,i)=>{e.constructor.createProperty(i,t)})(t,e,i):nt(t,e)}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function lt(t){return st({...t,state:!0})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ct=({finisher:t,descriptor:e})=>(i,a)=>{var o;if(void 0===a){const a=null!==(o=i.originalKey)&&void 0!==o?o:i.key,r=null!=e?{kind:"method",placement:"prototype",key:a,descriptor:e(i.key)}:{...i,key:a};return null!=t&&(r.finisher=function(e){t(e,a)}),r}{const o=i.constructor;void 0!==e&&Object.defineProperty(i,a,e(a)),null==t||t(o,a)}}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function dt(t,e){return ct({descriptor:i=>{const a={get(){var e,i;return null!==(i=null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t))&&void 0!==i?i:null},enumerable:!0,configurable:!0};if(e){const e="symbol"==typeof i?Symbol():"__"+i;a.get=function(){var i,a;return void 0===this[e]&&(this[e]=null!==(a=null===(i=this.renderRoot)||void 0===i?void 0:i.querySelector(t))&&void 0!==a?a:null),this[e]}}return a}})}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function ht(t){return ct({descriptor:e=>({async get(){var e;return await this.updateComplete,null===(e=this.renderRoot)||void 0===e?void 0:e.querySelector(t)},enumerable:!0,configurable:!0})})}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var pt;const ut=null!=(null===(pt=window.HTMLSlotElement)||void 0===pt?void 0:pt.prototype.assignedElements)?(t,e)=>t.assignedElements(e):(t,e)=>t.assignedNodes(e).filter((t=>t.nodeType===Node.ELEMENT_NODE));function mt(t){const{slot:e,selector:i}=null!=t?t:{};return ct({descriptor:a=>({get(){var a;const o="slot"+(e?`[name=${e}]`:":not([name])"),r=null===(a=this.renderRoot)||void 0===a?void 0:a.querySelector(o),n=null!=r?ut(r,t):[];return i?n.filter((t=>t.matches(i))):n},enumerable:!0,configurable:!0})})}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class vt extends at{render(){return F`<span class="shadow"></span>`}}
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */const gt=s`:host{--_level:var(--md-elevation-level, 0);--_shadow-color:var(--md-elevation-shadow-color, var(--md-sys-color-shadow, #000));display:flex;pointer-events:none}.shadow,.shadow::after,.shadow::before,:host{border-radius:inherit;inset:0;position:absolute;transition-duration:inherit;transition-timing-function:inherit}.shadow::after,.shadow::before{content:"";transition-property:box-shadow,opacity}.shadow::before{box-shadow:0 calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 3,1) + 2*clamp(0,var(--_level) - 4,1))) calc(1px*(2*clamp(0,var(--_level),1) + clamp(0,var(--_level) - 2,1) + clamp(0,var(--_level) - 4,1))) 0 var(--_shadow-color);opacity:.3}.shadow::after{box-shadow:0 calc(1px*(clamp(0,var(--_level),1) + clamp(0,var(--_level) - 1,1) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(3*clamp(0,var(--_level),2) + 2*clamp(0,var(--_level) - 2,3))) calc(1px*(clamp(0,var(--_level),4) + 2*clamp(0,var(--_level) - 4,1))) var(--_shadow-color);opacity:.15}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let ft=class extends vt{};ft.styles=[gt],ft=t([rt("md-elevation")],ft);
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const bt=["ariaAtomic","ariaAutoComplete","ariaBusy","ariaChecked","ariaColCount","ariaColIndex","ariaColIndexText","ariaColSpan","ariaCurrent","ariaDisabled","ariaExpanded","ariaHasPopup","ariaHidden","ariaInvalid","ariaKeyShortcuts","ariaLabel","ariaLevel","ariaLive","ariaModal","ariaMultiLine","ariaMultiSelectable","ariaOrientation","ariaPlaceholder","ariaPosInSet","ariaPressed","ariaReadOnly","ariaRequired","ariaRoleDescription","ariaRowCount","ariaRowIndex","ariaRowIndexText","ariaRowSpan","ariaSelected","ariaSetSize","ariaSort","ariaValueMax","ariaValueMin","ariaValueNow","ariaValueText"];function yt(t){return t.replace("aria","aria-").replace(/Elements?/g,"").toLowerCase()}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function _t(t){for(const e of bt)t.createProperty(e,{attribute:yt(e),reflect:!0});t.addInitializer((t=>{const e={hostConnected(){t.setAttribute("role","presentation")}};t.addController(e)}))}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */bt.map(yt);class xt extends at{constructor(){super(...arguments),this.activeIndex=0,this.hideInactiveLabels=!1,this.tabs=[]}render(){const{ariaLabel:t}=this;return F`<div class="md3-navigation-bar" role="tablist" aria-label="${t||B}" @keydown="${this.handleKeydown}" @navigation-tab-interaction="${this.handleNavigationTabInteraction}" @navigation-tab-rendered="${this.handleNavigationTabConnected}"><md-elevation></md-elevation><div class="md3-navigation-bar__tabs-slot-container"><slot></slot></div></div>`}updated(t){t.has("activeIndex")&&(this.onActiveIndexChange(this.activeIndex),this.dispatchEvent(new CustomEvent("navigation-bar-activated",{detail:{tab:this.tabs[this.activeIndex],activeIndex:this.activeIndex},bubbles:!0,composed:!0}))),t.has("hideInactiveLabels")&&this.onHideInactiveLabelsChange(this.hideInactiveLabels),t.has("tabs")&&(this.onHideInactiveLabelsChange(this.hideInactiveLabels),this.onActiveIndexChange(this.activeIndex))}firstUpdated(t){super.firstUpdated(t),this.layout()}layout(){if(!this.tabsElement)return;const t=[];for(const e of this.tabsElement)t.push(e);this.tabs=t}handleNavigationTabConnected(t){const e=t.target;-1===this.tabs.indexOf(e)&&this.layout()}handleNavigationTabInteraction(t){this.activeIndex=this.tabs.indexOf(t.detail.state)}handleKeydown(t){const e=t.key,i=this.tabs.findIndex((t=>t.matches(":focus-within"))),a=function(t,e=!0){return e&&"rtl"===getComputedStyle(t).getPropertyValue("direction").trim()}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(this),o=this.tabs.length-1;if("Enter"===e||" "===e)return void(this.activeIndex=i);if("Home"===e)return void this.tabs[0].focus();if("End"===e)return void this.tabs[o].focus();const r="ArrowRight"===e&&!a||"ArrowLeft"===e&&a;if(r&&i===o)return void this.tabs[0].focus();if(r)return void this.tabs[i+1].focus();const n="ArrowLeft"===e&&!a||"ArrowRight"===e&&a;n&&0===i?this.tabs[o].focus():n&&this.tabs[i-1].focus()}onActiveIndexChange(t){if(!this.tabs[t])throw new Error("NavigationBar: activeIndex is out of bounds.");for(let e=0;e<this.tabs.length;e++)this.tabs[e].active=e===t}onHideInactiveLabelsChange(t){for(const e of this.tabs)e.hideInactiveLabel=t}}_t(xt),t([st({type:Number})],xt.prototype,"activeIndex",void 0),t([st({type:Boolean})],xt.prototype,"hideInactiveLabels",void 0),t([mt({flatten:!0})],xt.prototype,"tabsElement",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const wt=s`:host{--_active-indicator-color:var(--md-navigation-bar-active-indicator-color, var(--md-sys-color-secondary-container, #e8def8));--_active-indicator-height:var(--md-navigation-bar-active-indicator-height, 32px);--_active-indicator-shape:var(--md-navigation-bar-active-indicator-shape, 9999px);--_active-indicator-width:var(--md-navigation-bar-active-indicator-width, 64px);--_active-focus-icon-color:var(--md-navigation-bar-active-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-focus-label-text-color:var(--md-navigation-bar-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-focus-state-layer-color:var(--md-navigation-bar-active-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-icon-color:var(--md-navigation-bar-active-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-hover-label-text-color:var(--md-navigation-bar-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-color:var(--md-navigation-bar-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-icon-color:var(--md-navigation-bar-active-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-label-text-color:var(--md-navigation-bar-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-label-text-weight:var(--md-navigation-bar-active-label-text-weight, 700);--_active-pressed-icon-color:var(--md-navigation-bar-active-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-pressed-label-text-color:var(--md-navigation-bar-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-color:var(--md-navigation-bar-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-color:var(--md-navigation-bar-container-color, var(--md-sys-color-surface-container, #f3edf7));--_container-elevation:var(--md-navigation-bar-container-elevation, 2);--_container-height:var(--md-navigation-bar-container-height, 80px);--_container-shape:var(--md-navigation-bar-container-shape, 0px);--_focus-state-layer-opacity:var(--md-navigation-bar-focus-state-layer-opacity, 0.12);--_hover-state-layer-opacity:var(--md-navigation-bar-hover-state-layer-opacity, 0.08);--_icon-size:var(--md-navigation-bar-icon-size, 24px);--_inactive-focus-icon-color:var(--md-navigation-bar-inactive-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-label-text-color:var(--md-navigation-bar-inactive-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-state-layer-color:var(--md-navigation-bar-inactive-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-icon-color:var(--md-navigation-bar-inactive-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-label-text-color:var(--md-navigation-bar-inactive-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-state-layer-color:var(--md-navigation-bar-inactive-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-icon-color:var(--md-navigation-bar-inactive-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-label-text-color:var(--md-navigation-bar-inactive-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-pressed-icon-color:var(--md-navigation-bar-inactive-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-label-text-color:var(--md-navigation-bar-inactive-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-state-layer-color:var(--md-navigation-bar-inactive-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font:var(--md-navigation-bar-label-text-font, var(--md-ref-typeface-plain, Roboto));--_label-text-line-height:var(--md-navigation-bar-label-text-line-height, 1rem);--_label-text-size:var(--md-navigation-bar-label-text-size, 0.75rem);--_label-text-tracking:var(--md-navigation-bar-label-text-tracking, 0.031rem);--_label-text-type:var(--md-navigation-bar-label-text-type, 500 0.75rem / 1rem var(--md-ref-typeface-plain, Roboto));--_label-text-weight:var(--md-navigation-bar-label-text-weight, 500);--_pressed-state-layer-opacity:var(--md-navigation-bar-pressed-state-layer-opacity, 0.12);--md-elevation-level:var(--_container-elevation);--md-elevation-shadow-color:var(--_container-shadow-color);width:100%}.md3-navigation-bar{display:flex;position:relative;width:100%;background-color:var(--_container-color);border-radius:var(--_container-shape);height:var(--_container-height)}.md3-navigation-bar .md3-navigation-bar__tabs-slot-container{display:inherit;width:inherit}md-elevation{transition-duration:280ms;z-index:0}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let $t=class extends xt{};$t.styles=[wt],$t=t([rt("md-navigation-bar")],$t);
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const kt=1,Ct=2,At=6,Pt=t=>(...e)=>({_$litDirective$:t,values:e});class St{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}}
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Tt=Pt(class extends St{constructor(t){var e;if(super(t),t.type!==kt||"class"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter((e=>t[e])).join(" ")+" "}update(t,[e]){var i,a;if(void 0===this.it){this.it=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter((t=>""!==t))));for(const t in e)e[t]&&!(null===(i=this.nt)||void 0===i?void 0:i.has(t))&&this.it.add(t);return this.render(e)}const o=t.element.classList;this.it.forEach((t=>{t in e||(o.remove(t),this.it.delete(t))}));for(const t in e){const i=!!e[t];i===this.it.has(t)||(null===(a=this.nt)||void 0===a?void 0:a.has(t))||(i?(o.add(t),this.it.add(t)):(o.remove(t),this.it.delete(t)))}return U}});
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class It extends at{constructor(){super(...arguments),this.value=""}render(){return F`<div class="md3-badge ${Tt(this.getRenderClasses())}"><p class="md3-badge__value">${this.value}</p></div>`}getRenderClasses(){return{"md3-badge--large":this.value}}}t([st()],It.prototype,"value",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const Et=s`:host{--_color:var(--md-badge-color, var(--md-sys-color-error, #b3261e));--_large-color:var(--md-badge-large-color, var(--md-sys-color-error, #b3261e));--_large-label-text-color:var(--md-badge-large-label-text-color, var(--md-sys-color-on-error, #fff));--_large-label-text-type:var(--md-badge-large-label-text-type, var(--md-sys-typescale-label-small, 500 0.688rem / 1rem var(--md-ref-typeface-plain, Roboto)));--_large-shape:var(--md-badge-large-shape, 9999px);--_large-size:var(--md-badge-large-size, 16px);--_shape:var(--md-badge-shape, 9999px);--_size:var(--md-badge-size, 6px)}.md3-badge{inset-inline-start:50%;margin-inline-start:6px;margin-block-start:4px;position:absolute;inset-block-start:0;background-color:var(--_color);border-radius:var(--_shape);height:var(--_size)}.md3-badge:not(.md3-badge--large){width:var(--_size)}.md3-badge.md3-badge--large{display:flex;flex-direction:column;justify-content:center;margin-inline-start:2px;margin-block-start:1px;background-color:var(--_large-color);border-radius:var(--_large-shape);height:var(--_large-size);min-width:var(--_large-size);color:var(--_large-label-text-color)}.md3-badge.md3-badge--large .md3-badge__value{padding:0 4px}.md3-badge__value{font:var(--_large-label-text-type)}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Lt=class extends It{};Lt.styles=[Et],Lt=t([rt("md-badge")],Lt);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Rt extends at{constructor(){super(...arguments),this.visible=!1}}t([st({type:Boolean,reflect:!0})],Rt.prototype,"visible",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const Mt=s`:host{--_shape-start-start:var(--md-focus-ring-shape-start-start, var(--md-focus-ring-shape, 9999px));--_shape-start-end:var(--md-focus-ring-shape-start-end, var(--md-focus-ring-shape, 9999px));--_shape-end-end:var(--md-focus-ring-shape-end-end, var(--md-focus-ring-shape, 9999px));--_shape-end-start:var(--md-focus-ring-shape-end-start, var(--md-focus-ring-shape, 9999px));--_offset:var(--md-focus-ring-offset, 2px);--_width:var(--md-focus-ring-width, 3px);--_animation-width:var(--md-focus-ring-animation-width, 8px);--_animation-duration:var(--md-focus-ring-animation-duration, 600ms);--_easing:var(--md-focus-ring-easing, cubic-bezier(0.2, 0, 0, 1));--_color:var(--md-focus-ring-color, var(--md-sys-color-secondary, #625b71));display:none;position:absolute;box-sizing:border-box;pointer-events:none;border-start-start-radius:calc(var(--_offset) + var(--_shape-start-start));border-start-end-radius:calc(var(--_offset) + var(--_shape-start-end));border-end-start-radius:calc(var(--_offset) + var(--_shape-end-start));border-end-end-radius:calc(var(--_offset) + var(--_shape-end-end));box-shadow:inset 0 0 0 0 var(--_color);outline:var(--_width) solid var(--_color);outline-offset:-1px;inset:calc(-1*(var(--_offset) + 1px))}:host([visible]){display:flex;animation-name:focus-ring;animation-duration:var(--_animation-duration);animation-timing-function:var(--_easing)}@keyframes focus-ring{from{outline-width:0}25%{box-shadow:inset 0 0 0 calc(var(--_animation-width)/2) var(--_color);outline-width:calc(var(--_animation-width)/2)}}@media(prefers-reduced-motion){:host([visible]){animation:none}}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Dt=class extends Rt{};Dt.styles=[Mt],Dt=t([rt("md-focus-ring")],Dt);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
const Ot="cubic-bezier(0.2, 0, 0, 1)",zt="cubic-bezier(.3,0,0,1)",Ft="cubic-bezier(.3,0,.8,.15)";var Ut;!function(t){t[t.INACTIVE=0]="INACTIVE",t[t.TOUCH_DELAY=1]="TOUCH_DELAY",t[t.HOLDING=2]="HOLDING",t[t.WAITING_FOR_CLICK=3]="WAITING_FOR_CLICK"}(Ut||(Ut={}));class Bt extends at{constructor(){super(...arguments),this.unbounded=!1,this.disabled=!1,this.hovered=!1,this.focused=!1,this.pressed=!1,this.rippleSize="",this.rippleScale="",this.initialSize=0,this.state=Ut.INACTIVE,this.checkBoundsAfterContextMenu=!1}handlePointerenter(t){this.shouldReactToEvent(t)&&(this.hovered=!0)}handlePointerleave(t){this.shouldReactToEvent(t)&&(this.hovered=!1,this.state!==Ut.INACTIVE&&this.endPressAnimation())}handleFocusin(){this.focused=!0}handleFocusout(){this.focused=!1}handlePointerup(t){if(this.shouldReactToEvent(t)){if(this.state!==Ut.HOLDING)return this.state===Ut.TOUCH_DELAY?(this.state=Ut.WAITING_FOR_CLICK,void this.startPressAnimation(this.rippleStartEvent)):void 0;this.state=Ut.WAITING_FOR_CLICK}}async handlePointerdown(t){if(this.shouldReactToEvent(t)){if(this.rippleStartEvent=t,!this.isTouch(t))return this.state=Ut.WAITING_FOR_CLICK,void this.startPressAnimation(t);this.checkBoundsAfterContextMenu&&!this.inBounds(t)||(this.checkBoundsAfterContextMenu=!1,this.state=Ut.TOUCH_DELAY,await new Promise((t=>{setTimeout(t,150)})),this.state===Ut.TOUCH_DELAY&&(this.state=Ut.HOLDING,this.startPressAnimation(t)))}}handleClick(){this.disabled||(this.state!==Ut.WAITING_FOR_CLICK?this.state===Ut.INACTIVE&&(this.startPressAnimation(),this.endPressAnimation()):this.endPressAnimation())}handlePointercancel(t){this.shouldReactToEvent(t)&&this.endPressAnimation()}handleContextmenu(){this.disabled||(this.checkBoundsAfterContextMenu=!0,this.endPressAnimation())}render(){const t={hovered:this.hovered,focused:this.focused,pressed:this.pressed,unbounded:this.unbounded};return F`<div class="surface ${Tt(t)}"></div>`}update(t){t.has("disabled")&&this.disabled&&(this.hovered=!1,this.focused=!1,this.pressed=!1),super.update(t)}getDimensions(){return(this.parentElement??this).getBoundingClientRect()}determineRippleSize(){const{height:t,width:e}=this.getDimensions(),i=Math.max(t,e),a=Math.max(.35*i,75);let o=i,r=Math.floor(.2*i);o=Math.sqrt(e**2+t**2)+10,this.unbounded&&(r-=r%2),this.initialSize=r,this.rippleScale=""+(o+a)/r,this.rippleSize=`${this.initialSize}px`}getNormalizedPointerEventCoords(t){const{scrollX:e,scrollY:i}=window,{left:a,top:o}=this.getDimensions(),r=e+a,n=i+o,{pageX:s,pageY:l}=t;return{x:s-r,y:l-n}}getTranslationCoordinates(t){const{height:e,width:i}=this.getDimensions(),a={x:(i-this.initialSize)/2,y:(e-this.initialSize)/2};let o;return o=t instanceof PointerEvent?this.getNormalizedPointerEventCoords(t):{x:i/2,y:e/2},o={x:o.x-this.initialSize/2,y:o.y-this.initialSize/2},{startPoint:o,endPoint:a}}startPressAnimation(t){this.pressed=!0,this.growAnimation?.cancel(),this.determineRippleSize();const{startPoint:e,endPoint:i}=this.getTranslationCoordinates(t),a=`${e.x}px, ${e.y}px`,o=`${i.x}px, ${i.y}px`;this.growAnimation=this.mdRoot.animate({top:[0,0],left:[0,0],height:[this.rippleSize,this.rippleSize],width:[this.rippleSize,this.rippleSize],transform:[`translate(${a}) scale(1)`,`translate(${o}) scale(${this.rippleScale})`]},{pseudoElement:"::after",duration:450,easing:Ot,fill:"forwards"})}async endPressAnimation(){const t=this.growAnimation,e=t?.currentTime??1/0;e>=225?this.pressed=!1:(await new Promise((t=>{setTimeout(t,225-e)})),this.growAnimation===t&&(this.pressed=!1))}shouldReactToEvent(t){if(this.disabled||!t.isPrimary)return!1;if(this.rippleStartEvent&&this.rippleStartEvent.pointerId!==t.pointerId)return!1;if("pointerenter"===t.type||"pointerleave"===t.type)return!this.isTouch(t);const e=1===t.buttons;return this.isTouch(t)||e}inBounds({x:t,y:e}){const{top:i,left:a,bottom:o,right:r}=this.getBoundingClientRect();return t>=a&&t<=r&&e>=i&&e<=o}isTouch({pointerType:t}){return"touch"===t}}t([st({type:Boolean,reflect:!0})],Bt.prototype,"unbounded",void 0),t([st({type:Boolean,reflect:!0})],Bt.prototype,"disabled",void 0),t([lt()],Bt.prototype,"hovered",void 0),t([lt()],Bt.prototype,"focused",void 0),t([lt()],Bt.prototype,"pressed",void 0),t([dt(".surface")],Bt.prototype,"mdRoot",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const Nt=s`:host{--_focus-color:var(--md-ripple-focus-color, var(--md-sys-color-on-surface, #1d1b20));--_focus-opacity:var(--md-ripple-focus-opacity, 0.12);--_hover-color:var(--md-ripple-hover-color, var(--md-sys-color-on-surface, #1d1b20));--_hover-opacity:var(--md-ripple-hover-opacity, 0.08);--_pressed-color:var(--md-ripple-pressed-color, var(--md-sys-color-on-surface, #1d1b20));--_pressed-opacity:var(--md-ripple-pressed-opacity, 0.12);--_shape:var(--md-ripple-shape, 0px)}:host{display:flex}:host([disabled]){opacity:0}.surface,:host{position:absolute;inset:0;pointer-events:none;overflow:hidden}.surface{will-change:transform;border-radius:var(--_shape);outline:0;-webkit-tap-highlight-color:transparent}.surface::after,.surface::before{position:absolute;opacity:0;pointer-events:none;content:""}.surface::before{background-color:var(--_hover-color);transition:opacity 15ms linear,background-color 15ms linear;inset:0}.surface::after{background:radial-gradient(closest-side,var(--_pressed-color) max(100% - 70px,65%),transparent 100%);transition:opacity 375ms linear;transform-origin:center center}.hovered::before{background-color:var(--_hover-color);opacity:var(--_hover-opacity)}.focused::before{background-color:var(--_focus-color);opacity:var(--_focus-opacity);transition-duration:75ms}.pressed::after{opacity:var(--_pressed-opacity);transition-duration:105ms}.unbounded{--_shape:var(--md-ripple-shape, 9999px)}@media screen and (forced-colors:active){:host{display:none}}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let jt=class extends Bt{};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function Ht(t,e,i){return t?e():null==i?void 0:i()}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */jt.styles=[Nt],jt=t([rt("md-ripple")],jt);let Vt=new class{constructor(){this.visible=!1}setVisible(t){this.visible=t}};const Gt=new Set(["Tab","ArrowLeft","ArrowRight","ArrowUp","ArrowDown"]);function qt(t){Gt.has(t.key)&&Vt.setVisible(!0)}function Wt(){return Vt.visible}function Yt(){Vt.setVisible(!1)}!function(t,e=!1){Vt=t,e?window.addEventListener("keydown",qt):window.removeEventListener("keydown",qt)}(Vt,!0);const Kt=Pt(
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class extends St{constructor(t){if(super(t),this.rippleGetter=async()=>null,t.type!==At)throw new Error("The `ripple` directive must be used on an element")}render(t){return U}async handleEvent(t){const e=await this.rippleGetter();if(e)switch(t.type){case"click":e.handleClick();break;case"contextmenu":e.handleContextmenu();break;case"pointercancel":e.handlePointercancel(t);break;case"pointerdown":await e.handlePointerdown(t);break;case"pointerenter":e.handlePointerenter(t);break;case"pointerleave":e.handlePointerleave(t);break;case"pointerup":e.handlePointerup(t)}}update(t,[e]){return this.element||(this.element=t.element,this.element.addEventListener("click",this),this.element.addEventListener("contextmenu",this),this.element.addEventListener("pointercancel",this),this.element.addEventListener("pointerdown",this),this.element.addEventListener("pointerenter",this),this.element.addEventListener("pointerleave",this),this.element.addEventListener("pointerup",this)),this.rippleGetter="function"==typeof e?e:()=>e,U}});
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */class Jt extends at{constructor(){super(...arguments),this.disabled=!1,this.active=!1,this.hideInactiveLabel=!1,this.badgeValue="",this.showBadge=!1,this.showFocusRing=!1,this.showRipple=!1,this.getRipple=()=>(this.showRipple=!0,this.ripple),this.renderRipple=()=>F`<md-ripple ?disabled="${this.disabled}" class="md3-navigation-tab__ripple"></md-ripple>`}render(){const{ariaLabel:t}=this;return F` <button class="md3-navigation-tab ${Tt(this.getRenderClasses())}" role="tab" aria-selected="${this.active}" aria-label="${t||B}" tabindex="${this.active?0:-1}" @focus="${this.handleFocus}" @blur="${this.handleBlur}" @pointerdown="${this.handlePointerDown}" @click="${this.handleClick}" ${Kt(this.getRipple)}>${this.renderFocusRing()}${Ht(this.showRipple,this.renderRipple)} <span aria-hidden="true" class="md3-navigation-tab__icon-content"><span class="md3-navigation-tab__active-indicator"></span><span class="md3-navigation-tab__icon"><slot name="inactiveIcon"></slot></span> <span class="md3-navigation-tab__icon md3-navigation-tab__icon--active"><slot name="activeIcon"></slot></span>${this.renderBadge()}</span>${this.renderLabel()} </button>`}getRenderClasses(){return{"md3-navigation-tab--hide-inactive-label":this.hideInactiveLabel,"md3-navigation-tab--active":this.active}}renderFocusRing(){return F`<md-focus-ring .visible="${this.showFocusRing}"></md-focus-ring>`}renderBadge(){return this.showBadge?F`<md-badge .value="${this.badgeValue}"></md-badge>`:B}renderLabel(){const{ariaLabel:t}=this,e=t?"true":"false";return this.label?F` <span aria-hidden="${e}" class="md3-navigation-tab__label-text">${this.label}</span>`:B}firstUpdated(t){super.firstUpdated(t);const e=new Event("navigation-tab-rendered",{bubbles:!0,composed:!0});this.dispatchEvent(e)}focus(){const t=this.buttonElement;t&&t.focus()}blur(){const t=this.buttonElement;t&&t.blur()}handleClick(){this.dispatchEvent(new CustomEvent("navigation-tab-interaction",{detail:{state:this},bubbles:!0,composed:!0}))}handlePointerDown(t){Yt(),this.showFocusRing=Wt()}handleFocus(){this.showFocusRing=Wt()}handleBlur(){this.showFocusRing=!1}}_t(Jt),t([st({type:Boolean})],Jt.prototype,"disabled",void 0),t([st({type:Boolean,reflect:!0})],Jt.prototype,"active",void 0),t([st({type:Boolean})],Jt.prototype,"hideInactiveLabel",void 0),t([st()],Jt.prototype,"label",void 0),t([st()],Jt.prototype,"badgeValue",void 0),t([st({type:Boolean})],Jt.prototype,"showBadge",void 0),t([lt()],Jt.prototype,"showFocusRing",void 0),t([lt()],Jt.prototype,"showRipple",void 0),t([dt("button")],Jt.prototype,"buttonElement",void 0),t([ht("md-ripple")],Jt.prototype,"ripple",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const Xt=s`:host{--_active-indicator-color:var(--md-navigation-bar-active-indicator-color, var(--md-sys-color-secondary-container, #e8def8));--_active-indicator-height:var(--md-navigation-bar-active-indicator-height, 32px);--_active-indicator-shape:var(--md-navigation-bar-active-indicator-shape, 9999px);--_active-indicator-width:var(--md-navigation-bar-active-indicator-width, 64px);--_active-focus-icon-color:var(--md-navigation-bar-active-focus-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-focus-label-text-color:var(--md-navigation-bar-active-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-focus-state-layer-color:var(--md-navigation-bar-active-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-icon-color:var(--md-navigation-bar-active-hover-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-hover-label-text-color:var(--md-navigation-bar-active-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-hover-state-layer-color:var(--md-navigation-bar-active-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_active-icon-color:var(--md-navigation-bar-active-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-label-text-color:var(--md-navigation-bar-active-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-label-text-weight:var(--md-navigation-bar-active-label-text-weight, 700);--_active-pressed-icon-color:var(--md-navigation-bar-active-pressed-icon-color, var(--md-sys-color-on-secondary-container, #1d192b));--_active-pressed-label-text-color:var(--md-navigation-bar-active-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_active-pressed-state-layer-color:var(--md-navigation-bar-active-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_container-color:var(--md-navigation-bar-container-color, var(--md-sys-color-surface-container, #f3edf7));--_container-elevation:var(--md-navigation-bar-container-elevation, 2);--_container-height:var(--md-navigation-bar-container-height, 80px);--_container-shape:var(--md-navigation-bar-container-shape, 0px);--_focus-state-layer-opacity:var(--md-navigation-bar-focus-state-layer-opacity, 0.12);--_hover-state-layer-opacity:var(--md-navigation-bar-hover-state-layer-opacity, 0.08);--_icon-size:var(--md-navigation-bar-icon-size, 24px);--_inactive-focus-icon-color:var(--md-navigation-bar-inactive-focus-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-label-text-color:var(--md-navigation-bar-inactive-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-focus-state-layer-color:var(--md-navigation-bar-inactive-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-icon-color:var(--md-navigation-bar-inactive-hover-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-label-text-color:var(--md-navigation-bar-inactive-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-hover-state-layer-color:var(--md-navigation-bar-inactive-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-icon-color:var(--md-navigation-bar-inactive-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-label-text-color:var(--md-navigation-bar-inactive-label-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_inactive-pressed-icon-color:var(--md-navigation-bar-inactive-pressed-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-label-text-color:var(--md-navigation-bar-inactive-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_inactive-pressed-state-layer-color:var(--md-navigation-bar-inactive-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_label-text-font:var(--md-navigation-bar-label-text-font, var(--md-ref-typeface-plain, Roboto));--_label-text-line-height:var(--md-navigation-bar-label-text-line-height, 1rem);--_label-text-size:var(--md-navigation-bar-label-text-size, 0.75rem);--_label-text-tracking:var(--md-navigation-bar-label-text-tracking, 0.031rem);--_label-text-type:var(--md-navigation-bar-label-text-type, 500 0.75rem / 1rem var(--md-ref-typeface-plain, Roboto));--_label-text-weight:var(--md-navigation-bar-label-text-weight, 500);--_pressed-state-layer-opacity:var(--md-navigation-bar-pressed-state-layer-opacity, 0.12);--md-focus-ring-shape-start-start:var(--md-focus-ring-shape, 8px);--md-focus-ring-shape-start-end:var(--md-focus-ring-shape, 8px);--md-focus-ring-shape-end-end:var(--md-focus-ring-shape, 8px);--md-focus-ring-shape-end-start:var(--md-focus-ring-shape, 8px);--md-focus-ring-offset:-2px;display:flex;flex-grow:1}.md3-navigation-tab{align-items:center;appearance:none;background:0 0;border:none;box-sizing:border-box;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:center;min-height:48px;min-width:48px;outline:0;padding:8px 0 12px;position:relative;text-align:center;width:100%;font:var(--_label-text-type)}.md3-navigation-tab::-moz-focus-inner{border:0;padding:0}.md3-navigation-tab__icon-content{align-items:center;box-sizing:border-box;display:flex;justify-content:center;position:relative;z-index:1}.md3-navigation-tab__label-text{height:16px;margin-top:4px;opacity:1;transition:opacity .1s cubic-bezier(.4,0,.2,1),height .1s cubic-bezier(.4,0,.2,1);z-index:1}.md3-navigation-tab--hide-inactive-label:not(.md3-navigation-tab--active) .md3-navigation-tab__label-text{height:0;opacity:0}.md3-navigation-tab__active-indicator{display:flex;justify-content:center;opacity:0;position:absolute;transition:width .1s cubic-bezier(.4,0,.2,1),opacity .1s cubic-bezier(.4,0,.2,1);width:32px;background-color:var(--_active-indicator-color);border-radius:var(--_active-indicator-shape)}.md3-navigation-tab--active .md3-navigation-tab__active-indicator{opacity:1}.md3-navigation-tab__active-indicator,.md3-navigation-tab__icon-content{height:var(--_active-indicator-height)}.md3-navigation-tab--active .md3-navigation-tab__active-indicator,.md3-navigation-tab__icon-content{width:var(--_active-indicator-width)}.md3-navigation-tab__icon{fill:currentColor;align-self:center;display:inline-block;position:relative;width:var(--_icon-size);height:var(--_icon-size);font-size:var(--_icon-size)}.md3-navigation-tab__icon.md3-navigation-tab__icon--active{display:none}.md3-navigation-tab--active .md3-navigation-tab__icon{display:none}.md3-navigation-tab--active .md3-navigation-tab__icon.md3-navigation-tab__icon--active{display:inline-block}.md3-navigation-tab__ripple{z-index:0}.md3-navigation-tab--active{--md-ripple-hover-color:var(--_active-hover-state-layer-color);--md-ripple-focus-color:var(--_active-focus-state-layer-color);--md-ripple-pressed-color:var(--_active-pressed-state-layer-color);--md-ripple-hover-opacity:var(--_hover-state-layer-opacity);--md-ripple-focus-opacity:var(--_focus-state-layer-opacity);--md-ripple-pressed-opacity:var(--_pressed-state-layer-opacity)}.md3-navigation-tab--active .md3-navigation-tab__icon{color:var(--_active-icon-color)}.md3-navigation-tab--active .md3-navigation-tab__label-text{color:var(--_active-label-text-color)}.md3-navigation-tab--active:hover .md3-navigation-tab__icon{color:var(--_active-hover-icon-color)}.md3-navigation-tab--active:hover .md3-navigation-tab__label-text{color:var(--_active-hover-label-text-color)}.md3-navigation-tab--active:focus .md3-navigation-tab__icon{color:var(--_active-focus-icon-color)}.md3-navigation-tab--active:focus .md3-navigation-tab__label-text{color:var(--_active-focus-label-text-color)}.md3-navigation-tab--active:active .md3-navigation-tab__icon{color:var(--_active-pressed-icon-color)}.md3-navigation-tab--active:active .md3-navigation-tab__label-text{color:var(--_active-pressed-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active){--md-ripple-hover-color:var(--_inactive-hover-state-layer-color);--md-ripple-focus-color:var(--_inactive-focus-state-layer-color);--md-ripple-pressed-color:var(--_inactive-pressed-state-layer-color);--md-ripple-hover-opacity:var(--_hover-state-layer-opacity);--md-ripple-focus-opacity:var(--_focus-state-layer-opacity);--md-ripple-pressed-opacity:var(--_pressed-state-layer-opacity)}.md3-navigation-tab:not(.md3-navigation-tab--active) .md3-navigation-tab__icon{color:var(--_inactive-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active) .md3-navigation-tab__label-text{color:var(--_inactive-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):hover .md3-navigation-tab__icon{color:var(--_inactive-hover-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):hover .md3-navigation-tab__label-text{color:var(--_inactive-hover-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):focus .md3-navigation-tab__icon{color:var(--_inactive-focus-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):focus .md3-navigation-tab__label-text{color:var(--_inactive-focus-label-text-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):active .md3-navigation-tab__icon{color:var(--_inactive-pressed-icon-color)}.md3-navigation-tab:not(.md3-navigation-tab--active):active .md3-navigation-tab__label-text{color:var(--_inactive-pressed-label-text-color)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Zt=class extends Jt{};Zt.styles=[Xt],Zt=t([rt("md-navigation-tab")],Zt);class Qt extends at{constructor(){super(...arguments),this.opened=!1,this.pivot="end"}render(){const t=this.opened?"true":"false",e=this.opened?"false":"true",{ariaLabel:i,ariaModal:a}=this;return F` <div aria-expanded="${t}" aria-hidden="${e}" aria-label="${i||B}" aria-modal="${a||B}" class="md3-navigation-drawer ${this.getRenderClasses()}" role="dialog"> <md-elevation></md-elevation> <div class="md3-navigation-drawer__slot-content"> <slot></slot> </div> </div> `}getRenderClasses(){return Tt({"md3-navigation-drawer--opened":this.opened,"md3-navigation-drawer--pivot-at-start":"start"===this.pivot})}updated(t){t.has("opened")&&setTimeout((()=>{this.dispatchEvent(new CustomEvent("navigation-drawer-changed",{detail:{opened:this.opened},bubbles:!0,composed:!0}))}),250)}}_t(Qt),t([st({type:Boolean})],Qt.prototype,"opened",void 0),t([st()],Qt.prototype,"pivot",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const te=s`:host{--_container-shape-start-start:var(--md-navigation-drawer-container-shape-start-start, var(--md-navigation-drawer-container-shape, 0));--_container-shape-start-end:var(--md-navigation-drawer-container-shape-start-end, var(--md-navigation-drawer-container-shape, 16px));--_container-shape-end-end:var(--md-navigation-drawer-container-shape-end-end, var(--md-navigation-drawer-container-shape, 16px));--_container-shape-end-start:var(--md-navigation-drawer-container-shape-end-start, var(--md-navigation-drawer-container-shape, 0));--_container-color:var(--md-navigation-drawer-container-color, #fff);--_container-height:var(--md-navigation-drawer-container-height, 100%);--_container-width:var(--md-navigation-drawer-container-width, 360px);--_divider-color:var(--md-navigation-drawer-divider-color, #000);--_modal-container-elevation:var(--md-navigation-drawer-modal-container-elevation, 1);--_standard-container-elevation:var(--md-navigation-drawer-standard-container-elevation, 0);--md-elevation-level:var(--_standard-container-elevation);--md-elevation-shadow-color:var(--_divider-color)}:host{display:flex}.md3-navigation-drawer{inline-size:0;box-sizing:border-box;display:flex;justify-content:flex-end;overflow:hidden;overflow-y:auto;visibility:hidden;transition:inline-size .25s cubic-bezier(.4,0,.2,1) 0s,visibility 0s cubic-bezier(.4,0,.2,1) .25s}md-elevation{z-index:0}.md3-navigation-drawer--opened{visibility:visible;transition:inline-size .25s cubic-bezier(.4,0,.2,1) 0s,visibility 0s cubic-bezier(.4,0,.2,1) 0s}.md3-navigation-drawer--pivot-at-start{justify-content:flex-start}.md3-navigation-drawer__slot-content{display:flex;flex-direction:column;position:relative}`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,ee=s`.md3-navigation-drawer-modal{background-color:var(--_container-color);border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-end-radius:var(--_container-shape-end-end);border-end-start-radius:var(--_container-shape-end-start);height:var(--_container-height)}.md3-navigation-drawer-modal.md3-navigation-drawer-modal--opened{inline-size:var(--_container-width)}.md3-navigation-drawer-modal .md3-navigation-drawer-modal__slot-content{min-inline-size:var(--_container-width);max-inline-size:var(--_container-width)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let ie=class extends Qt{};ie.styles=[ee,te],ie=t([rt("md-navigation-drawer")],ie);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const ae=s`@media(forced-colors:active){:host{--md-list-item-list-item-disabled-label-text-color:GrayText;--md-list-item-list-item-disabled-label-text-opacity:1;--md-list-item-list-item-disabled-leading-icon-color:GrayText;--md-list-item-list-item-disabled-leading-icon-opacity:1;--md-list-item-list-item-disabled-trailing-icon-color:GrayText;--md-list-item-list-item-disabled-trailing-icon-opacity:1}}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;class oe extends at{constructor(){super(...arguments),this.headline="",this.supportingText="",this.multiLineSupportingText=!1,this.trailingSupportingText="",this.disabled=!1,this.itemTabIndex=-1,this.active=!1,this.isListItem=!0,this.listItemRole="listitem",this.showFocusRing=!1,this.showRipple=!1,this.focusOnActivation=!0,this.getRipple=()=>(this.showRipple=!0,this.ripple),this.isFirstUpdate=!0}willUpdate(t){t.has("active")&&!this.disabled&&(this.active?(this.itemTabIndex=0,this.focusOnActivation&&(this.showFocusRing=Wt())):this.isFirstUpdate||(this.itemTabIndex=-1))}render(){return this.renderListItem(F` <div class="content-wrapper"> ${this.renderStart()} ${this.renderBody()} ${this.renderEnd()} ${this.renderRipple()} ${this.renderFocusRing()} </div>`)}renderListItem(t){return F` <li tabindex="${this.disabled?-1:this.itemTabIndex}" role="${this.listItemRole}" aria-selected="${this.ariaSelected||B}" aria-checked="${this.ariaChecked||B}" class="list-item ${Tt(this.getRenderClasses())}" @pointerdown="${this.onPointerdown}" @focus="${this.onFocus}" @blur="${this.onBlur}" @click="${this.onClick}" @pointerenter="${this.onPointerenter}" @pointerleave="${this.onPointerleave}" @keydown="${this.onKeydown}" ${Kt(this.getRipple)}>${t}</li>`}renderRipple(){return this.showRipple?F`<md-ripple ?disabled="${this.disabled}"></md-ripple>`:B}renderFocusRing(){return F`<md-focus-ring class="focus-ring" .visible="${this.showFocusRing}"></md-focus-ring>`}getRenderClasses(){return{"with-one-line":""===this.supportingText,"with-two-line":""!==this.supportingText&&!this.multiLineSupportingText,"with-three-line":""!==this.supportingText&&this.multiLineSupportingText,disabled:this.disabled}}renderStart(){return F`<div class="start"><slot name="start"></slot></div>`}renderBody(){const t=""!==this.supportingText?this.renderSupportingText():"";return F`<div class="body"><span class="label-text">${this.headline}</span>${t}</div>`}renderSupportingText(){return F`<span class="supporting-text ${Tt(this.getSupportingTextClasses())}">${this.supportingText}</span>`}getSupportingTextClasses(){return{"supporting-text--multi-line":this.multiLineSupportingText}}renderEnd(){const t=""!==this.trailingSupportingText?this.renderTrailingSupportingText():"";return F`<div class="end"><slot name="end">${t}</slot></div>`}renderTrailingSupportingText(){return F`<span class="trailing-supporting-text">${this.trailingSupportingText}</span>`}onPointerdown(){Yt(),this.showFocusRing=Wt()}onFocus(){this.showFocusRing=Wt()}onBlur(){this.showFocusRing=!1}onClick(t){}onKeydown(t){}onPointerenter(t){}onPointerleave(t){}updated(t){super.updated(t),t.has("active")&&!this.isFirstUpdate&&this.active&&this.focusOnActivation&&this.focus(),this.isFirstUpdate=!1}focus(){this.listItemRoot?.focus?.()}}_t(oe),t([st()],oe.prototype,"headline",void 0),t([st()],oe.prototype,"supportingText",void 0),t([st({type:Boolean})],oe.prototype,"multiLineSupportingText",void 0),t([st()],oe.prototype,"trailingSupportingText",void 0),t([st({type:Boolean})],oe.prototype,"disabled",void 0),t([st({type:Number})],oe.prototype,"itemTabIndex",void 0),t([st({type:Boolean,reflect:!0})],oe.prototype,"active",void 0),t([st({type:Boolean,attribute:"md-list-item",reflect:!0})],oe.prototype,"isListItem",void 0),t([ht("md-ripple")],oe.prototype,"ripple",void 0),t([dt(".list-item")],oe.prototype,"listItemRoot",void 0),t([lt()],oe.prototype,"showFocusRing",void 0),t([lt()],oe.prototype,"showRipple",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const re=s`:host{--_list-item-container-color:var(--md-list-item-list-item-container-color, var(--md-sys-color-surface, #fef7ff));--_list-item-container-shape:var(--md-list-item-list-item-container-shape, 0px);--_list-item-disabled-label-text-color:var(--md-list-item-list-item-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-disabled-label-text-opacity:var(--md-list-item-list-item-disabled-label-text-opacity, 0.3);--_list-item-disabled-leading-icon-color:var(--md-list-item-list-item-disabled-leading-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-disabled-leading-icon-opacity:var(--md-list-item-list-item-disabled-leading-icon-opacity, 0.38);--_list-item-disabled-trailing-icon-color:var(--md-list-item-list-item-disabled-trailing-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-disabled-trailing-icon-opacity:var(--md-list-item-list-item-disabled-trailing-icon-opacity, 0.38);--_list-item-focus-label-text-color:var(--md-list-item-list-item-focus-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-focus-leading-icon-icon-color:var(--md-list-item-list-item-focus-leading-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-focus-state-layer-color:var(--md-list-item-list-item-focus-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-focus-state-layer-opacity:var(--md-list-item-list-item-focus-state-layer-opacity, 0.12);--_list-item-focus-trailing-icon-icon-color:var(--md-list-item-list-item-focus-trailing-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-hover-label-text-color:var(--md-list-item-list-item-hover-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-hover-leading-icon-icon-color:var(--md-list-item-list-item-hover-leading-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-hover-state-layer-color:var(--md-list-item-list-item-hover-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-hover-state-layer-opacity:var(--md-list-item-list-item-hover-state-layer-opacity, 0.08);--_list-item-hover-trailing-icon-icon-color:var(--md-list-item-list-item-hover-trailing-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-label-text-color:var(--md-list-item-list-item-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-label-text-line-height:var(--md-list-item-list-item-label-text-line-height, 1.5rem);--_list-item-label-text-type:var(--md-list-item-list-item-label-text-type, var(--md-sys-typescale-body-large, 400 1rem / 1.5rem var(--md-ref-typeface-plain, Roboto)));--_list-item-large-leading-video-height:var(--md-list-item-list-item-large-leading-video-height, 69px);--_list-item-leading-avatar-label-color:var(--md-list-item-list-item-leading-avatar-label-color, var(--md-sys-color-on-primary-container, #21005d));--_list-item-leading-avatar-label-type:var(--md-list-item-list-item-leading-avatar-label-type, var(--md-sys-typescale-title-medium, 500 1rem / 1.5rem var(--md-ref-typeface-plain, Roboto)));--_list-item-leading-avatar-color:var(--md-list-item-list-item-leading-avatar-color, var(--md-sys-color-primary-container, #eaddff));--_list-item-leading-avatar-shape:var(--md-list-item-list-item-leading-avatar-shape, 9999px);--_list-item-leading-avatar-size:var(--md-list-item-list-item-leading-avatar-size, 40px);--_list-item-leading-icon-color:var(--md-list-item-list-item-leading-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-leading-icon-size:var(--md-list-item-list-item-leading-icon-size, 18px);--_list-item-leading-image-height:var(--md-list-item-list-item-leading-image-height, 56px);--_list-item-leading-image-shape:var(--md-list-item-list-item-leading-image-shape, 0px);--_list-item-leading-image-width:var(--md-list-item-list-item-leading-image-width, 56px);--_list-item-leading-video-shape:var(--md-list-item-list-item-leading-video-shape, 0px);--_list-item-leading-video-width:var(--md-list-item-list-item-leading-video-width, 100px);--_list-item-one-line-container-height:var(--md-list-item-list-item-one-line-container-height, 56px);--_list-item-pressed-label-text-color:var(--md-list-item-list-item-pressed-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-pressed-leading-icon-icon-color:var(--md-list-item-list-item-pressed-leading-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-pressed-state-layer-color:var(--md-list-item-list-item-pressed-state-layer-color, var(--md-sys-color-on-surface, #1d1b20));--_list-item-pressed-state-layer-opacity:var(--md-list-item-list-item-pressed-state-layer-opacity, 0.12);--_list-item-pressed-trailing-icon-icon-color:var(--md-list-item-list-item-pressed-trailing-icon-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-small-leading-video-height:var(--md-list-item-list-item-small-leading-video-height, 56px);--_list-item-supporting-text-color:var(--md-list-item-list-item-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-supporting-text-type:var(--md-list-item-list-item-supporting-text-type, var(--md-sys-typescale-body-medium, 400 0.875rem / 1.25rem var(--md-ref-typeface-plain, Roboto)));--_list-item-three-line-container-height:var(--md-list-item-list-item-three-line-container-height, 88px);--_list-item-trailing-icon-color:var(--md-list-item-list-item-trailing-icon-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-trailing-icon-size:var(--md-list-item-list-item-trailing-icon-size, 24px);--_list-item-trailing-supporting-text-color:var(--md-list-item-list-item-trailing-supporting-text-color, var(--md-sys-color-on-surface-variant, #49454f));--_list-item-trailing-supporting-text-line-height:var(--md-list-item-list-item-trailing-supporting-text-line-height, 1rem);--_list-item-trailing-supporting-text-type:var(--md-list-item-list-item-trailing-supporting-text-type, var(--md-sys-typescale-label-small, 500 0.688rem / 1rem var(--md-ref-typeface-plain, Roboto)));--_list-item-two-line-container-height:var(--md-list-item-list-item-two-line-container-height, 72px);--_list-item-leading-element-leading-space:var(--md-list-item-list-item-leading-element-leading-space, 16px);--_list-item-leading-space:var(--md-list-item-list-item-leading-space, 16px);--_list-item-leading-video-leading-space:var(--md-list-item-list-item-leading-video-leading-space, 0px);--_list-item-trailing-element-headline-trailing-element-space:var(--md-list-item-list-item-trailing-element-headline-trailing-element-space, 16px);--_list-item-trailing-space:var(--md-list-item-list-item-trailing-space, 16px)}:host{color:unset;--md-focus-ring-shape-start-start:var(--md-focus-ring-shape, 4px);--md-focus-ring-shape-start-end:var(--md-focus-ring-shape, 4px);--md-focus-ring-shape-end-end:var(--md-focus-ring-shape, 4px);--md-focus-ring-shape-end-start:var(--md-focus-ring-shape, 4px);--md-focus-ring-offset:-3px;--md-ripple-hover-color:var(--_list-item-hover-state-layer-color);--md-ripple-hover-opacity:var(--_list-item-hover-state-layer-opacity);--md-ripple-pressed-color:var(--_list-item-pressed-state-layer-color);--md-ripple-pressed-opacity:var(--_list-item-pressed-state-layer-opacity);--md-ripple-focus-color:var(--_list-item-focus-state-layer-color);--md-ripple-focus-opacity:var(--_list-item-focus-state-layer-opacity)}.list-item{align-items:center;box-sizing:border-box;display:flex;outline:0;position:relative;width:100%;text-decoration:none;background-color:var(--_list-item-container-color);border-radius:var(--_list-item-container-shape)}.list-item:not(.disabled){cursor:pointer}.list-item.disabled{pointer-events:none}.content-wrapper{display:flex;width:100%;border-radius:inherit}md-ripple{border-radius:inherit}.with-one-line{min-height:var(--_list-item-one-line-container-height)}.with-two-line{min-height:var(--_list-item-two-line-container-height)}.with-three-line{min-height:var(--_list-item-three-line-container-height)}.start{display:inline-flex;flex-direction:column;justify-content:center;align-items:center;flex:0 0 auto;z-index:1}.with-three-line .start{justify-content:start}slot[name=start]::slotted([data-variant=avatar]),slot[name=start]::slotted([data-variant=icon]),slot[name=start]::slotted([data-variant=image]){margin-inline-start:var(--_list-item-leading-element-leading-space)}.body{display:inline-flex;justify-content:center;flex-direction:column;box-sizing:border-box;flex:1 0 0;padding-inline-start:var(--_list-item-leading-space);padding-inline-end:var(--_list-item-trailing-space);z-index:1}.end{display:inline-flex;flex-direction:column;justify-content:center;flex:0 0 auto;z-index:1}.with-three-line .end{justify-content:start}.trailing-supporting-text,slot[name=end]::slotted(*){margin-inline-end:var(--_list-item-trailing-element-headline-trailing-element-space)}.label-text{display:flex;color:var(--_list-item-label-text-color);font:var(--_list-item-label-text-type)}:hover .label-text{color:var(--_list-item-hover-label-text-color)}:focus .label-text{color:var(--_list-item-focus-label-text-color)}:active .label-text{color:var(--_list-item-pressed-label-text-color)}.disabled .label-text{color:var(--_list-item-disabled-label-text-color);opacity:var(--_list-item-disabled-label-text-opacity)}.supporting-text{text-overflow:ellipsis;white-space:normal;overflow:hidden;width:100%;color:var(--_list-item-supporting-text-color);font:var(--_list-item-supporting-text-type);-webkit-box-orient:vertical;-webkit-line-clamp:1;display:-webkit-box}.disabled .supporting-text{color:var(--_list-item-disabled-label-text-color);opacity:var(--_list-item-disabled-label-text-opacity)}.supporting-text--multi-line{-webkit-line-clamp:2}.trailing-supporting-text{padding-inline-start:16px;font:var(--_list-item-trailing-supporting-text-type)}.list-item:not(.disabled) .trailing-supporting-text{color:var(--_list-item-trailing-supporting-text-color)}.disabled .trailing-supporting-text{color:var(--_list-item-disabled-label-text-color);opacity:var(--_list-item-disabled-label-text-opacity)}.with-three-line .trailing-supporting-text{padding-block-start:calc((var(--_list-item-label-text-line-height) - var(--_list-item-trailing-supporting-text-line-height))/ 2)}.focus-ring{z-index:1}::slotted([data-variant=image]){display:inline-flex;height:var(--_list-item-leading-image-height);width:var(--_list-item-leading-image-width);border-radius:var(--_list-item-leading-image-shape);padding-block:calc((var(--_list-item-two-line-container-height) - var(--_list-item-leading-image-height))/ 2)}.with-three-line ::slotted([data-variant=image]){padding-block:0}slot[name=start]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-leading-icon-color);--md-icon-size:var(--_list-item-leading-icon-size)}.with-three-line slot[name=start]::slotted([data-variant=icon]){padding-block-start:calc((var(--_list-item-label-text-line-height) - var(--_list-item-leading-icon-size))/ 2)}slot[name=end]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-trailing-icon-color);--md-icon-size:var(--_list-item-trailing-icon-size)}.with-three-line slot[name=end]::slotted([data-variant=icon]){padding-block-start:calc((var(--_list-item-label-text-line-height) - var(--_list-item-trailing-icon-size))/ 2)}:hover slot[name=start]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-hover-leading-icon-icon-color)}:hover slot[name=end]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-hover-trailing-icon-icon-color)}:focus slot[name=start]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-focus-leading-icon-icon-color)}:focus slot[name=end]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-focus-trailing-icon-icon-color)}:active slot[name=start]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-pressed-leading-icon-icon-color)}:active slot[name=end]::slotted([data-variant=icon]){--md-icon-color:var(--_list-item-pressed-trailing-icon-icon-color)}.disabled slot[name=start]::slotted([data-variant=icon]){opacity:var(--_list-item-disabled-leading-icon-opacity);--md-icon-color:var(--_list-item-disabled-leading-icon-color)}.disabled slot[name=end]::slotted([data-variant=icon]){opacity:var(--_list-item-disabled-trailing-icon-opacity);--md-icon-color:var(--_list-item-disabled-trailing-icon-color)}::slotted([data-variant=avatar]){display:inline-flex;justify-content:center;align-items:center;background-color:var(--_list-item-leading-avatar-color);height:var(--_list-item-leading-avatar-size);width:var(--_list-item-leading-avatar-size);border-radius:var(--_list-item-leading-avatar-shape);color:var(--_list-item-leading-avatar-label-color);font:var(--_list-item-leading-avatar-label-type)}::slotted([data-variant=video-large]),::slotted([data-variant=video]){display:inline-flex;object-fit:cover;height:var(--_list-item-small-leading-video-height);width:var(--_list-item-leading-video-width);border-radius:var(--_list-item-leading-video-shape);margin-inline-start:var(--_list-item-leading-video-leading-space);padding-block:calc((var(--_list-item-three-line-container-height) - var(--_list-item-small-leading-video-height))/ 2)}.with-three-line ::slotted([data-variant=video-large]),.with-three-line ::slotted([data-variant=video]){padding-block:0}::slotted([data-variant=video-large]){padding-block:calc((var(--_list-item-three-line-container-height) - var(--_list-item-large-leading-video-height))/ 2);height:var(--_list-item-large-leading-video-height)}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let ne=class extends oe{};ne.styles=[re,ae],ne=t([rt("md-list-item")],ne);const se={ArrowDown:"ArrowDown",ArrowUp:"ArrowUp",Home:"Home",End:"End"},le=new Set(Object.values(se));class ce extends at{constructor(){super(...arguments),this.type="list",this.listTabIndex=0}render(){return this.renderList()}renderList(){const{ariaLabel:t}=this;return F` <ul class="md3-list ${Tt(this.getListClasses())}" aria-label="${t||B}" tabindex="${this.listTabIndex}" role="${this.type||B}" @keydown="${this.handleKeydown}"> ${this.renderContent()} </ul> `}getListClasses(){return{}}renderContent(){return F`<span><slot @click="${t=>{t.stopPropagation()}}"></slot></span>`}handleKeydown(t){const e=t.key;if(!function(t){return le.has(t)}(e))return;const i=this.items;if(!i.length)return;const a=ce.getActiveItem(i);switch(a&&(a.item.active=!1),qt(t),t.preventDefault(),e){case se.ArrowDown:if(a){const t=ce.getNextItem(i,a.index);t&&(t.active=!0)}else ce.activateFirstItem(i);break;case se.ArrowUp:if(a){const t=ce.getPrevItem(i,a.index);t&&(t.active=!0)}else i[i.length-1].active=!0;break;case se.Home:ce.activateFirstItem(i);break;case se.End:ce.activateLastItem(i)}}static activateFirstItem(t){const e=ce.getFirstActivatableItem(t);e&&(e.active=!0)}static activateLastItem(t){const e=ce.getLastActivatableItem(t);e&&(e.active=!0)}static deactivateActiveItem(t){const e=ce.getActiveItem(t);return e&&(e.item.active=!1),e}focus(){this.listRoot.focus()}static getActiveItem(t){for(let e=0;e<t.length;e++){const i=t[e];if(i.active)return{item:i,index:e}}return null}static getFirstActivatableItem(t){for(const e of t)if(!e.disabled)return e;return null}static getLastActivatableItem(t){for(let e=t.length-1;e>=0;e--){const i=t[e];if(!i.disabled)return i}return null}static getNextItem(t,e){for(let i=1;i<t.length;i++){const a=t[(i+e)%t.length];if(!a.disabled)return a}return null}static getPrevItem(t,e){for(let i=1;i<t.length;i++){const a=t[(e-i+t.length)%t.length];if(!a.disabled)return a}return null}}_t(ce),ce.shadowRootOptions={mode:"open",delegatesFocus:!0},t([st()],ce.prototype,"type",void 0),t([st({type:Number})],ce.prototype,"listTabIndex",void 0),t([dt(".md3-list")],ce.prototype,"listRoot",void 0),t([mt({flatten:!0,selector:"[md-list-item]"})],ce.prototype,"items",void 0);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const de=s`:host{--_container-color:var(--md-list-container-color, var(--md-sys-color-surface, #fef7ff));color:unset;min-width:300px}.md3-list{background-color:var(--_container-color);border-radius:inherit;display:block;list-style-type:none;margin:0;min-width:inherit;outline:0;padding:8px 0;position:relative}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let he=class extends ce{};
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function pe(t){return t<0?-1:0===t?0:1}function ue(t,e,i){return(1-i)*t+i*e}function me(t,e,i){return i<t?t:i>e?e:i}function ve(t){return(t%=360)<0&&(t+=360),t}function ge(t,e){return[t[0]*e[0][0]+t[1]*e[0][1]+t[2]*e[0][2],t[0]*e[1][0]+t[1]*e[1][1]+t[2]*e[1][2],t[0]*e[2][0]+t[1]*e[2][1]+t[2]*e[2][2]]}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */he.styles=[de],he=t([rt("md-list")],he);const fe=[[.41233895,.35762064,.18051042],[.2126,.7152,.0722],[.01932141,.11916382,.95034478]],be=[[3.2413774792388685,-1.5376652402851851,-.49885366846268053],[-.9691452513005321,1.8758853451067872,.04156585616912061],[.05562093689691305,-.20395524564742123,1.0571799111220335]],ye=[95.047,100,108.883];function _e(t,e,i){return(255<<24|(255&t)<<16|(255&e)<<8|255&i)>>>0}function xe(t){return _e(Te(t[0]),Te(t[1]),Te(t[2]))}function we(t){return t>>16&255}function $e(t){return t>>8&255}function ke(t){return 255&t}function Ce(t){const e=function(t){return ge([Se(we(t)),Se($e(t)),Se(ke(t))],fe)}(t)[1];return 116*Ie(e/100)-16}function Ae(t){return 100*function(t){const e=216/24389,i=24389/27,a=t*t*t;return a>e?a:(116*t-16)/i}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */((t+16)/116)}function Pe(t){return 116*Ie(t/100)-16}function Se(t){const e=t/255;return e<=.040449936?e/12.92*100:100*Math.pow((e+.055)/1.055,2.4)}function Te(t){const e=t/100;let i=0;return i=e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055,a=0,o=255,(r=Math.round(255*i))<a?a:r>o?o:r;var a,o,r}function Ie(t){return t>216/24389?Math.pow(t,1/3):(903.2962962962963*t+16)/116}class Ee{static make(t=function(){return ye}(),e=200/Math.PI*Ae(50)/100,i=50,a=2,o=!1){const r=t,n=.401288*r[0]+.650173*r[1]+-.051461*r[2],s=-.250268*r[0]+1.204414*r[1]+.045854*r[2],l=-.002079*r[0]+.048952*r[1]+.953127*r[2],c=.8+a/10,d=c>=.9?ue(.59,.69,10*(c-.9)):ue(.525,.59,10*(c-.8));let h=o?1:c*(1-1/3.6*Math.exp((-e-42)/92));h=h>1?1:h<0?0:h;const p=c,u=[h*(100/n)+1-h,h*(100/s)+1-h,h*(100/l)+1-h],m=1/(5*e+1),v=m*m*m*m,g=1-v,f=v*e+.1*g*g*Math.cbrt(5*e),b=Ae(i)/t[1],y=1.48+Math.sqrt(b),_=.725/Math.pow(b,.2),x=_,w=[Math.pow(f*u[0]*n/100,.42),Math.pow(f*u[1]*s/100,.42),Math.pow(f*u[2]*l/100,.42)],$=[400*w[0]/(w[0]+27.13),400*w[1]/(w[1]+27.13),400*w[2]/(w[2]+27.13)];return new Ee(b,(2*$[0]+$[1]+.05*$[2])*_,_,x,d,p,u,f,Math.pow(f,.25),y)}constructor(t,e,i,a,o,r,n,s,l,c){this.n=t,this.aw=e,this.nbb=i,this.ncb=a,this.c=o,this.nc=r,this.rgbD=n,this.fl=s,this.fLRoot=l,this.z=c}}Ee.DEFAULT=Ee.make();
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Le{constructor(t,e,i,a,o,r,n,s,l){this.hue=t,this.chroma=e,this.j=i,this.q=a,this.m=o,this.s=r,this.jstar=n,this.astar=s,this.bstar=l}distance(t){const e=this.jstar-t.jstar,i=this.astar-t.astar,a=this.bstar-t.bstar,o=Math.sqrt(e*e+i*i+a*a);return 1.41*Math.pow(o,.63)}static fromInt(t){return Le.fromIntInViewingConditions(t,Ee.DEFAULT)}static fromIntInViewingConditions(t,e){const i=(65280&t)>>8,a=255&t,o=Se((16711680&t)>>16),r=Se(i),n=Se(a),s=.41233895*o+.35762064*r+.18051042*n,l=.2126*o+.7152*r+.0722*n,c=.01932141*o+.11916382*r+.95034478*n,d=.401288*s+.650173*l-.051461*c,h=-.250268*s+1.204414*l+.045854*c,p=-.002079*s+.048952*l+.953127*c,u=e.rgbD[0]*d,m=e.rgbD[1]*h,v=e.rgbD[2]*p,g=Math.pow(e.fl*Math.abs(u)/100,.42),f=Math.pow(e.fl*Math.abs(m)/100,.42),b=Math.pow(e.fl*Math.abs(v)/100,.42),y=400*pe(u)*g/(g+27.13),_=400*pe(m)*f/(f+27.13),x=400*pe(v)*b/(b+27.13),w=(11*y+-12*_+x)/11,$=(y+_-2*x)/9,k=(20*y+20*_+21*x)/20,C=(40*y+20*_+x)/20,A=180*Math.atan2($,w)/Math.PI,P=A<0?A+360:A>=360?A-360:A,S=P*Math.PI/180,T=C*e.nbb,I=100*Math.pow(T/e.aw,e.c*e.z),E=4/e.c*Math.sqrt(I/100)*(e.aw+4)*e.fLRoot,L=P<20.14?P+360:P,R=5e4/13*(.25*(Math.cos(L*Math.PI/180+2)+3.8))*e.nc*e.ncb*Math.sqrt(w*w+$*$)/(k+.305),M=Math.pow(R,.9)*Math.pow(1.64-Math.pow(.29,e.n),.73),D=M*Math.sqrt(I/100),O=D*e.fLRoot,z=50*Math.sqrt(M*e.c/(e.aw+4)),F=(1+100*.007)*I/(1+.007*I),U=1/.0228*Math.log(1+.0228*O),B=U*Math.cos(S),N=U*Math.sin(S);return new Le(P,D,I,E,O,z,F,B,N)}static fromJch(t,e,i){return Le.fromJchInViewingConditions(t,e,i,Ee.DEFAULT)}static fromJchInViewingConditions(t,e,i,a){const o=4/a.c*Math.sqrt(t/100)*(a.aw+4)*a.fLRoot,r=e*a.fLRoot,n=e/Math.sqrt(t/100),s=50*Math.sqrt(n*a.c/(a.aw+4)),l=i*Math.PI/180,c=(1+100*.007)*t/(1+.007*t),d=1/.0228*Math.log(1+.0228*r),h=d*Math.cos(l),p=d*Math.sin(l);return new Le(i,e,t,o,r,s,c,h,p)}static fromUcs(t,e,i){return Le.fromUcsInViewingConditions(t,e,i,Ee.DEFAULT)}static fromUcsInViewingConditions(t,e,i,a){const o=e,r=i,n=Math.sqrt(o*o+r*r),s=(Math.exp(.0228*n)-1)/.0228/a.fLRoot;let l=Math.atan2(r,o)*(180/Math.PI);l<0&&(l+=360);const c=t/(1-.007*(t-100));return Le.fromJchInViewingConditions(c,s,l,a)}toInt(){return this.viewed(Ee.DEFAULT)}viewed(t){const e=0===this.chroma||0===this.j?0:this.chroma/Math.sqrt(this.j/100),i=Math.pow(e/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),a=this.hue*Math.PI/180,o=.25*(Math.cos(a+2)+3.8),r=t.aw*Math.pow(this.j/100,1/t.c/t.z),n=o*(5e4/13)*t.nc*t.ncb,s=r/t.nbb,l=Math.sin(a),c=Math.cos(a),d=23*(s+.305)*i/(23*n+11*i*c+108*i*l),h=d*c,p=d*l,u=(460*s+451*h+288*p)/1403,m=(460*s-891*h-261*p)/1403,v=(460*s-220*h-6300*p)/1403,g=Math.max(0,27.13*Math.abs(u)/(400-Math.abs(u))),f=pe(u)*(100/t.fl)*Math.pow(g,1/.42),b=Math.max(0,27.13*Math.abs(m)/(400-Math.abs(m))),y=pe(m)*(100/t.fl)*Math.pow(b,1/.42),_=Math.max(0,27.13*Math.abs(v)/(400-Math.abs(v))),x=pe(v)*(100/t.fl)*Math.pow(_,1/.42),w=f/t.rgbD[0],$=y/t.rgbD[1],k=x/t.rgbD[2],C=function(t,e,i){const a=be,o=a[0][0]*t+a[0][1]*e+a[0][2]*i,r=a[1][0]*t+a[1][1]*e+a[1][2]*i,n=a[2][0]*t+a[2][1]*e+a[2][2]*i;return _e(Te(o),Te(r),Te(n))}(1.86206786*w-1.01125463*$+.14918677*k,.38752654*w+.62144744*$-.00897398*k,-.0158415*w-.03412294*$+1.04996444*k);return C}static fromXyzInViewingConditions(t,e,i,a){const o=.401288*t+.650173*e-.051461*i,r=-.250268*t+1.204414*e+.045854*i,n=-.002079*t+.048952*e+.953127*i,s=a.rgbD[0]*o,l=a.rgbD[1]*r,c=a.rgbD[2]*n,d=Math.pow(a.fl*Math.abs(s)/100,.42),h=Math.pow(a.fl*Math.abs(l)/100,.42),p=Math.pow(a.fl*Math.abs(c)/100,.42),u=400*pe(s)*d/(d+27.13),m=400*pe(l)*h/(h+27.13),v=400*pe(c)*p/(p+27.13),g=(11*u+-12*m+v)/11,f=(u+m-2*v)/9,b=(20*u+20*m+21*v)/20,y=(40*u+20*m+v)/20,_=180*Math.atan2(f,g)/Math.PI,x=_<0?_+360:_>=360?_-360:_,w=x*Math.PI/180,$=y*a.nbb,k=100*Math.pow($/a.aw,a.c*a.z),C=4/a.c*Math.sqrt(k/100)*(a.aw+4)*a.fLRoot,A=x<20.14?x+360:x,P=5e4/13*(1/4*(Math.cos(A*Math.PI/180+2)+3.8))*a.nc*a.ncb*Math.sqrt(g*g+f*f)/(b+.305),S=Math.pow(P,.9)*Math.pow(1.64-Math.pow(.29,a.n),.73),T=S*Math.sqrt(k/100),I=T*a.fLRoot,E=50*Math.sqrt(S*a.c/(a.aw+4)),L=(1+100*.007)*k/(1+.007*k),R=Math.log(1+.0228*I)/.0228,M=R*Math.cos(w),D=R*Math.sin(w);return new Le(x,T,k,C,I,E,L,M,D)}xyzInViewingConditions(t){const e=0===this.chroma||0===this.j?0:this.chroma/Math.sqrt(this.j/100),i=Math.pow(e/Math.pow(1.64-Math.pow(.29,t.n),.73),1/.9),a=this.hue*Math.PI/180,o=.25*(Math.cos(a+2)+3.8),r=t.aw*Math.pow(this.j/100,1/t.c/t.z),n=o*(5e4/13)*t.nc*t.ncb,s=r/t.nbb,l=Math.sin(a),c=Math.cos(a),d=23*(s+.305)*i/(23*n+11*i*c+108*i*l),h=d*c,p=d*l,u=(460*s+451*h+288*p)/1403,m=(460*s-891*h-261*p)/1403,v=(460*s-220*h-6300*p)/1403,g=Math.max(0,27.13*Math.abs(u)/(400-Math.abs(u))),f=pe(u)*(100/t.fl)*Math.pow(g,1/.42),b=Math.max(0,27.13*Math.abs(m)/(400-Math.abs(m))),y=pe(m)*(100/t.fl)*Math.pow(b,1/.42),_=Math.max(0,27.13*Math.abs(v)/(400-Math.abs(v))),x=pe(v)*(100/t.fl)*Math.pow(_,1/.42),w=f/t.rgbD[0],$=y/t.rgbD[1],k=x/t.rgbD[2];return[1.86206786*w-1.01125463*$+.14918677*k,.38752654*w+.62144744*$-.00897398*k,-.0158415*w-.03412294*$+1.04996444*k]}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Re{static sanitizeRadians(t){return(t+8*Math.PI)%(2*Math.PI)}static trueDelinearized(t){const e=t/100;let i=0;return i=e<=.0031308?12.92*e:1.055*Math.pow(e,1/2.4)-.055,255*i}static chromaticAdaptation(t){const e=Math.pow(Math.abs(t),.42);return 400*pe(t)*e/(e+27.13)}static hueOf(t){const e=ge(t,Re.SCALED_DISCOUNT_FROM_LINRGB),i=Re.chromaticAdaptation(e[0]),a=Re.chromaticAdaptation(e[1]),o=Re.chromaticAdaptation(e[2]),r=(11*i+-12*a+o)/11,n=(i+a-2*o)/9;return Math.atan2(n,r)}static areInCyclicOrder(t,e,i){return Re.sanitizeRadians(e-t)<Re.sanitizeRadians(i-t)}static intercept(t,e,i){return(e-t)/(i-t)}static lerpPoint(t,e,i){return[t[0]+(i[0]-t[0])*e,t[1]+(i[1]-t[1])*e,t[2]+(i[2]-t[2])*e]}static setCoordinate(t,e,i,a){const o=Re.intercept(t[a],e,i[a]);return Re.lerpPoint(t,o,i)}static isBounded(t){return 0<=t&&t<=100}static nthVertex(t,e){const i=Re.Y_FROM_LINRGB[0],a=Re.Y_FROM_LINRGB[1],o=Re.Y_FROM_LINRGB[2],r=e%4<=1?0:100,n=e%2==0?0:100;if(e<4){const e=r,s=n,l=(t-e*a-s*o)/i;return Re.isBounded(l)?[l,e,s]:[-1,-1,-1]}if(e<8){const e=r,s=n,l=(t-s*i-e*o)/a;return Re.isBounded(l)?[s,l,e]:[-1,-1,-1]}{const e=r,s=n,l=(t-e*i-s*a)/o;return Re.isBounded(l)?[e,s,l]:[-1,-1,-1]}}static bisectToSegment(t,e){let i=[-1,-1,-1],a=i,o=0,r=0,n=!1,s=!0;for(let l=0;l<12;l++){const c=Re.nthVertex(t,l);if(c[0]<0)continue;const d=Re.hueOf(c);n?(s||Re.areInCyclicOrder(o,d,r))&&(s=!1,Re.areInCyclicOrder(o,e,d)?(a=c,r=d):(i=c,o=d)):(i=c,a=c,o=d,r=d,n=!0)}return[i,a]}static midpoint(t,e){return[(t[0]+e[0])/2,(t[1]+e[1])/2,(t[2]+e[2])/2]}static criticalPlaneBelow(t){return Math.floor(t-.5)}static criticalPlaneAbove(t){return Math.ceil(t-.5)}static bisectToLimit(t,e){const i=Re.bisectToSegment(t,e);let a=i[0],o=Re.hueOf(a),r=i[1];for(let t=0;t<3;t++)if(a[t]!==r[t]){let i=-1,n=255;a[t]<r[t]?(i=Re.criticalPlaneBelow(Re.trueDelinearized(a[t])),n=Re.criticalPlaneAbove(Re.trueDelinearized(r[t]))):(i=Re.criticalPlaneAbove(Re.trueDelinearized(a[t])),n=Re.criticalPlaneBelow(Re.trueDelinearized(r[t])));for(let s=0;s<8&&!(Math.abs(n-i)<=1);s++){const s=Math.floor((i+n)/2),l=Re.CRITICAL_PLANES[s],c=Re.setCoordinate(a,l,r,t),d=Re.hueOf(c);Re.areInCyclicOrder(o,e,d)?(r=c,n=s):(a=c,o=d,i=s)}}return Re.midpoint(a,r)}static inverseChromaticAdaptation(t){const e=Math.abs(t),i=Math.max(0,27.13*e/(400-e));return pe(t)*Math.pow(i,1/.42)}static findResultByJ(t,e,i){let a=11*Math.sqrt(i);const o=Ee.DEFAULT,r=1/Math.pow(1.64-Math.pow(.29,o.n),.73),n=.25*(Math.cos(t+2)+3.8)*(5e4/13)*o.nc*o.ncb,s=Math.sin(t),l=Math.cos(t);for(let t=0;t<5;t++){const c=a/100,d=0===e||0===a?0:e/Math.sqrt(c),h=Math.pow(d*r,1/.9),p=o.aw*Math.pow(c,1/o.c/o.z)/o.nbb,u=23*(p+.305)*h/(23*n+11*h*l+108*h*s),m=u*l,v=u*s,g=(460*p+451*m+288*v)/1403,f=(460*p-891*m-261*v)/1403,b=(460*p-220*m-6300*v)/1403,y=ge([Re.inverseChromaticAdaptation(g),Re.inverseChromaticAdaptation(f),Re.inverseChromaticAdaptation(b)],Re.LINRGB_FROM_SCALED_DISCOUNT);if(y[0]<0||y[1]<0||y[2]<0)return 0;const _=Re.Y_FROM_LINRGB[0],x=Re.Y_FROM_LINRGB[1],w=Re.Y_FROM_LINRGB[2],$=_*y[0]+x*y[1]+w*y[2];if($<=0)return 0;if(4===t||Math.abs($-i)<.002)return y[0]>100.01||y[1]>100.01||y[2]>100.01?0:xe(y);a-=($-i)*a/(2*$)}return 0}static solveToInt(t,e,i){if(e<1e-4||i<1e-4||i>99.9999)return function(t){const e=Te(Ae(t));return _e(e,e,e)}(i);const a=(t=ve(t))/180*Math.PI,o=Ae(i),r=Re.findResultByJ(a,e,o);if(0!==r)return r;return xe(Re.bisectToLimit(o,a))}static solveToCam(t,e,i){return Le.fromInt(Re.solveToInt(t,e,i))}}Re.SCALED_DISCOUNT_FROM_LINRGB=[[.001200833568784504,.002389694492170889,.0002795742885861124],[.0005891086651375999,.0029785502573438758,.0003270666104008398],[.00010146692491640572,.0005364214359186694,.0032979401770712076]],Re.LINRGB_FROM_SCALED_DISCOUNT=[[1373.2198709594231,-1100.4251190754821,-7.278681089101213],[-271.815969077903,559.6580465940733,-32.46047482791194],[1.9622899599665666,-57.173814538844006,308.7233197812385]],Re.Y_FROM_LINRGB=[.2126,.7152,.0722],Re.CRITICAL_PLANES=[.015176349177441876,.045529047532325624,.07588174588720938,.10623444424209313,.13658714259697685,.16693984095186062,.19729253930674434,.2276452376616281,.2579979360165119,.28835063437139563,.3188300904430532,.350925934958123,.3848314933096426,.42057480301049466,.458183274052838,.4976837250274023,.5391024159806381,.5824650784040898,.6277969426914107,.6751227633498623,.7244668422128921,.775853049866786,.829304845476233,.8848452951698498,.942497089126609,1.0022825574869039,1.0642236851973577,1.1283421258858297,1.1946592148522128,1.2631959812511864,1.3339731595349034,1.407011200216447,1.4823302800086415,1.5599503113873272,1.6398909516233677,1.7221716113234105,1.8068114625156377,1.8938294463134073,1.9832442801866852,2.075074464868551,2.1693382909216234,2.2660538449872063,2.36523901573795,2.4669114995532007,2.5710888059345764,2.6777882626779785,2.7870270208169257,2.898822059350997,3.0131901897720907,3.1301480604002863,3.2497121605402226,3.3718988244681087,3.4967242352587946,3.624204428461639,3.754355295633311,3.887192587735158,4.022731918402185,4.160988767090289,4.301978482107941,4.445716283538092,4.592217266055746,4.741496401646282,4.893568542229298,5.048448422192488,5.20615066083972,5.3666897647573375,5.5300801301023865,5.696336044816294,5.865471690767354,6.037501145825082,6.212438385869475,6.390297286737924,6.571091626112461,6.7548350853498045,6.941541251256611,7.131223617812143,7.323895587840543,7.5195704746346665,7.7182615035334345,7.919981813454504,8.124744458384042,8.332562408825165,8.543448553206703,8.757415699253682,8.974476575321063,9.194643831691977,9.417930041841839,9.644347703669503,9.873909240696694,10.106627003236781,10.342513269534024,10.58158024687427,10.8238400726681,11.069304815507364,11.317986476196008,11.569896988756009,11.825048221409341,12.083451977536606,12.345119996613247,12.610063955123938,12.878295467455942,13.149826086772048,13.42466730586372,13.702830557985108,13.984327217668513,14.269168601521828,14.55736596900856,14.848930523210871,15.143873411576273,15.44220572664832,15.743938506781891,16.04908273684337,16.35764934889634,16.66964922287304,16.985093187232053,17.30399201960269,17.62635644741625,17.95219714852476,18.281524751807332,18.614349837764564,18.95068293910138,19.290534541298456,19.633915083172692,19.98083495742689,20.331304511189067,20.685334046541502,21.042933821039977,21.404114048223256,21.76888489811322,22.137256497705877,22.50923893145328,22.884842241736916,23.264076429332462,23.6469514538663,24.033477234264016,24.42366364919083,24.817520537484558,25.21505769858089,25.61628489293138,26.021211842414342,26.429848230738664,26.842203703840827,27.258287870275353,27.678110301598522,28.10168053274597,28.529008062403893,28.96010235337422,29.39497283293396,29.83362889318845,30.276079891419332,30.722335150426627,31.172403958865512,31.62629557157785,32.08401920991837,32.54558406207592,33.010999283389665,33.4802739966603,33.953417292456834,34.430438229418264,34.911345834551085,35.39614910352207,35.88485700094671,36.37747846067349,36.87402238606382,37.37449765026789,37.87891309649659,38.38727753828926,38.89959975977785,39.41588851594697,39.93615253289054,40.460400508064545,40.98864111053629,41.520882981230194,42.05713473317016,42.597404951718396,43.141702194811224,43.6900349931913,44.24241185063697,44.798841244188324,45.35933162437017,45.92389141541209,46.49252901546552,47.065252796817916,47.64207110610409,48.22299226451468,48.808024568002054,49.3971762874833,49.9904556690408,50.587870934119984,51.189430279724725,51.79514187861014,52.40501387947288,53.0190544071392,53.637271562750364,54.259673423945976,54.88626804504493,55.517063457223934,56.15206766869424,56.79128866487574,57.43473440856916,58.08241284012621,58.734331877617365,59.39049941699807,60.05092333227251,60.715611475655585,61.38457167773311,62.057811747619894,62.7353394731159,63.417162620860914,64.10328893648692,64.79372614476921,65.48848194977529,66.18756403501224,66.89098006357258,67.59873767827808,68.31084450182222,69.02730813691093,69.74813616640164,70.47333615344107,71.20291564160104,71.93688215501312,72.67524319850172,73.41800625771542,74.16517879925733,74.9167682708136,75.67278210128072,76.43322770089146,77.1981124613393,77.96744375590167,78.74122893956174,79.51947534912904,80.30219030335869,81.08938110306934,81.88105503125999,82.67721935322541,83.4778813166706,84.28304815182372,85.09272707154808,85.90692527145302,86.72564993000343,87.54890820862819,88.3767072518277,89.2090541872801,90.04595612594655,90.88742016217518,91.73345337380438,92.58406282226491,93.43925555268066,94.29903859396902,95.16341895893969,96.03240364439274,96.9059996312159,97.78421388448044,98.6670533535366,99.55452497210776];
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Me{static from(t,e,i){return new Me(Re.solveToInt(t,e,i))}static fromInt(t){return new Me(t)}toInt(){return this.argb}get hue(){return this.internalHue}set hue(t){this.setInternalState(Re.solveToInt(t,this.internalChroma,this.internalTone))}get chroma(){return this.internalChroma}set chroma(t){this.setInternalState(Re.solveToInt(this.internalHue,t,this.internalTone))}get tone(){return this.internalTone}set tone(t){this.setInternalState(Re.solveToInt(this.internalHue,this.internalChroma,t))}constructor(t){this.argb=t;const e=Le.fromInt(t);this.internalHue=e.hue,this.internalChroma=e.chroma,this.internalTone=Ce(t),this.argb=t}setInternalState(t){const e=Le.fromInt(t);this.internalHue=e.hue,this.internalChroma=e.chroma,this.internalTone=Ce(t),this.argb=t}inViewingConditions(t){const e=Le.fromInt(this.toInt()).xyzInViewingConditions(t),i=Le.fromXyzInViewingConditions(e[0],e[1],e[2],Ee.make());return Me.from(i.hue,i.chroma,Pe(e[1]))}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class De{static harmonize(t,e){const i=Me.fromInt(t),a=Me.fromInt(e),o=function(t,e){return 180-Math.abs(Math.abs(t-e)-180)}(i.hue,a.hue),r=Math.min(.5*o,15),n=ve(i.hue+r*(s=i.hue,ve(a.hue-s)<=180?1:-1));var s;return Me.from(n,i.chroma,i.tone).toInt()}static hctHue(t,e,i){const a=De.cam16Ucs(t,e,i),o=Le.fromInt(a),r=Le.fromInt(t);return Me.from(o.hue,r.chroma,Ce(t)).toInt()}static cam16Ucs(t,e,i){const a=Le.fromInt(t),o=Le.fromInt(e),r=a.jstar,n=a.astar,s=a.bstar,l=r+(o.jstar-r)*i,c=n+(o.astar-n)*i,d=s+(o.bstar-s)*i;return Le.fromUcs(l,c,d).toInt()}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Oe{static ratioOfTones(t,e){return t=me(0,100,t),e=me(0,100,e),Oe.ratioOfYs(Ae(t),Ae(e))}static ratioOfYs(t,e){const i=t>e?t:e;return(i+5)/((i===e?t:e)+5)}static lighter(t,e){if(t<0||t>100)return-1;const i=Ae(t),a=e*(i+5)-5,o=Oe.ratioOfYs(a,i),r=Math.abs(o-e);if(o<e&&r>.04)return-1;const n=Pe(a)+.4;return n<0||n>100?-1:n}static darker(t,e){if(t<0||t>100)return-1;const i=Ae(t),a=(i+5)/e-5,o=Oe.ratioOfYs(i,a),r=Math.abs(o-e);if(o<e&&r>.04)return-1;const n=Pe(a)-.4;return n<0||n>100?-1:n}static lighterUnsafe(t,e){const i=Oe.lighter(t,e);return i<0?100:i}static darkerUnsafe(t,e){const i=Oe.darker(t,e);return i<0?0:i}}
/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ze{static isDisliked(t){const e=Math.round(t.hue)>=90&&Math.round(t.hue)<=111,i=Math.round(t.chroma)>16,a=Math.round(t.tone)<65;return e&&i&&a}static fixIfDisliked(t){return ze.isDisliked(t)?Me.from(t.hue,t.chroma,70):t}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{static fromPalette(t){return new Fe((e=>t.palette(e).hue),(e=>t.palette(e).chroma),t.tone,(e=>Fe.toneMinContrastDefault({tone:t.tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),(e=>Fe.toneMaxContrastDefault({tone:t.tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),t.background,t.toneDeltaConstraint)}static fromHueAndChroma(t){return new Fe(t.hue,t.chroma,t.tone,(e=>Fe.toneMinContrastDefault({tone:t.tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),(e=>Fe.toneMaxContrastDefault({tone:t.tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),t.background,t.toneDeltaConstraint)}static fromArgb(t){return new Fe((e=>Me.fromInt(t.argb(e)).hue),(e=>Me.fromInt(t.argb(e)).chroma),(e=>t.tone?.(e)??Me.fromInt(t.argb(e)).tone),(e=>Fe.toneMinContrastDefault({tone:e=>t.tone?.(e)??Me.fromInt(t.argb(e)).tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),(e=>Fe.toneMaxContrastDefault({tone:e=>t.tone?.(e)??Me.fromInt(t.argb(e)).tone,scheme:e,background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})),t.background,t.toneDeltaConstraint)}constructor(t,e,i,a,o,r,n){this.hue=t,this.chroma=e,this.tone=i,this.toneMinContrast=a,this.toneMaxContrast=o,this.background=r,this.toneDeltaConstraint=n,this.hctCache=new Map}getArgb(t){return this.getHct(t).toInt()}getHct(t){const e=this.hctCache.get(t);if(null!=e)return e;const i=Me.from(this.hue(t),this.chroma(t),this.getTone(t));return this.hctCache.size>4&&this.hctCache.clear(),this.hctCache.set(t,i),i}getTone(t){let e=this.tone(t);const i=t.contrastLevel<0;if(0!==t.contrastLevel){const a=this.tone(t),o=((i?this.toneMinContrast(t):this.toneMaxContrast(t))-a)*Math.abs(t.contrastLevel);e=o+a}const a=this.background?.(t);let o,r,n;if(null!=a){const e=null!=a?.background?.(t);if(o=Oe.ratioOfTones(this.tone(t),a.tone(t)),i){const i=Oe.ratioOfTones(this.toneMinContrast(t),a.toneMinContrast(t));r=e?i:null,n=o}else{const i=Oe.ratioOfTones(this.toneMaxContrast(t),a.toneMaxContrast(t));r=e?Math.min(i,o):null,n=e?Math.max(i,o):null}}return e=Fe.calculateDynamicTone({scheme:t,toneStandard:this.tone,toneToJudge:e=>e.getTone(t),desiredTone:(t,i)=>e,background:null!=a?t=>a:void 0,toneDeltaConstraint:this.toneDeltaConstraint,minRatio:t=>r??1,maxRatio:t=>n??21}),e}static ensureToneDelta(t,e,i,a,o){const r=a?a(i):null;if(null==r||null==o)return t;const n=r.delta,s=o(r.keepAway),l=Math.abs(t-s);if(l>n)return t;switch(r.keepAwayPolarity){case"darker":return me(0,100,s+n);case"lighter":return me(0,100,s-n);case"no-preference":const a=e>r.keepAway.tone(i),o=Math.abs(l-n);return(a?t+o<=100:t<o)?t+o:t-o;default:return t}}static foregroundTone(t,e){const i=Oe.lighterUnsafe(t,e),a=Oe.darkerUnsafe(t,e),o=Oe.ratioOfTones(i,t),r=Oe.ratioOfTones(a,t);if(Fe.tonePrefersLightForeground(t)){const t=Math.abs(o-r)<.1&&o<e&&r<e;return o>=e||o>=r||t?i:a}return r>=e||r>=o?a:i}static calculateDynamicTone(t){const e=t.background,i=t.scheme,a=t.toneStandard,o=t.toneToJudge,r=t.desiredTone,n=t.minRatio,s=t.maxRatio,l=t.toneDeltaConstraint,c=a(i);let d=c;const h=e?.(i);if(null==h)return d;const p=h.tone(i),u=Oe.ratioOfTones(c,p),m=o(h),v=r(u,m),g=Oe.ratioOfTones(m,v),f=me(n?.(u)??1,s?.(u)??21,g);return d=f===g?v:Fe.foregroundTone(m,f),null==h.background?.(i)&&(d=Fe.enableLightForeground(d)),d=Fe.ensureToneDelta(d,c,i,l,(t=>o(t))),d}static toneMaxContrastDefault(t){return Fe.calculateDynamicTone({scheme:t.scheme,toneStandard:t.tone,toneToJudge:e=>e.toneMaxContrast(t.scheme),desiredTone:(e,i)=>null!=t.background?.(t.scheme)?.background?.(t.scheme)?Fe.foregroundTone(i,7):Fe.foregroundTone(i,Math.max(7,e)),background:t.background,toneDeltaConstraint:t.toneDeltaConstraint})}static toneMinContrastDefault(t){return Fe.calculateDynamicTone({scheme:t.scheme,toneStandard:t.tone,toneToJudge:e=>e.toneMinContrast(t.scheme),desiredTone:(e,i)=>{let a=t.tone(t.scheme);if(e>=7)a=Fe.foregroundTone(i,4.5);else if(e>=3)a=Fe.foregroundTone(i,3);else{null!=t.background?.(t.scheme)?.background?.(t.scheme)&&(a=Fe.foregroundTone(i,e))}return a},background:t.background,toneDeltaConstraint:t.toneDeltaConstraint,minRatio:t=>1,maxRatio:t=>t})}static tonePrefersLightForeground(t){return Math.round(t)<60}static toneAllowsLightForeground(t){return Math.round(t)<=49}static enableLightForeground(t){return Fe.tonePrefersLightForeground(t)&&!Fe.toneAllowsLightForeground(t)?49:t}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ue;!function(t){t[t.MONOCHROME=0]="MONOCHROME",t[t.NEUTRAL=1]="NEUTRAL",t[t.TONAL_SPOT=2]="TONAL_SPOT",t[t.VIBRANT=3]="VIBRANT",t[t.EXPRESSIVE=4]="EXPRESSIVE",t[t.FIDELITY=5]="FIDELITY",t[t.CONTENT=6]="CONTENT"}(Ue||(Ue={}));
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Be{constructor(t,e,i){this.delta=t,this.keepAway=e,this.keepAwayPolarity=i}}
/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ne(t){return t.variant===Ue.FIDELITY||t.variant===Ue.CONTENT}function je(t){return t.variant===Ue.MONOCHROME}function He(t,e){const i=t.inViewingConditions(function(t){return Ee.make(void 0,void 0,t.isDark?30:80,void 0,void 0)}(e));return Fe.tonePrefersLightForeground(t.tone)&&!Fe.toneAllowsLightForeground(i.tone)?Fe.enableLightForeground(t.tone):Fe.enableLightForeground(i.tone)}class Ve{static highestSurface(t){return t.isDark?Ve.surfaceBright:Ve.surfaceDim}}Ve.contentAccentToneDelta=15,Ve.background=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98}),Ve.onBackground=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>Ve.background}),Ve.surface=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?6:98}),Ve.surfaceDim=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?6:87}),Ve.surfaceBright=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?24:98}),Ve.surfaceContainerLowest=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?4:100}),Ve.surfaceContainerLow=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?10:96}),Ve.surfaceContainer=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?12:94}),Ve.surfaceContainerHigh=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?17:92}),Ve.surfaceContainerHighest=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?22:90}),Ve.onSurface=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?90:10,background:t=>Ve.highestSurface(t)}),Ve.surfaceVariant=Fe.fromPalette({palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:90}),Ve.onSurfaceVariant=Fe.fromPalette({palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?80:30,background:t=>Ve.surfaceVariant}),Ve.inverseSurface=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?90:20}),Ve.inverseOnSurface=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>t.isDark?20:95,background:t=>Ve.inverseSurface}),Ve.outline=Fe.fromPalette({palette:t=>t.neutralVariantPalette,tone:t=>50,background:t=>Ve.highestSurface(t)}),Ve.outlineVariant=Fe.fromPalette({palette:t=>t.neutralVariantPalette,tone:t=>t.isDark?30:80,background:t=>Ve.highestSurface(t)}),Ve.shadow=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>0}),Ve.scrim=Fe.fromPalette({palette:t=>t.neutralPalette,tone:t=>0}),Ve.surfaceTintColor=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>t.isDark?80:40}),Ve.primary=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?100:0:t.isDark?80:40,background:t=>Ve.highestSurface(t),toneDeltaConstraint:t=>new Be(Ve.contentAccentToneDelta,Ve.primaryContainer,t.isDark?"darker":"lighter")}),Ve.onPrimary=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?10:90:t.isDark?20:100,background:t=>Ve.primary}),Ve.primaryContainer=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?85:25:Ne(t)?He(t.sourceColorHct,t):t.isDark?30:90,background:t=>Ve.highestSurface(t)}),Ve.onPrimaryContainer=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?0:100:Ne(t)?Fe.foregroundTone(Ve.primaryContainer.tone(t),4.5):t.isDark?90:10,background:t=>Ve.primaryContainer}),Ve.inversePrimary=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>t.isDark?40:80,background:t=>Ve.inverseSurface}),Ve.inverseOnPrimary=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>t.isDark?100:20,background:t=>Ve.inversePrimary}),Ve.secondary=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>t.isDark?80:40,background:t=>Ve.highestSurface(t),toneDeltaConstraint:t=>new Be(Ve.contentAccentToneDelta,Ve.secondaryContainer,t.isDark?"darker":"lighter")}),Ve.onSecondary=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>je(t)?t.isDark?10:100:t.isDark?20:100,background:t=>Ve.secondary}),Ve.secondaryContainer=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>{const e=t.isDark?30:90;if(je(t))return t.isDark?30:85;if(!Ne(t))return e;let i=function(t,e,i,a){let o=i,r=Me.from(t,e,i);if(r.chroma<e){let i=r.chroma;for(;r.chroma<e;){o+=a?-1:1;const n=Me.from(t,e,o);if(i>n.chroma)break;if(Math.abs(n.chroma-e)<.4)break;Math.abs(n.chroma-e)<Math.abs(r.chroma-e)&&(r=n),i=Math.max(i,n.chroma)}}return o}(t.secondaryPalette.hue,t.secondaryPalette.chroma,e,!t.isDark);return i=He(t.secondaryPalette.getHct(i),t),i},background:t=>Ve.highestSurface(t)}),Ve.onSecondaryContainer=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>Ne(t)?Fe.foregroundTone(Ve.secondaryContainer.tone(t),4.5):t.isDark?90:10,background:t=>Ve.secondaryContainer}),Ve.tertiary=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?t.isDark?90:25:t.isDark?80:40,background:t=>Ve.highestSurface(t),toneDeltaConstraint:t=>new Be(Ve.contentAccentToneDelta,Ve.tertiaryContainer,t.isDark?"darker":"lighter")}),Ve.onTertiary=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?t.isDark?10:90:t.isDark?20:100,background:t=>Ve.tertiary}),Ve.tertiaryContainer=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>{if(je(t))return t.isDark?60:49;if(!Ne(t))return t.isDark?30:90;const e=He(t.tertiaryPalette.getHct(t.sourceColorHct.tone),t),i=t.tertiaryPalette.getHct(e);return ze.fixIfDisliked(i).tone},background:t=>Ve.highestSurface(t)}),Ve.onTertiaryContainer=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?t.isDark?0:100:Ne(t)?Fe.foregroundTone(Ve.tertiaryContainer.tone(t),4.5):t.isDark?90:10,background:t=>Ve.tertiaryContainer}),Ve.error=Fe.fromPalette({palette:t=>t.errorPalette,tone:t=>t.isDark?80:40,background:t=>Ve.highestSurface(t),toneDeltaConstraint:t=>new Be(Ve.contentAccentToneDelta,Ve.errorContainer,t.isDark?"darker":"lighter")}),Ve.onError=Fe.fromPalette({palette:t=>t.errorPalette,tone:t=>t.isDark?20:100,background:t=>Ve.error}),Ve.errorContainer=Fe.fromPalette({palette:t=>t.errorPalette,tone:t=>t.isDark?30:90,background:t=>Ve.highestSurface(t)}),Ve.onErrorContainer=Fe.fromPalette({palette:t=>t.errorPalette,tone:t=>t.isDark?90:10,background:t=>Ve.errorContainer}),Ve.primaryFixed=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?100:10:90,background:t=>Ve.highestSurface(t)}),Ve.primaryFixedDim=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?90:20:80,background:t=>Ve.highestSurface(t)}),Ve.onPrimaryFixed=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?10:90:10,background:t=>Ve.primaryFixedDim}),Ve.onPrimaryFixedVariant=Fe.fromPalette({palette:t=>t.primaryPalette,tone:t=>je(t)?t.isDark?30:70:30,background:t=>Ve.primaryFixedDim}),Ve.secondaryFixed=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>je(t)?80:90,background:t=>Ve.highestSurface(t)}),Ve.secondaryFixedDim=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>je(t)?70:80,background:t=>Ve.highestSurface(t)}),Ve.onSecondaryFixed=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>10,background:t=>Ve.secondaryFixedDim}),Ve.onSecondaryFixedVariant=Fe.fromPalette({palette:t=>t.secondaryPalette,tone:t=>je(t)?25:30,background:t=>Ve.secondaryFixedDim}),Ve.tertiaryFixed=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?40:90,background:t=>Ve.highestSurface(t)}),Ve.tertiaryFixedDim=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?30:80,background:t=>Ve.highestSurface(t)}),Ve.onTertiaryFixed=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?90:10,background:t=>Ve.tertiaryFixedDim}),Ve.onTertiaryFixedVariant=Fe.fromPalette({palette:t=>t.tertiaryPalette,tone:t=>je(t)?70:30,background:t=>Ve.tertiaryFixedDim});
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class Ge{static fromInt(t){const e=Me.fromInt(t);return Ge.fromHueAndChroma(e.hue,e.chroma)}static fromHueAndChroma(t,e){return new Ge(t,e)}constructor(t,e){this.hue=t,this.chroma=e,this.cache=new Map}tone(t){let e=this.cache.get(t);return void 0===e&&(e=Me.from(this.hue,this.chroma,t).toInt(),this.cache.set(t,e)),e}getHct(t){return Me.fromInt(this.tone(t))}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{static of(t){return new qe(t,!1)}static contentOf(t){return new qe(t,!0)}static fromColors(t){return qe.createPaletteFromColors(!1,t)}static contentFromColors(t){return qe.createPaletteFromColors(!0,t)}static createPaletteFromColors(t,e){const i=new qe(e.primary,t);if(e.secondary){const a=new qe(e.secondary,t);i.a2=a.a1}if(e.tertiary){const a=new qe(e.tertiary,t);i.a3=a.a1}if(e.error){const a=new qe(e.error,t);i.error=a.a1}if(e.neutral){const a=new qe(e.neutral,t);i.n1=a.n1}if(e.neutralVariant){const a=new qe(e.neutralVariant,t);i.n2=a.n2}return i}constructor(t,e){const i=Me.fromInt(t),a=i.hue,o=i.chroma;e?(this.a1=Ge.fromHueAndChroma(a,o),this.a2=Ge.fromHueAndChroma(a,o/3),this.a3=Ge.fromHueAndChroma(a+60,o/2),this.n1=Ge.fromHueAndChroma(a,Math.min(o/12,4)),this.n2=Ge.fromHueAndChroma(a,Math.min(o/6,8))):(this.a1=Ge.fromHueAndChroma(a,Math.max(48,o)),this.a2=Ge.fromHueAndChroma(a,16),this.a3=Ge.fromHueAndChroma(a+60,24),this.n1=Ge.fromHueAndChroma(a,4),this.n2=Ge.fromHueAndChroma(a,8)),this.error=Ge.fromHueAndChroma(25,84)}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class We{get primary(){return this.props.primary}get onPrimary(){return this.props.onPrimary}get primaryContainer(){return this.props.primaryContainer}get onPrimaryContainer(){return this.props.onPrimaryContainer}get secondary(){return this.props.secondary}get onSecondary(){return this.props.onSecondary}get secondaryContainer(){return this.props.secondaryContainer}get onSecondaryContainer(){return this.props.onSecondaryContainer}get tertiary(){return this.props.tertiary}get onTertiary(){return this.props.onTertiary}get tertiaryContainer(){return this.props.tertiaryContainer}get onTertiaryContainer(){return this.props.onTertiaryContainer}get error(){return this.props.error}get onError(){return this.props.onError}get errorContainer(){return this.props.errorContainer}get onErrorContainer(){return this.props.onErrorContainer}get background(){return this.props.background}get onBackground(){return this.props.onBackground}get surface(){return this.props.surface}get onSurface(){return this.props.onSurface}get surfaceVariant(){return this.props.surfaceVariant}get onSurfaceVariant(){return this.props.onSurfaceVariant}get outline(){return this.props.outline}get outlineVariant(){return this.props.outlineVariant}get shadow(){return this.props.shadow}get scrim(){return this.props.scrim}get inverseSurface(){return this.props.inverseSurface}get inverseOnSurface(){return this.props.inverseOnSurface}get inversePrimary(){return this.props.inversePrimary}static light(t){return We.lightFromCorePalette(qe.of(t))}static dark(t){return We.darkFromCorePalette(qe.of(t))}static lightContent(t){return We.lightFromCorePalette(qe.contentOf(t))}static darkContent(t){return We.darkFromCorePalette(qe.contentOf(t))}static lightFromCorePalette(t){return new We({primary:t.a1.tone(40),onPrimary:t.a1.tone(100),primaryContainer:t.a1.tone(90),onPrimaryContainer:t.a1.tone(10),secondary:t.a2.tone(40),onSecondary:t.a2.tone(100),secondaryContainer:t.a2.tone(90),onSecondaryContainer:t.a2.tone(10),tertiary:t.a3.tone(40),onTertiary:t.a3.tone(100),tertiaryContainer:t.a3.tone(90),onTertiaryContainer:t.a3.tone(10),error:t.error.tone(40),onError:t.error.tone(100),errorContainer:t.error.tone(90),onErrorContainer:t.error.tone(10),background:t.n1.tone(99),onBackground:t.n1.tone(10),surface:t.n1.tone(99),onSurface:t.n1.tone(10),surfaceVariant:t.n2.tone(90),onSurfaceVariant:t.n2.tone(30),outline:t.n2.tone(50),outlineVariant:t.n2.tone(80),shadow:t.n1.tone(0),scrim:t.n1.tone(0),inverseSurface:t.n1.tone(20),inverseOnSurface:t.n1.tone(95),inversePrimary:t.a1.tone(80)})}static darkFromCorePalette(t){return new We({primary:t.a1.tone(80),onPrimary:t.a1.tone(20),primaryContainer:t.a1.tone(30),onPrimaryContainer:t.a1.tone(90),secondary:t.a2.tone(80),onSecondary:t.a2.tone(20),secondaryContainer:t.a2.tone(30),onSecondaryContainer:t.a2.tone(90),tertiary:t.a3.tone(80),onTertiary:t.a3.tone(20),tertiaryContainer:t.a3.tone(30),onTertiaryContainer:t.a3.tone(90),error:t.error.tone(80),onError:t.error.tone(20),errorContainer:t.error.tone(30),onErrorContainer:t.error.tone(80),background:t.n1.tone(10),onBackground:t.n1.tone(90),surface:t.n1.tone(10),onSurface:t.n1.tone(90),surfaceVariant:t.n2.tone(30),onSurfaceVariant:t.n2.tone(80),outline:t.n2.tone(60),outlineVariant:t.n2.tone(30),shadow:t.n1.tone(0),scrim:t.n1.tone(0),inverseSurface:t.n1.tone(90),inverseOnSurface:t.n1.tone(20),inversePrimary:t.a1.tone(40)})}constructor(t){this.props=t}toJSON(){return{...this.props}}}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ye(t){const e=we(t),i=$e(t),a=ke(t),o=[e.toString(16),i.toString(16),a.toString(16)];for(const[t,e]of o.entries())1===e.length&&(o[t]="0"+e);return"#"+o.join("")}function Ke(t){const e=3===(t=t.replace("#","")).length,i=6===t.length,a=8===t.length;if(!e&&!i&&!a)throw new Error("unexpected hex "+t);let o=0,r=0,n=0;return e?(o=Je(t.slice(0,1).repeat(2)),r=Je(t.slice(1,2).repeat(2)),n=Je(t.slice(2,3).repeat(2))):i?(o=Je(t.slice(0,2)),r=Je(t.slice(2,4)),n=Je(t.slice(4,6))):a&&(o=Je(t.slice(2,4)),r=Je(t.slice(4,6)),n=Je(t.slice(6,8))),(255<<24|(255&o)<<16|(255&r)<<8|255&n)>>>0}function Je(t){return parseInt(t,16)}
/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xe(t,e=[]){const i=qe.of(t);return{source:t,schemes:{light:We.light(t),dark:We.dark(t)},palettes:{primary:i.a1,secondary:i.a2,tertiary:i.a3,neutral:i.n1,neutralVariant:i.n2,error:i.error},customColors:e.map((e=>function(t,e){let i=e.value;const a=i,o=t;e.blend&&(i=De.harmonize(a,o));const r=qe.of(i),n=r.a1;return{color:e,value:i,light:{color:n.tone(40),onColor:n.tone(100),colorContainer:n.tone(90),onColorContainer:n.tone(10)},dark:{color:n.tone(80),onColor:n.tone(20),colorContainer:n.tone(30),onColorContainer:n.tone(90)}}}(t,e)))}}function Ze(t,e,i=""){for(const[a,o]of Object.entries(e.toJSON())){const e=a.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),r=Ye(o);t.style.setProperty(`--md-sys-color-${e}${i}`,r)}}
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */const Qe=s`@media(forced-colors:active){.menu{border-style:solid;border-color:CanvasText;border-width:1px}}`
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */,ti="important",ei=" !"+ti,ii=Pt(class extends St{constructor(t){var e;if(super(t),t.type!==kt||"style"!==t.name||(null===(e=t.strings)||void 0===e?void 0:e.length)>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce(((e,i)=>{const a=t[i];return null==a?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`}),"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ut){this.ut=new Set;for(const t in e)this.ut.add(t);return this.render(e)}this.ut.forEach((t=>{null==e[t]&&(this.ut.delete(t),t.includes("-")?i.removeProperty(t):i[t]="")}));for(const t in e){const a=e[t];if(null!=a){this.ut.add(t);const e="string"==typeof a&&a.endsWith(ei);t.includes("-")||e?i.setProperty(t,e?a.slice(0,-11):a,e?ti:""):i[t]=a}}return U}});
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class ai{constructor(t,e){this.host=t,this.getProperties=e,this.surfaceStylesInternal={display:"none"},this.lastValues={isOpen:!1},this.host.addController(this)}get surfaceStyles(){return this.surfaceStylesInternal}async position(){const{surfaceEl:t,anchorEl:e,anchorCorner:i,surfaceCorner:a,isTopLayer:o,xOffset:r,yOffset:n}=this.getProperties(),s=i.toUpperCase().trim(),l=a.toUpperCase().trim();if(!t||!e)return;this.surfaceStylesInternal={display:"block",opacity:"0"},this.host.requestUpdate(),await this.host.updateComplete;const c=t.getSurfacePositionClientRect?t.getSurfacePositionClientRect():t.getBoundingClientRect(),d=e.getSurfacePositionClientRect?e.getSurfacePositionClientRect():e.getBoundingClientRect(),[h,p]=l.split("_"),[u,m]=s.split("_"),v=o?1:0,g="ltr"===getComputedStyle(t).direction?1:0,f=g?0:1,b="START"===p?1:0,y="END"===p?1:0,_="START"===h?1:0,x="END"===h?1:0,w=u!==h?1:0,$=(m!==p?1:0)*d.width+r,k=g*(b*d.left+y*(window.innerWidth-d.right))+f*(b*(window.innerWidth-d.right)+y*d.left),C=v*k+$+Math.min(0,window.innerWidth-k-$-c.width),A=w*d.height+n,P=_*d.top+x*(window.innerHeight-d.bottom),S=v*P+A+Math.min(0,window.innerHeight-P-A-c.height),T="START"===h?"inset-block-start":"inset-block-end",I="START"===p?"inset-inline-start":"inset-inline-end";this.surfaceStylesInternal={display:"block",opacity:"1",[T]:`${S}px`,[I]:`${C}px`},this.host.requestUpdate()}hostUpdate(){this.onUpdate()}hostUpdated(){this.onUpdate()}async onUpdate(){const t=this.getProperties();let e=!1;for(const[i,a]of Object.entries(t))if(e=e||a!==this.lastValues[i],e)break;const i=this.lastValues.isOpen!==t.isOpen,a=!!t.anchorEl,o=!!t.surfaceEl;e&&a&&o&&(this.lastValues.isOpen=t.isOpen,t.isOpen?(this.lastValues=t,await this.position(),t.onOpen()):i&&(await t.beforeClose(),this.close(),t.onClose()))}close(){this.surfaceStylesInternal={display:"none"},this.host.requestUpdate()}}
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */const oi=0,ri=1,ni=2;class si{constructor(t){this.getProperties=t,this.typeaheadRecords=[],this.typaheadBuffer="",this.cancelTypeaheadTimeout=0,this.isTypingAhead=!1,this.lastActiveRecord=null,this.onKeydown=t=>{this.isTypingAhead?this.typeahead(t):this.beginTypeahead(t)},this.endTypeahead=()=>{this.isTypingAhead=!1,this.typaheadBuffer="",this.typeaheadRecords=[]}}get items(){return this.getProperties().getItems()}get active(){return this.getProperties().active}beginTypeahead(t){this.active&&("Space"===t.code||"Enter"===t.code||t.code.startsWith("Arrow")||"Escape"===t.code||(this.isTypingAhead=!0,this.typeaheadRecords=this.items.map(((t,e)=>[e,t,t.headline.trim().toLowerCase()])),this.lastActiveRecord=this.typeaheadRecords.find((t=>t[ri].active))??null,this.lastActiveRecord&&(this.lastActiveRecord[ri].active=!1),this.typeahead(t)))}typeahead(t){if(clearTimeout(this.cancelTypeaheadTimeout),"Enter"===t.code||t.code.startsWith("Arrow")||"Escape"===t.code)return this.endTypeahead(),void(this.lastActiveRecord&&(this.lastActiveRecord[ri].active=!1));"Space"===t.code&&(t.stopPropagation(),t.preventDefault()),this.cancelTypeaheadTimeout=setTimeout(this.endTypeahead,this.getProperties().typeaheadBufferTime),this.typaheadBuffer+=t.key.toLowerCase();const e=this.lastActiveRecord?this.lastActiveRecord[oi]:-1,i=this.typeaheadRecords.length,a=t=>(t[oi]+i-e)%i,o=this.typeaheadRecords.filter((t=>!t[ri].disabled&&t[ni].startsWith(this.typaheadBuffer))).sort(((t,e)=>a(t)-a(e)));if(0===o.length)return clearTimeout(this.cancelTypeaheadTimeout),this.lastActiveRecord&&(this.lastActiveRecord[ri].active=!1),void this.endTypeahead();const r=1===this.typaheadBuffer.length;let n;n=this.lastActiveRecord===o[0]&&r?o[1]??o[0]:o[0],this.lastActiveRecord&&(this.lastActiveRecord[ri].active=!1),this.lastActiveRecord=n,n[ri].active=!0}}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function li(t=document){const e=t.activeElement;return e?e.shadowRoot?li(e.shadowRoot)??e:e:null}class ci extends at{constructor(){super(...arguments),this.anchor=null,this.fixed=!1,this.quick=!1,this.hasOverflow=!1,this.open=!1,this.xOffset=0,this.yOffset=0,this.listTabIndex=0,this.type="menu",this.typeaheadBufferTime=200,this.anchorCorner="END_START",this.menuCorner="START_START",this.stayOpenOnOutsideClick=!1,this.stayOpenOnFocusout=!1,this.skipRestoreFocus=!1,this.defaultFocus="LIST_ROOT",this.typeaheadActive=!0,this.openCloseAnimationSignal=function(){let t=null;return{start:()=>(t?.abort(),t=new AbortController,t.signal),finish(){t=null}}}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(),this.lastFocusedElement=null,this.typeaheadController=new si((()=>({getItems:()=>this.items,typeaheadBufferTime:this.typeaheadBufferTime,active:this.typeaheadActive}))),this.menuPositionController=new ai(this,(()=>({anchorCorner:this.anchorCorner,surfaceCorner:this.menuCorner,surfaceEl:this.surfaceEl,anchorEl:this.anchor,isTopLayer:this.fixed,isOpen:this.open,xOffset:this.xOffset,yOffset:this.yOffset,onOpen:this.onOpened,beforeClose:this.beforeClose,onClose:this.onClosed}))),this.onOpened=()=>{if(this.lastFocusedElement=li(),!this.listElement)return;const t=this.listElement.items,e=ce.getActiveItem(t);switch(e&&"NONE"!==this.defaultFocus&&(e.item.active=!1),this.defaultFocus){case"FIRST_ITEM":const e=ce.getFirstActivatableItem(t);e&&(e.active=!0);break;case"LAST_ITEM":const i=ce.getLastActivatableItem(t);i&&(i.active=!0);break;case"LIST_ROOT":this.listElement?.focus()}this.quick?(this.dispatchEvent(new Event("opening")),this.dispatchEvent(new Event("opened"))):this.animateOpen()},this.beforeClose=async()=>{this.open=!1,this.skipRestoreFocus||this.lastFocusedElement?.focus?.(),this.quick||await this.animateClose()},this.onClosed=()=>{this.quick&&(this.dispatchEvent(new Event("closing")),this.dispatchEvent(new Event("closed")))},this.onWindowClick=t=>{this.stayOpenOnOutsideClick||t.composedPath().includes(this)||(this.open=!1)}}get openDirection(){return"START"===this.menuCorner.split("_")[0]?"DOWN":"UP"}get items(){const t=this.listElement;return t?t.items.filter((t=>t.hasAttribute("md-menu-item"))):[]}render(){return this.renderSurface()}renderSurface(){return F` <div class="menu ${Tt(this.getSurfaceClasses())}" style="${ii(this.menuPositionController.surfaceStyles)}" @focusout="${this.handleFocusout}"> ${this.renderElevation()} ${this.renderList()} ${this.renderFocusRing()} </div> `}renderList(){const{ariaLabel:t}=this;return F` <md-list aria-label="${t||B}" type="${this.type}" listTabIndex="${this.listTabIndex}" @focus="${this.handleListFocus}" @blur="${this.handleListBlur}" @click="${this.handleListClick}" @keydown="${this.handleListKeydown}"> ${this.renderMenuItems()} </md-list>`}renderMenuItems(){return F`<slot @close-menu="${this.onCloseMenu}" @deactivate-items="${this.onDeactivateItems}" @deactivate-typeahead="${this.handleDeactivateTypeahead}" @activate-typeahead="${this.handleActivateTypeahead}"></slot>`}renderElevation(){return F`<md-elevation></md-elevation>`}renderFocusRing(){return F`<md-focus-ring></md-focus-ring>`}getSurfaceClasses(){return{open:this.open,fixed:this.fixed,"has-overflow":this.hasOverflow}}async handleFocusout(t){if(this.stayOpenOnFocusout)return;if(t.stopPropagation(),t.relatedTarget&&
/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
function(t,e){const i=new Event("md-contains",{bubbles:!0,composed:!0});let a=[];const o=t=>{a=t.composedPath()};return e.addEventListener("md-contains",o),t.dispatchEvent(i),e.removeEventListener("md-contains",o),a.length>0}(t.relatedTarget,this))return;const e=this.skipRestoreFocus;this.skipRestoreFocus=!0,this.close(),await this.updateComplete,this.skipRestoreFocus=e}handleListFocus(){this.focusRing.visible=Wt()}handleListClick(){Yt(),this.focusRing.visible=Wt()}handleListKeydown(t){this.typeaheadController.onKeydown(t)}handleListBlur(){this.focusRing.visible=!1}animateOpen(){const t=this.surfaceEl,e=this.slotEl;if(!t||!e)return;const i=this.openDirection;this.dispatchEvent(new Event("opening")),t.classList.toggle("animating",!0);const a=this.openCloseAnimationSignal.start(),o=t.offsetHeight,r="UP"===i,n=this.items,s=250/n.length,l=t.animate([{height:"0px"},{height:`${o}px`}],{duration:500,easing:zt}),c=e.animate([{transform:r?`translateY(-${o}px)`:""},{transform:""}],{duration:500,easing:zt}),d=t.animate([{opacity:0},{opacity:1}],50),h=[];for(let t=0;t<n.length;t++){const e=n[r?n.length-1-t:t],i=e.animate([{opacity:0},{opacity:1}],{duration:250,delay:s*t});e.classList.toggle("hidden",!0),i.addEventListener("finish",(()=>{e.classList.toggle("hidden",!1)})),h.push([e,i])}a.addEventListener("abort",(()=>{l.cancel(),c.cancel(),d.cancel(),h.forEach((([t,e])=>{t.classList.toggle("hidden",!1),e.cancel()}))})),l.addEventListener("finish",(()=>{t.classList.toggle("animating",!1),this.openCloseAnimationSignal.finish(),this.dispatchEvent(new Event("opened"))}))}animateClose(){let t,e;const i=new Promise(((i,a)=>{t=i,e=a})),a=this.surfaceEl,o=this.slotEl;if(!a||!o)return e(),i;const r="UP"===this.openDirection;this.dispatchEvent(new Event("closing")),a.classList.toggle("animating",!0);const n=this.openCloseAnimationSignal.start(),s=a.offsetHeight,l=this.items,c=150,d=50/l.length,h=a.animate([{height:`${s}px`},{height:.35*s+"px"}],{duration:c,easing:Ft}),p=o.animate([{transform:""},{transform:r?`translateY(-${.65*s}px)`:""}],{duration:c,easing:Ft}),u=a.animate([{opacity:1},{opacity:0}],{duration:50,delay:100}),m=[];for(let t=0;t<l.length;t++){const e=l[r?t:l.length-1-t],i=e.animate([{opacity:1},{opacity:0}],{duration:50,delay:50+d*t});i.addEventListener("finish",(()=>{e.classList.toggle("hidden",!0)})),m.push([e,i])}return n.addEventListener("abort",(()=>{h.cancel(),p.cancel(),u.cancel(),m.forEach((([t,e])=>{e.cancel(),t.classList.toggle("hidden",!1)})),e()})),h.addEventListener("finish",(()=>{a.classList.toggle("animating",!1),m.forEach((([t])=>{t.classList.toggle("hidden",!1)})),this.openCloseAnimationSignal.finish(),this.dispatchEvent(new Event("closed")),t(!0)})),i}connectedCallback(){super.connectedCallback(),window.addEventListener("click",this.onWindowClick,{capture:!0})}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("click",this.onWindowClick,{capture:!0})}onCloseMenu(t){this.close()}onDeactivateItems(t){t.stopPropagation();const e=this.items;for(const t of e)t.active=!1,t.selected=!1}handleDeactivateTypeahead(t){t.stopPropagation(),this.typeaheadActive=!1}handleActivateTypeahead(t){t.stopPropagation(),this.typeaheadActive=!0}focus(){this.listElement?.focus()}close(){this.open=!1,this.items.forEach((t=>{t.close?.()}))}show(){this.open=!0}}_t(ci),t([dt("md-list")],ci.prototype,"listElement",void 0),t([dt(".menu")],ci.prototype,"surfaceEl",void 0),t([dt("slot")],ci.prototype,"slotEl",void 0),t([dt("md-focus-ring")],ci.prototype,"focusRing",void 0),t([st({attribute:!1})],ci.prototype,"anchor",void 0),t([st({type:Boolean})],ci.prototype,"fixed",void 0),t([st({type:Boolean})],ci.prototype,"quick",void 0),t([st({type:Boolean,attribute:"has-overflow"})],ci.prototype,"hasOverflow",void 0),t([st({type:Boolean,reflect:!0})],ci.prototype,"open",void 0),t([st({type:Number,attribute:"x-offset"})],ci.prototype,"xOffset",void 0),t([st({type:Number,attribute:"y-offset"})],ci.prototype,"yOffset",void 0),t([st({type:Number,attribute:"list-tab-index"})],ci.prototype,"listTabIndex",void 0),t([st()],ci.prototype,"type",void 0),t([st({type:Number,attribute:"typeahead-delay"})],ci.prototype,"typeaheadBufferTime",void 0),t([st({attribute:"anchor-corner"})],ci.prototype,"anchorCorner",void 0),t([st({attribute:"menu-corner"})],ci.prototype,"menuCorner",void 0),t([st({type:Boolean,attribute:"stay-open-on-outside-click"})],ci.prototype,"stayOpenOnOutsideClick",void 0),t([st({type:Boolean,attribute:"stay-open-on-focusout"})],ci.prototype,"stayOpenOnFocusout",void 0),t([st({type:Boolean,attribute:"skip-restore-focus"})],ci.prototype,"skipRestoreFocus",void 0),t([st({attribute:"default-focus"})],ci.prototype,"defaultFocus",void 0),t([lt()],ci.prototype,"typeaheadActive",void 0),t([function(t){return ct({finisher:(e,i)=>{Object.assign(e.prototype[i],t)}})}({capture:!0})],ci.prototype,"handleListKeydown",null);
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
const di=s`:host{--_container-color:var(--md-menu-container-color, var(--md-sys-color-surface-container, #f3edf7));--_container-elevation:var(--md-menu-container-elevation, 2);--_container-shadow-color:var(--md-menu-container-shadow-color, var(--md-sys-color-shadow, #000));--_container-shape:var(--md-menu-container-shape, 4px);--md-list-container-color:var(--_container-color);--md-elevation-level:var(--_container-elevation);--md-elevation-shadow-color:var(--_container-shadow-color);--md-focus-ring-shape-start-start:var(--md-focus-ring-shape, var(--_container-shape));--md-focus-ring-shape-start-end:var(--md-focus-ring-shape, var(--_container-shape));--md-focus-ring-shape-end-end:var(--md-focus-ring-shape, var(--_container-shape));--md-focus-ring-shape-end-start:var(--md-focus-ring-shape, var(--_container-shape));min-width:300px}.menu{border-radius:var(--_container-shape);display:none;opacity:0;z-index:20;position:absolute;user-select:none;max-height:inherit;height:inherit;min-width:inherit}.menu.fixed{position:fixed}.menu md-list{height:inherit;max-height:inherit;display:block;overflow:auto;min-width:inherit;border-radius:inherit}.menu.has-overflow md-list{overflow:visible}.menu.animating md-list{pointer-events:none;overflow:hidden}.menu.animating ::slotted(.hidden){opacity:0}.menu slot{display:block;height:inherit;max-height:inherit}`
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let hi=class extends ci{};hi.styles=[di,Qe],hi=t([rt("md-menu")],hi);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const pi=t=>null!=t?t:B
/**
@license
Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
Copyright (c) 2020 Citizens Foundation Iceland / Citizens Foundation USA LitElement Port. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/;let ui=class extends at{constructor(){super(...arguments),this.src="",this.alt=void 0,this.crossorigin=void 0,this.preventLoad=!1,this.sizing=void 0,this.position="center",this.preload=!1,this.placeholder=void 0,this.fade=!1,this.loaded=!1,this.loading=!1,this.error=!1,this.width=void 0,this.height=void 0,this._resolvedSrc=void 0,this.ABS_URL=/(^\/[^\/])|(^#)|(^[\w-\d]*:)/,this.workingURL=void 0,this.resolveDoc=void 0}static get styles(){return[s`:host{display:inline-block;overflow:hidden;position:relative}#baseURIAnchor{display:none}#sizedImgDiv{position:absolute;top:0;right:0;bottom:0;left:0;display:none}#img{display:block;width:var(--yp-image-width,auto);height:var(--yp-image-height,auto)}:host([sizing]) #sizedImgDiv{display:block}:host([sizing]) #img{display:none}#placeholder{position:absolute;top:0;right:0;bottom:0;left:0;background-color:inherit;opacity:1}#placeholder.faded-out{transition:opacity .5s linear;opacity:0}`]}render(){return F` <a id="baseURIAnchor" href="#"></a> <div id="sizedImgDiv" role="img" ?hidden="${this._computeImgDivHidden}" aria-hidden="${this._computeImgDivARIAHidden}" aria-label="${pi(this._computeImgDivARIALabel)}"></div> <img id="img" alt="${this.alt?this.alt:""}" ?hidden="${this._computeImgHidden}" crossorigin="${pi(this.crossorigin)}" @load="${this._imgOnLoad}" @error="${this._imgOnError}"> <div id="placeholder" ?hidden="${this.computePlaceholderHidden}" class="${this._computePlaceholderClassName}"></div> `}$$(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}connectedCallback(){super.connectedCallback(),this._resolvedSrc=""}_imgOnLoad(){this.$$("img").src===this._resolveSrc(this.src)&&(this.loading=!1,this.loaded=!0,this.error=!1)}_imgOnError(){this.$$("img").src===this._resolveSrc(this.src)&&(this.$$("img").removeAttribute("src"),this.$$("#sizedImgDiv").style.backgroundImage="",this.loading=!1,this.loaded=!1,this.error=!0)}get computePlaceholderHidden(){return!this.preload||!this.fade&&!this.loading&&this.loaded}_computePlaceholderClassName(){return this.preload&&this.fade&&!this.loading&&this.loaded?"faded-out":""}get _computeImgDivHidden(){return!this.sizing}get _computeImgDivARIAHidden(){return""===this.alt}get _computeImgDivARIALabel(){if(null!==this.alt)return this.alt;if(""===this.src)return"";const t=this._resolveSrc(this.src);return t?t.replace(/[?|#].*/g,"").split("/").pop():""}get _computeImgHidden(){return!!this.sizing}_widthChanged(){this.width&&(this.style.width=this.width+"px")}_heightChanged(){this.style.height=this.height+"px"}_loadStateObserver(){const t=this._resolveSrc(this.src);t!==this._resolvedSrc&&(this._resolvedSrc="",this.$$("img").removeAttribute("src"),this.$$("#sizedImgDiv").style.backgroundImage="",""===this.src||this.preventLoad?(this.loading=!1,this.loaded=!1,this.error=!1):(this._resolvedSrc=t,this._resolvedSrc&&(this.$$("img").src=this._resolvedSrc),this.$$("#sizedImgDiv").style.backgroundImage='url("'+this._resolvedSrc+'")',this.loading=!0,this.loaded=!1,this.error=!1))}_placeholderChanged(){this.$$("#placeholder").style.backgroundImage=this.placeholder?'url("'+this.placeholder+'")':""}_transformChanged(){const t=this.$$("#sizedImgDiv").style,e=this.$$("#placeholder").style;this.sizing&&(t.backgroundSize=e.backgroundSize=this.sizing),t.backgroundPosition=e.backgroundPosition=this.sizing?this.position:"",t.backgroundRepeat=e.backgroundRepeat=this.sizing?"no-repeat":""}_resolveSrc(t){let e=this.resolveUrl(t,this.$$("#baseURIAnchor").href);return e&&e.length>=2&&"/"===e[0]&&"/"!==e[1]&&(e=(location.origin||location.protocol+"//"+location.host)+e),e}resolveUrl(t,e){if(t&&this.ABS_URL.test(t))return t;if("//"===t)return t;if(void 0===this.workingURL){this.workingURL=!1;try{const t=new URL("b","http://a");t.pathname="c%20d",this.workingURL="http://a/c%20d"===t.href}catch(t){}}if(e||(e=document.baseURI||window.location.href),this.workingURL)try{return new URL(t,e).href}catch(e){return t}}updated(t){super.updated(t),t.has("placeHolder")&&this._placeholderChanged(),t.has("width")&&this._widthChanged(),t.has("height")&&this._widthChanged(),(t.has("sizing")||t.has("position"))&&this._transformChanged(),(t.has("src")||t.has("preventLoad"))&&this._loadStateObserver()}};t([st({type:String}),e("design:type",String)],ui.prototype,"src",void 0),t([st({type:String}),e("design:type",String)],ui.prototype,"alt",void 0),t([st({type:String}),e("design:type",String)],ui.prototype,"crossorigin",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"preventLoad",void 0),t([st({type:String,reflect:!0}),e("design:type",String)],ui.prototype,"sizing",void 0),t([st({type:String}),e("design:type",Object)],ui.prototype,"position",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"preload",void 0),t([st({type:String}),e("design:type",String)],ui.prototype,"placeholder",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"fade",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"loaded",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"loading",void 0),t([st({type:Boolean}),e("design:type",Object)],ui.prototype,"error",void 0),t([st({type:String}),e("design:type",String)],ui.prototype,"width",void 0),t([st({type:String}),e("design:type",String)],ui.prototype,"height",void 0),ui=t([rt("yp-image")],ui);class mi extends at{constructor(){super(...arguments),this.language="en",this.wide=!1,this.rtl=!1,this.largeFont=!1,this.themeColor="#FFE800"}static get styles(){return[]}connectedCallback(){super.connectedCallback(),this.addGlobalListener("yp-language-loaded",this._languageEvent.bind(this)),this.addGlobalListener("yp-large-font",this._largeFont.bind(this)),this.addGlobalListener("yp-theme-color",this._changeThemeColor.bind(this)),this.addGlobalListener("yp-theme-dark-mode",this._changeThemeDarkMode.bind(this)),window.appGlobals&&window.appGlobals.i18nTranslation&&window.appGlobals.locale?(this.language=window.appGlobals.locale,this._setupRtl()):this.language="en",((t,e)=>{let i=window.matchMedia(t);i.addListener((t=>e(t.matches))),e(i.matches)})("(min-width: 960px)",(t=>{this.wide=t}))}disconnectedCallback(){super.disconnectedCallback(),this.removeGlobalListener("yp-language-loaded",this._languageEvent.bind(this)),this.removeGlobalListener("yp-large-font",this._largeFont.bind(this)),this.removeGlobalListener("yp-theme-color",this._changeThemeColor.bind(this)),this.removeGlobalListener("yp-theme-dark-mode",this._changeThemeDarkMode.bind(this))}_changeThemeColor(t){this.themeColor=t.detail}_changeThemeDarkMode(t){this.themeDarkMode=t.detail}updated(t){t.has("language")&&this.languageChanged()}static get rtlLanguages(){return["fa","ar","ar_EG"]}languageChanged(){}_setupRtl(){mi.rtlLanguages.indexOf(this.language)>-1?this.rtl=!0:this.rtl=!1}_largeFont(t){this.largeFont=t.detail}_languageEvent(t){this.language=t.detail.language,window.appGlobals.locale=t.detail.language,void 0!==this.rtl&&this._setupRtl()}fire(t,e={},i=this){const a=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});i.dispatchEvent(a)}fireGlobal(t,e={}){this.fire(t,e,document)}addListener(t,e,i=this){i.addEventListener(t,e,!1)}addGlobalListener(t,e){this.addListener(t,e,document)}removeListener(t,e,i=this){i.removeEventListener(t,e)}removeGlobalListener(t,e){this.removeListener(t,e,document)}t(...t){const e=t[0];if(window.appGlobals&&window.appGlobals.i18nTranslation){let t=window.appGlobals.i18nTranslation.t(e);return t||(t=""),t}return e}$$(t){return this.shadowRoot?this.shadowRoot.querySelector(t):null}}t([st({type:String}),e("design:type",Object)],mi.prototype,"language",void 0),t([st({type:Boolean}),e("design:type",Object)],mi.prototype,"wide",void 0),t([st({type:Boolean}),e("design:type",Object)],mi.prototype,"rtl",void 0),t([st({type:Boolean}),e("design:type",Object)],mi.prototype,"largeFont",void 0),t([st({type:String}),e("design:type",Object)],mi.prototype,"themeColor",void 0),t([st({type:Boolean}),e("design:type",Boolean)],mi.prototype,"themeDarkMode",void 0);const vi=s`
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
`;s`
  box-sizing: border-box;
`;const gi=s`
  display: -ms-inline-flexbox;
  display: -webkit-inline-flex;
  display: inline-flex;
`,fi=s`
  -ms-flex-direction: row;
  -webkit-flex-direction: row;
  flex-direction: row;
`,bi=s`
  -ms-flex-direction: column;
  -webkit-flex-direction: column;
  flex-direction: column;
`,yi=s`
  -ms-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  flex-wrap: wrap;
`,_i=s`
  -ms-flex-wrap: nowrap;
  -webkit-flex-wrap: nowrap;
  flex-wrap: nowrap;
`,xi=s`
  -ms-flex: 1 1 0.000000001px;
  -webkit-flex: 1;
  flex: 1;
  -webkit-flex-basis: 0.000000001px;
  flex-basis: 0.000000001px;
`,wi=s`
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
`,$i=s`
  -ms-flex: 1 1 auto;
  -webkit-flex: 1 1 auto;
  flex: 1 1 auto;
`,ki=s`
  display: none !important;
`,Ci=s`
  -ms-flex: 2;
  -webkit-flex: 2;
  flex: 2;
`,Ai=s`
  -ms-flex: 3;
  -webkit-flex: 3;
  flex: 3;
`,Pi=s`
  -ms-flex: 4;
  -webkit-flex: 4;
  flex: 4;
`,Si=s`
  -ms-flex: 5;
  -webkit-flex: 5;
  flex: 5;
`,Ti=s`
  -ms-flex: 6;
  -webkit-flex: 6;
  flex: 6;
`,Ii=s`
  -ms-flex: 7;
  -webkit-flex: 7;
  flex: 7;
`,Ei=s`
  -ms-flex: 8;
  -webkit-flex: 8;
  flex: 8;
`,Li=s`
  -ms-flex: 9;
  -webkit-flex: 9;
  flex: 9;
`,Ri=s`
  -ms-flex: 10;
  -webkit-flex: 10;
  flex: 10;
`,Mi=s`
  -ms-flex: 11;
  -webkit-flex: 11;
  flex: 11;
`,Di=s`
  -ms-flex: 12;
  -webkit-flex: 12;
  flex: 12;
`,Oi=s`
  -ms-flex-direction: row-reverse;
  -webkit-flex-direction: row-reverse;
  flex-direction: row-reverse;
`,zi=s`
  -ms-flex-direction: column-reverse;
  -webkit-flex-direction: column-reverse;
  flex-direction: column-reverse;
`,Fi=s`
  -ms-flex-wrap: wrap-reverse;
  -webkit-flex-wrap: wrap-reverse;
  flex-wrap: wrap-reverse;
`,Ui=s`
  display: block;
`,Bi=s`
  visibility: hidden !important;
`,Ni=s`
  position: relative;
`,ji=s`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`,Hi=s`
  -webkit-overflow-scrolling: touch;
  overflow: auto;
`,Vi=s`
  position: fixed;
`,Gi=s`
  top: 0;
  left: 0;
  right: 0;
`,qi=s`
  top: 0;
  right: 0;
  bottom: 0;
`,Wi=s`
  top: 0;
  bottom: 0;
  left: 0;
`,Yi=s`
  right: 0;
  bottom: 0;
  left: 0;
`,Ki=s`
  -ms-flex-align: start;
  -webkit-align-items: flex-start;
  align-items: flex-start;
`,Ji=s`
  -ms-flex-align: center;
  -webkit-align-items: center;
  align-items: center;
`,Xi=s`
  -ms-flex-align: end;
  -webkit-align-items: flex-end;
  align-items: flex-end;
`,Zi=s`
  -ms-flex-align: baseline;
  -webkit-align-items: baseline;
  align-items: baseline;
`,Qi=s`
  -ms-flex-pack: start;
  -webkit-justify-content: flex-start;
  justify-content: flex-start;
`,ta=s`
  -ms-flex-pack: center;
  -webkit-justify-content: center;
  justify-content: center;
`,ea=s`
  -ms-flex-pack: end;
  -webkit-justify-content: flex-end;
  justify-content: flex-end;
`,ia=s`
  -ms-flex-pack: distribute;
  -webkit-justify-content: space-around;
  justify-content: space-around;
`,aa=s`
  -ms-flex-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
`,oa=s`
  -ms-align-self: flex-start;
  -webkit-align-self: flex-start;
  align-self: flex-start;
`,ra=s`
  -ms-align-self: center;
  -webkit-align-self: center;
  align-self: center;
`,na=s`
  -ms-align-self: flex-end;
  -webkit-align-self: flex-end;
  align-self: flex-end;
`,sa=s`
  -ms-align-self: stretch;
  -webkit-align-self: stretch;
  align-self: stretch;
`,la=s`
  -ms-align-self: baseline;
  -webkit-align-self: baseline;
  align-self: baseline;
`,ca=s`
  -ms-flex-line-pack: start; /* IE10 */
  -ms-align-content: flex-start;
  -webkit-align-content: flex-start;
  align-content: flex-start;
`,da=s`
  -ms-flex-line-pack: end; /* IE10 */
  -ms-align-content: flex-end;
  -webkit-align-content: flex-end;
  align-content: flex-end;
`,ha=s`
  -ms-flex-line-pack: center; /* IE10 */
  -ms-align-content: center;
  -webkit-align-content: center;
  align-content: center;
`,pa=s`
  -ms-flex-line-pack: justify; /* IE10 */
  -ms-align-content: space-between;
  -webkit-align-content: space-between;
  align-content: space-between;
`,ua=s`
  -ms-flex-line-pack: distribute; /* IE10 */
  -ms-align-content: space-around;
  -webkit-align-content: space-around;
  align-content: space-around;
`,ma=s`.layout.horizontal,.layout.vertical{${vi}}.layout.inline{${gi}}.layout.horizontal{${fi}}.layout.vertical{${bi}}.layout.wrap{${yi}}.layout.no-wrap{${_i}}.layout.center,.layout.center-center{${Ji}}.layout.center-center,.layout.center-justified{${ta}}.flex{${xi}}.flex-auto{${wi}}.flex-none{${$i}}.none{${ki}}`;s`.flex,.flex-1{${wi}}.flex-2{${Ci}}.flex-3{${Ai}}.flex-4{${Pi}}.flex-5{${Si}}.flex-6{${Ti}}.flex-7{${Ii}}.flex-8{${Ei}}.flex-9{${Li}}.flex-10{${Ri}}.flex-11{${Mi}}.flex-12{${Di}}`,s`.layout.horizontal-reverse,.layout.vertical-reverse{${vi}}.layout.horizontal-reverse{${Oi}}.layout.vertical-reverse{${zi}}.layout.wrap-reverse{${Fi}}`,s`.block{${Ui}}[hidden]{${ki}}.invisible{${Bi}}.relative{${Ni}}.fit{${ji}}body.fullbleed{margin:0;height:100vh}.scroll{${Hi}}.fixed-bottom,.fixed-left,.fixed-right,.fixed-top{${Vi}}.fixed-top{${Gi}}.fixed-right{${qi}}.fixed-bottom{${Yi}}.fixed-left{${Wi}}`,s`
  .layout.start {
    ${Ki}
  }

  .layout.center,
  .layout.center-center {
    ${Ji}
  }

  .layout.end {
    ${Xi}
  }

  .layout.baseline {
    ${Zi}
  }

  .layout.start-justified {
    ${Qi}
  }

  .layout.center-justified,
  .layout.center-center {
    ${ta}
  }

  .layout.end-justified {
    ${ea}
  }

  .layout.around-justified {
    ${ia}
  }

  .layout.justified {
    ${aa}
  }

  .self-start {
   ${oa}

  .self-center {
   ${ra}
  }

  .self-end {
    ${na}
  }

  .self-stretch {
   ${sa}
  }

  .self-baseline {
   ${la}
  }

  .layout.start-aligned {
   ${ca}
  }

  .layout.end-aligned {
    ${da}
  }

  .layout.center-aligned {
   ${ha}
  }

  .layout.between-aligned {
    ${pa}
  }

  .layout.around-aligned {
    ${ua}
  }
`
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */;class va extends St{constructor(t){if(super(t),this.et=B,t.type!==Ct)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===B||null==t)return this.ft=void 0,this.et=t;if(t===U)return t;if("string"!=typeof t)throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.et)return this.ft;this.et=t;const e=[t];return e.raw=e,this.ft={_$litType$:this.constructor.resultType,strings:e,values:[]}}}va.directiveName="unsafeHTML",va.resultType=1;const ga=Pt(va);class fa{static _checkVideoLongPlayTimeAndReset(t,e){const i=e.getAttribute("data-id");if(t.playStartedAt&&i){const e=((new Date).getTime()-t.playStartedAt.getTime())/1e3;e>5&&window.appGlobals.sendLongVideoView(i),window.appGlobals.activity("completed","video",e),t.playStartedAt=void 0}else t.playStartedAt&&(console.error("Got long view check without id"),t.playStartedAt=void 0)}static _checkAudioLongPlayTimeAndReset(t,e){const i=e.getAttribute("data-id");if(t.playStartedAt&&i){const e=((new Date).getTime()-t.playStartedAt.getTime())/1e3;e>5&&window.appGlobals.sendLongAudioListen(i),window.appGlobals.activity("completed","audio",e),t.playStartedAt=void 0}else t.playStartedAt&&(console.error("Got long view check without audio id"),t.playStartedAt=void 0)}static getImageFormatUrl(t,e=0){if(!(t&&t.length>0))return"";{const i=JSON.parse(t[t.length-1].formats);if(i&&i.length>0)return i[e]}}static setupTopHeaderImage(t,e){if(t.wide){let t;t=e?"url("+this.getImageFormatUrl(e,0)+")":"none",window.appGlobals.theme.updateStyles({"--top-area-background-image":t})}}static attachMediaListeners(t){setTimeout((()=>{const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");if(e){const i=e.getAttribute("data-id");i&&(t.videoPlayListener=()=>{t.playStartedAt=new Date,window.appGlobals.sendVideoView(parseInt(i))},t.videoPauseListener=()=>{this._checkVideoLongPlayTimeAndReset(t,e)},t.videoEndedListener=()=>{this._checkVideoLongPlayTimeAndReset(t,e)},e.addEventListener("play",t.videoPlayListener.bind(t)),e.addEventListener("pause",t.videoPauseListener.bind(t)),e.addEventListener("ended",t.videoEndedListener.bind(t)))}if(i){const e=i.getAttribute("data-id");e&&(t.audioPlayListener=()=>{t.playStartedAt=new Date,window.appGlobals.sendAudioListen(e)},t.audioPauseListener=()=>{this._checkAudioLongPlayTimeAndReset(t,i)},t.audioEndedListener=()=>{this._checkAudioLongPlayTimeAndReset(t,i)},i.addEventListener("play",t.audioPlayListener.bind(t)),i.addEventListener("pause",t.audioPauseListener.bind(t)),i.addEventListener("ended",t.audioEndedListener.bind(t)))}}),200)}static detachMediaListeners(t){const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");e&&(t.videoPlayListener&&(e.removeEventListener("play",t.videoPlayListener),t.videoPlayListener=void 0),t.videoPauseListener&&(e.removeEventListener("pause",t.videoPauseListener),t.videoPauseListener=void 0),t.videoEndedListener&&(e.removeEventListener("ended",t.videoEndedListener),t.videoEndedListener=void 0),this._checkVideoLongPlayTimeAndReset(t,e)),i&&(t.audioPlayListener&&(i.removeEventListener("play",t.audioPlayListener),t.audioPlayListener=void 0),t.audioPauseListener&&(i.removeEventListener("pause",t.audioPauseListener),t.audioPauseListener=void 0),t.audioEndedListener&&(i.removeEventListener("ended",t.audioEndedListener),t.audioEndedListener=void 0),this._checkVideoLongPlayTimeAndReset(t,i))}static pauseMediaPlayback(t){const e=t.$$("#videoPlayer"),i=t.$$("#audioPlayer");e&&e.pause(),i&&i.pause()}static getVideoURL(t){return t&&t.length>0&&t[0].formats&&t[0].formats.length>0?t[0].formats[0]:null}static isPortraitVideo(t){return!!(t&&t.length>0&&t[0].formats&&t[0].formats.length>0)&&!(!t[0].public_meta||!t[0].public_meta.aspect||"portrait"!==t[0].public_meta.aspect)}static getAudioURL(t){return t&&t.length>0&&t[0].formats&&t[0].formats.length>0?t[0].formats[0]:null}static getVideoPosterURL(t,e,i=0){return t&&t.length>0&&t[0].VideoImages&&t[0].VideoImages.length>0?(t[0].public_meta&&t[0].public_meta.selectedVideoFrameIndex&&(i=t[0].public_meta.selectedVideoFrameIndex),i>t[0].VideoImages.length-1&&(i=0),-2===i&&e?this.getImageFormatUrl(e,0):(i<0&&(i=0),JSON.parse(t[0].VideoImages[i].formats)[0])):null}}let ba=class extends mi{async connectedCallback(){super.connectedCallback(),window.appGlobals.activity("open","surveyIntro")}static get styles(){return[super.styles,s`.footerHtml{margin-top:32px;max-width:600px;color:var(--md-sys-color-on-surface-variant)}.title{padding:18px;font-family:monospace;font-size:22px;letter-spacing:.22em;line-height:1.7;background-color:var(--md-sys-color-primary);color:var(--md-sys-color-on-primary);padding:16px;text-align:center;margin-top:32px;border-radius:16px;margin-bottom:24px}.fab{margin-top:24px}.description{font-family:monospace;font-size:16px;letter-spacing:.04em;line-height:1.6;border-radius:8px;max-width:600px;vertical-align:center;margin-bottom:32px;margin-top:24px;padding:16px;color:var(--md-sys-color-primary);background-color:var(--md-sys-color-on-primary)}.image{width:632px;height:356px}@media (max-width:960px){.image{width:332px;height:187px}.description{max-width:300px}.title{margin-left:16px;margin-right:16px;margin-bottom:32px}}`]}get formattedDescription(){return(this.earl.welcome_message||"").replace(/(\n)/g,"<br>")}clickStart(){window.appGlobals.activity("click","startFromIntro"),this.fire("start")}render(){return F` <div class="topContainer layout vertical wrap center-center"> <div class="title">${this.question.name}</div> <yp-image class="column image" sizing="contain" src="${fa.getImageFormatUrl(this.earl.logo_file_name,0)}"></yp-image> <md-fab-extended icon="rocket" class="fab" @click="${this.clickStart}" .label="${this.t("Start")}"></md-fab-extended> <div class="description">${ga(this.formattedDescription)}</div> <div class="footerHtml"> ${this.earl.configuration&&this.earl.configuration.footerHtml?ga(this.earl.configuration.footerHtml):B} </div> </div> `}};t([st({type:Object}),e("design:type",Object)],ba.prototype,"earl",void 0),t([st({type:Object}),e("design:type",Object)],ba.prototype,"question",void 0),ba=t([rt("aoi-survey-intro")],ba);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ya=Symbol.for(""),_a=t=>{if((null==t?void 0:t.r)===ya)return null==t?void 0:t._$litStatic$},xa=(t,...e)=>({_$litStatic$:e.reduce(((e,i,a)=>e+(t=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but\n            take care to ensure page security.`)})(i)+t[a+1]),t[0]),r:ya}),wa=new Map,$a=(t=>(e,...i)=>{const a=i.length;let o,r;const n=[],s=[];let l,c=0,d=!1;for(;c<a;){for(l=e[c];c<a&&void 0!==(r=i[c],o=_a(r));)l+=o+e[++c],d=!0;c!==a&&s.push(r),n.push(l),c++}if(c===a&&n.push(e[a]),d){const t=n.join("$$lit$$");void 0===(e=wa.get(t))&&(n.raw=n,wa.set(t,e=n)),i=s}return t(e,...i)})(F);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */function ka(t){return t.currentTarget===t.target&&(t.composedPath()[0]===t.target&&(!t.target.disabled&&!function(t){const e=Ca;e&&(t.preventDefault(),t.stopImmediatePropagation());return async function(){Ca=!0,await null,Ca=!1}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */(),e}(t)))}let Ca=!1;class Aa extends at{constructor(){super(),this.disabled=!1,this.trailingIcon=!1,this.hasIcon=!1,this.preventClickDefault=!1,this.showFocusRing=!1,this.showRipple=!1,this.handleActivationClick=t=>{ka(t)&&(this.focus(),function(t){const e=new MouseEvent("click",{bubbles:!0});t.dispatchEvent(e)}(this.buttonElement))},this.getRipple=()=>(this.showRipple=!0,this.ripple),this.renderRipple=()=>F`<md-ripple class="md3-button__ripple" ?disabled="${this.disabled}"></md-ripple>`,this.addEventListener("click",this.handleActivationClick)}focus(){this.buttonElement.focus()}blur(){this.buttonElement.blur()}render(){const t=this.disabled&&!this.href,e=this.href?xa`a`:xa`button`,{ariaLabel:i,ariaHasPopup:a,ariaExpanded:o}=this;return $a`
      <${e}
        class="md3-button ${Tt(this.getRenderClasses())}"
        ?disabled=${t}
        aria-label="${i||B}"
        aria-haspopup="${a||B}"
        aria-expanded="${o||B}"
        href=${this.href||B}
        target=${this.target||B}
        @pointerdown="${this.handlePointerDown}"
        @focus="${this.handleFocus}"
        @blur="${this.handleBlur}"
        @click="${this.handleClick}"
        ${Kt(this.getRipple)}
      >
        ${this.renderFocusRing()}
        ${this.renderElevation()}
        ${Ht(this.showRipple,this.renderRipple)}
        ${this.renderOutline()}
        ${this.renderTouchTarget()}
        ${this.renderLeadingIcon()}
        ${this.renderLabel()}
        ${this.renderTrailingIcon()}
      </${e}>`}getRenderClasses(){return{"md3-button--icon-leading":!this.trailingIcon&&this.hasIcon,"md3-button--icon-trailing":this.trailingIcon&&this.hasIcon}}renderTouchTarget(){return F` <span class="md3-button__touch"></span> `}renderElevation(){return F``}renderOutline(){return F``}renderFocusRing(){return F`<md-focus-ring .visible="${this.showFocusRing}"></md-focus-ring>`}renderLabel(){return F`<span class="md3-button__label"><slot></slot></span>`}renderLeadingIcon(){return this.trailingIcon?"":this.renderIcon()}renderTrailingIcon(){return this.trailingIcon?this.renderIcon():""}renderIcon(){return F`<slot name="icon" @slotchange="${this.handleSlotChange}"></slot>`}handlePointerDown(t){Yt(),this.showFocusRing=Wt()}handleClick(t){this.preventClickDefault&&t.preventDefault()}handleFocus(){this.showFocusRing=Wt()}handleBlur(){this.showFocusRing=!1}handleSlotChange(){this.hasIcon=this.assignedIcons.length>0}}_t(Aa),Aa.shadowRootOptions={mode:"open",delegatesFocus:!0},t([st({type:Boolean,reflect:!0})],Aa.prototype,"disabled",void 0),t([st()],Aa.prototype,"href",void 0),t([st()],Aa.prototype,"target",void 0),t([st({type:Boolean,attribute:"trailingicon"})],Aa.prototype,"trailingIcon",void 0),t([st({type:Boolean})],Aa.prototype,"hasIcon",void 0),t([st({type:Boolean})],Aa.prototype,"preventClickDefault",void 0),t([dt(".md3-button")],Aa.prototype,"buttonElement",void 0),t([ht("md-ripple")],Aa.prototype,"ripple",void 0),t([lt()],Aa.prototype,"showFocusRing",void 0),t([lt()],Aa.prototype,"showRipple",void 0),t([mt({slot:"icon",flatten:!0})],Aa.prototype,"assignedIcons",void 0);
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
class Pa extends Aa{getRenderClasses(){return{...super.getRenderClasses(),"md3-button--elevated":!0}}renderElevation(){return F`<md-elevation></md-elevation>`}}
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */const Sa=s`:host{--_container-shape-start-start:var(--md-elevated-button-container-shape-start-start, var(--md-elevated-button-container-shape, 9999px));--_container-shape-start-end:var(--md-elevated-button-container-shape-start-end, var(--md-elevated-button-container-shape, 9999px));--_container-shape-end-end:var(--md-elevated-button-container-shape-end-end, var(--md-elevated-button-container-shape, 9999px));--_container-shape-end-start:var(--md-elevated-button-container-shape-end-start, var(--md-elevated-button-container-shape, 9999px));--_container-color:var(--md-elevated-button-container-color, var(--md-sys-color-surface-container-low, #f7f2fa));--_container-elevation:var(--md-elevated-button-container-elevation, 1);--_container-height:var(--md-elevated-button-container-height, 40px);--_container-shadow-color:var(--md-elevated-button-container-shadow-color, var(--md-sys-color-shadow, #000));--_disabled-container-color:var(--md-elevated-button-disabled-container-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-container-elevation:var(--md-elevated-button-disabled-container-elevation, 0);--_disabled-container-opacity:var(--md-elevated-button-disabled-container-opacity, 0.12);--_disabled-label-text-color:var(--md-elevated-button-disabled-label-text-color, var(--md-sys-color-on-surface, #1d1b20));--_disabled-label-text-opacity:var(--md-elevated-button-disabled-label-text-opacity, 0.38);--_focus-container-elevation:var(--md-elevated-button-focus-container-elevation, 1);--_focus-label-text-color:var(--md-elevated-button-focus-label-text-color, var(--md-sys-color-primary, #6750a4));--_focus-state-layer-color:var(--md-elevated-button-focus-state-layer-color, var(--md-sys-color-primary, #6750a4));--_focus-state-layer-opacity:var(--md-elevated-button-focus-state-layer-opacity, 0.12);--_hover-container-elevation:var(--md-elevated-button-hover-container-elevation, 2);--_hover-label-text-color:var(--md-elevated-button-hover-label-text-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-color:var(--md-elevated-button-hover-state-layer-color, var(--md-sys-color-primary, #6750a4));--_hover-state-layer-opacity:var(--md-elevated-button-hover-state-layer-opacity, 0.08);--_label-text-color:var(--md-elevated-button-label-text-color, var(--md-sys-color-primary, #6750a4));--_label-text-type:var(--md-elevated-button-label-text-type, var(--md-sys-typescale-label-large, 500 0.875rem / 1.25rem var(--md-ref-typeface-plain, Roboto)));--_pressed-container-elevation:var(--md-elevated-button-pressed-container-elevation, 1);--_pressed-label-text-color:var(--md-elevated-button-pressed-label-text-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-color:var(--md-elevated-button-pressed-state-layer-color, var(--md-sys-color-primary, #6750a4));--_pressed-state-layer-opacity:var(--md-elevated-button-pressed-state-layer-opacity, 0.12);--_with-icon-disabled-icon-color:var(--md-elevated-button-with-icon-disabled-icon-color, var(--md-sys-color-on-surface, #1d1b20));--_with-icon-disabled-icon-opacity:var(--md-elevated-button-with-icon-disabled-icon-opacity, 0.38);--_with-icon-focus-icon-color:var(--md-elevated-button-with-icon-focus-icon-color, var(--md-sys-color-primary, #6750a4));--_with-icon-hover-icon-color:var(--md-elevated-button-with-icon-hover-icon-color, var(--md-sys-color-primary, #6750a4));--_with-icon-icon-color:var(--md-elevated-button-with-icon-icon-color, var(--md-sys-color-primary, #6750a4));--_with-icon-icon-size:var(--md-elevated-button-with-icon-icon-size, 18px);--_with-icon-pressed-icon-color:var(--md-elevated-button-with-icon-pressed-icon-color, var(--md-sys-color-primary, #6750a4));--_spacing-leading:var(--md-elevated-button-spacing-leading, 24px);--_spacing-trailing:var(--md-elevated-button-spacing-trailing, 24px);--_with-icon-spacing-leading:var(--md-elevated-button-with-icon-spacing-leading, 16px);--_with-icon-spacing-trailing:var(--md-elevated-button-with-icon-spacing-trailing, 24px);--_with-trailing-icon-spacing-leading:var(--md-elevated-button-with-trailing-icon-spacing-leading, 24px);--_with-trailing-icon-spacing-trailing:var(--md-elevated-button-with-trailing-icon-spacing-trailing, 16px)}`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,Ta=s`md-elevation{transition-duration:280ms}.md3-button{--md-elevation-level:var(--_container-elevation);--md-elevation-shadow-color:var(--_container-shadow-color)}.md3-button:focus{--md-elevation-level:var(--_focus-container-elevation)}.md3-button:hover{--md-elevation-level:var(--_hover-container-elevation)}.md3-button:active{--md-elevation-level:var(--_pressed-container-elevation)}.md3-button:disabled{--md-elevation-level:var(--_disabled-container-elevation)}`
/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */,Ia=s`:root{--md-filled-button-container-shape-start-start:12px;--md-filled-button-container-shape:8px}:host{display:inline-flex;outline:0;-webkit-tap-highlight-color:transparent;vertical-align:top;--md-ripple-hover-color:var(--_hover-state-layer-color);--md-ripple-focus-color:var(--_focus-state-layer-color);--md-ripple-pressed-color:var(--_pressed-state-layer-color);--md-ripple-hover-opacity:var(--_hover-state-layer-opacity);--md-ripple-focus-opacity:var(--_focus-state-layer-opacity);--md-ripple-pressed-opacity:var(--_pressed-state-layer-opacity);--md-focus-ring-shape-start-start:var(--md-focus-ring-shape, var(--_container-shape-start-start));--md-focus-ring-shape-start-end:var(--md-focus-ring-shape, var(--_container-shape-start-end));--md-focus-ring-shape-end-end:var(--md-focus-ring-shape, var(--_container-shape-end-end));--md-focus-ring-shape-end-start:var(--md-focus-ring-shape, var(--_container-shape-end-start))}:host([disabled]){cursor:default;pointer-events:none}.md3-button{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-inline-size:64px;border:none;outline:0;user-select:none;-webkit-appearance:none;vertical-align:middle;background:rgba(0,0,0,0);text-decoration:none;inline-size:100%;position:relative;z-index:0;block-size:var(--_container-height);font:var(--_label-text-type);color:var(--_label-text-color);padding-inline-start:var(--_spacing-leading);padding-inline-end:var(--_spacing-trailing);gap:8px}.md3-button::before{background-color:var(--_container-color);border-radius:inherit;content:"";inset:0;position:absolute}.md3-button::-moz-focus-inner{padding:0;border:0}.md3-button:hover{color:var(--_hover-label-text-color);cursor:pointer}.md3-button:focus{color:var(--_focus-label-text-color)}.md3-button:active{color:var(--_pressed-label-text-color);outline:0}.md3-button:disabled .md3-button__label{color:var(--_disabled-label-text-color);opacity:var(--_disabled-label-text-opacity)}.md3-button:disabled::before{background-color:var(--_disabled-container-color);opacity:var(--_disabled-container-opacity)}@media(forced-colors:active){.md3-button::before{position:absolute;box-sizing:border-box;width:100%;height:100%;top:0;left:0;border:1px solid transparent;border-radius:inherit;content:"";pointer-events:none}}.md3-button,.md3-button__ripple{border-start-start-radius:var(--_container-shape-start-start);border-start-end-radius:var(--_container-shape-start-end);border-end-start-radius:var(--_container-shape-end-start);border-end-end-radius:var(--_container-shape-end-end)}.md3-button::after,.md3-button::before,.md3-button__ripple,md-elevation{z-index:-1}.md3-button--icon-leading{padding-inline-start:var(--_with-icon-spacing-leading);padding-inline-end:var(--_with-icon-spacing-trailing)}.md3-button--icon-trailing{padding-inline-start:var(--_with-trailing-icon-spacing-leading);padding-inline-end:var(--_with-trailing-icon-spacing-trailing)}.md3-link-button-wrapper{inline-size:100%}.md3-button ::slotted([slot=icon]){display:inline-flex;position:relative;writing-mode:horizontal-tb;fill:currentColor;color:var(--_with-icon-icon-color);font-size:var(--_with-icon-icon-size);inline-size:var(--_with-icon-icon-size);block-size:var(--_with-icon-icon-size)}.md3-button:hover ::slotted([slot=icon]){color:var(--_with-icon-hover-icon-color)}.md3-button:focus ::slotted([slot=icon]){color:var(--_with-icon-focus-icon-color)}.md3-button:active ::slotted([slot=icon]){color:var(--_with-icon-pressed-icon-color)}.md3-button:disabled ::slotted([slot=icon]){color:var(--_with-icon-disabled-icon-color);opacity:var(--_with-icon-disabled-icon-opacity)}.md3-button__touch{position:absolute;top:50%;height:48px;left:0;right:0;transform:translateY(-50%)}`
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */;let Ea=class extends Pa{};Ea.styles=[Ia,Ta,Sa],Ea=t([rt("md-elevated-button")],Ea);let La=class extends mi{constructor(){super(...arguments),this.voteCount=0}async connectedCallback(){this.leftAnswer=this.firstPrompt.left_choice_text,this.rightAnswer=this.firstPrompt.right_choice_text,this.promptId=this.firstPrompt.id,this.appearanceLookup=this.question.appearance_id,super.connectedCallback(),window.appGlobals.activity("open","surveyVoting"),this.resetTimer()}resetTimer(){this.timer=(new Date).getTime()}static get styles(){return[super.styles,s`.buttonContainer md-elevated-button{min-width:100px;min-height:100px;display:flex;align-items:center;justify-content:center;margin:8px}.progressBarContainer{width:100%;height:10px;background-color:#f0f0f0;border-radius:5px;overflow:hidden;box-shadow:inset 0 1px 3px rgba(0,0,0,.2)}.progressBar{height:100%;background-color:#4caf50;transition:width .4s ease-in-out}`]}renderProgressBar(){if(this.earl.configuration){const t=this.earl.configuration.targetVotes,e=Math.min(this.voteCount/t*100,100);return F` <div class="progressBarContainer"> <div class="progressBar" style="width:${e}%"></div> </div> `}return B}render(){return F` <div class="topContainer layout vertical wrap center-center"> ${this.renderProgressBar()} <div class="question"> ${this.question.name} </div> <div class="buttonContainer layout horizontal wrap center-center"> ${this.renderProgressBar()} <md-elevated-button class="leftAnswer" @click="${()=>this.voteForAnswer("left")}"> ${this.leftAnswer} </md-elevated-button> <md-elevated-button class="rightAnswer" @click="${()=>this.voteForAnswer("right")}"> ${this.rightAnswer} </md-elevated-button> </div> <div class="layout horizontal wrap center-center"> </div> </div> `}async voteForAnswer(t){const e={time_viewed:(new Date).getTime()-this.timer,prompt_id:this.promptId,direction:t,appearance_lookup:this.appearanceLookup},i=await window.aoiServerApi.postVote(this.question.id,this.promptId,this.language,e);this.leftAnswer=i.newleft,this.rightAnswer=i.newright,this.promptId=i.prompt_id,this.appearanceLookup=i.appearance_lookup,this.resetTimer()}};t([st({type:Object}),e("design:type",Object)],La.prototype,"earl",void 0),t([st({type:Object}),e("design:type",Object)],La.prototype,"question",void 0),t([st({type:Object}),e("design:type",Object)],La.prototype,"firstPrompt",void 0),t([st({type:Number}),e("design:type",Number)],La.prototype,"promptId",void 0),t([st({type:Number}),e("design:type",Object)],La.prototype,"voteCount",void 0),t([st({type:String}),e("design:type",String)],La.prototype,"leftAnswer",void 0),t([st({type:String}),e("design:type",String)],La.prototype,"rightAnswer",void 0),t([st({type:String}),e("design:type",String)],La.prototype,"appearanceLookup",void 0),La=t([rt("aoi-survey-voting")],La);class Ra{constructor(){this.addGlobalListener("yp-language-loaded",this._languageEvent.bind(this)),window.appGlobals&&window.appGlobals.i18nTranslation&&window.appGlobals.locale?this.language=window.appGlobals.locale:this.language="en"}_languageEvent(t){const e=t.detail;this.language=e.language,window.appGlobals.locale=e.language}fire(t,e={},i){const a=new CustomEvent(t,{detail:e,bubbles:!0,composed:!0});i.dispatchEvent(a)}fireGlobal(t,e={}){this.fire(t,e,document)}addListener(t,e,i){i.addEventListener(t,e,!1)}addGlobalListener(t,e){this.addListener(t,e,document)}showToast(t,e=4e3){window.appDialogs.getDialogAsync("masterToast",(i=>{i.labelText=t,i.timeoutMs=e,i.open=!0}))}removeListener(t,e,i){i.removeEventListener(t,e)}removeGlobalListener(t,e){this.removeListener(t,e,document)}t(...t){const e=t[0];if(window.appGlobals.i18nTranslation){let t=window.appGlobals.i18nTranslation.t(e);return t||(t=""),t}return""}}class Ma extends Ra{constructor(){super(...arguments),this.baseUrlPath="/api"}static transformCollectionTypeToApi(t){let e;switch(t){case"domain":e="domains";break;case"community":e="communities";break;case"group":e="groups";break;case"post":e="posts";break;case"user":e="users";break;default:e="",console.error(`Cant find collection type transform for ${t}`)}return e}async fetchWrapper(t,e={},i=!0,a=void 0){if(e.headers||(e.headers={"Content-Type":"application/json"}),navigator.onLine||"POST"!==e.method||void 0===window.fetch){if(!navigator.onLine&&["POST","PUT","DELETE"].indexOf(e.method)>-1)throw this.showToast(this.t("youAreOfflineCantSend")),new Error("offlineSendLater");{const o=await fetch(t,e);return this.handleResponse(o,i,a)}}throw window.appGlobals.offline.sendWhenOnlineNext({body:e.body,method:e.method,params:{},url:t}),new Error("offlineSendLater")}async handleResponse(t,e,i=void 0){if(t.ok){let a=null;try{a=await t.json()}catch(a){200===t.status&&"OK"===t.statusText||this.fireGlobal("yp-network-error",{response:t,jsonError:a,showUserError:e,errorId:i})}return null===a||a}return this.fireGlobal("yp-network-error",{response:t,showUserError:e,errorId:i}),null}}class Da extends Ma{constructor(t="/api"){super(),this.baseUrlPath=t}getEarl(t){return this.fetchWrapper(this.baseUrlPath+`/earls/${t}.json`)}postVote(t,e,i,a){return this.fetchWrapper(this.baseUrlPath+`/questions/${t}/prompts/${e}/votes.js?locale=${i}`,{method:"POST",body:JSON.stringify(a)},!1)}postVoteSkip(t,e,i,a){return this.fetchWrapper(this.baseUrlPath+`/questions/${t}/prompts/${e}/skip.js?locale=${i}`,{method:"POST",body:JSON.stringify(a)},!1)}}class Oa{activity(t,e){}}const za=1,Fa=2,Ua=3,Ba=4;let Na=class extends mi{constructor(){super(),this.pageIndex=2,this.collectionType="domain",this.themeColor="#013B70";const t=window.location.href.split("/"),e=new URLSearchParams(window.location.search).get("name");this.earlName=e||t[t.length-1],window.aoiServerApi=new Da,window.appGlobals=new Oa}getServerUrlFromClusterId(t){return 1==t?"https://betrireykjavik.is/api":3==t?"https://ypus.org/api":"https://yrpri.org/api"}connectedCallback(){super.connectedCallback(),this._setupEventListeners();const t=localStorage.getItem("md3-yrpri-promotion-color");t&&this.fireGlobal("yp-theme-color",t),this.getEarl()}async getEarl(){const t=await window.aoiServerApi.getEarl(this.earlName);this.earl=t.earl,this.question=t.question,this.prompt=t.prompt}disconnectedCallback(){super.disconnectedCallback(),this._removeEventListeners()}updateThemeDarkMode(t){this.themeDarkMode=t.detail,this.themeChanged()}themeChanged(t=void 0){!function(t,e){const i=e?.target||document.body;if(Ze(i,e?.dark?t.schemes.dark:t.schemes.light),e?.brightnessSuffix&&(Ze(i,t.schemes.dark,"-dark"),Ze(i,t.schemes.light,"-light")),e?.paletteTones){const a=e?.paletteTones??[];for(const[e,o]of Object.entries(t.palettes)){const t=e.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase();for(const e of a){const a=`--md-ref-palette-${t}-${t}${e}`,r=Ye(o.tone(e));i.style.setProperty(a,r)}}}}(Xe(Ke(this.themeColor),[{name:"up-vote",value:Ke("#0F0"),blend:!0},{name:"down-vote",value:Ke("#F00"),blend:!0}]),{target:t||this,dark:void 0===this.themeDarkMode?window.matchMedia("(prefers-color-scheme: dark)").matches:this.themeDarkMode})}snackbarclosed(){this.lastSnackbarText=void 0}tabChanged(t){0==t.detail.activeIndex?this.pageIndex=1:1==t.detail.activeIndex?this.pageIndex=2:2==t.detail.activeIndex&&(this.pageIndex=4)}exitToMainApp(){window.location.href="/"}async _displaySnackbar(t){this.lastSnackbarText=t.detail,await this.updateComplete}_setupEventListeners(){this.addListener("app-error",this._appError),this.addListener("display-snackbar",this._displaySnackbar)}_removeEventListeners(){this.removeListener("display-snackbar",this._displaySnackbar)}updated(t){super.updated(t),(t.has("themeColor")||t.has("themeDarkMode"))&&this.themeChanged(document.body)}_appError(t){console.error(t.detail.message),this.currentError=t.detail.message}get adminConfirmed(){return!0}_settingsColorChanged(t){this.fireGlobal("yp-theme-color",t.detail.value)}static get styles(){return[ma,s`:host{background-color:var(--md-sys-color-surface,#fefefe)}body{background-color:var(--md-sys-color-surface,#fefefe)}.analyticsHeaderText{font-size:var(--md-sys-typescale-headline-large-size,18px);margin-top:16px;margin-bottom:16px}.ypLogo{margin-top:16px}.rightPanel{margin-left:16px;width:100%}md-list-item{--md-list-list-item-container-color:var(--md-sys-color-surface);color:var(--md-sys-color-on-surface);--md-list-list-item-label-text-color:var(--md-sys-color-on-surface)}.selectedContainer{--md-list-list-item-container-color:var(
            --md-sys-color-secondary-container
          );color:var(--md-sys-color-on-secondary-container);--md-list-list-item-label-text-color:var(
            --md-sys-color-on-secondary-container
          )}md-navigation-drawer{--md-navigation-drawer-container-color:var(--md-sys-color-surface)}md-list{--md-list-container-color:var(--md-sys-color-surface)}.topAppBar{border-radius:48px;background-color:var(--md-sys-color-primary-container);color:var(--md-sys-color-on-primary-container);margin-top:32px;padding:0;padding-left:32px;padding-right:32px;text-align:center}.collectionLogoImage{width:120px;height:68px;margin-right:16px;margin-left:16px}.mainPageContainer{margin-top:16px}yp-promotion-dashboard{max-width:1100px}`]}updateThemeColor(t){this.themeColor=t.detail}renderIntroduction(){return F` <div class="layout vertical center-center"></div> `}renderShare(){return F` <div class="layout vertical center-center"></div> `}_renderPage(){if(!this.earl)return F`Loading...`;switch(this.pageIndex){case za:return F`<aoi-survey-intro .earl="${this.earl}" .question="${this.question}"></aoi-survey-intro>`;case Fa:return F`<aoi-survey-voting .earl="${this.earl}" .question="${this.question}" .firstPrompt="${this.prompt}" @theme-dark-mode="${this.updateThemeDarkMode}" @theme-color="${this.updateThemeColor}"></aoi-survey-voting>`;case Ua:return F`<oai-results @theme-dark-mode="${this.updateThemeDarkMode}" @theme-color="${this.updateThemeColor}"></oai-results>`;case Ba:return F` ${this.renderShare()} `;default:return F` <p>Page not found try going to <a href="#main">Main</a></p> `}}renderTopBar(){return F` <div class="layout vertical center-center"> <div class="layout horizontal topAppBar"> <div class="layout horizontal headerContainer"> <div class="analyticsHeaderText layout horizontal center-center"> <div> <img class="collectionLogoImage" src=""> </div> <div>Hackathon template</div> </div> </div> </div> </div> `}renderNavigationBar(){return this.wide?F` <md-navigation-drawer opened> <div class="layout horizontal headerContainer"> <div class="analyticsHeaderText layout horizontal center-center"> <div> <yp-image class="collectionLogoImage" sizing="contain" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"></yp-image> </div> <div></div> </div> </div> <md-list> <md-list-item class="${1==this.pageIndex&&"selectedContainer"}" @click="${()=>this.pageIndex=1}" headline="${this.t("Analytics")}" supportingText="${this.t("Historical and realtime")}"> <md-list-item-icon slot="start"> <md-icon>insights</md-icon> </md-list-item-icon></md-list-item> <md-list-item class="${2==this.pageIndex&&"selectedContainer"}" @click="${()=>this.pageIndex=2}" headline="${this.t("Promotion")}" supportingText="${"posts"==this.collectionType?this.t("Promote your idea"):this.t("Promote your project")}"> <md-list-item-icon slot="start"><md-icon>ads_click</md-icon></md-list-item-icon></md-list-item> <md-list-item class="${3==this.pageIndex&&"selectedContainer"}" @click="${()=>this.pageIndex=3}" ?hidden="${"posts"==this.collectionType}" headline="${this.t("Email Templates")}" supportingText="${this.t("Send promotional emails")}"> <md-list-item-icon slot="start"><md-icon><span class="material-symbols-outlined">schedule_send</span></md-icon></md-list-item-icon></md-list-item> <md-list-item class="${4==this.pageIndex&&"selectedContainer"}" @click="${()=>this.pageIndex=4}" ?hidden="${"posts"==this.collectionType}" headline="${this.t("AI Analysis")}" supportingText="${this.t("Text analysis with AI")}"> <md-list-item-icon slot="start"><md-icon>document_scanner</md-icon></md-list-item-icon></md-list-item> <md-list-divider></md-list-divider> <md-list-item class="${5==this.pageIndex&&"selectedContainer"}" @click="${()=>this.pageIndex=5}" headline="${this.t("Setting")}" supportingText="${this.t("Theme, language, etc.")}"> <md-list-item-icon slot="start"><md-icon>settings</md-icon></md-list-item-icon></md-list-item> <md-list-item headline="${this.t("Exit")}" supportingText="${this.t("Exit back to project")}" @click="${this.exitToMainApp}"> <md-list-item-icon slot="start"><md-icon>arrow_back</md-icon></md-list-item-icon></md-list-item> <div class="layout horizontal center-center"> <div> <img class="ypLogo" height="65" alt="Your Priorities Logo" src="https://yrpri-eu-direct-assets.s3-eu-west-1.amazonaws.com/YpLogos/YourPriorites-Trans-Wide.png"> </div> </div> </md-list> </md-navigation-drawer> `:F` <div class="navContainer"> <md-navigation-bar @navigation-bar-activated="${this.tabChanged}"> <md-navigation-tab .label="${this.t("Analytics")}"><md-icon slot="activeIcon">insights</md-icon> <md-icon slot="inactiveIcon">insights</md-icon></md-navigation-tab> <md-navigation-tab .label="${this.t("Campaign")}"> <md-icon slot="activeIcon">ads_click</md-icon> <md-icon slot="inactiveIcon">ads_click</md-icon> </md-navigation-tab> <md-navigation-tab .label="${this.t("Settings")}"> <md-icon slot="activeIcon">settings</md-icon> <md-icon slot="inactiveIcon">settings</md-icon> </md-navigation-tab> </md-navigation-bar> </div> `}render(){return F` <div class="mainPageContainer">${this._renderPage()}</div> `}};t([st({type:Number}),e("design:type",Object)],Na.prototype,"pageIndex",void 0),t([st({type:String}),e("design:type",String)],Na.prototype,"lastSnackbarText",void 0),t([st({type:String}),e("design:type",Object)],Na.prototype,"collectionType",void 0),t([st({type:String}),e("design:type",String)],Na.prototype,"earlName",void 0),t([st({type:String}),e("design:type",String)],Na.prototype,"currentError",void 0),t([st({type:String}),e("design:type",Object)],Na.prototype,"themeColor",void 0),t([st({type:Object}),e("design:type",Object)],Na.prototype,"earl",void 0),t([st({type:Object}),e("design:type",Object)],Na.prototype,"question",void 0),t([st({type:Object}),e("design:type",Object)],Na.prototype,"prompt",void 0),Na=t([rt("aoi-survey-app"),e("design:paramtypes",[])],Na);
