import coverage from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';


export default defineConfig({
    env: { codeCoverage: { exclude: 'cypress/**/*.*' } },
    e2e: {
        baseUrl: 'http://localhost:5137/',
        video: false,
        screenshotOnRunFailure: false,

        setupNodeEvents(on, config) {
            coverage(on, config);
            on(
                'file:preprocessor',
                vitePreprocessor({
                    configFile: './vite.config.ts',
                    mode: 'development'
                })
            );

            return config;
        }
    }

    // component: {
    //     devServer: {
    //         framework: 'react',
    //         bundler: 'vite'
    //     },
    //     setupNodeEvents(on, config) {
    //         coverage(on, config);

    //         return config;
    //     }
    // }
});
