import { IReadonlyLazy } from "interfaces/IReadonlyLazy";

/**
 * Defines the complete interface for a lazy value holder
 */
export interface ILazy<T> extends IReadonlyLazy<T> {
	/**
	 * If the value for the instance is already loaded, just returns that value.
	 * Otherwise, attempts to load the value, cache it, and return that loaded value.
	 * @throws Throws if the attempt to load the value causes it to throw.
	 * @returns The value for the instance
	 */
	getValue(): T;

	/**
	 * If the value for the instance is already loaded, just returns a result with
	 * success = true and the given value. Otherwise, attempts to load the value,
	 * cache it, and then returns a result with success = true and the given value.
	 * If the attempt to load the value errors out, then returns a result with
	 * success = false and the error message.
	 * @returns \{ success: true, value } if the value was successfully loaded,
	 * \{ success: false, errorMessage } otherwise.
	 */
	tryGetValue(): { success: true; value: T } | { success: false; errorMessage: string };
}
