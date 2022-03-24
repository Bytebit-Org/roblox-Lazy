/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/consistent-type-assertions */
/// <reference types="@rbxts/testez/globals" />

import { HttpService } from "@rbxts/services";
import { Lazy } from "./Lazy";

const SUCCESSFULLY_LOADED_VALUE = HttpService.GenerateGUID();
const ERROR_MESSAGE = HttpService.GenerateGUID();

const successfulCallback = () => SUCCESSFULLY_LOADED_VALUE;
const errorCallback = () => {
	throw ERROR_MESSAGE;
};

export = () => {
	describe("getValue", () => {
		it("should return if the callback succeeds by only calling the callback once and change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			expect(lazyValueHolder.getValue()).to.equal(SUCCESSFULLY_LOADED_VALUE);

			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);
		});

		it("should return the value from the callback without calling the function again if value is already loaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			lazyValueHolder.getValue();

			expect(lazyValueHolder.isValueLoaded()).to.equal(true);

			expect(lazyValueHolder.getValue()).to.equal(SUCCESSFULLY_LOADED_VALUE);
			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);
		});

		it("should throw if the callback throws, call the callback function again on another attempt, and not change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return errorCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			for (let i = 0; i < 10; i++) {
				expect(() => lazyValueHolder.getValue()).to.throw();
				expect(numberOfCallbackExecutions).to.equal(i + 1);
				expect(lazyValueHolder.isValueLoaded()).to.equal(false);
			}
		});
	});

	describe("getValueWithoutLoadingOrThrow", () => {
		it("should return the expected value if it has already been loaded without calling the callback again and not change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			lazyValueHolder.getValue();

			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);

			expect(lazyValueHolder.getValueWithoutLoadingOrThrow()).to.equal(SUCCESSFULLY_LOADED_VALUE);

			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);
		});

		it("should throw without calling the callback if the value has not yet been loaded and not change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			expect(() => lazyValueHolder.getValueWithoutLoadingOrThrow()).to.throw();

			expect(numberOfCallbackExecutions).to.equal(0);
			expect(lazyValueHolder.isValueLoaded()).to.equal(false);
		});
	});

	describe("isValueLoaded", () => {
		// this is tested in just about every other method so I'm going to call it good to go with just this
		it("should be false for a newly created instance", () => {
			const lazyValueHolder = new Lazy<string>(successfulCallback);
			expect(lazyValueHolder.isValueLoaded()).to.equal(false);
		});
	});

	describe("tryGetValue", () => {
		it("should return if the callback succeeds by only calling the callback once and change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			const result = lazyValueHolder.tryGetValue();
			assert(result.success);
			expect(result.value).to.equal(SUCCESSFULLY_LOADED_VALUE);

			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);
		});

		it("should return the value from the callback without calling the function again if value is already loaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return successfulCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			lazyValueHolder.tryGetValue();

			expect(lazyValueHolder.isValueLoaded()).to.equal(true);

			const result = lazyValueHolder.tryGetValue();
			assert(result.success);
			expect(result.value).to.equal(SUCCESSFULLY_LOADED_VALUE);
			expect(numberOfCallbackExecutions).to.equal(1);
			expect(lazyValueHolder.isValueLoaded()).to.equal(true);
		});

		it("should return false and the error message if the callback throws, call the callback function again on another attempt, and not change the response of isValueLoaded", () => {
			let numberOfCallbackExecutions = 0;
			const lazyValueHolder = new Lazy<string>(() => {
				numberOfCallbackExecutions++;
				return errorCallback();
			});

			expect(lazyValueHolder.isValueLoaded()).to.equal(false);

			for (let i = 0; i < 10; i++) {
				const result = lazyValueHolder.tryGetValue();
				assert(!result.success);
				assert(result.errorMessage.find(ERROR_MESSAGE));
				expect(numberOfCallbackExecutions).to.equal(i + 1);
				expect(lazyValueHolder.isValueLoaded()).to.equal(false);
			}
		});
	});
};
