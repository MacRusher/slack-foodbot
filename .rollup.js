import babel from 'rollup-plugin-babel';
import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'src/index.js',
    dest: 'handler.js',
    format: 'cjs',
    plugins: [
        nodeResolve(),
        commonjs(),
        babel({
            exclude: 'node_modules/**'
        })
    ]
};
