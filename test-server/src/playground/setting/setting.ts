import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';

export abstract class ESLSetting extends ESLBaseElement {
  static eventNs = 'esl:setting';

  @attr() name: string;
  @attr() value: string | boolean;

  static get observedAttributes(): string[] {
    return ['name', 'value'];
  }

  @bind
  protected onValueChange(): void {
    this.$$fireNs('settingChange', {detail: {name: this.name, value: this.value}});
  }

  protected setStyle(): void {
    this.style.display = 'block';
  }
}
