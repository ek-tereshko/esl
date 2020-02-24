/**
 * Simple Audio API provider for {@link SmartMedia}
 * @author Alexey Stsefanovich (ala'n)
 */

import {HTMLMediaProvider} from './media-provider';
import EmbeddedVideoProviderRegistry from '../../smart-media-registry';

export class AudioProvider extends HTMLMediaProvider<HTMLAudioElement> {
	static get providerName() {
		return 'audio';
	}

	protected createElement(): HTMLAudioElement {
		const el = document.createElement('audio');
		el.innerHTML = HTMLMediaProvider.buildSrc(this.component.mediaSrc, 'audio/mpeg');
		return el;
	}

    get defaultAspectRatio(): number {
        return 0;
    }

    setSize(width: number | 'auto', height: number | 'auto'): void {
	    return;
    }
}

EmbeddedVideoProviderRegistry.register(AudioProvider, AudioProvider.providerName);
