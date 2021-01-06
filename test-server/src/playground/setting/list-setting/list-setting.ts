import {ESLSetting} from '../setting';

export class ESLListSetting extends ESLSetting {
  static is = 'esl-list-setting';
  protected select: HTMLSelectElement;

  protected render() {
  }
}

ESLListSetting.register();
