import {ESLSetting} from '../setting';

export class ESLTextSetting extends ESLSetting {
  static is = 'esl-text-setting';

  protected connectedCallback(): void {
    super.connectedCallback();
    // this.setStyle();
    this.render();
  }

  protected render(): void {
    this.innerHTML = `<label for="${this.name}-setting">${this.name}</label>
                      <input  type="text" id="${this.name}-setting">`;
  }
}

ESLTextSetting.register();
