import {boolAttr} from '../../../../../../src/modules/esl-base-element/core';
import {ESLInputSetting} from '../input-setting';

export class ESLCheckSetting extends ESLInputSetting {
  public static is = 'esl-check-setting';
  @boolAttr() public value: boolean = false;

  protected targetValue(e: Event): string | boolean {
    return (e.target as HTMLInputElement).checked;
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    const val = (newVal === '');
    if (attrName === 'value' && this.input.checked !== val) {
      this.input.checked = val;
    }
  }

  protected render(): void {
    this.renderInput('checkbox');
  }
}

ESLCheckSetting.register();
