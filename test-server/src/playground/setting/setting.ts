import {ESLBaseElement, attr} from '../../../../src/modules/esl-base-element/core';
import {bind} from '../../../../src/modules/esl-utils/decorators/bind';

export abstract class ESLSetting extends ESLBaseElement {
  static eventNs = 'esl:setting';

  @attr({readonly: true}) public name: string;
  @attr({readonly: true}) public for: string;
  public value: string | boolean;

  protected abstract render(): void;
  protected abstract get target(): HTMLElement;
  protected abstract targetValue(e: Event): string | boolean;

  protected connectedCallback() {
    super.connectedCallback();
    this.renderLabel();
    this.render();

    this.target.addEventListener('change', this.onValueChange);
    this.appendChild(this.target);
  }

  static get observedAttributes(): string[] {
    return ['value'];
  }

  @bind
  protected onValueChange(e: Event): void {
    e.preventDefault();
    this.value = this.targetValue(e);
    this.$$fireNs('valueChange', {detail: {name: this.name, value: this.value, forTag: this.for}});
  }

  protected renderLabel(): void {
    const label = document.createElement('label');
    label.innerText = this.name;
    label.htmlFor = this.name;

    this.appendChild(label);
  }

  protected disconnectedCallback() {
    super.disconnectedCallback();
    this.target.removeEventListener('change', this.onValueChange);
  }
}
