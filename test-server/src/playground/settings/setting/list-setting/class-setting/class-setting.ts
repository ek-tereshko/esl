import {ESLListSetting} from '../list-setting';
import {bind} from '../../../../../../../src/modules/esl-utils/decorators/bind';
import {EventUtils} from '../../../../../../../src/modules/esl-utils/dom/events';

export class ESLClassSetting extends ESLListSetting {
  public static is = 'esl-class-setting';

  @bind
  protected onValueChange(e: Event) {
    e.preventDefault();
    this.value = this.targetValue(e);
    EventUtils.dispatch(this, 'classChange', {detail:
        {value: this.value, selector: this.selector, values: this.values}});
  }
}

ESLClassSetting.register();
