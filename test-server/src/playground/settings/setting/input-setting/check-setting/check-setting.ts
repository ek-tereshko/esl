import {boolAttr} from '../../../../../../../src/modules/esl-base-element/core';
import {ESLInputSetting} from '../input-setting';

export class ESLCheckSetting extends ESLInputSetting {
  public static is = 'esl-check-setting';
  @boolAttr() public value: boolean = false;

  protected targetValue(e: Event): boolean {
    return (e.target as HTMLInputElement).checked;
  }

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value') {
      this.input.checked = this.value;
    }
  }

  protected render(): void {
    this.renderInput('checkbox');
  }
}

ESLCheckSetting.register();
