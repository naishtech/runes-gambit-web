import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default [
  // Base recommended config
  js.configs.recommended,
  
  // Vue 3 recommended config
  ...pluginVue.configs['flat/recommended'],
  
  // Prettier config to disable conflicting rules
  prettierConfig,
  
  // Global configuration
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        
        // Node globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        
        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly',
        test: 'readonly',
        
        // Test environment globals
        global: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly'
      }
    },
    rules: {
      // Disable multi-word component names rule
      'vue/multi-word-component-names': 'off'
    }
  },
  
  // Ignore patterns
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
      '**/.git/**',
      '**/build/**'
    ]
  }
]
