import babel from '@rollup/plugin-babel';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        exports: 'default',
        sourcemap: 'hidden'
      },
      {
        file: pkg.module,
        format: 'esm',
        exports: 'named',
        sourcemap: 'hidden'
      }
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {})
    ],
    plugins: [
      typescript(),
      babel({
        babelHelpers: 'bundled',
        exclude: ['node_modules/**']
      })
    ]
  }
];
