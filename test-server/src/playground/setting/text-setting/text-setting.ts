import {ESLSetting} from '../setting';

export class ESLTextSetting extends ESLSetting {
  static is = 'esl-text-setting';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setStyle();
    this.render('text');
  }

  protected render(inputType: string): void {
    const input = document.createElement('input');
    input.type = inputType;
    input.addEventListener('', this.onValueChange);
    this.appendChild(input);
  }
}

ESLTextSetting.register();
