function t(t,e,o,i){var s,n=arguments.length,a=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,o):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,o,i);else for(var r=t.length-1;r>=0;r--)(s=t[r])&&(a=(n<3?s(a):n>3?s(e,o,a):s(e,o))||a);return n>3&&a&&Object.defineProperty(e,o,a),a}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,o=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,o){if(this._$cssResult$=!0,o!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(o&&void 0===t){const o=void 0!==e&&1===e.length;o&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),o&&s.set(e,t))}return t}toString(){return this.cssText}};const a=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,o,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(o)+t[i+1],t[0]);return new n(o,t,i)},r=o?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const o of t.cssRules)e+=o.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,m=_.trustedTypes,g=m?m.emptyScript:"",f=_.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?g:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let o=t;switch(e){case Boolean:o=null!==t;break;case Number:o=null===t?null:Number(t);break;case Object:case Array:try{o=JSON.parse(t)}catch(t){o=null}}return o}},v=(t,e)=>!c(t,e),x={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:v};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let w=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=x){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const o=Symbol(),i=this.getPropertyDescriptor(t,o,e);void 0!==i&&l(this.prototype,t,i)}}static getPropertyDescriptor(t,e,o){const{get:i,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);s?.call(this,e),this.requestUpdate(t,n,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??x}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const o of e)this.createProperty(o,t[o])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,o]of e)this.elementProperties.set(t,o)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const o=this._$Eu(t,e);void 0!==o&&this._$Eh.set(o,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const o=new Set(t.flat(1/0).reverse());for(const t of o)e.unshift(r(t))}else void 0!==t&&e.push(r(t));return e}static _$Eu(t,e){const o=e.attribute;return!1===o?void 0:"string"==typeof o?o:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const o of e.keys())this.hasOwnProperty(o)&&(t.set(o,this[o]),delete this[o]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(o)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const o of i){const i=document.createElement("style"),s=e.litNonce;void 0!==s&&i.setAttribute("nonce",s),i.textContent=o.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,o){this._$AK(t,o)}_$ET(t,e){const o=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,o);if(void 0!==i&&!0===o.reflect){const s=(void 0!==o.converter?.toAttribute?o.converter:b).toAttribute(e,o.type);this._$Em=t,null==s?this.removeAttribute(i):this.setAttribute(i,s),this._$Em=null}}_$AK(t,e){const o=this.constructor,i=o._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=o.getPropertyOptions(i),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=i;const n=s.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,o,i=!1,s){if(void 0!==t){const n=this.constructor;if(!1===i&&(s=this[t]),o??=n.getPropertyOptions(t),!((o.hasChanged??v)(s,e)||o.useDefault&&o.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,o))))return;this.C(t,e,o)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:o,reflect:i,wrapped:s},n){o&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||o||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,o]of t){const{wrapped:t}=o,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,o,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};w.elementStyles=[],w.shadowRootOptions={mode:"open"},w[y("elementProperties")]=new Map,w[y("finalized")]=new Map,f?.({ReactiveElement:w}),(_.reactiveElementVersions??=[]).push("2.1.2");const $=globalThis,k=t=>t,A=$.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,O="?"+C,q=`<${O}>`,P=document,T=()=>P.createComment(""),z=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,D="[ \t\n\f\r]",j=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,U=/-->/g,N=/>/g,H=RegExp(`>|${D}(?:([^\\s"'>=/]+)(${D}*=${D}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,R=/"/g,B=/^(?:script|style|textarea|title)$/i,F=(t=>(e,...o)=>({_$litType$:t,strings:e,values:o}))(1),I=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),V=new WeakMap,K=P.createTreeWalker(P,129);function Z(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const G=(t,e)=>{const o=t.length-1,i=[];let s,n=2===e?"<svg>":3===e?"<math>":"",a=j;for(let e=0;e<o;e++){const o=t[e];let r,c,l=-1,d=0;for(;d<o.length&&(a.lastIndex=d,c=a.exec(o),null!==c);)d=a.lastIndex,a===j?"!--"===c[1]?a=U:void 0!==c[1]?a=N:void 0!==c[2]?(B.test(c[2])&&(s=RegExp("</"+c[2],"g")),a=H):void 0!==c[3]&&(a=H):a===H?">"===c[0]?(a=s??j,l=-1):void 0===c[1]?l=-2:(l=a.lastIndex-c[2].length,r=c[1],a=void 0===c[3]?H:'"'===c[3]?R:L):a===R||a===L?a=H:a===U||a===N?a=j:(a=H,s=void 0);const h=a===H&&t[e+1].startsWith("/>")?" ":"";n+=a===j?o+q:l>=0?(i.push(r),o.slice(0,l)+E+o.slice(l)+C+h):o+C+(-2===l?e:h)}return[Z(t,n+(t[o]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Y{constructor({strings:t,_$litType$:e},o){let i;this.parts=[];let s=0,n=0;const a=t.length-1,r=this.parts,[c,l]=G(t,e);if(this.el=Y.createElement(c,o),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=K.nextNode())&&r.length<a;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(E)){const e=l[n++],o=i.getAttribute(t).split(C),a=/([.?@])?(.*)/.exec(e);r.push({type:1,index:s,name:a[2],strings:o,ctor:"."===a[1]?et:"?"===a[1]?ot:"@"===a[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(C)&&(r.push({type:6,index:s}),i.removeAttribute(t));if(B.test(i.tagName)){const t=i.textContent.split(C),e=t.length-1;if(e>0){i.textContent=A?A.emptyScript:"";for(let o=0;o<e;o++)i.append(t[o],T()),K.nextNode(),r.push({type:2,index:++s});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===O)r.push({type:2,index:s});else{let t=-1;for(;-1!==(t=i.data.indexOf(C,t+1));)r.push({type:7,index:s}),t+=C.length-1}s++}}static createElement(t,e){const o=P.createElement("template");return o.innerHTML=t,o}}function J(t,e,o=t,i){if(e===I)return e;let s=void 0!==i?o._$Co?.[i]:o._$Cl;const n=z(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,o,i)),void 0!==i?(o._$Co??=[])[i]=s:o._$Cl=s),void 0!==s&&(e=J(t,s._$AS(t,e.values),s,i)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:o}=this._$AD,i=(t?.creationScope??P).importNode(e,!0);K.currentNode=i;let s=K.nextNode(),n=0,a=0,r=o[0];for(;void 0!==r;){if(n===r.index){let e;2===r.type?e=new X(s,s.nextSibling,this,t):1===r.type?e=new r.ctor(s,r.name,r.strings,this,t):6===r.type&&(e=new st(s,this,t)),this._$AV.push(e),r=o[++a]}n!==r?.index&&(s=K.nextNode(),n++)}return K.currentNode=P,i}p(t){let e=0;for(const o of this._$AV)void 0!==o&&(void 0!==o.strings?(o._$AI(t,o,e),e+=o.strings.length-2):o._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,o,i){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=o,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),z(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==I&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&z(this._$AH)?this._$AA.nextSibling.data=t:this.T(P.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:o}=t,i="number"==typeof o?this._$AC(t):(void 0===o.el&&(o.el=Y.createElement(Z(o.h,o.h[0]),this.options)),o);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new Q(i,this),o=t.u(this.options);t.p(e),this.T(o),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new Y(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let o,i=0;for(const s of t)i===e.length?e.push(o=new X(this.O(T()),this.O(T()),this,this.options)):o=e[i],o._$AI(s),i++;i<e.length&&(this._$AR(o&&o._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,o,i,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=s,o.length>2||""!==o[0]||""!==o[1]?(this._$AH=Array(o.length-1).fill(new String),this.strings=o):this._$AH=W}_$AI(t,e=this,o,i){const s=this.strings;let n=!1;if(void 0===s)t=J(this,t,e,0),n=!z(t)||t!==this._$AH&&t!==I,n&&(this._$AH=t);else{const i=t;let a,r;for(t=s[0],a=0;a<s.length-1;a++)r=J(this,i[o+a],e,a),r===I&&(r=this._$AH[a]),n||=!z(r)||r!==this._$AH[a],r===W?t=W:t!==W&&(t+=(r??"")+s[a+1]),this._$AH[a]=r}n&&!i&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class ot extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class it extends tt{constructor(t,e,o,i,s){super(t,e,o,i,s),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??W)===I)return;const o=this._$AH,i=t===W&&o!==W||t.capture!==o.capture||t.once!==o.once||t.passive!==o.passive,s=t!==W&&(o===W||i);i&&this.element.removeEventListener(this.name,this,o),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,o){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=o}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=$.litHtmlPolyfillSupport;nt?.(Y,X),($.litHtmlVersions??=[]).push("3.3.3");const at=globalThis;let rt=class extends w{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,o)=>{const i=o?.renderBefore??e;let s=i._$litPart$;if(void 0===s){const t=o?.renderBefore??null;i._$litPart$=s=new X(e.insertBefore(T(),t),t,void 0,o??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return I}};rt._$litElement$=!0,rt.finalized=!0,at.litElementHydrateSupport?.({LitElement:rt});const ct=at.litElementPolyfillSupport;ct?.({LitElement:rt}),(at.litElementVersions??=[]).push("4.2.2");const lt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:v},dt=(t=lt,e,o)=>{const{kind:i,metadata:s}=o;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(o.name,t),"accessor"===i){const{name:i}=o;return{set(o){const s=e.get.call(this);e.set.call(this,o),this.requestUpdate(i,s,t,!0,o)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=o;return function(o){const s=this[i];e.call(this,o),this.requestUpdate(i,s,t,!0,o)}}throw Error("Unsupported decorator location: "+i)};function ht(t){return(e,o)=>"object"==typeof o?dt(t,e,o):((t,e,o)=>{const i=e.hasOwnProperty(o);return e.constructor.createProperty(o,t),i?Object.getOwnPropertyDescriptor(e,o):void 0})(t,e,o)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=1,_t=t=>(...e)=>({_$litDirective$:t,values:e});let mt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,o){this._$Ct=t,this._$AM=e,this._$Ci=o}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const gt=_t(class extends mt{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const o=t.element.classList;for(const t of this.st)t in e||(o.remove(t),this.st.delete(t));for(const t in e){const i=!!e[t];i===this.st.has(t)||this.nt?.has(t)||(i?(o.add(t),this.st.add(t)):(o.remove(t),this.st.delete(t)))}return I}}),ft="important",yt=" !"+ft,bt=_t(class extends mt{constructor(t){if(super(t),t.type!==ut||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,o)=>{const i=t[o];return null==i?e:e+`${o=o.includes("-")?o:o.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(t,[e]){const{style:o}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?o.removeProperty(t):o[t]=null);for(const t in e){const i=e[t];if(null!=i){this.ft.add(t);const e="string"==typeof i&&i.endsWith(yt);t.includes("-")||e?o.setProperty(t,e?i.slice(0,-11):i,e?ft:""):o[t]=i}}return I}});function vt(t=new Date){const e=t=>String(t).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function xt(t,e){const o=Date.parse(`${t.slice(0,10)}T00:00:00Z`),i=Date.parse(`${e.slice(0,10)}T00:00:00Z`);return Number.isNaN(o)||Number.isNaN(i)?null:Math.round((i-o)/864e5)}function wt(t){const e=t.opened_on&&t.days_after_opening?function(t,e){const o=new Date(`${t.slice(0,10)}T00:00:00Z`);return o.setUTCDate(o.getUTCDate()+e),o.toISOString().slice(0,10)}(t.opened_on,t.days_after_opening):null;return e&&(!t.expiry||e<t.expiry.slice(0,10))?{date:e,byOpening:!0}:{date:t.expiry?t.expiry.slice(0,10):null,byOpening:!1}}function $t(t,e,o){const i=t.quantity<=0,s=null!=t.min_quantity&&t.quantity<=t.min_quantity,n=wt(t),a=n.date?xt(e,n.date):null,r=t.opened_on&&!i?xt(t.opened_on,e):null;return{out:i,low:s,days:a,expired:!i&&null!=a&&a<0,soon:!i&&null!=a&&a>=0&&a<=o,onList:!!t.shopping,byOpening:n.byOpening,openedDays:r}}function kt(t){return t.out||t.low}function At(t){return Math.abs(t-Math.round(t))<1e-9?String(Math.round(t)):String(Number(t.toFixed(2)))}function St(t,e){return t.shopping?.amount&&t.shopping.amount>0?t.shopping.amount:e.out||e.low?function(t){return t.restock_quantity?t.restock_quantity:null==t.min_quantity?1:Math.max(1,Math.floor(t.min_quantity-t.quantity)+1)}(t):null}function Et(t){switch(t){case"g":case"ml":return 100;case"kg":case"l":return.5;default:return 1}}const Ct={food:"mdi:food-apple-outline",drinks:"mdi:bottle-soda-classic-outline",frozen:"mdi:snowflake",cleaning:"mdi:spray-bottle",toiletries:"mdi:paper-roll-outline",household:"mdi:home-variant-outline",baby:"mdi:baby-bottle-outline",pets:"mdi:paw-outline",medicine:"mdi:pill",other:"mdi:package-variant-closed"},Ot={pantry:"mdi:cupboard-outline",fridge:"mdi:fridge-outline",freezer:"mdi:snowflake",bathroom:"mdi:shower",cleaning:"mdi:spray-bottle"};function qt(t){return t.icon||t.category&&Ct[t.category]||t.location&&Ot[t.location]||"mdi:package-variant-closed"}const Pt=t=>(t??"").trim().toLocaleLowerCase();function Tt(t,e,o,i,s){return t.filter(t=>{const n=i.get(t.id);if(!function(t,e){const o=Pt(e);return!o||[t.name,t.notes,t.category,t.location,...t.barcodes??[]].some(t=>Pt(t).includes(o))}(t,o))return!1;switch(e.kind){case"low":return kt(n);case"expiring":return n.expired||n.soon;case"list":return n.onList;case"location":return Pt(t.location)===Pt(e.value);case"category":return Pt(t.category)===Pt(e.value);default:return!(s&&n.out&&!o)}})}function zt(t,e,o){if("none"===e)return[{key:"",items:t}];const i=new Map;for(const o of t){const t=("category"===e?o.category:o.location)??"",s=i.get(t);s?s.push(o):i.set(t,[o])}const s=t=>{if(!t)return[2,""];const e=o.indexOf(t);return e>=0?[0,String(e).padStart(3,"0")]:[1,t.toLocaleLowerCase()]};return[...i.entries()].sort(([t],[e])=>{const[o,i]=s(t),[n,a]=s(e);return o-n||i.localeCompare(a)}).map(([t,e])=>({key:t,items:e}))}function Mt(t,e,o){const i=new Set(t.map(t=>t[e]).filter(t=>!!t)),s=o.filter(t=>i.has(t)),n=[...i].filter(t=>!o.includes(t)).sort((t,e)=>t.localeCompare(e));return[...s,...n]}function Dt(t){const e=[];for(const o of String(t??"").split(/[,;\n]+/)){const t=o.replace(/[\s-]/g,"");t&&!e.includes(t)&&e.push(t)}return e}function jt(t){return(t??[]).join(", ")}function Ut(t){return/^\d{6,14}$/.test(t.replace(/[\s-]/g,""))}const Nt={search_or_add:"Search or add…",add_item:"Add item",add_named:"Add “{name}”",new_item:"New item",close:"Close",save:"Save",cancel:"Cancel",delete:"Delete",delete_confirm:"Tap again to delete",add_to_list:"Add to shopping list",remove_from_list:"Remove from list",bought:"Bought",bought_aria:"Bought: add {amount} to the stock",restocked:"{name}: +{amount}",increase:"Add {step}",decrease:"Use {step}",chip_all:"All",chip_low:"Low",chip_expiring:"Expiring",chip_list:"On list",n_items:"{n} items",n_items_one:"1 item",n_low:"{n} low",n_expiring:"{n} expiring",n_on_list:"{n} on the list",all_stocked:"All stocked up",empty:"Nothing here yet",empty_hint:"Add what you keep at home and the card keeps count.",no_match:"No items match",out_of_stock:"Out of stock",low:"Low",expires_today:"Expires today",expires_tomorrow:"Expires tomorrow",expires_in:"Expires in {n} days",expires_on:"Best before {date}",expired_yesterday:"Expired yesterday",expired_ago:"Expired {n} days ago",on_list:"On the shopping list",no_category:"Uncategorised",no_location:"No location",everything:"Everything",f_name:"Name",f_quantity:"Quantity",f_unit:"Unit",f_category:"Category",f_location:"Location",f_expiry:"Best before",f_min_quantity:"Low at",f_restock_quantity:"Buy amount",f_auto_shop:"Add to the shopping list when low",f_notes:"Notes",f_icon:"Icon",h_min_quantity:"At or below this it counts as low",h_restock_quantity:"Empty: just enough to get back above it",not_installed:"The Stock Pulse integration isn't set up yet. Add it in Settings → Devices & services.",not_found:"Inventory “{inventory}” was not found.",failed:"Something went wrong: {error}",scan:"Scan a barcode",scan_hint:"Point the camera at the barcode on the pack.",scan_manual:"Or type the numbers",scan_find:"Find",scan_looking:"Looking it up…",scan_denied:"Camera access was refused. Allow the camera for Home Assistant in the browser or app settings.",scan_no_camera:"The camera couldn't be started: {error}",scan_found:"Found in {source}. Check the details and save.",scan_not_found:"Not found online. Give it a name: the barcode is saved with it, so next time it's recognised.",scan_offline:"Couldn't look it up online. Give it a name: the barcode is saved with it.",scan_known:"Scanned: +{amount}. Save to keep it.",not_a_barcode:"That doesn't look like a barcode.",scan_type_only:"Type the numbers under the barcode below.",opened:"Opened",opened_aria:"Opened: mark it as opened today",opened_toast:"{name}: opened today",opened_today:"Opened today",opened_ago:"Opened {n} days ago",opened_ago_one:"Opened yesterday",open_use_today:"Opened · use today",open_use_tomorrow:"Opened · use by tomorrow",open_use_in:"Opened · use within {n} days",open_use_by:"Opened · use by {date}",f_opened_on:"Opened on",f_days_after_opening:"Keeps after opening (days)",f_barcodes:"Barcodes",h_barcodes:"Scanning one of these finds this item. Separate several with commas.",unit_pcs:"pieces",unit_pcs_one:"piece",unit_pack:"packs",unit_pack_one:"pack",unit_roll:"rolls",unit_roll_one:"roll",unit_bottle:"bottles",unit_bottle_one:"bottle",unit_can:"cans",unit_can_one:"can",unit_box:"boxes",unit_box_one:"box",unit_bag:"bags",unit_bag_one:"bag",unit_jar:"jars",unit_jar_one:"jar",unit_kg:"kg",unit_g:"g",unit_l:"L",unit_ml:"ml",cat_food:"Food",cat_drinks:"Drinks",cat_frozen:"Frozen",cat_cleaning:"Cleaning",cat_toiletries:"Toiletries",cat_household:"Household",cat_baby:"Baby",cat_pets:"Pets",cat_medicine:"Medicine",cat_other:"Other",loc_pantry:"Pantry",loc_fridge:"Fridge",loc_freezer:"Freezer",loc_bathroom:"Bathroom",loc_cleaning:"Cleaning cupboard",loc_other:"Other",ed_inventory:"Inventory",ed_title:"Title",ed_icon:"Icon",ed_group_by:"Group by",ed_sort:"Sort by",group_category:"Category",group_location:"Location",group_none:"Nothing",sort_name:"Name",sort_quantity:"Quantity (lowest first)",sort_expiry:"Best before (soonest first)",ed_locations:"Only show these locations",ed_categories:"Only show these categories",ed_show_search:"Search and quick add",ed_show_filters:"Filter chips",ed_hide_out_of_stock:"Hide items that ran out",ed_compact:"Compact rows",ed_show_scan:"Scan barcodes (needs HTTPS)",ed_max_height:"Maximum list height (e.g. 480px)"},Ht={en:Nt,el:{search_or_add:"Αναζήτηση ή προσθήκη…",add_item:"Προσθήκη είδους",add_named:"Προσθήκη «{name}»",new_item:"Νέο είδος",close:"Κλείσιμο",save:"Αποθήκευση",cancel:"Ακύρωση",delete:"Διαγραφή",delete_confirm:"Πατήστε ξανά για διαγραφή",add_to_list:"Στη λίστα αγορών",remove_from_list:"Αφαίρεση από τη λίστα",bought:"Αγοράστηκε",bought_aria:"Αγοράστηκε: πρόσθεσε {amount} στο απόθεμα",restocked:"{name}: +{amount}",increase:"Πρόσθεσε {step}",decrease:"Αφαίρεσε {step}",chip_all:"Όλα",chip_low:"Τελειώνουν",chip_expiring:"Λήγουν",chip_list:"Στη λίστα",n_items:"{n} είδη",n_items_one:"1 είδος",n_low:"{n} τελειώνουν",n_expiring:"{n} λήγουν",n_on_list:"{n} στη λίστα",all_stocked:"Τίποτα δεν λείπει",empty:"Δεν υπάρχει τίποτα ακόμη",empty_hint:"Προσθέστε ό,τι έχετε στο σπίτι και η κάρτα κρατά λογαριασμό.",no_match:"Κανένα είδος δεν ταιριάζει",out_of_stock:"Τελείωσε",low:"Τελειώνει",expires_today:"Λήγει σήμερα",expires_tomorrow:"Λήγει αύριο",expires_in:"Λήγει σε {n} ημέρες",expires_on:"Ανάλωση έως {date}",expired_yesterday:"Έληξε χθες",expired_ago:"Έληξε πριν {n} ημέρες",on_list:"Στη λίστα αγορών",no_category:"Χωρίς κατηγορία",no_location:"Χωρίς θέση",everything:"Όλα",f_name:"Όνομα",f_quantity:"Ποσότητα",f_unit:"Μονάδα",f_category:"Κατηγορία",f_location:"Θέση",f_expiry:"Ανάλωση έως",f_min_quantity:"Τελειώνει στα",f_restock_quantity:"Ποσότητα αγοράς",f_auto_shop:"Στη λίστα αγορών όταν τελειώνει",f_notes:"Σημειώσεις",f_icon:"Εικονίδιο",h_min_quantity:"Σε αυτή την ποσότητα ή λιγότερο θεωρείται ότι τελειώνει",h_restock_quantity:"Κενό: όσο χρειάζεται για να ξεπεράσει το όριο",not_installed:"Η ενσωμάτωση Stock Pulse δεν έχει ρυθμιστεί. Προσθέστε τη στις Ρυθμίσεις → Συσκευές & υπηρεσίες.",not_found:"Δεν βρέθηκε το απόθεμα «{inventory}».",failed:"Κάτι πήγε στραβά: {error}",scan:"Σάρωση barcode",scan_hint:"Στρέψε την κάμερα στο barcode της συσκευασίας.",scan_manual:"Ή γράψε τους αριθμούς",scan_find:"Εύρεση",scan_looking:"Αναζήτηση…",scan_denied:"Δεν επιτράπηκε η πρόσβαση στην κάμερα. Επίτρεψέ τη για το Home Assistant στις ρυθμίσεις του browser ή της εφαρμογής.",scan_no_camera:"Η κάμερα δεν ξεκίνησε: {error}",scan_found:"Βρέθηκε στο {source}. Έλεγξε τα στοιχεία και αποθήκευσε.",scan_not_found:"Δεν βρέθηκε online. Δώσε του όνομα: το barcode αποθηκεύεται μαζί του, ώστε την επόμενη φορά να αναγνωριστεί.",scan_offline:"Δεν έγινε αναζήτηση online. Δώσε του όνομα: το barcode αποθηκεύεται μαζί του.",scan_known:"Σαρώθηκε: +{amount}. Αποθήκευσε για να μείνει.",not_a_barcode:"Αυτό δεν μοιάζει με barcode.",scan_type_only:"Γράψε παρακάτω τους αριθμούς κάτω από το barcode.",opened:"Άνοιξε",opened_aria:"Άνοιξε: σημείωσε ότι άνοιξε σήμερα",opened_toast:"{name}: άνοιξε σήμερα",opened_today:"Άνοιξε σήμερα",opened_ago:"Άνοιξε πριν από {n} μέρες",opened_ago_one:"Άνοιξε χθες",open_use_today:"Ανοιχτό · κατανάλωση σήμερα",open_use_tomorrow:"Ανοιχτό · κατανάλωση ως αύριο",open_use_in:"Ανοιχτό · κατανάλωση σε {n} μέρες",open_use_by:"Ανοιχτό · κατανάλωση ως {date}",f_opened_on:"Άνοιξε στις",f_days_after_opening:"Διατηρείται ανοιχτό (μέρες)",f_barcodes:"Barcodes",h_barcodes:"Η σάρωση ενός από αυτά βρίσκει αυτό το είδος. Χώρισε πολλά με κόμμα.",unit_pcs:"τεμάχια",unit_pcs_one:"τεμάχιο",unit_pack:"πακέτα",unit_pack_one:"πακέτο",unit_roll:"ρολά",unit_roll_one:"ρολό",unit_bottle:"μπουκάλια",unit_bottle_one:"μπουκάλι",unit_can:"κουτάκια",unit_can_one:"κουτάκι",unit_box:"κουτιά",unit_box_one:"κουτί",unit_bag:"σακούλες",unit_bag_one:"σακούλα",unit_jar:"βάζα",unit_jar_one:"βάζο",unit_kg:"kg",unit_g:"g",unit_l:"L",unit_ml:"ml",cat_food:"Τρόφιμα",cat_drinks:"Ποτά",cat_frozen:"Κατεψυγμένα",cat_cleaning:"Καθαριστικά",cat_toiletries:"Είδη υγιεινής",cat_household:"Οικιακά",cat_baby:"Μωρό",cat_pets:"Κατοικίδια",cat_medicine:"Φάρμακα",cat_other:"Άλλο",loc_pantry:"Ντουλάπι",loc_fridge:"Ψυγείο",loc_freezer:"Καταψύκτης",loc_bathroom:"Μπάνιο",loc_cleaning:"Ντουλάπι καθαριστικών",loc_other:"Άλλο",ed_inventory:"Απόθεμα",ed_title:"Τίτλος",ed_icon:"Εικονίδιο",ed_group_by:"Ομαδοποίηση",ed_sort:"Ταξινόμηση",group_category:"Κατηγορία",group_location:"Θέση",group_none:"Καμία",sort_name:"Όνομα",sort_quantity:"Ποσότητα (λιγότερα πρώτα)",sort_expiry:"Ανάλωση (πλησιέστερη πρώτα)",ed_locations:"Μόνο αυτές οι θέσεις",ed_categories:"Μόνο αυτές οι κατηγορίες",ed_show_search:"Αναζήτηση και γρήγορη προσθήκη",ed_show_filters:"Φίλτρα",ed_hide_out_of_stock:"Απόκρυψη ειδών που τελείωσαν",ed_compact:"Συμπαγείς γραμμές",ed_show_scan:"Σάρωση barcode (θέλει HTTPS)",ed_max_height:"Μέγιστο ύψος λίστας (π.χ. 480px)"}};function Lt(t,e,o){const i=Ht[function(t){return(t?.locale?.language||t?.language||"en").split("-")[0]}(t)]??Nt,s=o?.n,n=1===s||"1"===s?`${e}_one`:void 0;let a=n&&(i[n]??Nt[n])||i[e]||Nt[e]||e;if(o)for(const[t,e]of Object.entries(o))a=a.replaceAll(`{${t}}`,String(e));return a}function Rt(t,e,o,i=2){if(!o)return"";const s=`${e}_${o}`;return s in Nt?Lt(t,s,"unit"===e?{n:i}:void 0):o}function Bt(t,e,o){if(!o)return;const i=Rt(t,e,o);return"unit"===e&&`${e}_${o}`in Nt&&i.length>2&&i===i.toLocaleLowerCase()?i.charAt(0).toLocaleUpperCase()+i.slice(1):i}function Ft(t,e,o,i){const s=(o??"").trim();if(!s)return null;const n=s.toLocaleLowerCase();for(const o of i){const i=[o,Rt(t,e,o),Rt(void 0,e,o)];if("unit"===e&&i.push(Rt(t,e,o,1),Rt(void 0,e,o,1)),i.some(t=>t.toLocaleLowerCase()===n))return o}return s}async function It(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const t=await(window.loadCardHelpers?.()),e=await(t?.createCardElement({type:"entities",entities:[]}));await(e?.constructor?.getConfigElement?.())}catch{}}function Wt(t,e,o){t.dispatchEvent(new CustomEvent(e,{detail:o,bubbles:!0,composed:!0}))}function Vt(t,e){Wt(t,"hass-notification",{message:e})}function Kt(t){return String(t&&"object"==typeof t&&"message"in t?t.message:t)}const Zt=a`
  :host {
    /* Colour is reserved for what needs attention (low, out, expiring); everything else stays neutral.
       Every variable reads the shared Pulse token first (set by the Pulse theme), then Home Assistant's
       own variable, then the value this card always used. Without the Pulse theme nothing changes. */
    --sp-accent: var(--pulse-accent, var(--primary-color));
    --sp-on-accent: var(--pulse-on-accent, var(--text-primary-color, #fff));
    --sp-warn: var(--pulse-warn, var(--orange-color, #ff9800));
    --sp-bad: var(--pulse-bad, var(--red-color, #f44336));
    --sp-neutral-bg: var(--pulse-surface-neutral, color-mix(in srgb, var(--primary-text-color) 6%, transparent));
    --sp-neutral-bg-hover: var(--pulse-surface-neutral-hover, color-mix(in srgb, var(--primary-text-color) 10%, transparent));
    /* The selected chip: a stronger neutral step, like Area Pulse's active action and Home Pulse's current mode. */
    --sp-neutral-bg-strong: var(--pulse-surface-neutral-strong, color-mix(in srgb, var(--primary-text-color) 14%, transparent));
    --sp-radius: var(--pulse-radius, var(--ha-card-border-radius, 12px));
    --sp-control-radius: var(--pulse-control-radius, var(--ha-card-features-border-radius, var(--feature-border-radius, 12px)));
    --sp-chip-height: var(--pulse-chip-height, 30px);
    --sp-row-height: var(--pulse-row-height, 56px);
    --sp-gap: var(--pulse-gap, 12px);
    --sp-pad: var(--pulse-pad, 12px);
    /* Motion: the theme's rhythm, else the durations the card always used. */
    --sp-motion-fast: var(--pulse-motion-fast, 120ms);
    --sp-motion-normal: var(--pulse-motion-normal, 150ms);
    --sp-ease: var(--pulse-ease, ease);
    display: block;
    height: 100%;
  }
  :host([compact]) {
    --sp-row-height: 44px;
  }
  @media (prefers-reduced-motion: reduce) {
    :host {
      --sp-motion-fast: 0ms;
      --sp-motion-normal: 0ms;
    }
  }

  ha-card {
    height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--sp-gap);
    padding: var(--sp-pad);
    min-height: 0;
    flex: 1;
  }

  button {
    font: inherit;
    color: inherit;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  button:focus-visible {
    outline: 2px solid var(--sp-accent);
    outline-offset: 2px;
  }

  /* Header */
  .header {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }
  .badge {
    flex: none;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 24px;
  }
  .titles {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .title {
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .secondary {
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  /* Like Area Pulse's readings: coloured only when something is out of range. */
  .secondary .warn { color: var(--sp-warn); }
  .secondary .bad { color: var(--sp-bad); }
  .dot { margin: 0 4px; opacity: 0.6; }
  .round {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    transition: background-color var(--sp-motion-normal) var(--sp-ease), transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 22px;
  }
  .round:hover { background: var(--sp-neutral-bg-hover); }
  .round:active { transform: scale(0.94); }

  /* Search / quick add */
  .search {
    position: relative;
    display: flex;
    align-items: center;
  }
  .search > ha-icon {
    position: absolute;
    left: 12px;
    color: var(--secondary-text-color);
    pointer-events: none;
    --mdc-icon-size: 20px;
  }
  .search input {
    width: 100%;
    height: 40px;
    box-sizing: border-box;
    padding: 0 40px 0 40px;
    border: none;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 14px;
    outline: none;
  }
  .search input::-webkit-search-cancel-button { display: none; }
  .search input::placeholder { color: var(--secondary-text-color); }
  .search input:focus { box-shadow: inset 0 0 0 2px var(--sp-accent); }
  .search .clear {
    position: absolute;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    --mdc-icon-size: 18px;
  }

  /* Filter chips */
  .chips {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    margin: 0 calc(-1 * var(--sp-pad));
    padding: 0 var(--sp-pad);
  }
  .chips::-webkit-scrollbar { display: none; }
  /* Scrollers fade at the edge that has more, so a cut-off chip or row reads as "scroll", not as a bug. */
  .chips.more-end {
    -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
    mask-image: linear-gradient(to right, #000 calc(100% - 40px), transparent);
  }
  .chips.more-start {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 40px);
    mask-image: linear-gradient(to right, transparent, #000 40px);
  }
  .chips.more-start.more-end {
    -webkit-mask-image: linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent);
    mask-image: linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent);
  }
  .chip {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--sp-chip-height);
    padding: 0 12px;
    border-radius: calc(var(--sp-chip-height) / 2);
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 12px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--sp-motion-normal) var(--sp-ease), color var(--sp-motion-normal) var(--sp-ease),
      transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 16px;
  }
  .chip:hover { background: var(--sp-neutral-bg-hover); }
  .chip:active { transform: scale(0.96); }
  /* Selected: no accent wash, just the family's stronger neutral step and full-strength text. */
  .chip.selected,
  .chip.selected:hover {
    background: var(--sp-neutral-bg-strong);
    color: var(--primary-text-color);
  }
  .chip .count {
    font-variant-numeric: tabular-nums;
    font-weight: 400;
    opacity: 0.8;
  }

  /* List */
  .list {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow-y: auto;
    margin: 0 -4px;
    padding: 0 4px;
  }
  .list.more-end {
    -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to bottom, #000 calc(100% - 32px), transparent);
  }
  .list.more-start {
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 24px);
    mask-image: linear-gradient(to bottom, transparent, #000 24px);
  }
  .list.more-start.more-end {
    -webkit-mask-image: linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 32px), transparent);
    mask-image: linear-gradient(to bottom, transparent, #000 24px, #000 calc(100% - 32px), transparent);
  }
  .group-head {
    display: flex;
    align-items: baseline;
    gap: 6px;
    padding: 12px 4px 4px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
  }
  .group-head:first-child { padding-top: 0; }
  .group-head .n { font-weight: 400; opacity: 0.8; }

  .row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: var(--sp-row-height);
    border-radius: var(--sp-control-radius);
  }
  .row + .row { border-top: 1px solid color-mix(in srgb, var(--divider-color) 60%, transparent); }
  .row .main {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 12px;
    align-self: stretch;
    padding: 4px;
    text-align: left;
    border-radius: var(--sp-control-radius);
  }
  .row .main:hover { background: var(--sp-neutral-bg); }
  .ricon {
    flex: none;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    --mdc-icon-size: 20px;
  }
  :host([compact]) .ricon { width: 30px; height: 30px; --mdc-icon-size: 18px; }
  /* Same rule as Area Pulse's chips: the disc stays neutral, only the icon carries the meaning. */
  .ricon.warn { color: var(--sp-warn); }
  .ricon.bad { color: var(--sp-bad); }
  .text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .rname {
    font-size: 14px;
    line-height: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row.out .rname { color: var(--secondary-text-color); }
  /* One line of facts. Parts wrap onto a hidden second line instead of being cut to "Fr…",
     so a fact is either shown whole or not at all. Only the first may be shortened. */
  .meta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    height: 16px;
    min-width: 0;
    overflow: hidden;
    font-size: 12px;
    line-height: 16px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 14px;
  }
  .meta .part { white-space: nowrap; flex: none; }
  .meta .part:first-of-type {
    flex: 0 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .meta .warn { color: var(--sp-warn); }
  .meta .bad { color: var(--sp-bad); }
  .meta .cart { flex: none; margin-right: 4px; height: 16px; align-items: center; }
  :host([compact]) .meta { display: none; }
  :host([compact]) .meta.important { display: flex; }

  .stepper {
    flex: none;
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .step {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--secondary-text-color);
    transition: background-color var(--sp-motion-normal) var(--sp-ease), color var(--sp-motion-normal) var(--sp-ease),
      transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 20px;
  }
  .step:hover { background: var(--sp-neutral-bg); color: var(--primary-text-color); }
  .step:active { transform: scale(0.9); }
  .step[disabled] { opacity: 0.3; cursor: default; background: none; transform: none; }
  .qty {
    /* Fixed, so the +/- buttons line up down the list whatever the unit's length. */
    width: 58px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.1;
    font-variant-numeric: tabular-nums;
  }
  .qty b { font-size: 15px; font-weight: 500; color: var(--primary-text-color); }
  .qty small { font-size: 11px; color: var(--secondary-text-color); max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .row.out .qty b { color: var(--secondary-text-color); }

  .add-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: var(--sp-row-height);
    padding: 4px;
    border-radius: var(--sp-control-radius);
    color: var(--primary-text-color);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
  .add-row:hover { background: var(--sp-neutral-bg); }
  /* An action, like Home Pulse's fixes: neutral, with the accent on the icon. */
  .add-row .ricon { color: var(--sp-accent); }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 20px 12px;
    text-align: center;
    color: var(--secondary-text-color);
    font-size: 13px;
    --mdc-icon-size: 32px;
  }
  .empty .big { font-size: 15px; color: var(--primary-text-color); font-weight: 500; }
  .empty ha-icon { opacity: 0.5; margin-bottom: 4px; }
  .notice {
    padding: 12px;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--secondary-text-color);
    font-size: 13px;
  }
`,Gt=a`
  dialog.sp-dialog {
    padding: 0;
    border: none;
    background: transparent;
    width: min(520px, calc(100vw - 32px));
    max-width: none;
    max-height: min(88vh, 820px);
    color: var(--primary-text-color);
    overflow: visible;
  }
  dialog.sp-dialog::backdrop {
    background: rgba(0, 0, 0, 0.45);
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
  }
  dialog.sp-dialog[open] .surface { animation: sp-pop var(--pulse-motion-normal, 200ms) cubic-bezier(0.2, 0.9, 0.3, 1.1); }
  @keyframes sp-pop {
    from { opacity: 0; transform: translateY(12px) scale(0.98); }
  }
  .surface {
    display: flex;
    flex-direction: column;
    max-height: min(88vh, 820px);
    box-sizing: border-box;
    border-radius: var(--ha-dialog-border-radius, 28px);
    background: var(--ha-dialog-surface-background, var(--mdc-theme-surface, var(--card-background-color, #fff)));
    /* Frosted like HA's own dialogs when the theme asks for it (Pulse Glass); nothing otherwise. */
    -webkit-backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    backdrop-filter: var(--ha-dialog-surface-backdrop-filter, none);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  .d-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 16px 8px 20px;
  }
  .d-head .badge { width: 40px; height: 40px; --mdc-icon-size: 22px; }
  .d-title {
    flex: 1;
    min-width: 0;
    font-size: 20px;
    line-height: 26px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .d-body {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    padding: 8px 20px 12px;
  }
  .d-status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }
  /* Family chips: neutral fill and text, the icon carries the colour. */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: var(--sp-chip-height);
    padding: 0 12px 0 9px;
    box-sizing: border-box;
    border-radius: calc(var(--sp-chip-height) / 2);
    background: var(--sp-neutral-bg);
    font-size: 12px;
    font-weight: 500;
    color: var(--primary-text-color);
    --mdc-icon-size: 16px;
  }
  .pill ha-icon { color: var(--secondary-text-color); }
  .pill.warn ha-icon { color: var(--sp-warn); }
  .pill.bad ha-icon { color: var(--sp-bad); }
  /* "Bought": the one-tap restock. Neutral like the pills, accent icon, pushed to the end of the row. */
  .bought {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 36px;
    padding: 0 14px 0 11px;
    border-radius: var(--sp-control-radius);
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color var(--sp-motion-normal) var(--sp-ease), transform var(--sp-motion-fast) var(--sp-ease);
    --mdc-icon-size: 18px;
  }
  .bought ha-icon { color: var(--sp-accent); }
  .bought:hover { background: var(--sp-neutral-bg-hover); }
  .bought:active { transform: scale(0.96); }
  .bought .amount { color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
  .bought[disabled] { opacity: 0.5; cursor: default; transform: none; }
  /* Opened and Bought side by side: one pushes to the end, the other sits next to it. */
  .bought + .bought { margin-left: 0; }
  /* Scanner: the camera in a calm frame, with a guide where the barcode goes. */
  .scan-view {
    position: relative;
    aspect-ratio: 4 / 3;
    border-radius: var(--sp-control-radius, 12px);
    overflow: hidden;
    background: #000;
  }
  .scan-view video { width: 100%; height: 100%; object-fit: cover; display: block; }
  .scan-view .guide {
    position: absolute;
    inset: 32% 10%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 0 0 100vmax rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }
  .scan-view .state {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 16px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    background: rgba(0, 0, 0, 0.55);
    --mdc-icon-size: 20px;
  }
  .scan-hint { margin: 12px 2px 0; font-size: 13px; color: var(--secondary-text-color); }
  .scan-manual { display: flex; gap: 8px; margin-top: 12px; }
  .scan-manual input {
    flex: 1;
    min-width: 0;
    height: 40px;
    padding: 0 14px;
    box-sizing: border-box;
    border: none;
    border-radius: 20px;
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font: inherit;
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }
  .scan-manual input:focus-visible { outline: 2px solid var(--sp-accent); outline-offset: 0; }
  .d-note { margin: -4px 2px 16px; font-size: 13px; line-height: 18px; color: var(--secondary-text-color); }
  .d-head .badge img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
  .d-error {
    margin-top: 8px;
    color: var(--error-color, var(--sp-bad));
    font-size: 13px;
  }
  .d-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px calc(16px + env(safe-area-inset-bottom));
    border-top: 1px solid var(--divider-color);
    flex-wrap: wrap;
  }
  .d-foot .spacer { flex: 1; }
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 40px;
    padding: 0 16px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--sp-accent);
    --mdc-icon-size: 18px;
    transition: background-color var(--sp-motion-normal) var(--sp-ease);
  }
  .btn:hover { background: color-mix(in srgb, var(--sp-accent) 10%, transparent); }
  .btn.filled { background: var(--sp-accent); color: var(--sp-on-accent); }
  .btn.filled:hover { background: color-mix(in srgb, var(--sp-accent) 88%, black); }
  .btn.danger { color: var(--sp-bad); }
  .btn.danger:hover, .btn.danger.armed { background: color-mix(in srgb, var(--sp-bad) 12%, transparent); }
  .btn[disabled] { opacity: 0.5; cursor: default; }

  @media (max-width: 600px) {
    dialog.sp-dialog {
      width: 100vw;
      max-height: 92vh;
      margin: auto 0 0 0;
    }
    .surface {
      max-height: 92vh;
      border-radius: var(--ha-dialog-border-radius, 28px) var(--ha-dialog-border-radius, 28px) 0 0;
    }
    .d-foot { flex-wrap: nowrap; }
    .d-foot .btn { padding: 0 12px; }
    /* Phones: secondary actions become icons; the close button replaces Cancel. */
    .d-foot .btn .lbl, .d-foot .btn.cancel { display: none; }
    .d-foot .btn:has(.lbl) { width: 40px; padding: 0; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog.sp-dialog[open] .surface { animation: none; }
  }
`;function Yt(t,e){const o=()=>{customElements.get(t)||customElements.define(t,e)};return document.querySelector("home-assistant")&&!customElements.get("home-assistant")?customElements.whenDefined("home-assistant").then(o):(o(),Promise.resolve())}const Jt=["pantry","fridge","freezer","bathroom","cleaning","other"],Qt=["food","drinks","frozen","cleaning","toiletries","household","baby","pets","medicine","other"],Xt={group_by:"category",sort:"name",show_search:!0,show_filters:!0,show_scan:!0,hide_out_of_stock:!1,compact:!1};class te extends rt{constructor(){super(...arguments),this._ready=!1,this._inventories=[],this._t=t=>Lt(this.hass,t)}connectedCallback(){super.connectedCallback(),It().then(()=>this._ready=!0)}setConfig(t){this._config=t}firstUpdated(){this.hass?.callWS({type:"stock_pulse/inventories"}).then(t=>this._inventories=t).catch(()=>{})}_schema(){const t=this._t,e=(t,e)=>t.map(t=>({value:t,label:Rt(this.hass,e,t)}));return[...this._inventories.length>1?[{name:"inventory",selector:{select:{mode:"dropdown",options:this._inventories.map(t=>({value:t.entry_id,label:t.title}))}}}]:[],{type:"grid",name:"",schema:[{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"group_by",selector:{select:{mode:"dropdown",options:["category","location","none"].map(e=>({value:e,label:t(`group_${e}`)}))}}},{name:"sort",selector:{select:{mode:"dropdown",options:["name","quantity","expiry"].map(e=>({value:e,label:t(`sort_${e}`)}))}}}]},{name:"locations",selector:{select:{multiple:!0,custom_value:!0,mode:"dropdown",options:e(Jt,"loc")}}},{name:"categories",selector:{select:{multiple:!0,custom_value:!0,mode:"dropdown",options:e(Qt,"cat")}}},{type:"grid",name:"",schema:[{name:"show_search",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}},{name:"show_scan",selector:{boolean:{}}},{name:"hide_out_of_stock",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}]},{name:"max_height",selector:{text:{}}}]}render(){if(!this.hass||!this._config||!this._ready)return W;const t={...Xt,...this._config};return F`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${t=>this._t(`ed_${t.name}`)}
        @value-changed=${this._changed}
      ></ha-form>
    `}_changed(t){t.stopPropagation();const e=t.detail.value,o={...this._config},i=this._schema().flatMap(t=>(t.schema??[t]).map(t=>t.name));for(const t of i)t in e||delete o[t];for(const[t,i]of Object.entries(e)){null==i||""===i||Array.isArray(i)&&0===i.length||Xt[t]===i?delete o[t]:o[t]=i}Wt(this,"config-changed",{config:o})}}t([ht({attribute:!1})],te.prototype,"hass",void 0),t([pt()],te.prototype,"_config",void 0),t([pt()],te.prototype,"_ready",void 0),t([pt()],te.prototype,"_inventories",void 0),Yt("stock-pulse-card-editor",te);const ee="1.3.0",oe="stock_pulse",ie=["category","location","none"],se=["name","quantity","expiry"],ne=["ean_13","ean_8","upc_a","upc_e"],ae={openfoodfacts:"Open Food Facts",openbeautyfacts:"Open Beauty Facts",openproductsfacts:"Open Products Facts"};function re(t){const e=t?.auth?.external;return e?.config?.hasBarCodeScanner&&"function"==typeof e.fireMessage&&"function"==typeof e._commandHandler?e:void 0}function ce(){return"undefined"!=typeof window&&window.isSecureContext&&"BarcodeDetector"in window&&!!navigator.mediaDevices?.getUserMedia}const le=["name","quantity","unit","category","location","expiry","min_quantity","restock_quantity","auto_shop","notes","icon","barcodes","opened_on","days_after_opening"];class de extends rt{constructor(){super(...arguments),this.compact=!1,this._query="",this._filter={kind:"all"},this._today=vt(),this._resize=new ResizeObserver(()=>{for(const t of this.renderRoot.querySelectorAll(".chips, .list"))this._markEdges(t)}),this._onScroll=t=>this._markEdges(t.currentTarget),this._t=(t,e)=>Lt(this.hass,t,e),this._onSearchKey=t=>{if("Escape"===t.key)return void(this._query="");if("Enter"!==t.key||!this._query.trim()||!this._snap)return;if(t.preventDefault(),Ut(this._query.trim())){const t=this._query.trim();return this._query="",void this._onScanned(t)}const e=Pt(this._query),o=this._snap.items.find(t=>Pt(t.name)===e);o?this._openEdit(o):this._openAdd(this._query.trim())},this._onFormChanged=t=>{t.stopPropagation(),this._dialog&&(this._dialog={...this._dialog,data:{...t.detail.value},armed:!1,error:void 0})},this._onBackdrop=t=>{t.target===t.currentTarget&&this._closeDialog()},this._closeDialog=()=>{this.renderRoot.querySelector("dialog.sp-dialog")?.close()},this._onDialogClosed=()=>{this._dialog=void 0},this._onSave=async()=>{const t=this._dialog;if(!t||t.busy)return;const e=this._fromForm(t.data);this._dialog={...t,busy:!0,error:void 0};try{if("add"===t.mode){const t=Object.fromEntries(Object.entries(e).filter(([,t])=>null!=t&&""!==t));await this._call({type:`${oe}/item/add`,item:t}),this._query=""}else{const{barcodes:o,...i}=e,s=function(t,e){const o={};for(const[i,s]of Object.entries(e)){const e=""===s||void 0===s?null:s;e!==(t[i]??null)&&(o[i]=e)}return o}({...t.original,barcodes:void 0},i);jt(o)!==jt(t.original.barcodes)&&(s.barcodes=o),Object.keys(s).length&&await this._call({type:`${oe}/item/update`,item_id:t.id,changes:s})}this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Kt(t)})}},this._onDelete=async()=>{const t=this._dialog;if(t?.id&&!t.busy)if(t.armed){this._dialog={...t,busy:!0};try{await this._call({type:`${oe}/item/remove`,item_id:t.id}),this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,armed:!1,error:Kt(t)})}}else this._dialog={...t,armed:!0}},this._onScanButton=()=>{const t=re(this.hass);t?this._openNativeScan(t):this._openScan()},this._openScan=async(t=!1)=>{if(this._scan={phase:"camera",manual:""},t||!ce())return void(this._scan={phase:"error",manual:"",manualOnly:!0});await this.updateComplete;const e=this.renderRoot.querySelector(".scan-view video");if(e)try{const t=window.BarcodeDetector,o=await t.getSupportedFormats(),i=ne.filter(t=>o.includes(t)),s=new t({formats:i.length?i:ne});if(this._stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"environment"}},audio:!1}),!this._scan)return this._stopCamera();e.srcObject=this._stream,await e.play();const n=async()=>{if(this._scan&&"camera"===this._scan.phase){try{const t=(await s.detect(e)).find(t=>Ut(t.rawValue));if(t)return void this._onScanned(t.rawValue)}catch{}this._scanTimer=window.setTimeout(n,200)}};n()}catch(t){this._stopCamera();const e=t instanceof DOMException&&("NotAllowedError"===t.name||"SecurityError"===t.name);this._scan&&(this._scan={...this._scan,phase:"error",error:e?this._t("scan_denied"):this._t("scan_no_camera",{error:Kt(t)})})}},this._onScanClosed=()=>{this._stopCamera(),this._scan=void 0},this._onManualScan=t=>{t.preventDefault();const e=this._scan?.manual.trim()??"";Ut(e)?this._onScanned(e):this._scan&&(this._scan={...this._scan,manualError:this._t("not_a_barcode")})}}static getConfigElement(){return document.createElement("stock-pulse-card-editor")}static getStubConfig(){return{}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.group_by&&!ie.includes(t.group_by))throw new Error(`group_by must be one of ${ie.join(", ")}`);if(t.sort&&!se.includes(t.sort))throw new Error(`sort must be one of ${se.join(", ")}`);for(const e of["locations","categories"])if(void 0!==t[e]&&!Array.isArray(t[e]))throw new Error(`${e} must be a list`);const e=this._config&&(this._config.inventory??"")!==(t.inventory??"");this._config=t,this.compact=!!t.compact,e&&this._resubscribe()}getCardSize(){const t=this._view?.shown??3;return 2+Math.ceil(Math.min(t,12)/1.5)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resize.observe(this),this.hass&&this._config&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect(),this._stopCamera(),this._unsubscribe()}willUpdate(t){t.has("hass")&&this.hass&&this._config&&!this._unsub&&this._subscribe();const e=vt();(!this._view||e!==this._today||t.has("_snap")||t.has("_config")||t.has("_query")||t.has("_filter"))&&(this._today=e,this._view=this._buildView())}shouldUpdate(t){if(1===t.size&&t.has("hass")){const e=t.get("hass");return!e||e.language!==this.hass?.language||!this._snap}return!0}updated(){for(const t of this.renderRoot.querySelectorAll(".chips, .list"))this._markEdges(t);const t=this.renderRoot.querySelector("dialog.sp-dialog");if(t&&!t.open)try{t.showModal()}catch{t.setAttribute("open","")}}_markEdges(t){const e=t.classList.contains("chips"),o=e?t.scrollLeft:t.scrollTop,i=e?t.clientWidth:t.clientHeight,s=e?t.scrollWidth:t.scrollHeight;t.classList.toggle("more-start",o>1),t.classList.toggle("more-end",o+i<s-1)}_subscribe(){if(!this.hass||!this._config||this._unsub||!this.isConnected)return;const t=this._config.inventory||void 0;this._subscribedTo=t??"",this._unsub=this.hass.connection.subscribeMessage(t=>{this._snap=t,this._error=void 0},{type:`${oe}/subscribe`,...t?{inventory:t}:{}}).catch(e=>{const o=function(t){if(t&&"object"==typeof t&&"code"in t)return String(t.code)}(e);return this._error="unknown_command"===o?Lt(this.hass,"not_installed"):"not_found"===o&&t?Lt(this.hass,"not_found",{inventory:t}):Kt(e),this._unsub=void 0,window.clearTimeout(this._retry),this._retry=window.setTimeout(()=>this._subscribe(),3e4),()=>{}})}_unsubscribe(){window.clearTimeout(this._retry);const t=this._unsub;this._unsub=void 0,t?.then(t=>t()).catch(()=>{})}_resubscribe(){this._unsubscribe(),this._snap=void 0,this._subscribe()}_buildView(){const t=this._snap,e=this._config,o=new Map;if(!t)return{statuses:o,inScope:[],groups:[],shown:0,counts:{items:0,low:0,expiring:0,list:0},locations:[],exact:!1};const i=t.settings.expiring_days;for(const e of t.items)o.set(e.id,$t(e,this._today,i));const s=function(t,e){const o=(e.locations??[]).map(Pt),i=(e.categories??[]).map(Pt);return t.filter(t=>(!o.length||o.includes(Pt(t.location)))&&(!i.length||i.includes(Pt(t.category))))}(t.items,e),n={items:0,low:0,expiring:0,list:0};for(const t of s){const e=o.get(t.id);n.items++,kt(e)&&n.low++,(e.expired||e.soon)&&n.expiring++,e.onList&&n.list++}const a=function(t,e,o){const i=(t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}),s=[...t];if("quantity"===e)s.sort((t,e)=>t.quantity-e.quantity||i(t,e));else if("expiry"===e){const t=t=>o.get(t.id)?.days??Number.POSITIVE_INFINITY;s.sort((e,o)=>t(e)-t(o)||i(e,o))}else s.sort(i);return s}(Tt(s,this._filter,this._query,o,!!e.hide_out_of_stock),e.sort??"name",o),r=e.group_by??"category",c="location"===r?t.locations:t.categories,l=Pt(this._query);return{statuses:o,inScope:s,groups:zt(a,r,c),shown:a.length,counts:n,locations:Mt(s,"location",t.locations),exact:!!l&&t.items.some(t=>Pt(t.name)===l)}}render(){if(!this._config)return W;const t=this._config,e=this._view,o=this._snap,i=t.title??o?.title??"Stock",s=t.max_height;return F`
      <ha-card>
        <div class="content">
          <div class="header">
            <div class="badge"><ha-icon .icon=${t.icon||"mdi:package-variant-closed"}></ha-icon></div>
            <div class="titles">
              <div class="title">${i}</div>
              ${o?F`<div class="secondary">${this._summary(e)}</div>`:W}
            </div>
            ${o&&!1!==t.show_scan&&(re(this.hass)||ce())?F`<button class="round" title=${this._t("scan")} aria-label=${this._t("scan")} @click=${this._onScanButton}>
                  <ha-icon icon="mdi:barcode-scan"></ha-icon>
                </button>`:W}
            ${o?F`<button class="round" title=${this._t("add_item")} aria-label=${this._t("add_item")} @click=${()=>this._openAdd("")}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>`:W}
          </div>
          ${this._error?F`<div class="notice">${this._error}</div>`:o?F`
                  ${!1!==t.show_search?this._renderSearch():W}
                  ${!1!==t.show_filters?this._renderChips(e,o):W}
                  <div class="list" style=${bt(s?{maxHeight:s}:{})} @scroll=${this._onScroll}>${this._renderList(e,o)}</div>
                `:W}
        </div>
        ${this._dialog&&o?this._renderDialog(this._dialog,o):this._scan&&o?this._renderScan(this._scan):W}
      </ha-card>
    `}_summary(t){const e=[F`<span>${this._t("n_items",{n:t.counts.items})}</span>`];return t.counts.low&&e.push(F`<span class="warn">${this._t("n_low",{n:t.counts.low})}</span>`),t.counts.expiring&&e.push(F`<span class="warn">${this._t("n_expiring",{n:t.counts.expiring})}</span>`),!t.counts.items||t.counts.low||t.counts.expiring||e.push(F`<span>${this._t("all_stocked")}</span>`),F`${e.map((t,e)=>F`${e?F`<span class="dot">·</span>`:W}${t}`)}`}_renderSearch(){return F`
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input
          type="search"
          enterkeyhint="done"
          autocomplete="off"
          .value=${this._query}
          placeholder=${this._t("search_or_add")}
          aria-label=${this._t("search_or_add")}
          @input=${t=>this._query=t.target.value}
          @keydown=${this._onSearchKey}
        />
        ${this._query?F`<button class="clear" aria-label=${this._t("close")} @click=${()=>this._query=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`:W}
      </div>
    `}_renderChips(t,e){const o=[{filter:{kind:"all"},label:this._t("chip_all")}];if((t.counts.low||"low"===this._filter.kind)&&o.push({filter:{kind:"low"},label:this._t("chip_low"),count:t.counts.low}),(t.counts.expiring||"expiring"===this._filter.kind)&&o.push({filter:{kind:"expiring"},label:this._t("chip_expiring"),count:t.counts.expiring}),e.settings.shopping_list&&(t.counts.list||"list"===this._filter.kind)&&o.push({filter:{kind:"list"},label:this._t("chip_list"),count:t.counts.list,icon:"mdi:cart-outline"}),t.locations.length>1)for(const e of t.locations)o.push({filter:{kind:"location",value:e},label:Rt(this.hass,"loc",e)});if(o.length<2)return W;const i=(t,e)=>t.kind===e.kind&&(!("value"in t)||"value"in e&&t.value===e.value);return F`
      <div class="chips" role="toolbar" @scroll=${this._onScroll}>
        ${o.map(t=>F`
            <button
              class=${gt({chip:!0,selected:i(t.filter,this._filter)})}
              aria-pressed=${i(t.filter,this._filter)?"true":"false"}
              @click=${()=>this._filter=i(t.filter,this._filter)?{kind:"all"}:t.filter}
            >
              ${t.icon?F`<ha-icon .icon=${t.icon}></ha-icon>`:W}${t.label}
              ${null!=t.count?F`<span class="count">${t.count}</span>`:W}
            </button>
          `)}
      </div>
    `}_renderList(t,e){const o=this._query.trim(),i=o&&!t.exact?F`<button class="add-row" @click=${()=>this._openAdd(o)}>
            <span class="ricon"><ha-icon icon="mdi:plus"></ha-icon></span>
            <span>${this._t("add_named",{name:o})}</span>
          </button>`:W;if(!e.items.length&&!o)return F`<div class="empty">
        <ha-icon icon="mdi:package-variant"></ha-icon>
        <div class="big">${this._t("empty")}</div>
        <div>${this._t("empty_hint")}</div>
      </div>`;if(!t.shown)return F`${i}${o?W:F`<div class="empty"><div>${this._t("no_match")}</div></div>`}`;const s=this._config.group_by??"category",n="none"!==s&&t.groups.length>1;return F`
      ${i}
      ${t.groups.map(e=>F`
          ${n?F`<div class="group-head">
                ${e.key?Rt(this.hass,"location"===s?"loc":"cat",e.key):this._t("location"===s?"no_location":"no_category")}
                <span class="n">${e.items.length}</span>
              </div>`:W}
          ${e.items.map(e=>this._renderRow(e,t.statuses.get(e.id)))}
        `)}
    `}_expiryText(t,e){if(null!=t.days&&!t.out)return t.byOpening?t.days<0?this._t("opened_ago",{n:t.openedDays??0}):0===t.days?this._t("open_use_today"):1===t.days?this._t("open_use_tomorrow"):t.soon?this._t("open_use_in",{n:t.days}):this._t("open_use_by",{date:this._formatDate(wt(e).date)}):t.days<0?-1===t.days?this._t("expired_yesterday"):this._t("expired_ago",{n:-t.days}):0===t.days?this._t("expires_today"):1===t.days?this._t("expires_tomorrow"):t.soon?this._t("expires_in",{n:t.days}):this._t("expires_on",{date:this._formatDate(e.expiry)})}_formatDate(t){try{const[e,o,i]=t.split("-").map(Number);return new Date(e,o-1,i).toLocaleDateString(this.hass?.locale?.language??this.hass?.language,{day:"numeric",month:"short"})}catch{return t}}_renderRow(t,e){const o=e.out||e.expired?"bad":e.low||e.soon?"warn":"",i=this._config.group_by??"category",s=1===this._config.locations?.length,n=[];e.out?n.push({text:this._t("out_of_stock"),tone:"bad"}):e.low&&n.push({text:this._t("low"),tone:"warn"});const a=e.expired||e.soon||"expiry"===this._config.sort?this._expiryText(e,t):void 0;a&&n.push({text:a,tone:e.expired?"bad":e.soon?"warn":void 0}),t.location&&"location"!==i&&!s&&n.push({text:Rt(this.hass,"loc",t.location)}),n.length||null==e.days||e.out||n.push({text:this._expiryText(e,t)});const r=e.out||e.low||e.expired||e.soon,c=Et(t.unit),l="pcs"===t.unit?"":Rt(this.hass,"unit",t.unit,t.quantity);return F`
      <div class=${gt({row:!0,out:e.out})}>
        <button class="main" @click=${()=>this._openEdit(t)} aria-label=${t.name}>
          <span class=${gt({ricon:!0,[o]:!!o})}><ha-icon .icon=${qt(t)}></ha-icon></span>
          <span class="text">
            <span class="rname">${t.name}</span>
            ${n.length||e.onList?F`<span class=${gt({meta:!0,important:r})}>
                  ${e.onList?F`<ha-icon class="cart" icon="mdi:cart-outline" title=${this._t("on_list")}></ha-icon>`:W}
                  ${n.map((t,e)=>F`<span class=${gt({part:!0,[t.tone??""]:!!t.tone})}
                        >${e?F`<span class="dot">·</span>`:W}${t.text}</span
                      >`)}
                </span>`:W}
          </span>
        </button>
        <div class="stepper">
          <button
            class="step"
            ?disabled=${t.quantity<=0}
            aria-label=${this._t("decrease",{step:At(c)})}
            @click=${()=>this._adjust(t,-c)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <span class="qty"><b>${At(t.quantity)}</b>${l?F`<small>${l}</small>`:W}</span>
          <button class="step" aria-label=${this._t("increase",{step:At(c)})} @click=${()=>this._adjust(t,c)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_schema(t,e,o){const i=t.items,s=(t,e,o)=>{const s=[...new Set(i.map(e=>e[t]).filter(t=>!!t&&!e.includes(t)))];return[...e,...s.sort()].map(t=>{const e=Bt(this.hass,o,t);return{value:e,label:e}})},n=t=>({select:{options:t,custom_value:!0,mode:"dropdown"}}),a={number:{min:0,step:"any",mode:"box"}};return[{name:"name",required:!0,selector:{text:{}}},{type:"grid",name:"",schema:[{name:"quantity",selector:a},{name:"unit",selector:n(s("unit",t.units,"unit"))}]},{type:"grid",name:"",schema:[{name:"category",selector:n(s("category",t.categories,"cat"))},{name:"location",selector:n(s("location",t.locations,"loc"))}]},{type:"grid",name:"",schema:[{name:"expiry",selector:{date:{}}},{name:"days_after_opening",selector:{number:{min:1,max:3650,step:1,mode:"box"}}}]},...o?[{name:"opened_on",selector:{date:{}}}]:[],{type:"grid",name:"",schema:[{name:"min_quantity",selector:a},{name:"restock_quantity",selector:a}]},...t.settings.shopping_list?[{name:"auto_shop",selector:{boolean:{}}}]:[],{name:"notes",selector:{text:{multiline:!0}}},{name:"icon",selector:{icon:{}}},...e?[{name:"barcodes",selector:{text:{}}}]:[]]}async _openAdd(t,e={},o){const i=this._config,s={name:t,quantity:1,unit:"pcs",auto_shop:!0};"location"===this._filter.kind?s.location=this._filter.value:1===i.locations?.length&&(s.location=i.locations[0]),1===i.categories?.length&&(s.category=i.categories[0]);for(const[t,o]of Object.entries(e))null!=o&&""!==o&&(s[t]=o);await It();const n=this._toForm(s);this._dialog={mode:"add",data:n,original:{},armed:!1,busy:!1,scan:o,showBarcodes:!!n.barcodes,showOpened:!1}}async _openEdit(t,e){const o={};for(const e of le)o[e]=t[e]??void 0;const i=this._toForm(o);e?.amount&&(i.quantity=Math.round(1e3*(t.quantity+e.amount))/1e3),await It(),this._dialog={mode:"edit",id:t.id,data:i,original:o,armed:!1,busy:!1,scan:e,showBarcodes:!!i.barcodes,showOpened:!!i.opened_on}}_toForm(t){return{...t,unit:Bt(this.hass,"unit",t.unit),category:Bt(this.hass,"cat",t.category),location:Bt(this.hass,"loc",t.location),barcodes:t.barcodes?.length?jt(t.barcodes):void 0}}_fromForm(t){const e=this._snap;return{...t,name:String(t.name??"").trim(),unit:Ft(this.hass,"unit",t.unit,e.units)??"pcs",category:Ft(this.hass,"cat",t.category,e.categories),location:Ft(this.hass,"loc",t.location,e.locations),barcodes:Dt(t.barcodes)}}_renderDialog(t,e){const o=t.id?e.items.find(e=>e.id===t.id):void 0,i=o?this._view.statuses.get(o.id):void 0,s="add"===t.mode?this._t("new_item"):o?.name??t.data.name??"",n=t.data.icon||(o?qt(o):"mdi:package-variant-plus"),a=t.scan?.image,r=!!e.settings.shopping_list&&"edit"===t.mode&&!!o,c=o&&i?this._expiryText(i,o):void 0,l=o&&i&&"edit"===t.mode?St(o,i):null,d=!(!o||!i||"edit"!==t.mode||i.out||o.opened_on),h=!(!i||null==i.openedDays||i.byOpening&&(i.expired||i.soon));return F`
      <dialog class="sp-dialog" aria-label=${s} @close=${this._onDialogClosed} @click=${this._onBackdrop}>
        <div class="surface">
          <div class="d-head">
            <div class="badge">${a?F`<img src=${a} alt="" referrerpolicy="no-referrer" />`:F`<ha-icon .icon=${n}></ha-icon>`}</div>
            <div class="d-title">${s}</div>
            <button class="round" aria-label=${this._t("close")} @click=${this._closeDialog}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="d-body">
            ${t.scan?F`<div class="d-note">${this._scanNote(t.scan,o)}</div>`:W}
            ${o&&i&&(i.out||i.low||i.onList||i.expired||i.soon||d||h)?F`<div class="d-status">
                  ${i.out?F`<span class="pill bad"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("out_of_stock")}</span>`:i.low?F`<span class="pill warn"><ha-icon icon="mdi:alert-circle-outline"></ha-icon>${this._t("low")}</span>`:W}
                  ${(i.expired||i.soon)&&c?F`<span class=${gt({pill:!0,bad:i.expired,warn:i.soon})}
                        ><ha-icon icon="mdi:clock-alert-outline"></ha-icon>${c}</span
                      >`:W}
                  ${i.onList?F`<span class="pill"><ha-icon icon="mdi:cart-outline"></ha-icon>${this._t("on_list")}</span>`:W}
                  ${h?F`<span class="pill"><ha-icon icon="mdi:package-variant"></ha-icon>${0===i.openedDays?this._t("opened_today"):this._t("opened_ago",{n:i.openedDays})}</span>`:W}
                  ${d?F`<button class="bought" aria-label=${this._t("opened_aria")} ?disabled=${t.busy} @click=${()=>this._onOpened(o)}>
                        <ha-icon icon="mdi:package-variant"></ha-icon>${this._t("opened")}
                      </button>`:W}
                  ${null!=l?F`<button
                        class="bought"
                        aria-label=${this._t("bought_aria",{amount:this._amountText(o,l)})}
                        ?disabled=${t.busy}
                        @click=${()=>this._onBought(o,l)}
                      >
                        <ha-icon icon="mdi:cart-check"></ha-icon>${this._t("bought")}
                        <span class="amount">+${this._amountText(o,l)}</span>
                      </button>`:W}
                </div>`:W}
            <ha-form
              .hass=${this.hass}
              .data=${t.data}
              .schema=${this._schema(e,t.showBarcodes,t.showOpened)}
              .computeLabel=${t=>this._t(`f_${t.name}`)}
              .computeHelper=${t=>["min_quantity","restock_quantity","barcodes"].includes(t.name)?this._t(`h_${t.name}`):void 0}
              @value-changed=${this._onFormChanged}
            ></ha-form>
            ${t.error?F`<div class="d-error">${t.error}</div>`:W}
          </div>
          <div class="d-foot">
            ${"edit"===t.mode?F`<button
                  class=${gt({btn:!0,danger:!0,armed:t.armed})}
                  aria-label=${t.armed?this._t("delete_confirm"):this._t("delete")}
                  ?disabled=${t.busy}
                  @click=${this._onDelete}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon><span class=${t.armed?"":"lbl"}>${t.armed?this._t("delete_confirm"):this._t("delete")}</span>
                </button>`:W}
            ${r?F`<button
                  class="btn"
                  aria-label=${o.shopping?this._t("remove_from_list"):this._t("add_to_list")}
                  ?disabled=${t.busy}
                  @click=${()=>this._toggleShopping(o)}
                >
                  <ha-icon .icon=${o.shopping?"mdi:cart-remove":"mdi:cart-plus"}></ha-icon>
                  <span class="lbl">${o.shopping?this._t("remove_from_list"):this._t("add_to_list")}</span>
                </button>`:W}
            <span class="spacer"></span>
            <button class="btn cancel" @click=${this._closeDialog}>${this._t("cancel")}</button>
            <button class="btn filled" ?disabled=${t.busy||!String(t.data.name??"").trim()} @click=${this._onSave}>
              ${this._t("save")}
            </button>
          </div>
        </div>
      </dialog>
    `}async _call(t){return this.hass.callWS({...t,inventory:this._snap.entry_id})}async _toggleShopping(t){const e=this._dialog;if(e){this._dialog={...e,busy:!0};try{await this._call({type:`${oe}/item/shop`,item_id:t.id,on:!t.shopping}),this._dialog&&(this._dialog={...this._dialog,busy:!1})}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Kt(t)})}}}_amountText(t,e){const o="pcs"===t.unit?"":Rt(this.hass,"unit",t.unit,e);return o?`${At(e)} ${o}`:At(e)}async _onBought(t,e){const o=this._dialog;if(o&&!o.busy){this._dialog={...o,busy:!0,error:void 0};try{await this._call({type:`${oe}/item/adjust`,item_id:t.id,amount:e}),t.shopping&&!t.shopping.auto&&await this._call({type:`${oe}/item/shop`,item_id:t.id,on:!1}),Vt(this,this._t("restocked",{name:t.name,amount:this._amountText(t,e)})),this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Kt(t)})}}}async _onOpened(t){const e=this._dialog;if(e&&!e.busy){this._dialog={...e,busy:!0,error:void 0};try{await this._call({type:`${oe}/item/update`,item_id:t.id,changes:{opened_on:vt()}}),Vt(this,this._t("opened_toast",{name:t.name})),this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Kt(t)})}}}_scanNote(t,e){return"item"===t.outcome&&e?this._t("scan_known",{amount:this._amountText(e,t.amount??0)}):"product"===t.outcome?this._t("scan_found",{source:ae[t.source??""]??t.source??""}):"offline"===t.outcome?this._t("scan_offline"):this._t("scan_not_found")}_renderScan(t){const e=this._t("scan");return F`
      <dialog class="sp-dialog" aria-label=${e} @close=${this._onScanClosed} @click=${this._onBackdrop}>
        <div class="surface">
          <div class="d-head">
            <div class="badge"><ha-icon icon="mdi:barcode-scan"></ha-icon></div>
            <div class="d-title">${e}</div>
            <button class="round" aria-label=${this._t("close")} @click=${this._closeDialog}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="d-body">
            ${t.manualOnly?F`<p class="scan-hint">${this._t("scan_type_only")}</p>`:F`<div class="scan-view">
              <video playsinline muted autoplay></video>
              ${"camera"===t.phase?F`<div class="guide"></div>`:W}
              ${"looking"===t.phase?F`<div class="state"><ha-icon icon="mdi:barcode"></ha-icon>${this._t("scan_looking")}</div>`:"error"===t.phase?F`<div class="state">${t.error}</div>`:W}
            </div>
            <p class="scan-hint">${this._t("scan_hint")}</p>`}
            <form class="scan-manual" @submit=${this._onManualScan}>
              <input
                inputmode="numeric"
                autocomplete="off"
                enterkeyhint="search"
                placeholder=${this._t("scan_manual")}
                aria-label=${this._t("scan_manual")}
                .value=${t.manual}
                @input=${t=>this._scan&&(this._scan={...this._scan,manual:t.target.value,manualError:void 0})}
              />
              <button class="btn" type="submit" ?disabled=${"looking"===t.phase||!t.manual.trim()}>${this._t("scan_find")}</button>
            </form>
            ${t.manualError?F`<div class="d-error">${t.manualError}</div>`:W}
          </div>
        </div>
      </dialog>
    `}_openNativeScan(t){const e=t._commandHandler,o=()=>{t._commandHandler===i&&t.addCommandHandler(e)},i=i=>{if("bar_code/scan_result"===i.command){const e=String(i.payload?.rawValue??"");Ut(e)?(o(),t.fireMessage({type:"bar_code/close"}),this._onScanned(e)):t.fireMessage({type:"bar_code/notify",payload:{message:this._t("not_a_barcode")}})}else"bar_code/aborted"===i.command&&(o(),"alternative_options"===i.payload?.reason&&this._openScan(!0));return!e||e(i)};t.addCommandHandler(i),t.fireMessage({type:"bar_code/scan",payload:{title:this._t("scan"),description:this._t("scan_hint"),alternative_option_label:this._t("scan_manual")}})}_stopCamera(){window.clearTimeout(this._scanTimer),this._stream?.getTracks().forEach(t=>t.stop()),this._stream=void 0}async _onScanned(t){if(!this._snap)return;let e;this._stopCamera(),navigator.vibrate?.(30),this._scan&&(this._scan={...this._scan,phase:"looking"});try{e=await this._call({type:`${oe}/item/lookup`,barcode:t})}catch(t){return void(this._scan?this._scan={...this._scan,phase:"error",error:Kt(t)}:Vt(this,this._t("failed",{error:Kt(t)})))}this._scan=void 0;const o=e.item_id?this._snap?.items.find(t=>t.id===e.item_id):void 0;if(o){const t=o.restock_quantity||Et(o.unit);return void await this._openEdit(o,{code:e.barcode,outcome:"item",amount:t})}const i=e.product;await this._openAdd(i?.name??"",{barcodes:[e.barcode],category:i?.category??void 0,notes:i?.notes??void 0},{code:e.barcode,outcome:i?"product":e.error?"offline":"none",source:e.source,image:i?.image})}async _adjust(t,e){const o=this._snap;if(!o)return;const i=Math.max(0,Math.round(1e3*(t.quantity+e))/1e3);if(i!==t.quantity){this._snap={...o,items:o.items.map(e=>e.id===t.id?{...e,quantity:i}:e)};try{await this._call({type:`${oe}/item/adjust`,item_id:t.id,amount:i-t.quantity})}catch(t){Vt(this,this._t("failed",{error:Kt(t)}))}}}}de.styles=[Zt,Gt],t([ht({attribute:!1})],de.prototype,"hass",void 0),t([ht({type:Boolean,reflect:!0})],de.prototype,"compact",void 0),t([pt()],de.prototype,"_config",void 0),t([pt()],de.prototype,"_snap",void 0),t([pt()],de.prototype,"_error",void 0),t([pt()],de.prototype,"_query",void 0),t([pt()],de.prototype,"_filter",void 0),t([pt()],de.prototype,"_dialog",void 0),t([pt()],de.prototype,"_scan",void 0),window.customCards?.some(t=>"stock-pulse-card"===t.type)||(window.customCards=window.customCards||[],window.customCards.push({type:"stock-pulse-card",name:"Stock Pulse Card",description:"What you have at home, what is running low, and a shopping list that fills itself.",preview:!0,documentationURL:"https://github.com/zacharatos/stock-pulse-integration"}),Yt("stock-pulse-card",de).then(()=>console.info(`%c STOCK-PULSE-CARD %c ${ee} `,"color:white;background:#555;font-weight:600;border-radius:4px 0 0 4px;padding:2px 4px","color:white;background:var(--primary-color,#03a9f4);border-radius:0 4px 4px 0;padding:2px 4px")));export{de as StockPulseCard,ee as VERSION};
