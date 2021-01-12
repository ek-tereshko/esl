import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {attr} from '../../../../src/modules/esl-base-element/decorators/attr';
import {ESLCheckSetting} from '../setting/input-setting/check-setting/check-setting';
import {ESLListSetting} from '../setting/list-setting/list-setting';
import {ESLTextSetting} from '../setting/input-setting/text-setting/text-setting';
import {ESLSetting} from '../setting/setting';


export class ESLSettings extends ESLBaseElement {
  public static is = 'esl-settings';
  public static eventNs = 'esl:settings';

  @attr() public markup: string;

  static get observedAttributes() {
    return ['markup'];
  }

  protected connectedCallback() {
    super.connectedCallback();
    this.bindEvents();
    this.parseCode(this.markup);
  }

  protected bindEvents() {
    this.addEventListener(`${ESLSetting.eventNs}:valueChange`, this._onSettingsChanged);
  }

  private _onSettingsChanged(e: any) {
    console.log('detail', e.detail);
    const elem = new DOMParser().parseFromString(this.markup, 'text/html').body;
    const {name, value, forTag} = e.detail; //check?
    if (elem.children.length) {
      const tag = (forTag === '') ? elem.firstElementChild : elem.getElementsByTagName(forTag || '')[0]; //[0]???
      if (typeof value !== 'boolean') {
        tag.setAttribute(name, value);
      } else {
        value ? tag.setAttribute(name, '') : tag.removeAttribute(name);
      }
      this.$$fireNs('markupChange', {detail: {markup: elem.innerHTML}});
    }
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  private attributeChangedCallback(attrName: string, oldVal: string, newVal: string) {
    if (!this.connected || oldVal === newVal) return;
    if (attrName === 'markup') {
      this.markup = newVal;
      this.parseCode(this.markup);
    }
  }

  private get settingsTags(): any[] {
    return [
      ...this.getElementsByTagName(ESLCheckSetting.is),
      ...this.getElementsByTagName(ESLListSetting.is),
      ...this.getElementsByTagName(ESLTextSetting.is),
    ];
  }

  //TODO refactor this terrible method
  public parseCode(code: string) {
    const elem = new DOMParser().parseFromString(code, 'text/html').body;
    console.log(elem);
    if (elem.children.length) {
      for (let settingTag of this.settingsTags) {
        settingTag = settingTag as typeof ESLSetting;
        const attrName = settingTag.name;
        const tagName = settingTag.for;
        const tag = (tagName === '') ? elem.firstElementChild : elem.getElementsByTagName(tagName || '')[0]; //[0]???
        if (attrName && tag) {
          const attrValue = tag.getAttribute(attrName);
          settingTag.setAttribute('value', attrValue);
        }
      }
    }
  }

  private unbindEvents() {
    this.removeEventListener(`${ESLSetting}:valueChange`, this._onSettingsChanged);
  }
}

ESLSettings.register();
