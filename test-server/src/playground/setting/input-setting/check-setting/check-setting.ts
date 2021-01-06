import {boolAttr} from '../../../../../../src/modules/esl-base-element/core';
import {ESLInputSetting} from '../input-setting';

export class ESLCheckSetting extends ESLInputSetting {
  static is = 'esl-check-setting';
  @boolAttr() public value = false;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.input.checked !== (newVal === '')) {
      this.input.checked = (newVal === '');
    }
  }

  protected render(): void {
    this.renderInput();
    this.input.type = 'checkbox';

    this.input.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.value = (event.target as HTMLInputElement).checked;
      this.onValueChange();
    });
  }
}

ESLCheckSetting.register();
