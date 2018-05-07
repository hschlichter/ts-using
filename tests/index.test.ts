import { Disposable, using } from "../src";
import { setTimeout } from "timers";

describe("how to use 'using'", () => {
    test("the simple use case", () => {
        const callback = jest.fn();
        class SimpleCase extends Disposable {
            getMeaningOfLife() {
                return 42;
            }

            dispose() {
                callback();
            }
        }

        using(new SimpleCase(), s => {
            expect(s.getMeaningOfLife()).toBe(42);
        });

        expect(callback.mock.calls.length).toBe(1);
    });

    test("async case", async () => {
        const callback = jest.fn();
        class AsyncCase extends Disposable {
            getMeaningOfLife() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(42);
                    }, 25);
                });
            }

            dispose() {
                callback();
            }
        }

        await using(new AsyncCase(), async s => {
            const v = await s.getMeaningOfLife();
            expect(v).toBe(42);
            callback();
        });

        expect(callback.mock.calls.length).toBe(2);
    });

    test("async using re-throws the exception", async () => {
        class AsyncCase extends Disposable {
            getMeaningOfLife() {
                return new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(42);
                    }, 25);
                });
            }

            dispose() {
                // Nothing to be done
            }
        }

        try {
            await using(new AsyncCase(), async s => {
                const v = await s.getMeaningOfLife();
                throw new Error("hello");
            });
        } catch (err) {
            expect(err).toBeDefined();
        }

        expect.assertions(1);
    });
});