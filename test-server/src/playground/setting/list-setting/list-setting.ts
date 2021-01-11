import {attr} from '../../../../../src/modules/esl-base-element/core';
import {ESLSetting} from '../setting';

export class ESLListSetting extends ESLSetting {
  public static is = 'esl-list-setting';
  protected select: HTMLSelectElement;

  @attr() public value: string;
  @attr({readonly: true}) public values: string;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.select.value !== newVal) {
      this.select.value = newVal;
    }
  }

  protected render(): void {
    this.select = document.createElement('select');
    this.select.id = this.name;
    this.createOptions();
    this.value = this.select.value;

    this.select.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.value = (event.target as HTMLSelectElement).value;
      this.onValueChange();
    });

    this.appendChild(this.select);
  }

  protected createOptions(): void {
    if (this.select.length) {
      this.select.length = 0;
    }

    this.values.split(',').forEach(value => this.select.add(new Option(value, value)));
  }
}

ESLListSetting.register();
