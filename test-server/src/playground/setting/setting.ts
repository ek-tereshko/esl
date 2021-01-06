import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export abstract class ESLSetting extends ESLBaseElement {
  static eventNs = 'esl:setting';

  @attr() name: string;
  @attr() value: string | boolean;

  static get observedAttributes(): string[] {
    return ['name', 'value'];
  }

  protected onValueChange(): void {
    this.$$fireNs('settingChange', {detail: {name: this.name, value: this.value}});
  }
}
