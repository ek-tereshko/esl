import {ESLCheckSetting} from './setting/input-setting/check-setting/check-setting';
import {ESLListSetting} from './setting/list-setting/list-setting';
import {ESLTextSetting} from './setting/input-setting/text-setting/text-setting';
import {ESLSetting} from './setting/setting';
import {bind} from '../../../../../src/modules/esl-utils/decorators/bind';
import {ESLBaseElement} from '../../../../../src/modules/esl-base-element/core/esl-base-element';
import {Playground} from '../../core/playground';

export class ESLSettings extends ESLBaseElement {
  public static is = 'esl-settings';
  protected playground: Playground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = (document.querySelector('esl-playground') as Playground);
    this.playground.subscribe(this.parseCode);
    this.bindEvents();
  }

  protected bindEvents() {
    this.addEventListener(`${ESLSetting.eventNs}:valueChange`, this._onSettingsChanged);
  }

  private _onSettingsChanged(e: any) {
    const elem = new DOMParser().parseFromString(this.playground?.state, 'text/html').body;
    const {name, value, forTag} = e.detail; // check?
    if (elem.children.length) {
      const tag = (forTag === '') ? elem.firstElementChild : elem.getElementsByTagName(forTag || '')[0]; // [0]???
      if (typeof value !== 'boolean') {
        tag.setAttribute(name, value);
      } else {
        value ? tag.setAttribute(name, '') : tag.removeAttribute(name);
      }
      this.playground.passMarkup(elem.innerHTML, ESLSettings.is);
    }
  }

  protected disconnectedCallback() {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  private get settingsTags(): any[] {
    return [
      ...this.getElementsByTagName(ESLCheckSetting.is),
      ...this.getElementsByTagName(ESLListSetting.is),
      ...this.getElementsByTagName(ESLTextSetting.is),
    ];
  }

  // TODO refactor this terrible method
  @bind
  public parseCode(markup: string, source: string) {
    if (source === ESLSettings.is) {
      return;
    }

    const elem = new DOMParser().parseFromString(markup, 'text/html').body;
    if (elem.children.length) {
      for (let settingTag of this.settingsTags) {
        settingTag = settingTag as typeof ESLSetting;
        const attrName = settingTag.name;
        const tagName = settingTag.for;
        const tag = (tagName === '') ? elem.firstElementChild : elem.getElementsByTagName(tagName || '')[0]; // [0]???
        if (attrName && tag) {
          const attrValue = tag.getAttribute(attrName);
          settingTag.setAttribute('value', attrValue);
        }
      }
    }
  }

  private unbindEvents() {
    this.removeEventListener(`${ESLSetting}:valueChange`, this._onSettingsChanged);
    this.playground.unsubscribe(this.parseCode);
  }
}

ESLSettings.register();
