// HTMLElement ES6 extends shim
import '../helpers/es5-support/es6-htmlelement-shim';

// Builtin polyfills
import '../helpers/builtin-polyfils/closest-polyfill';

import * as SmartQuery from '../components/smart-query/smart-query';
import {SmartMulticarousel, SmartMulticarouselDots} from '../components/smart-multicarousel/smart-multicarousel';
import {SmartImage} from '../components/smart-image/smart-image';

export {
	SmartQuery,
	SmartMulticarousel,
	SmartMulticarouselDots,
	SmartImage,
};
