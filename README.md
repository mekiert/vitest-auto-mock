# vitest-auto-mock
[![Tests](https://github.com/mekiert/vitest-auto-mock/actions/workflows/tests.yml/badge.svg)](https://github.com/mekiert/vitest-auto-mock)
[![NPM Type Definitions](https://img.shields.io/npm/types/vitest-auto-mock)](https://github.com/mekiert/vitest-auto-mock)
[![NPM Version](https://img.shields.io/npm/v/vitest-auto-mock)](https://www.npmjs.com/package/vitest-auto-mock)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://raw.githubusercontent.com/mekiert/vitest-auto-mock/master/LICENCE)

A convenient way to define mocks in your Vitest tests without a need to provide the mocked entity path. The path to mock is automatically obtained from the import of the module.

BEFORE
```ts
vi.mock('src/components/auth/AuthComponent');
const AuthComponentMock = vi.mocked(AuthComponent);
```

AFTER
```ts
const AuthComponentMock = vi.mocked(AuthComponent);
```

## Installation

```sh
npm install -D vitest-auto-mock
```

## Requirements
As this library is an extension for `vitest`, it is required to have `vitest` already installed.


## Configuration
To use automatically provided mocks, the Vite plugin must be used.

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import vitestAutoMockPlugin from 'vitest-auto-mock';

export default defineConfig({
  plugins: [vitestAutoMockPlugin()],
  {...}
}));
```

The whole feature is automatically activated after enabling the plugin.

If there is a separated configuration for `vitest` (like `vitest.config.ts`), it will be a better place to use the plugin.


## Usage
```ts
import { App } from 'src/app';
import { render } from '@testing-library/react';
import { RouterProvider } from 'react-router-dom';

// No need to use vi.mock('react-router-dom')
const RouterProviderMock = vi.mocked(RouterProvider);

it('should call RouterProvider', () => {
  RouterProviderMock.mockImplementation(() => <div>Router mock</div>);

  render(<App/>);
  expect(RouterProviderMock).toBeCalledTimes(1);
});
```

### ✅ Working with @testing-library/react
The primary goal of the library was to make React elements mocking easier. It is checked that `vitest-auto-mock` is working with `@testing-library/react`.


### ✅ Working with JavaScript
The library is providing support for types of `vitest` mocks. However, it is possible to use it within JavaScript tests.


## Limitations
This project is not a magic. It is based on the simple assumption that variable used as an argument of `vi.mocked` is imported somewhere in the test file. The path is obtained from the [AST](https://en.wikipedia.org/wiki/Abstract_syntax_tree) of the test file, and `vi.mock` function with the obtained path is added to the code. Therefore, any non-imported or re-assigned parameter probably will not work.


## Authors
- [Mateusz Ekiert](https://github.com/mekiert)
