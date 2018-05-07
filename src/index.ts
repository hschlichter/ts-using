export abstract class Disposable {
    public abstract dispose(): void;
}

export function using<T extends Disposable>(val: T, fn: (val: T) => void): Promise<void> | void {
    const ret = <any>fn(val);
    if (ret instanceof Promise) {
        return ret.then(() => {
            val.dispose();
        }).catch(err => {
            throw err;
        });
    } else {
        val.dispose();
    }
}