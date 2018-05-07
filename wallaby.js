module.exports = function (wallaby) {
    return {
        files: [
            'src/**/*.ts',
            '!tests/**/*.ts',
        ],
        tests: [
            'tests/**/*.test.ts'
        ],
        env: {
            type: 'node',
            runner: 'node'
        },
        testFramework: 'jest',
        compilers: {    
            '**/*.ts': wallaby.compilers.typeScript({})
        },
        workers: {
            initial: 1,
            regular: 1,
            restart: true
        }
    };
};