import {ESLCheckSetting} from './setting/input-setting/check-setting/check-setting';
import {ESLListSetting} from './setting/list-setting/list-setting';
import {ESLTextSetting} from './setting/input-setting/text-setting/text-setting';
import {ESLClassSetting} from './setting/list-setting/class-setting/class-setting';
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
    this.addEventListener('classChange', this._onClassChange);
  }

  private _onClassChange(e: any) {
    const {value, selector, values} = e.detail;

    const component = new DOMParser().parseFromString(this.playground.state, 'text/html').body;
    const tags = component.querySelectorAll(selector);
    if (!tags.length) return;

    tags.forEach((tag: HTMLElement) => {
      const removeClass = values.find((val: string) => tag.classList.contains(val));
      removeClass && tag.classList.remove(removeClass);
      tag.classList.add(value);
    });

    this.playground.passMarkup(component.innerHTML, ESLSettings.is);
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

  protected disconnectedCallback(): void {
    this.unbindEvents();
    super.disconnectedCallback();
  }

  private get attrSettingsTags(): any[] {
    return [
      ...this.getElementsByTagName(ESLCheckSetting.is),
      ...this.getElementsByTagName(ESLListSetting.is),
      ...this.getElementsByTagName(ESLTextSetting.is),
    ];
  }

  private get classSettingsTags(): any[] {
    return [...this.getElementsByTagName(ESLClassSetting.is)];
  }

  @bind
  public parseCode(markup: string, source: string): void {
    if (source === ESLSettings.is) return;

    const component = new DOMParser().parseFromString(markup, 'text/html').body;

    this.setAttrSettings(component);
    this.setClassSettings(component);
  }

  protected setAttrSettings(component: HTMLElement): void {
    for (let settingTag of this.attrSettingsTags) {
      settingTag = settingTag as typeof ESLSetting;
      const {name, selector} = settingTag;

      if (!selector || !name) continue;

      const attrValues = Array.prototype.map.call(component.querySelectorAll(selector),
        (tag: HTMLElement) => tag.getAttribute(name));
      if (!attrValues.length) continue;

      if (attrValues.length === 1) {
        const [val] = attrValues;
        (val === null) ? settingTag.removeAttribute('value') : settingTag.setAttribute('value', val);
      } else {
        attrValues.every((value: string) => value === attrValues[0]) ?
          settingTag.setAttribute('value', attrValues[0]) : settingTag.setAttribute('value', 'null');
      }
    }
  }

  protected setClassSettings(component: HTMLElement): void {
    for (let classSetting of this.classSettingsTags) {
      classSetting = classSetting as ESLClassSetting;
      const {selector, values} = classSetting;

      const classLists: DOMTokenList[] = Array.prototype.map.call(component.querySelectorAll(selector),
        (tag: HTMLElement) => tag.classList);
      if (!classLists.length) continue;

      const item = values.find((val: string) => classLists[0].contains(val));

      if (classLists.length === 1) {
        item ? (classSetting.value = item) : (classSetting.value = 'null');
      } else {
        classLists.every((classList: DOMTokenList) => classList.contains(item)) ?
          classSetting.value = item : classSetting.value = 'null';
      }
    }
  }

  private unbindEvents(): void {
    this.removeEventListener('valueChange', this._onSettingsChanged);
    this.removeEventListener('classChange', this._onClassChange);
    this.playground.unsubscribe(this.parseCode);
  }
}

ESLSettings.register();
