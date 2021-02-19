// Support for ES5 bundle target
import '../../src/polyfills/es5-target-shim';
// Builtin polyfills
import '../../src/polyfills/polyfills.es6';
// Validate environment
import '../../src/polyfills/polyfills.validate';

import './common/back-button';
import './common/test-media';
import './common/test-media-source';

// With Namespace
import '../../src/modules/lib';

import {
  ESLImage,
  ESLMedia,
  ESLPopup,
  ESLPanel,
  ESLPanelGroup,
  ESLTrigger,
  ESLA11yGroup,
  ESLTabsContainer,
  ESLTab,
  ESLScrollableTabs,
  ESLScrollbar,
  ESLAlert,
  ESLToggleableDispatcher,
  ESLSelect,
  ESLSelectList
} from '../../src/modules/all';

import '../../src/modules/esl-media/providers/iframe-provider';
import '../../src/modules/esl-media/providers/html5/audio-provider';
import '../../src/modules/esl-media/providers/html5/video-provider';
import '../../src/modules/esl-media/providers/youtube-provider';
import '../../src/modules/esl-media/providers/brightcove-provider';

import {
  ESLCarousel,
  ESLCarouselPlugins
} from '../../src/modules/draft/all';

ESLImage.register();
ESLMedia.register();

ESLToggleableDispatcher.init();
ESLPopup.register();
ESLPanel.register();
ESLPanelGroup.register();

ESLTrigger.register();
ESLTab.register();

ESLA11yGroup.register();
ESLTabsContainer.register();
ESLScrollableTabs.register();

ESLScrollbar.register();
ESLAlert.register();
ESLAlert.init();

ESLSelectList.register();
ESLSelect.register();

ESLCarousel.register();
ESLCarouselPlugins.Dots.register();
ESLCarouselPlugins.Link.register();
ESLCarouselPlugins.Touch.register();
ESLCarouselPlugins.Autoplay.register();
