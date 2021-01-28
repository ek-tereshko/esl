import {ESLCheckSetting} from './setting/input-setting/check-setting/check-setting';
import {ESLListSetting} from './setting/list-setting/list-setting';
import {ESLTextSetting} from './setting/input-setting/text-setting/text-setting';
import {ESLSetting} from './setting/setting';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';
import {ESLBaseElement} from '../../../../src/modules/esl-base-element/core/esl-base-element';
import {ESLPlayground} from '../core/playground';
import {TraversingQuery} from '../../../../src/modules/esl-traversing-query/core/esl-traversing-query';

export class ESLSettings extends ESLBaseElement {
  public static is = 'esl-settings';
  protected playground: ESLPlayground;

  protected connectedCallback() {
    super.connectedCallback();
    this.playground = TraversingQuery.first(`::parent(${ESLPlayground.is})`, this) as ESLPlayground;
    if (this.playground) {
      this.playground.subscribe(this.parseCode);
    }
    this.bindEvents();
  }

  protected bindEvents() {
    this.addEventListener('valueChange', this._onSettingsChanged);
  }

  private _onSettingsChanged(e: any) {
    const {name, value, forTag} = e.detail;
    if (!forTag || !name) return;

    const elem = new DOMParser().parseFromString(this.playground.state, 'text/html').body;
    const tag = elem.getElementsByTagName(forTag)[0];
    if (!tag) return;

    if (typeof value !== 'boolean') {
      tag.setAttribute(name, value);
    } else {
      value ? tag.setAttribute(name, '') : tag.removeAttribute(name);
    }
    this.playground.passMarkup(elem.innerHTML, ESLSettings.is);
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

  @bind
  public parseCode(markup: string, source: string) {
    if (source === ESLSettings.is) return;

    const elem = new DOMParser().parseFromString(markup, 'text/html').body;
    for (let settingTag of this.settingsTags) {
      settingTag = settingTag as typeof ESLSetting;
      const {name, for: forTag} = settingTag;
      if (!forTag || !name) continue;

      const tag = elem.getElementsByTagName(forTag)[0];
      if (!tag) continue;

      const attrValue = tag.getAttribute(name);
      settingTag.setAttribute('value', attrValue);
    }
  }

  private unbindEvents() {
    this.removeEventListener(`${ESLSetting}:valueChange`, this._onSettingsChanged);
    this.playground && this.playground.unsubscribe(this.parseCode);
  }
}

ESLSettings.register();
