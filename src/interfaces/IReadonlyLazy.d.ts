/**
 * Defines an interface for interacting with a lazy value holder
 * without causing it to actually try to load the value if it has
 * not yet been loaded for the instance.
 */
export interface IReadonlyLazy<T> {
    /**
     * If the instance has loaded its value already, will return that value; otherwise, throws.
     * @returns The loaded value for the instance
     * @throws Throws if the value is not yet loaded
     */
    getValueWithoutLoadingOrThrow(): T;

    /**
     * Gets whether this instance has loaded its value yet
     * @returns True if the instance has loaded its value already, false otherwise
     */
    isValueLoaded(): boolean;
}