function t(t,e,i,o){var s,n=arguments.length,r=n<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,i):o;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,i,o);else for(var a=t.length-1;a>=0;a--)(s=t[a])&&(r=(n<3?s(r):n>3?s(e,i,r):s(e,i))||r);return n>3&&r&&Object.defineProperty(e,i,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,i=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,o=Symbol(),s=new WeakMap;let n=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==o)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(i&&void 0===t){const i=void 0!==e&&1===e.length;i&&(t=s.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),i&&s.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const i=1===t.length?t[0]:e.reduce((e,i,o)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[o+1],t[0]);return new n(i,t,o)},a=i?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,o))(e)})(t):t,{is:c,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:h,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,m=g?g.emptyScript:"",f=_.reactiveElementPolyfillSupport,y=(t,e)=>t,b={toAttribute(t,e){switch(e){case Boolean:t=t?m:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},x=(t,e)=>!c(t,e),v={attribute:!0,type:String,converter:b,reflect:!1,useDefault:!1,hasChanged:x};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=v){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),o=this.getPropertyDescriptor(t,i,e);void 0!==o&&l(this.prototype,t,o)}}static getPropertyDescriptor(t,e,i){const{get:o,set:s}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:o,set(e){const n=o?.call(this);s?.call(this,e),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??v}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...h(t),...p(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,o)=>{if(i)t.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const i of o){const o=document.createElement("style"),s=e.litNonce;void 0!==s&&o.setAttribute("nonce",s),o.textContent=i.cssText,t.appendChild(o)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),o=this.constructor._$Eu(t,i);if(void 0!==o&&!0===i.reflect){const s=(void 0!==i.converter?.toAttribute?i.converter:b).toAttribute(e,i.type);this._$Em=t,null==s?this.removeAttribute(o):this.setAttribute(o,s),this._$Em=null}}_$AK(t,e){const i=this.constructor,o=i._$Eh.get(t);if(void 0!==o&&this._$Em!==o){const t=i.getPropertyOptions(o),s="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:b;this._$Em=o;const n=s.fromAttribute(e,t.type);this[o]=n??this._$Ej?.get(o)??n,this._$Em=null}}requestUpdate(t,e,i,o=!1,s){if(void 0!==t){const n=this.constructor;if(!1===o&&(s=this[t]),i??=n.getPropertyOptions(t),!((i.hasChanged??x)(s,e)||i.useDefault&&i.reflect&&s===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:o,wrapped:s},n){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==s||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===o&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,o=this[e];!0!==t||this._$AL.has(e)||void 0===o||this.C(e,void 0,i,o)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[y("elementProperties")]=new Map,$[y("finalized")]=new Map,f?.({ReactiveElement:$}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,k=t=>t,A=w.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,q="?"+C,P=`<${q}>`,O=document,z=()=>O.createComment(""),T=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,U="[ \t\n\f\r]",L=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,j=/-->/g,N=/>/g,D=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),H=/'/g,R=/"/g,I=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),F=Symbol.for("lit-noChange"),W=Symbol.for("lit-nothing"),V=new WeakMap,K=O.createTreeWalker(O,129);function Z(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const Y=(t,e)=>{const i=t.length-1,o=[];let s,n=2===e?"<svg>":3===e?"<math>":"",r=L;for(let e=0;e<i;e++){const i=t[e];let a,c,l=-1,d=0;for(;d<i.length&&(r.lastIndex=d,c=r.exec(i),null!==c);)d=r.lastIndex,r===L?"!--"===c[1]?r=j:void 0!==c[1]?r=N:void 0!==c[2]?(I.test(c[2])&&(s=RegExp("</"+c[2],"g")),r=D):void 0!==c[3]&&(r=D):r===D?">"===c[0]?(r=s??L,l=-1):void 0===c[1]?l=-2:(l=r.lastIndex-c[2].length,a=c[1],r=void 0===c[3]?D:'"'===c[3]?R:H):r===R||r===H?r=D:r===j||r===N?r=L:(r=D,s=void 0);const h=r===D&&t[e+1].startsWith("/>")?" ":"";n+=r===L?i+P:l>=0?(o.push(a),i.slice(0,l)+E+i.slice(l)+C+h):i+C+(-2===l?e:h)}return[Z(t,n+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),o]};class G{constructor({strings:t,_$litType$:e},i){let o;this.parts=[];let s=0,n=0;const r=t.length-1,a=this.parts,[c,l]=Y(t,e);if(this.el=G.createElement(c,i),K.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(o=K.nextNode())&&a.length<r;){if(1===o.nodeType){if(o.hasAttributes())for(const t of o.getAttributeNames())if(t.endsWith(E)){const e=l[n++],i=o.getAttribute(t).split(C),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:s,name:r[2],strings:i,ctor:"."===r[1]?et:"?"===r[1]?it:"@"===r[1]?ot:tt}),o.removeAttribute(t)}else t.startsWith(C)&&(a.push({type:6,index:s}),o.removeAttribute(t));if(I.test(o.tagName)){const t=o.textContent.split(C),e=t.length-1;if(e>0){o.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)o.append(t[i],z()),K.nextNode(),a.push({type:2,index:++s});o.append(t[e],z())}}}else if(8===o.nodeType)if(o.data===q)a.push({type:2,index:s});else{let t=-1;for(;-1!==(t=o.data.indexOf(C,t+1));)a.push({type:7,index:s}),t+=C.length-1}s++}}static createElement(t,e){const i=O.createElement("template");return i.innerHTML=t,i}}function J(t,e,i=t,o){if(e===F)return e;let s=void 0!==o?i._$Co?.[o]:i._$Cl;const n=T(e)?void 0:e._$litDirective$;return s?.constructor!==n&&(s?._$AO?.(!1),void 0===n?s=void 0:(s=new n(t),s._$AT(t,i,o)),void 0!==o?(i._$Co??=[])[o]=s:i._$Cl=s),void 0!==s&&(e=J(t,s._$AS(t,e.values),s,o)),e}class Q{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,o=(t?.creationScope??O).importNode(e,!0);K.currentNode=o;let s=K.nextNode(),n=0,r=0,a=i[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new X(s,s.nextSibling,this,t):1===a.type?e=new a.ctor(s,a.name,a.strings,this,t):6===a.type&&(e=new st(s,this,t)),this._$AV.push(e),a=i[++r]}n!==a?.index&&(s=K.nextNode(),n++)}return K.currentNode=O,o}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class X{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,o){this.type=2,this._$AH=W,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=o,this._$Cv=o?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=J(this,t,e),T(t)?t===W||null==t||""===t?(this._$AH!==W&&this._$AR(),this._$AH=W):t!==this._$AH&&t!==F&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==W&&T(this._$AH)?this._$AA.nextSibling.data=t:this.T(O.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,o="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=G.createElement(Z(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===o)this._$AH.p(e);else{const t=new Q(o,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=V.get(t.strings);return void 0===e&&V.set(t.strings,e=new G(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,o=0;for(const s of t)o===e.length?e.push(i=new X(this.O(z()),this.O(z()),this,this.options)):i=e[o],i._$AI(s),o++;o<e.length&&(this._$AR(i&&i._$AB.nextSibling,o),e.length=o)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=k(t).nextSibling;k(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,o,s){this.type=1,this._$AH=W,this._$AN=void 0,this.element=t,this.name=e,this._$AM=o,this.options=s,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=W}_$AI(t,e=this,i,o){const s=this.strings;let n=!1;if(void 0===s)t=J(this,t,e,0),n=!T(t)||t!==this._$AH&&t!==F,n&&(this._$AH=t);else{const o=t;let r,a;for(t=s[0],r=0;r<s.length-1;r++)a=J(this,o[i+r],e,r),a===F&&(a=this._$AH[r]),n||=!T(a)||a!==this._$AH[r],a===W?t=W:t!==W&&(t+=(a??"")+s[r+1]),this._$AH[r]=a}n&&!o&&this.j(t)}j(t){t===W?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===W?void 0:t}}class it extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==W)}}class ot extends tt{constructor(t,e,i,o,s){super(t,e,i,o,s),this.type=5}_$AI(t,e=this){if((t=J(this,t,e,0)??W)===F)return;const i=this._$AH,o=t===W&&i!==W||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,s=t!==W&&(i===W||o);o&&this.element.removeEventListener(this.name,this,i),s&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){J(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(G,X),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;let at=class extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const o=i?.renderBefore??e;let s=o._$litPart$;if(void 0===s){const t=i?.renderBefore??null;o._$litPart$=s=new X(e.insertBefore(z(),t),t,void 0,i??{})}return s._$AI(t),s})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return F}};at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const ct=rt.litElementPolyfillSupport;ct?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const lt={attribute:!0,type:String,converter:b,reflect:!1,hasChanged:x},dt=(t=lt,e,i)=>{const{kind:o,metadata:s}=i;let n=globalThis.litPropertyMetadata.get(s);if(void 0===n&&globalThis.litPropertyMetadata.set(s,n=new Map),"setter"===o&&((t=Object.create(t)).wrapped=!0),n.set(i.name,t),"accessor"===o){const{name:o}=i;return{set(i){const s=e.get.call(this);e.set.call(this,i),this.requestUpdate(o,s,t,!0,i)},init(e){return void 0!==e&&this.C(o,void 0,t,e),e}}}if("setter"===o){const{name:o}=i;return function(i){const s=this[o];e.call(this,i),this.requestUpdate(o,s,t,!0,i)}}throw Error("Unsupported decorator location: "+o)};function ht(t){return(e,i)=>"object"==typeof i?dt(t,e,i):((t,e,i)=>{const o=e.hasOwnProperty(i);return e.constructor.createProperty(i,t),o?Object.getOwnPropertyDescriptor(e,i):void 0})(t,e,i)}function pt(t){return ht({...t,state:!0,attribute:!1})}const ut=1,_t=t=>(...e)=>({_$litDirective$:t,values:e});let gt=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};const mt=_t(class extends gt{constructor(t){if(super(t),t.type!==ut||"class"!==t.name||t.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(t,[e]){if(void 0===this.st){this.st=new Set,void 0!==t.strings&&(this.nt=new Set(t.strings.join(" ").split(/\s/).filter(t=>""!==t)));for(const t in e)e[t]&&!this.nt?.has(t)&&this.st.add(t);return this.render(e)}const i=t.element.classList;for(const t of this.st)t in e||(i.remove(t),this.st.delete(t));for(const t in e){const o=!!e[t];o===this.st.has(t)||this.nt?.has(t)||(o?(i.add(t),this.st.add(t)):(i.remove(t),this.st.delete(t)))}return F}}),ft="important",yt=" !"+ft,bt=_t(class extends gt{constructor(t){if(super(t),t.type!==ut||"style"!==t.name||t.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,i)=>{const o=t[i];return null==o?e:e+`${i=i.includes("-")?i:i.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${o};`},"")}update(t,[e]){const{style:i}=t.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(e)),this.render(e);for(const t of this.ft)null==e[t]&&(this.ft.delete(t),t.includes("-")?i.removeProperty(t):i[t]=null);for(const t in e){const o=e[t];if(null!=o){this.ft.add(t);const e="string"==typeof o&&o.endsWith(yt);t.includes("-")||e?i.setProperty(t,e?o.slice(0,-11):o,e?ft:""):i[t]=o}}return F}});function xt(t=new Date){const e=t=>String(t).padStart(2,"0");return`${t.getFullYear()}-${e(t.getMonth()+1)}-${e(t.getDate())}`}function vt(t,e,i){const o=t.quantity<=0,s=null!=t.min_quantity&&t.quantity<=t.min_quantity,n=t.expiry?function(t,e){const i=Date.parse(`${t.slice(0,10)}T00:00:00Z`),o=Date.parse(`${e.slice(0,10)}T00:00:00Z`);return Number.isNaN(i)||Number.isNaN(o)?null:Math.round((o-i)/864e5)}(e,t.expiry):null;return{out:o,low:s,days:n,expired:!o&&null!=n&&n<0,soon:!o&&null!=n&&n>=0&&n<=i,onList:!!t.shopping}}function $t(t){return t.out||t.low}function wt(t){return Math.abs(t-Math.round(t))<1e-9?String(Math.round(t)):String(Number(t.toFixed(2)))}const kt={food:"mdi:food-apple-outline",drinks:"mdi:bottle-soda-classic-outline",frozen:"mdi:snowflake",cleaning:"mdi:spray-bottle",toiletries:"mdi:paper-roll-outline",household:"mdi:home-variant-outline",baby:"mdi:baby-bottle-outline",pets:"mdi:paw-outline",medicine:"mdi:pill",other:"mdi:package-variant-closed"},At={pantry:"mdi:cupboard-outline",fridge:"mdi:fridge-outline",freezer:"mdi:snowflake",bathroom:"mdi:shower",cleaning:"mdi:spray-bottle"};function St(t){return t.icon||t.category&&kt[t.category]||t.location&&At[t.location]||"mdi:package-variant-closed"}const Et=t=>(t??"").trim().toLocaleLowerCase();function Ct(t,e,i,o,s){return t.filter(t=>{const n=o.get(t.id);if(!function(t,e){const i=Et(e);return!i||[t.name,t.notes,t.category,t.location].some(t=>Et(t).includes(i))}(t,i))return!1;switch(e.kind){case"low":return $t(n);case"expiring":return n.expired||n.soon;case"list":return n.onList;case"location":return Et(t.location)===Et(e.value);case"category":return Et(t.category)===Et(e.value);default:return!(s&&n.out&&!i)}})}function qt(t,e,i){if("none"===e)return[{key:"",items:t}];const o=new Map;for(const i of t){const t=("category"===e?i.category:i.location)??"",s=o.get(t);s?s.push(i):o.set(t,[i])}const s=t=>{if(!t)return[2,""];const e=i.indexOf(t);return e>=0?[0,String(e).padStart(3,"0")]:[1,t.toLocaleLowerCase()]};return[...o.entries()].sort(([t],[e])=>{const[i,o]=s(t),[n,r]=s(e);return i-n||o.localeCompare(r)}).map(([t,e])=>({key:t,items:e}))}function Pt(t,e,i){const o=new Set(t.map(t=>t[e]).filter(t=>!!t)),s=i.filter(t=>o.has(t)),n=[...o].filter(t=>!i.includes(t)).sort((t,e)=>t.localeCompare(e));return[...s,...n]}const Ot={search_or_add:"Search or add…",add_item:"Add item",add_named:"Add “{name}”",new_item:"New item",close:"Close",save:"Save",cancel:"Cancel",delete:"Delete",delete_confirm:"Tap again to delete",add_to_list:"Add to shopping list",remove_from_list:"Remove from list",increase:"Add {step}",decrease:"Use {step}",chip_all:"All",chip_low:"Low",chip_expiring:"Expiring",chip_list:"On list",n_items:"{n} items",n_items_one:"1 item",n_low:"{n} low",n_expiring:"{n} expiring",n_on_list:"{n} on the list",empty:"Nothing here yet",empty_hint:"Add what you keep at home and the card keeps count.",no_match:"No items match",out_of_stock:"Out of stock",low:"Low",expires_today:"Expires today",expires_tomorrow:"Expires tomorrow",expires_in:"Expires in {n} days",expires_on:"Best before {date}",expired_yesterday:"Expired yesterday",expired_ago:"Expired {n} days ago",on_list:"On the shopping list",no_category:"Uncategorised",no_location:"No location",everything:"Everything",f_name:"Name",f_quantity:"Quantity",f_unit:"Unit",f_category:"Category",f_location:"Location",f_expiry:"Best before",f_min_quantity:"Low at",f_restock_quantity:"Buy amount",f_auto_shop:"Add to the shopping list when low",f_notes:"Notes",f_icon:"Icon",h_min_quantity:"At or below this it counts as low",h_restock_quantity:"Empty: just enough to get back above it",not_installed:"The Stock Pulse integration isn't set up yet. Add it in Settings → Devices & services.",not_found:"Inventory “{inventory}” was not found.",failed:"Something went wrong: {error}",unit_pcs:"pieces",unit_pcs_one:"piece",unit_pack:"packs",unit_pack_one:"pack",unit_roll:"rolls",unit_roll_one:"roll",unit_bottle:"bottles",unit_bottle_one:"bottle",unit_can:"cans",unit_can_one:"can",unit_box:"boxes",unit_box_one:"box",unit_bag:"bags",unit_bag_one:"bag",unit_jar:"jars",unit_jar_one:"jar",unit_kg:"kg",unit_g:"g",unit_l:"L",unit_ml:"ml",cat_food:"Food",cat_drinks:"Drinks",cat_frozen:"Frozen",cat_cleaning:"Cleaning",cat_toiletries:"Toiletries",cat_household:"Household",cat_baby:"Baby",cat_pets:"Pets",cat_medicine:"Medicine",cat_other:"Other",loc_pantry:"Pantry",loc_fridge:"Fridge",loc_freezer:"Freezer",loc_bathroom:"Bathroom",loc_cleaning:"Cleaning cupboard",loc_other:"Other",ed_inventory:"Inventory",ed_title:"Title",ed_icon:"Icon",ed_group_by:"Group by",ed_sort:"Sort by",group_category:"Category",group_location:"Location",group_none:"Nothing",sort_name:"Name",sort_quantity:"Quantity (lowest first)",sort_expiry:"Best before (soonest first)",ed_locations:"Only show these locations",ed_categories:"Only show these categories",ed_show_search:"Search and quick add",ed_show_filters:"Filter chips",ed_hide_out_of_stock:"Hide items that ran out",ed_compact:"Compact rows",ed_max_height:"Maximum list height (e.g. 480px)"},zt={en:Ot,el:{search_or_add:"Αναζήτηση ή προσθήκη…",add_item:"Προσθήκη είδους",add_named:"Προσθήκη «{name}»",new_item:"Νέο είδος",close:"Κλείσιμο",save:"Αποθήκευση",cancel:"Ακύρωση",delete:"Διαγραφή",delete_confirm:"Πατήστε ξανά για διαγραφή",add_to_list:"Στη λίστα αγορών",remove_from_list:"Αφαίρεση από τη λίστα",increase:"Πρόσθεσε {step}",decrease:"Αφαίρεσε {step}",chip_all:"Όλα",chip_low:"Τελειώνουν",chip_expiring:"Λήγουν",chip_list:"Στη λίστα",n_items:"{n} είδη",n_items_one:"1 είδος",n_low:"{n} τελειώνουν",n_expiring:"{n} λήγουν",n_on_list:"{n} στη λίστα",empty:"Δεν υπάρχει τίποτα ακόμη",empty_hint:"Προσθέστε ό,τι έχετε στο σπίτι και η κάρτα κρατά λογαριασμό.",no_match:"Κανένα είδος δεν ταιριάζει",out_of_stock:"Τελείωσε",low:"Τελειώνει",expires_today:"Λήγει σήμερα",expires_tomorrow:"Λήγει αύριο",expires_in:"Λήγει σε {n} ημέρες",expires_on:"Ανάλωση έως {date}",expired_yesterday:"Έληξε χθες",expired_ago:"Έληξε πριν {n} ημέρες",on_list:"Στη λίστα αγορών",no_category:"Χωρίς κατηγορία",no_location:"Χωρίς θέση",everything:"Όλα",f_name:"Όνομα",f_quantity:"Ποσότητα",f_unit:"Μονάδα",f_category:"Κατηγορία",f_location:"Θέση",f_expiry:"Ανάλωση έως",f_min_quantity:"Τελειώνει στα",f_restock_quantity:"Ποσότητα αγοράς",f_auto_shop:"Στη λίστα αγορών όταν τελειώνει",f_notes:"Σημειώσεις",f_icon:"Εικονίδιο",h_min_quantity:"Σε αυτή την ποσότητα ή λιγότερο θεωρείται ότι τελειώνει",h_restock_quantity:"Κενό: όσο χρειάζεται για να ξεπεράσει το όριο",not_installed:"Η ενσωμάτωση Stock Pulse δεν έχει ρυθμιστεί. Προσθέστε τη στις Ρυθμίσεις → Συσκευές & υπηρεσίες.",not_found:"Δεν βρέθηκε το απόθεμα «{inventory}».",failed:"Κάτι πήγε στραβά: {error}",unit_pcs:"τεμάχια",unit_pcs_one:"τεμάχιο",unit_pack:"πακέτα",unit_pack_one:"πακέτο",unit_roll:"ρολά",unit_roll_one:"ρολό",unit_bottle:"μπουκάλια",unit_bottle_one:"μπουκάλι",unit_can:"κουτάκια",unit_can_one:"κουτάκι",unit_box:"κουτιά",unit_box_one:"κουτί",unit_bag:"σακούλες",unit_bag_one:"σακούλα",unit_jar:"βάζα",unit_jar_one:"βάζο",unit_kg:"kg",unit_g:"g",unit_l:"L",unit_ml:"ml",cat_food:"Τρόφιμα",cat_drinks:"Ποτά",cat_frozen:"Κατεψυγμένα",cat_cleaning:"Καθαριστικά",cat_toiletries:"Είδη υγιεινής",cat_household:"Οικιακά",cat_baby:"Μωρό",cat_pets:"Κατοικίδια",cat_medicine:"Φάρμακα",cat_other:"Άλλο",loc_pantry:"Ντουλάπι",loc_fridge:"Ψυγείο",loc_freezer:"Καταψύκτης",loc_bathroom:"Μπάνιο",loc_cleaning:"Ντουλάπι καθαριστικών",loc_other:"Άλλο",ed_inventory:"Απόθεμα",ed_title:"Τίτλος",ed_icon:"Εικονίδιο",ed_group_by:"Ομαδοποίηση",ed_sort:"Ταξινόμηση",group_category:"Κατηγορία",group_location:"Θέση",group_none:"Καμία",sort_name:"Όνομα",sort_quantity:"Ποσότητα (λιγότερα πρώτα)",sort_expiry:"Ανάλωση (πλησιέστερη πρώτα)",ed_locations:"Μόνο αυτές οι θέσεις",ed_categories:"Μόνο αυτές οι κατηγορίες",ed_show_search:"Αναζήτηση και γρήγορη προσθήκη",ed_show_filters:"Φίλτρα",ed_hide_out_of_stock:"Απόκρυψη ειδών που τελείωσαν",ed_compact:"Συμπαγείς γραμμές",ed_max_height:"Μέγιστο ύψος λίστας (π.χ. 480px)"}};function Tt(t,e,i){const o=zt[function(t){return(t?.locale?.language||t?.language||"en").split("-")[0]}(t)]??Ot,s=i?.n,n=1===s||"1"===s?`${e}_one`:void 0;let r=n&&(o[n]??Ot[n])||o[e]||Ot[e]||e;if(i)for(const[t,e]of Object.entries(i))r=r.replaceAll(`{${t}}`,String(e));return r}function Mt(t,e,i,o=2){if(!i)return"";const s=`${e}_${i}`;return s in Ot?Tt(t,s,"unit"===e?{n:o}:void 0):i}function Ut(t,e,i){if(!i)return;const o=Mt(t,e,i);return"unit"===e&&`${e}_${i}`in Ot&&o.length>2&&o===o.toLocaleLowerCase()?o.charAt(0).toLocaleUpperCase()+o.slice(1):o}function Lt(t,e,i,o){const s=(i??"").trim();if(!s)return null;const n=s.toLocaleLowerCase();for(const i of o){const o=[i,Mt(t,e,i),Mt(void 0,e,i)];if("unit"===e&&o.push(Mt(t,e,i,1),Mt(void 0,e,i,1)),o.some(t=>t.toLocaleLowerCase()===n))return i}return s}async function jt(){if(!customElements.get("ha-form")||!customElements.get("ha-selector"))try{const t=await(window.loadCardHelpers?.()),e=await(t?.createCardElement({type:"entities",entities:[]}));await(e?.constructor?.getConfigElement?.())}catch{}}function Nt(t,e,i){t.dispatchEvent(new CustomEvent(e,{detail:i,bubbles:!0,composed:!0}))}function Dt(t){return String(t&&"object"==typeof t&&"message"in t?t.message:t)}const Ht=r`
  :host {
    /* Colours map onto Home Assistant's palette so themes keep working. Colour is reserved for
       what needs attention (low, out, expiring); everything else stays neutral. */
    --sp-accent: var(--primary-color);
    --sp-warn: var(--orange-color, #ff9800);
    --sp-bad: var(--red-color, #f44336);
    --sp-neutral-bg: color-mix(in srgb, var(--primary-text-color) 6%, transparent);
    --sp-neutral-bg-hover: color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    --sp-radius: var(--ha-card-border-radius, 12px);
    --sp-control-radius: var(--ha-card-features-border-radius, var(--feature-border-radius, 12px));
    --sp-row-height: 56px;
    display: block;
    height: 100%;
  }
  :host([compact]) {
    --sp-row-height: 44px;
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
    gap: 12px;
    padding: 12px;
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
    transition: background-color 150ms ease, transform 120ms ease;
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
    margin: 0 -12px;
    padding: 0 12px;
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
    height: 32px;
    padding: 0 12px;
    border-radius: 16px;
    background: var(--sp-neutral-bg);
    color: var(--primary-text-color);
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 150ms ease, color 150ms ease;
    --mdc-icon-size: 16px;
  }
  .chip:hover { background: var(--sp-neutral-bg-hover); }
  .chip.selected {
    background: color-mix(in srgb, var(--sp-accent) 18%, transparent);
    color: var(--sp-accent);
  }
  .chip .count {
    font-variant-numeric: tabular-nums;
    color: var(--secondary-text-color);
    font-weight: 400;
  }
  .chip.selected .count { color: inherit; }

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
  .ricon.warn { background: color-mix(in srgb, var(--sp-warn) 16%, transparent); color: var(--sp-warn); }
  .ricon.bad { background: color-mix(in srgb, var(--sp-bad) 16%, transparent); color: var(--sp-bad); }
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
    transition: background-color 150ms ease, color 150ms ease, transform 120ms ease;
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
    color: var(--sp-accent);
    font-size: 14px;
    font-weight: 500;
    text-align: left;
  }
  .add-row:hover { background: var(--sp-neutral-bg); }
  .add-row .ricon { background: color-mix(in srgb, var(--sp-accent) 14%, transparent); color: var(--sp-accent); }

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
`,Rt=r`
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
  dialog.sp-dialog[open] .surface { animation: sp-pop 200ms cubic-bezier(0.2, 0.9, 0.3, 1.1); }
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
    gap: 8px;
    margin-bottom: 12px;
  }
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 10px;
    border-radius: 14px;
    background: var(--sp-neutral-bg);
    font-size: 12px;
    color: var(--secondary-text-color);
    --mdc-icon-size: 16px;
  }
  .pill.warn { color: var(--sp-warn); background: color-mix(in srgb, var(--sp-warn) 14%, transparent); }
  .pill.bad { color: var(--sp-bad); background: color-mix(in srgb, var(--sp-bad) 14%, transparent); }
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
    transition: background-color 150ms ease;
  }
  .btn:hover { background: color-mix(in srgb, var(--sp-accent) 10%, transparent); }
  .btn.filled { background: var(--sp-accent); color: var(--text-primary-color, #fff); }
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
`;function It(t,e){const i=()=>{customElements.get(t)||customElements.define(t,e)};return document.querySelector("home-assistant")&&!customElements.get("home-assistant")?customElements.whenDefined("home-assistant").then(i):(i(),Promise.resolve())}const Bt=["pantry","fridge","freezer","bathroom","cleaning","other"],Ft=["food","drinks","frozen","cleaning","toiletries","household","baby","pets","medicine","other"],Wt={group_by:"category",sort:"name",show_search:!0,show_filters:!0,hide_out_of_stock:!1,compact:!1};class Vt extends at{constructor(){super(...arguments),this._ready=!1,this._inventories=[],this._t=t=>Tt(this.hass,t)}connectedCallback(){super.connectedCallback(),jt().then(()=>this._ready=!0)}setConfig(t){this._config=t}firstUpdated(){this.hass?.callWS({type:"stock_pulse/inventories"}).then(t=>this._inventories=t).catch(()=>{})}_schema(){const t=this._t,e=(t,e)=>t.map(t=>({value:t,label:Mt(this.hass,e,t)}));return[...this._inventories.length>1?[{name:"inventory",selector:{select:{mode:"dropdown",options:this._inventories.map(t=>({value:t.entry_id,label:t.title}))}}}]:[],{type:"grid",name:"",schema:[{name:"title",selector:{text:{}}},{name:"icon",selector:{icon:{}}}]},{type:"grid",name:"",schema:[{name:"group_by",selector:{select:{mode:"dropdown",options:["category","location","none"].map(e=>({value:e,label:t(`group_${e}`)}))}}},{name:"sort",selector:{select:{mode:"dropdown",options:["name","quantity","expiry"].map(e=>({value:e,label:t(`sort_${e}`)}))}}}]},{name:"locations",selector:{select:{multiple:!0,custom_value:!0,mode:"dropdown",options:e(Bt,"loc")}}},{name:"categories",selector:{select:{multiple:!0,custom_value:!0,mode:"dropdown",options:e(Ft,"cat")}}},{type:"grid",name:"",schema:[{name:"show_search",selector:{boolean:{}}},{name:"show_filters",selector:{boolean:{}}},{name:"hide_out_of_stock",selector:{boolean:{}}},{name:"compact",selector:{boolean:{}}}]},{name:"max_height",selector:{text:{}}}]}render(){if(!this.hass||!this._config||!this._ready)return W;const t={...Wt,...this._config};return B`
      <ha-form
        .hass=${this.hass}
        .data=${t}
        .schema=${this._schema()}
        .computeLabel=${t=>this._t(`ed_${t.name}`)}
        @value-changed=${this._changed}
      ></ha-form>
    `}_changed(t){t.stopPropagation();const e=t.detail.value,i={...this._config},o=this._schema().flatMap(t=>(t.schema??[t]).map(t=>t.name));for(const t of o)t in e||delete i[t];for(const[t,o]of Object.entries(e)){null==o||""===o||Array.isArray(o)&&0===o.length||Wt[t]===o?delete i[t]:i[t]=o}Nt(this,"config-changed",{config:i})}}t([ht({attribute:!1})],Vt.prototype,"hass",void 0),t([pt()],Vt.prototype,"_config",void 0),t([pt()],Vt.prototype,"_ready",void 0),t([pt()],Vt.prototype,"_inventories",void 0),It("stock-pulse-card-editor",Vt);const Kt="0.1.0",Zt="stock_pulse",Yt=["category","location","none"],Gt=["name","quantity","expiry"],Jt=["name","quantity","unit","category","location","expiry","min_quantity","restock_quantity","auto_shop","notes","icon"];class Qt extends at{constructor(){super(...arguments),this.compact=!1,this._query="",this._filter={kind:"all"},this._today=xt(),this._resize=new ResizeObserver(()=>{for(const t of this.renderRoot.querySelectorAll(".chips, .list"))this._markEdges(t)}),this._onScroll=t=>this._markEdges(t.currentTarget),this._t=(t,e)=>Tt(this.hass,t,e),this._onSearchKey=t=>{if("Escape"===t.key)return void(this._query="");if("Enter"!==t.key||!this._query.trim()||!this._snap)return;t.preventDefault();const e=Et(this._query),i=this._snap.items.find(t=>Et(t.name)===e);i?this._openEdit(i):this._openAdd(this._query.trim())},this._onFormChanged=t=>{t.stopPropagation(),this._dialog&&(this._dialog={...this._dialog,data:{...t.detail.value},armed:!1,error:void 0})},this._onBackdrop=t=>{t.target===t.currentTarget&&this._closeDialog()},this._closeDialog=()=>{this.renderRoot.querySelector("dialog.sp-dialog")?.close()},this._onDialogClosed=()=>{this._dialog=void 0},this._onSave=async()=>{const t=this._dialog;if(!t||t.busy)return;const e=this._fromForm(t.data);this._dialog={...t,busy:!0,error:void 0};try{if("add"===t.mode){const t=Object.fromEntries(Object.entries(e).filter(([,t])=>null!=t&&""!==t));await this._call({type:`${Zt}/item/add`,item:t}),this._query=""}else{const i=function(t,e){const i={};for(const[o,s]of Object.entries(e)){const e=""===s||void 0===s?null:s;e!==(t[o]??null)&&(i[o]=e)}return i}(t.original,e);Object.keys(i).length&&await this._call({type:`${Zt}/item/update`,item_id:t.id,changes:i})}this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Dt(t)})}},this._onDelete=async()=>{const t=this._dialog;if(t?.id&&!t.busy)if(t.armed){this._dialog={...t,busy:!0};try{await this._call({type:`${Zt}/item/remove`,item_id:t.id}),this._closeDialog()}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,armed:!1,error:Dt(t)})}}else this._dialog={...t,armed:!0}}}static getConfigElement(){return document.createElement("stock-pulse-card-editor")}static getStubConfig(){return{}}setConfig(t){if(!t)throw new Error("Invalid configuration");if(t.group_by&&!Yt.includes(t.group_by))throw new Error(`group_by must be one of ${Yt.join(", ")}`);if(t.sort&&!Gt.includes(t.sort))throw new Error(`sort must be one of ${Gt.join(", ")}`);for(const e of["locations","categories"])if(void 0!==t[e]&&!Array.isArray(t[e]))throw new Error(`${e} must be a list`);const e=this._config&&(this._config.inventory??"")!==(t.inventory??"");this._config=t,this.compact=!!t.compact,e&&this._resubscribe()}getCardSize(){const t=this._view?.shown??3;return 2+Math.ceil(Math.min(t,12)/1.5)}getGridOptions(){return{columns:12,min_columns:6,rows:"auto"}}connectedCallback(){super.connectedCallback(),this._resize.observe(this),this.hass&&this._config&&this._subscribe()}disconnectedCallback(){super.disconnectedCallback(),this._resize.disconnect(),this._unsubscribe()}willUpdate(t){t.has("hass")&&this.hass&&this._config&&!this._unsub&&this._subscribe();const e=xt();(!this._view||e!==this._today||t.has("_snap")||t.has("_config")||t.has("_query")||t.has("_filter"))&&(this._today=e,this._view=this._buildView())}shouldUpdate(t){if(1===t.size&&t.has("hass")){const e=t.get("hass");return!e||e.language!==this.hass?.language||!this._snap}return!0}updated(){for(const t of this.renderRoot.querySelectorAll(".chips, .list"))this._markEdges(t);const t=this.renderRoot.querySelector("dialog.sp-dialog");if(t&&!t.open)try{t.showModal()}catch{t.setAttribute("open","")}}_markEdges(t){const e=t.classList.contains("chips"),i=e?t.scrollLeft:t.scrollTop,o=e?t.clientWidth:t.clientHeight,s=e?t.scrollWidth:t.scrollHeight;t.classList.toggle("more-start",i>1),t.classList.toggle("more-end",i+o<s-1)}_subscribe(){if(!this.hass||!this._config||this._unsub||!this.isConnected)return;const t=this._config.inventory||void 0;this._subscribedTo=t??"",this._unsub=this.hass.connection.subscribeMessage(t=>{this._snap=t,this._error=void 0},{type:`${Zt}/subscribe`,...t?{inventory:t}:{}}).catch(e=>{const i=function(t){if(t&&"object"==typeof t&&"code"in t)return String(t.code)}(e);return this._error="unknown_command"===i?Tt(this.hass,"not_installed"):"not_found"===i&&t?Tt(this.hass,"not_found",{inventory:t}):Dt(e),this._unsub=void 0,window.clearTimeout(this._retry),this._retry=window.setTimeout(()=>this._subscribe(),3e4),()=>{}})}_unsubscribe(){window.clearTimeout(this._retry);const t=this._unsub;this._unsub=void 0,t?.then(t=>t()).catch(()=>{})}_resubscribe(){this._unsubscribe(),this._snap=void 0,this._subscribe()}_buildView(){const t=this._snap,e=this._config,i=new Map;if(!t)return{statuses:i,inScope:[],groups:[],shown:0,counts:{items:0,low:0,expiring:0,list:0},locations:[],exact:!1};const o=t.settings.expiring_days;for(const e of t.items)i.set(e.id,vt(e,this._today,o));const s=function(t,e){const i=(e.locations??[]).map(Et),o=(e.categories??[]).map(Et);return t.filter(t=>(!i.length||i.includes(Et(t.location)))&&(!o.length||o.includes(Et(t.category))))}(t.items,e),n={items:0,low:0,expiring:0,list:0};for(const t of s){const e=i.get(t.id);n.items++,$t(e)&&n.low++,(e.expired||e.soon)&&n.expiring++,e.onList&&n.list++}const r=function(t,e,i){const o=(t,e)=>t.name.localeCompare(e.name,void 0,{sensitivity:"base"}),s=[...t];if("quantity"===e)s.sort((t,e)=>t.quantity-e.quantity||o(t,e));else if("expiry"===e){const t=t=>i.get(t.id)?.days??Number.POSITIVE_INFINITY;s.sort((e,i)=>t(e)-t(i)||o(e,i))}else s.sort(o);return s}(Ct(s,this._filter,this._query,i,!!e.hide_out_of_stock),e.sort??"name",i),a=e.group_by??"category",c="location"===a?t.locations:t.categories,l=Et(this._query);return{statuses:i,inScope:s,groups:qt(r,a,c),shown:r.length,counts:n,locations:Pt(s,"location",t.locations),exact:!!l&&t.items.some(t=>Et(t.name)===l)}}render(){if(!this._config)return W;const t=this._config,e=this._view,i=this._snap,o=t.title??i?.title??"Stock",s=t.max_height;return B`
      <ha-card>
        <div class="content">
          <div class="header">
            <div class="badge"><ha-icon .icon=${t.icon||"mdi:package-variant-closed"}></ha-icon></div>
            <div class="titles">
              <div class="title">${o}</div>
              ${i?B`<div class="secondary">${this._summary(e)}</div>`:W}
            </div>
            ${i?B`<button class="round" title=${this._t("add_item")} aria-label=${this._t("add_item")} @click=${()=>this._openAdd("")}>
                  <ha-icon icon="mdi:plus"></ha-icon>
                </button>`:W}
          </div>
          ${this._error?B`<div class="notice">${this._error}</div>`:i?B`
                  ${!1!==t.show_search?this._renderSearch():W}
                  ${!1!==t.show_filters?this._renderChips(e,i):W}
                  <div class="list" style=${bt(s?{maxHeight:s}:{})} @scroll=${this._onScroll}>${this._renderList(e,i)}</div>
                `:W}
        </div>
        ${this._dialog&&i?this._renderDialog(this._dialog,i):W}
      </ha-card>
    `}_summary(t){const e=[B`<span>${this._t("n_items",{n:t.counts.items})}</span>`];return t.counts.low&&e.push(B`<span class="warn">${this._t("n_low",{n:t.counts.low})}</span>`),t.counts.expiring&&e.push(B`<span class="warn">${this._t("n_expiring",{n:t.counts.expiring})}</span>`),B`${e.map((t,e)=>B`${e?B`<span class="dot">·</span>`:W}${t}`)}`}_renderSearch(){return B`
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
        ${this._query?B`<button class="clear" aria-label=${this._t("close")} @click=${()=>this._query=""}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>`:W}
      </div>
    `}_renderChips(t,e){const i=[{filter:{kind:"all"},label:this._t("chip_all")}];if((t.counts.low||"low"===this._filter.kind)&&i.push({filter:{kind:"low"},label:this._t("chip_low"),count:t.counts.low}),(t.counts.expiring||"expiring"===this._filter.kind)&&i.push({filter:{kind:"expiring"},label:this._t("chip_expiring"),count:t.counts.expiring}),e.settings.shopping_list&&(t.counts.list||"list"===this._filter.kind)&&i.push({filter:{kind:"list"},label:this._t("chip_list"),count:t.counts.list,icon:"mdi:cart-outline"}),t.locations.length>1)for(const e of t.locations)i.push({filter:{kind:"location",value:e},label:Mt(this.hass,"loc",e)});if(i.length<2)return W;const o=(t,e)=>t.kind===e.kind&&(!("value"in t)||"value"in e&&t.value===e.value);return B`
      <div class="chips" role="toolbar" @scroll=${this._onScroll}>
        ${i.map(t=>B`
            <button
              class=${mt({chip:!0,selected:o(t.filter,this._filter)})}
              aria-pressed=${o(t.filter,this._filter)?"true":"false"}
              @click=${()=>this._filter=t.filter}
            >
              ${t.icon?B`<ha-icon .icon=${t.icon}></ha-icon>`:W}${t.label}
              ${null!=t.count?B`<span class="count">${t.count}</span>`:W}
            </button>
          `)}
      </div>
    `}_renderList(t,e){const i=this._query.trim(),o=i&&!t.exact?B`<button class="add-row" @click=${()=>this._openAdd(i)}>
            <span class="ricon"><ha-icon icon="mdi:plus"></ha-icon></span>
            <span>${this._t("add_named",{name:i})}</span>
          </button>`:W;if(!e.items.length&&!i)return B`<div class="empty">
        <ha-icon icon="mdi:package-variant"></ha-icon>
        <div class="big">${this._t("empty")}</div>
        <div>${this._t("empty_hint")}</div>
      </div>`;if(!t.shown)return B`${o}${i?W:B`<div class="empty"><div>${this._t("no_match")}</div></div>`}`;const s=this._config.group_by??"category",n="none"!==s&&t.groups.length>1;return B`
      ${o}
      ${t.groups.map(e=>B`
          ${n?B`<div class="group-head">
                ${e.key?Mt(this.hass,"location"===s?"loc":"cat",e.key):this._t("location"===s?"no_location":"no_category")}
                <span class="n">${e.items.length}</span>
              </div>`:W}
          ${e.items.map(e=>this._renderRow(e,t.statuses.get(e.id)))}
        `)}
    `}_expiryText(t,e){if(null!=t.days&&!t.out)return t.days<0?-1===t.days?this._t("expired_yesterday"):this._t("expired_ago",{n:-t.days}):0===t.days?this._t("expires_today"):1===t.days?this._t("expires_tomorrow"):t.soon?this._t("expires_in",{n:t.days}):this._t("expires_on",{date:this._formatDate(e.expiry)})}_formatDate(t){try{const[e,i,o]=t.split("-").map(Number);return new Date(e,i-1,o).toLocaleDateString(this.hass?.locale?.language??this.hass?.language,{day:"numeric",month:"short"})}catch{return t}}_renderRow(t,e){const i=e.out||e.expired?"bad":e.low||e.soon?"warn":"",o=this._config.group_by??"category",s=1===this._config.locations?.length,n=[];e.out?n.push({text:this._t("out_of_stock"),tone:"bad"}):e.low&&n.push({text:this._t("low"),tone:"warn"});const r=e.expired||e.soon||"expiry"===this._config.sort?this._expiryText(e,t):void 0;r&&n.push({text:r,tone:e.expired?"bad":e.soon?"warn":void 0}),t.location&&"location"!==o&&!s&&n.push({text:Mt(this.hass,"loc",t.location)}),n.length||!t.expiry||e.out||n.push({text:this._expiryText(e,t)});const a=e.out||e.low||e.expired||e.soon,c=function(t){switch(t){case"g":case"ml":return 100;case"kg":case"l":return.5;default:return 1}}(t.unit),l="pcs"===t.unit?"":Mt(this.hass,"unit",t.unit,t.quantity);return B`
      <div class=${mt({row:!0,out:e.out})}>
        <button class="main" @click=${()=>this._openEdit(t)} aria-label=${t.name}>
          <span class=${mt({ricon:!0,[i]:!!i})}><ha-icon .icon=${St(t)}></ha-icon></span>
          <span class="text">
            <span class="rname">${t.name}</span>
            ${n.length||e.onList?B`<span class=${mt({meta:!0,important:a})}>
                  ${e.onList?B`<ha-icon class="cart" icon="mdi:cart-outline" title=${this._t("on_list")}></ha-icon>`:W}
                  ${n.map((t,e)=>B`<span class=${mt({part:!0,[t.tone??""]:!!t.tone})}
                        >${e?B`<span class="dot">·</span>`:W}${t.text}</span
                      >`)}
                </span>`:W}
          </span>
        </button>
        <div class="stepper">
          <button
            class="step"
            ?disabled=${t.quantity<=0}
            aria-label=${this._t("decrease",{step:wt(c)})}
            @click=${()=>this._adjust(t,-c)}
          >
            <ha-icon icon="mdi:minus"></ha-icon>
          </button>
          <span class="qty"><b>${wt(t.quantity)}</b>${l?B`<small>${l}</small>`:W}</span>
          <button class="step" aria-label=${this._t("increase",{step:wt(c)})} @click=${()=>this._adjust(t,c)}>
            <ha-icon icon="mdi:plus"></ha-icon>
          </button>
        </div>
      </div>
    `}_schema(t){const e=t.items,i=(t,i,o)=>{const s=[...new Set(e.map(e=>e[t]).filter(t=>!!t&&!i.includes(t)))];return[...i,...s.sort()].map(t=>{const e=Ut(this.hass,o,t);return{value:e,label:e}})},o=t=>({select:{options:t,custom_value:!0,mode:"dropdown"}}),s={number:{min:0,step:"any",mode:"box"}};return[{name:"name",required:!0,selector:{text:{}}},{type:"grid",name:"",schema:[{name:"quantity",selector:s},{name:"unit",selector:o(i("unit",t.units,"unit"))}]},{type:"grid",name:"",schema:[{name:"category",selector:o(i("category",t.categories,"cat"))},{name:"location",selector:o(i("location",t.locations,"loc"))}]},{name:"expiry",selector:{date:{}}},{type:"grid",name:"",schema:[{name:"min_quantity",selector:s},{name:"restock_quantity",selector:s}]},...t.settings.shopping_list?[{name:"auto_shop",selector:{boolean:{}}}]:[],{name:"notes",selector:{text:{multiline:!0}}},{name:"icon",selector:{icon:{}}}]}async _openAdd(t){const e=this._config,i={name:t,quantity:1,unit:"pcs",auto_shop:!0};"location"===this._filter.kind?i.location=this._filter.value:1===e.locations?.length&&(i.location=e.locations[0]),1===e.categories?.length&&(i.category=e.categories[0]),await jt(),this._dialog={mode:"add",data:this._toForm(i),original:{},armed:!1,busy:!1}}async _openEdit(t){const e={};for(const i of Jt)e[i]=t[i]??void 0;await jt(),this._dialog={mode:"edit",id:t.id,data:this._toForm(e),original:e,armed:!1,busy:!1}}_toForm(t){return{...t,unit:Ut(this.hass,"unit",t.unit),category:Ut(this.hass,"cat",t.category),location:Ut(this.hass,"loc",t.location)}}_fromForm(t){const e=this._snap;return{...t,name:String(t.name??"").trim(),unit:Lt(this.hass,"unit",t.unit,e.units)??"pcs",category:Lt(this.hass,"cat",t.category,e.categories),location:Lt(this.hass,"loc",t.location,e.locations)}}_renderDialog(t,e){const i=t.id?e.items.find(e=>e.id===t.id):void 0,o=i?this._view.statuses.get(i.id):void 0,s="add"===t.mode?this._t("new_item"):i?.name??t.data.name??"",n=t.data.icon||(i?St(i):"mdi:package-variant-plus"),r=!!e.settings.shopping_list&&"edit"===t.mode&&!!i,a=i&&o?this._expiryText(o,i):void 0;return B`
      <dialog class="sp-dialog" aria-label=${s} @close=${this._onDialogClosed} @click=${this._onBackdrop}>
        <div class="surface">
          <div class="d-head">
            <div class="badge"><ha-icon .icon=${n}></ha-icon></div>
            <div class="d-title">${s}</div>
            <button class="round" aria-label=${this._t("close")} @click=${this._closeDialog}>
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="d-body">
            ${i&&o&&(o.out||o.low||o.onList||o.expired||o.soon)?B`<div class="d-status">
                  ${o.out?B`<span class="pill bad">${this._t("out_of_stock")}</span>`:o.low?B`<span class="pill warn">${this._t("low")}</span>`:W}
                  ${(o.expired||o.soon)&&a?B`<span class=${mt({pill:!0,bad:o.expired,warn:o.soon})}>${a}</span>`:W}
                  ${o.onList?B`<span class="pill"><ha-icon icon="mdi:cart-outline"></ha-icon>${this._t("on_list")}</span>`:W}
                </div>`:W}
            <ha-form
              .hass=${this.hass}
              .data=${t.data}
              .schema=${this._schema(e)}
              .computeLabel=${t=>this._t(`f_${t.name}`)}
              .computeHelper=${t=>"min_quantity"===t.name||"restock_quantity"===t.name?this._t(`h_${t.name}`):void 0}
              @value-changed=${this._onFormChanged}
            ></ha-form>
            ${t.error?B`<div class="d-error">${t.error}</div>`:W}
          </div>
          <div class="d-foot">
            ${"edit"===t.mode?B`<button
                  class=${mt({btn:!0,danger:!0,armed:t.armed})}
                  aria-label=${t.armed?this._t("delete_confirm"):this._t("delete")}
                  ?disabled=${t.busy}
                  @click=${this._onDelete}
                >
                  <ha-icon icon="mdi:delete-outline"></ha-icon><span class=${t.armed?"":"lbl"}>${t.armed?this._t("delete_confirm"):this._t("delete")}</span>
                </button>`:W}
            ${r?B`<button
                  class="btn"
                  aria-label=${i.shopping?this._t("remove_from_list"):this._t("add_to_list")}
                  ?disabled=${t.busy}
                  @click=${()=>this._toggleShopping(i)}
                >
                  <ha-icon .icon=${i.shopping?"mdi:cart-remove":"mdi:cart-plus"}></ha-icon>
                  <span class="lbl">${i.shopping?this._t("remove_from_list"):this._t("add_to_list")}</span>
                </button>`:W}
            <span class="spacer"></span>
            <button class="btn cancel" @click=${this._closeDialog}>${this._t("cancel")}</button>
            <button class="btn filled" ?disabled=${t.busy||!String(t.data.name??"").trim()} @click=${this._onSave}>
              ${this._t("save")}
            </button>
          </div>
        </div>
      </dialog>
    `}async _call(t){return this.hass.callWS({...t,inventory:this._snap.entry_id})}async _toggleShopping(t){const e=this._dialog;if(e){this._dialog={...e,busy:!0};try{await this._call({type:`${Zt}/item/shop`,item_id:t.id,on:!t.shopping}),this._dialog&&(this._dialog={...this._dialog,busy:!1})}catch(t){this._dialog&&(this._dialog={...this._dialog,busy:!1,error:Dt(t)})}}}async _adjust(t,e){const i=this._snap;if(!i)return;const o=Math.max(0,Math.round(1e3*(t.quantity+e))/1e3);if(o!==t.quantity){this._snap={...i,items:i.items.map(e=>e.id===t.id?{...e,quantity:o}:e)};try{await this._call({type:`${Zt}/item/adjust`,item_id:t.id,amount:o-t.quantity})}catch(t){s=this,n=this._t("failed",{error:Dt(t)}),Nt(s,"hass-notification",{message:n})}var s,n}}}Qt.styles=[Ht,Rt],t([ht({attribute:!1})],Qt.prototype,"hass",void 0),t([ht({type:Boolean,reflect:!0})],Qt.prototype,"compact",void 0),t([pt()],Qt.prototype,"_config",void 0),t([pt()],Qt.prototype,"_snap",void 0),t([pt()],Qt.prototype,"_error",void 0),t([pt()],Qt.prototype,"_query",void 0),t([pt()],Qt.prototype,"_filter",void 0),t([pt()],Qt.prototype,"_dialog",void 0),window.customCards?.some(t=>"stock-pulse-card"===t.type)||(window.customCards=window.customCards||[],window.customCards.push({type:"stock-pulse-card",name:"Stock Pulse Card",description:"What you have at home, what is running low, and a shopping list that fills itself.",preview:!0,documentationURL:"https://github.com/zacharatos/stock-pulse-integration"}),It("stock-pulse-card",Qt).then(()=>console.info(`%c STOCK-PULSE-CARD %c ${Kt} `,"color:white;background:#555;font-weight:600;border-radius:4px 0 0 4px;padding:2px 4px","color:white;background:var(--primary-color,#03a9f4);border-radius:0 4px 4px 0;padding:2px 4px")));export{Qt as StockPulseCard,Kt as VERSION};
