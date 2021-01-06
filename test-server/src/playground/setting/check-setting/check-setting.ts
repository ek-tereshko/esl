import {ESLSetting} from '../setting';
import {boolAttr} from '../../../../../src/modules/esl-base-element/core';

export class ESLCheckSetting extends ESLSetting {
  static is = 'esl-check-setting';
  protected input: HTMLInputElement;
  @boolAttr() public value: boolean;

  protected render(): void {
    this.input = document.createElement('input');
    this.input.type = 'checkbox';
    this.input.id = this.name;

    this.input.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.value = (event.target as HTMLInputElement).checked;
      this.onValueChange();
    });

    this.appendChild(this.input);
  }
}

ESLCheckSetting.register();
