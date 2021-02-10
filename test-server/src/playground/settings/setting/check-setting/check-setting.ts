import {boolAttr} from '../../../../../../src/modules/esl-base-element/core';
import {ESLSetting} from '../setting';

export class ESLCheckSetting extends ESLSetting {
  public static is = 'esl-check-setting';
  @boolAttr() public value: boolean = false;

  protected input: HTMLInputElement;

  protected get target(): HTMLInputElement {
    return this.input;
  }

  protected renderInput(inputType: string): void {
    this.input = document.createElement('input');
    this.input.type = inputType;
    this.input.name = this.name;
  }

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
