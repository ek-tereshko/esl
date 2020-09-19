/** Interface to describe abstract listenable target */
export type ListenableTarget = {
	addEventListener: (
		event: string,
		callback: (payload: any) => void,
		options?: boolean | AddEventListenerOptions | undefined
	) => void;
	removeEventListener: (
		event: string,
		callback: (payload: any) => void,
		options?: boolean | AddEventListenerOptions | undefined
	) => void;
};

/**
 * Promise utils helper class
 */
export abstract class PromiseUtils {
	/**
	 * @return {Promise} that will be resolved in {@param timeout} with optional {@param payload}
	 */
	static fromTimeout<T>(timeout: number, payload?: T): Promise<T> {
		return new Promise<T>((resolve) =>
			setTimeout(resolve.bind(null, payload), timeout)
		);
	}

	/**
	 * @return {Promise} that will be resolved by dispatching {@param event} on {@param target}
	 * Or it will be rejected in {@param timeout} if it's specified
	 * Optional {@param options} for addEventListener can be also specified
	 */
	static fromEvent(
		target: ListenableTarget,
		event: string,
		timeout?: number | null | undefined,
		options?: boolean | AddEventListenerOptions
	): Promise<Event>{
		return new Promise((resolve, reject) => {
			function eventCallback(...args: any) {
				target.removeEventListener(event, eventCallback, options);
				resolve(...args);
			}

			target.addEventListener(event, eventCallback, options);
			if (typeof timeout === 'number' && timeout >= 0) {
				setTimeout(() => reject('Event timeout'), timeout);
			}
		});
	}

	/**
	 * Short helper to make Promise from element state marker
	 * Marker should be accessible and listenable
	 * @example
	 * const imgReady = PromiseUtils.fromMarker(eslImage, 'ready');
	 */
	static fromMarker(target: HTMLElement, marker: string, event?: string): Promise<HTMLElement> {
		if ((target as any)[marker]) return Promise.resolve(target);
		return PromiseUtils.fromEvent(target, event || marker).then(() => target);
	}

	/**
	 * Safe wrap for Promise.resolve to use in Promise chain
	 * @example
	 * const resolvedPromise = rejectedPromise.catch(PromiseUtils.resolve);
	 */
	static resolve<T>(arg: T | PromiseLike<T>): Promise<T> {
		return Promise.resolve(arg);
	}

	/**
	 * Safe wrap for Promise.reject to use in Promise chain
	 * @example
	 * const rejectedPromise = resolvedPromise.then(PromiseUtils.resolve);
	 */
	static reject<T = never>(arg?: T | PromiseLike<T>): Promise<T> {
		return Promise.reject(arg);
	}
}