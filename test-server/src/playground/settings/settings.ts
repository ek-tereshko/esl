import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {attr} from '../../../../src/modules/esl-base-element/decorators/attr';
import {ESLCheckSetting} from '../setting/input-setting/check-setting/check-setting';
import {ESLListSetting} from '../setting/list-setting/list-setting';
import {ESLTextSetting} from '../setting/input-setting/text-setting/text-setting';
import {ESLSetting} from '../setting/setting';


export class Settings extends ESLBaseElement {
  public static is = 'esl-settings';
  public static eventNs = 'esl:settings';

  @attr() public markup: string;

  static get observedAttributes() {
    return ['markup'];
  }

  protected connectedCallback() {
    console.log('settings callback');
    super.connectedCallback();
  }

  protected bindEvents() {
    this.addEventListener(`${ESLSetting}:valueChange`, this._onSettingsChanged);
  }

  private _onSettingsChanged(e: any) {
    const elem = new DOMParser().parseFromString(this.markup, 'text/html').body.firstElementChild;
    const {attrName, attrValue} = e.detail; //check?
    if (elem && attrName && attrValue) {
      elem.setAttribute(attrName, attrValue); // TODO coordinate names
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
          settingTag.setAttribute('value', attrValue || '');
          console.log(settingTag);
        }
      }
    }
  }

  private unbindEvents() {
    this.removeEventListener(`${ESLSetting}:valueChange`, this._onSettingsChanged);
  }
}

Settings.register();
