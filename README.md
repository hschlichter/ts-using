# ts-using

[![travis](https://travis-ci.org/hschlichter/ts-using.svg?branch=master)](https://travis-ci.org/hschlichter/ts-using?branch=master)
[![Coverage Status](https://coveralls.io/repos/github/hschlichter/ts-using/badge.svg?branch=master)](https://coveralls.io/github/hschlichter/ts-using?branch=master)

I really wanted to be able to use the C# pattern of `using` and `IDisposable` in typescript.

[using-statement](https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/using-statement)

[IDisposable](https://docs.microsoft.com/en-us/dotnet/api/system.idisposable)

So I created a small package which mimics the behaviour.

```bash
$ npm install ts-using
```

This will you the following possibility.

```typescript
function using<T extends Disposable>(val: T, fn: (val: T) => void): Promise<void> | void
```

## Example

Here is an example of how to use it.

Extend the abstract class of `Disposable`, which forces you to implement `dispose()` 
somewhere in your class heriachy.
```typescript
import { Disposable } from "ts-using";

class Simple extends Disposable {
    getMeaningOfLife() {
        return 42;
    }

    dispose() {
        // Do something
    }
}
```

Then it can be used with `using`, which will ensure that `dispose()` will be called
once out of scope.

```typescript
import { using } from "ts-using";

using(new Simple(), s => {
    const val = s.getMeaningOfLife();
    console.log(val);
});
```

### Async

It supports using *async/await*. If the given function returns a promise, then it wait
on that before calling `dispose()`.

```typescript
class Async extends Disposable {
    getMeaningOfLife() {
        return new Promise((resolve, reject) => {
            resolve(42);
        });
    }

    dispose() {
        // Do something
    }
}
```

```typescript
using(new Async(), async s => {
    const val = await s.getMeaningOfLife();
    console.log(val);
});
```

If the given function is async, `using` will return the promise so you can await/then/catch
to your liking.

```typescript
await using(new Async(), async s => {
    const val = await s.getMeaningOfLife();
    console.log(val);
});
```

Errors are re-thrown, so you can catch them outside of `using`.

```typescript
try {
    await using(new Async(), async s => {
        throw new Error("hello");
    });
} catch (err) {
    // Handle error
}
```



