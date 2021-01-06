import {ESLSetting} from '../setting';
import {attr} from '../../../../../src/modules/esl-base-element/core';

export class ESLTextSetting extends ESLSetting {
  public static is = 'esl-text-setting';
  protected input: HTMLInputElement;
  @attr() public value: string;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.input.value !== newVal) {
      this.input.value = newVal;
    }
  }

  protected render(): void {
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.id = this.name;

    this.input.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.value = (event.target as HTMLInputElement).value;
      this.onValueChange();
    });

    this.appendChild(this.input);
  }
}

ESLTextSetting.register();
