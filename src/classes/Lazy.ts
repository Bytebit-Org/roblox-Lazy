import { ILazy } from "interfaces/ILazy";

/**
 * An implementation of ILazy<T> that takes a callback function in
 * its constructor arguments to use to load the value
 */
export class Lazy<T> implements ILazy<T> {
	private hasValueBeenLoaded = false;
	private value?: T;

	/**
	 * Creates a new Lazy instance of the given type
	 * @param loadCallback A callback function that returns type T
	 * which is used to populate the value of the instance
	 */
	public constructor(private readonly loadCallback: () => T) {}

	public getValue() {
		if (this.hasValueBeenLoaded) {
			// Needs the ` as T` to make TypeScript ignore that
			// `this.value`'s type is `T | undefined` at this point
			// `hasValueBeenLoaded` will control that, so this is safe
			return this.value as T;
		}

		this.value = this.loadCallback();
		this.hasValueBeenLoaded = true;

		return this.value;
	}

	public getValueWithoutLoadingOrThrow() {
		if (this.hasValueBeenLoaded) {
			// Needs the ` as T` to make TypeScript ignore that
			// `this.value`'s type is `T | undefined` at this point
			// `hasValueBeenLoaded` will control that, so this is safe
			return this.value as T;
		}

		throw "Attempted to get value from Lazy instance without loading, but value was not yet loaded";
	}

	public isValueLoaded() {
		return this.hasValueBeenLoaded;
	}

	public tryGetValue(): { success: true; value: T } | { success: false; errorMessage: string } {
		if (this.hasValueBeenLoaded) {
			return {
				success: true,
				// Needs the ` as T` to make TypeScript ignore that
				// `this.value`'s type is `T | undefined` at this point
				// `hasValueBeenLoaded` will control that, so this is safe
				value: this.value as T,
			};
		}

		const opcallResult = opcall(this.loadCallback);
		if (opcallResult.success) {
			this.value = opcallResult.value;

			return {
				success: true,
				value: this.value,
			};
		} else {
			return {
				success: false,
				errorMessage: opcallResult.error,
			};
		}
	}
}
