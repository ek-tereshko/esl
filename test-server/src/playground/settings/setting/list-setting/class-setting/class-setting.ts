import {ESLListSetting} from '../list-setting';
import {bind} from '../../../../../../../src/modules/esl-utils/decorators/bind';

export class ESLClassSetting extends ESLListSetting {
  public static is = 'esl-class-setting';

  @bind
  protected onValueChange(e: Event) {
    e.preventDefault();
    this.value = this.targetValue(e);
    this.$$fire('classChange', {detail: {value: this.value, selector: this.selector, values: this.values}});
  }
}

ESLClassSetting.register();
