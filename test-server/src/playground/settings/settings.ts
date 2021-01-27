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
    const {name, value, selector} = e.detail;
    if (!selector || !name) return;

    const component = new DOMParser().parseFromString(this.playground.state, 'text/html').body;
    const tags = component.querySelectorAll(selector);
    if (!tags.length) return;

    if (typeof value !== 'boolean') {
      tags.forEach(tag => tag.setAttribute(name, value));
    } else {
      value ? tags.forEach(tag => tag.setAttribute(name, '')) : tags.forEach(tag => tag.removeAttribute(name));
    }
    this.playground.passMarkup(component.innerHTML, ESLSettings.is);
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

    const component = new DOMParser().parseFromString(markup, 'text/html').body;
    for (let settingTag of this.settingsTags) {
      settingTag = settingTag as typeof ESLSetting;
      const {name, for: selector} = settingTag;
      if (!selector || !name) continue;

      const attrValues = Array.prototype.map.call(component.querySelectorAll(selector),
        (tag: HTMLElement) => tag.getAttribute(name));
      if (!attrValues.length) continue;

      if (attrValues.length === 1) {
        settingTag.setAttribute('value', attrValues[0]);
      }
      else {
        attrValues.every((value: string) => value === attrValues[0]) ?
          settingTag.setAttribute('value', attrValues[0]) : settingTag.setAttribute('value', 'null');
      }
    }
  }

  private unbindEvents() {
    this.removeEventListener('valueChange', this._onSettingsChanged);
    this.playground.unsubscribe(this.parseCode);
  }
}

ESLSettings.register();
