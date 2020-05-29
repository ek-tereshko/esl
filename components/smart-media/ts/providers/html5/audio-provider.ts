/**
 * Simple Audio API provider for {@link SmartMedia}
 * @author Alexey Stsefanovich (ala'n)
 */

import {HTMLMediaProvider} from './media-provider';
import SmartMediaProviderRegistry from '../../smart-media-registry';

export class AudioProvider extends HTMLMediaProvider<HTMLAudioElement> {
	static get providerName() {
		return 'audio';
	}

	protected createElement(): HTMLAudioElement {
		const el = document.createElement('audio');
		el.src = this.component.mediaSrc;
		return el;
	}

    get defaultAspectRatio(): number {
        return 0;
    }
}

SmartMediaProviderRegistry.register(AudioProvider, AudioProvider.providerName);
