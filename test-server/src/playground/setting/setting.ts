import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';

export abstract class ESLSetting extends ESLBaseElement {
  static eventNs = 'esl:setting';

  @attr() name: string;
  @attr() value: string | boolean;

  protected abstract render(): void;

  constructor() {
    super();

    this.style.display = 'block';
  }

  static get observedAttributes(): string[] {
    return ['name', 'value'];
  }

  protected onValueChange(): void {
    this.$$fireNs('valueChange', {detail: {name: this.name, value: this.value}});
  }

  protected setStyle(): void {
    this.style.display = 'block';
  }
}
