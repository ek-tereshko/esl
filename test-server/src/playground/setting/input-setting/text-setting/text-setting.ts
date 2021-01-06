import {attr} from '../../../../../../src/modules/esl-base-element/core';
import {ESLInputSetting} from '../input-setting';

export class ESLTextSetting extends ESLInputSetting {
  public static is = 'esl-text-setting';
  @attr() public value: string;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.input.value !== newVal) {
      this.input.value = newVal;
    }
  }

  protected render(): void {
    this.renderInput();
    this.input.type = 'text';

    this.input.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.value = (event.target as HTMLInputElement).value;
      this.onValueChange();
    });
  }
}

ESLTextSetting.register();
