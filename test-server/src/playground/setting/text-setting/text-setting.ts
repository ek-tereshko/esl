import {ESLSetting} from '../setting';

export class ESLTextSetting extends ESLSetting {
  static is = 'esl-text-setting';
  protected input: HTMLInputElement;

  protected attributeChangedCallback(attrName: string, oldVal: string, newVal: string): void {
    if (!this.connected || oldVal === newVal) return;

    if (attrName === 'value' && this.input.value !== newVal) {
      this.input.value = newVal;
    }
  }

  protected render(): void {
    this.addLabel();

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.id = this.name;

    this.input.addEventListener('change', (event: Event) => {
      event.preventDefault();
      this.setAttribute('value', (event.target as HTMLInputElement).value);
      this.onValueChange();
    });

    this.appendChild(this.input);
  }
}

ESLTextSetting.register();
