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
    const elem = new DOMParser().parseFromString(this.markup, 'text/html').body.firstElementChild;
    const {name, value} = e.detail; //check?
    if (elem) {
      if (typeof value !== 'boolean') {
        elem.setAttribute(name, value);
      } else {
        value ? elem.setAttribute(name, '') : elem.removeAttribute(name);
      }
      this.$$fireNs('markupChange', {detail: {markup: elem.outerHTML}});
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

  private get settingsTags(): Element[] {
    return [
      ...this.getElementsByTagName(ESLCheckSetting.is),
      ...this.getElementsByTagName(ESLListSetting.is),
      ...this.getElementsByTagName(ESLTextSetting.is),
    ];
  }

  //TODO refactor this terrible method
  public parseCode(code: string) {
    const elem = new DOMParser().parseFromString(code, 'text/html').body.firstElementChild;
    if (elem) {
      for (const settingTag of this.settingsTags) {
        const attrName = settingTag.getAttribute('name');
        if (attrName) {
          const attrValue = elem.getAttribute(attrName);
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
