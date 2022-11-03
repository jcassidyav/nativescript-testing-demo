import { runTestApp } from '@nativescript/unit-test-runner';
declare let require: any;

runTestApp({
  runTests: () => {
    const tests = require.context('./', true, /\.spec\.ts$/);
    // ensure main.spec is included first
    // to configure Angular's test environment
    tests('./main.spec.ts'); 
    tests.keys().map(tests);
  },
});