import type {ESLToggleableTagShape} from '../../esl-toggleable/core/esl-toggleable.shape';
import type {ESLAlert} from './esl-alert';

/**
 * Tag declaration interface of {@link ESLAlert} element
 * Used for TSX declaration
 */
export interface ESLAlertShape extends ESLToggleableTagShape<ESLAlert> {
  /**
   * Define the scope (using {@link TraversingQuery} syntax) element to listen to activation event.
   * Parent element by default
   */
  target?: string;
}

declare global {
  namespace JSX {
    export interface IntrinsicElements {
      /** {@link ESLAlert} custom tag */
      'esl-alert': ESLAlertShape;
    }
  }
}
