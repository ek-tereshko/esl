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

  protected render(inputType: string): void {
    this.innerHTML = `<label for="${this.name}">${this.name}</label>
                      <input type="${inputType}" id="${this.name}">`;
    this.querySelector('input')?.addEventListener('change', (ev: Event) => {
      this.setAttribute('value', (ev.target as HTMLInputElement).value);
      this.onValueChange();
    });
  }

  protected setStyle(): void {
    this.style.display = 'block';
  }
}
