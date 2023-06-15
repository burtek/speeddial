import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';


export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:5137/',
        video: false,
        screenshotOnRunFailure: false,

        setupNodeEvents(on) {
            on('file:preprocessor', vitePreprocessor({
                configFile: './vite.config.ts',
                mode: 'development'
            }));
        }
    }
});
