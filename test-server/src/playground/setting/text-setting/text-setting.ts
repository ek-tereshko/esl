import {ESLSetting} from '../setting';

export class ESLTextSetting extends ESLSetting {
  static is = 'esl-text-setting';

  protected connectedCallback(): void {
    super.connectedCallback();
    this.setStyle();
    this.render('text');
  }
}

ESLTextSetting.register();
