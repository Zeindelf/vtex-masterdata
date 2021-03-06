
const babel = require('rollup-plugin-babel');
const pkg = require('./package');

const now = new Date();
const banner = `
/*!!
 * VtexMasterdata.js v${pkg.version}
 * https://github.com/${pkg.repository}
 *
 * Copyright (c) 2017-${now.getFullYear()} ${pkg.author.name}
 * Released under the ${pkg.license} license
 *
 * Date: ${now.toISOString()}
 */
`;

module.exports = {
    // Export banner
    banner,
    input: 'src/vtex-masterdata.js',
    output: [
        {
            banner: banner,
            file: 'dist/vtex-masterdata.js',
            format: 'umd',
            name: 'VTEX.VtexMasterdata',
        },
        {
            banner: banner,
            file: 'dist/vtex-masterdata.common.js',
            format: 'cjs',
        },
        {
            banner: banner,
            file: 'dist/vtex-masterdata.esm.js',
            format: 'es',
        },
    ],
    plugins: [
        babel({
            exclude: 'node_modules/**',
            plugins: ['external-helpers'],
        }),
    ],
};
