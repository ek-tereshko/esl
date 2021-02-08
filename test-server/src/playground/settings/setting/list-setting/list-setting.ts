import {attr} from '../../../../../../src/modules/esl-base-element/core';
import {ESLSetting} from '../setting';

export class ESLListSetting extends ESLSetting {
  public static is = 'esl-list-setting';
  protected select: HTMLSelectElement;

  @attr() public value: string;

  protected get target(): HTMLElement {
    return this.select;
  }

  protected targetValue(e: Event): string {
    return (e.target as HTMLSelectElement).value;
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.select.value !== newVal) {
      this.select.value = newVal;
    }
  }

  protected render(): void {
    this.select = document.createElement('select');
    this.select.name = this.name;
    this.createOptions();
    this.value = this.select.value;
  }

  protected createOptions(): void {
    this.querySelectorAll('esl-list-item').forEach(item => {
      if (item.textContent) {
        const value = item.getAttribute('value');
        this.select.add(new Option(item.textContent, value ? value : item.textContent));
      }
    });
  }
}

ESLListSetting.register();
