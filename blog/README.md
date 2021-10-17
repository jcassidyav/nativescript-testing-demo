# Unit Testing with NativeScript and Angular

We all know that testing is important and now thanks to the [changes in NativeSript to support Angular 12](https://blog.nativescript.org/nativescript-angular-12/index.html) this is easier than ever for NativeScript Angular projects.

## A sample project to demonstrate 

We will run through an example adding tests to a SideDrawer angular app generated from the standard angular templates.  When we are done we will have tests which execute our code on the phone/emulator of our choice.

<image src="assets/RunningTests.gif" height="400">

### Create the project

1. ```ns create```
1. Enter a Name e.g. nstestingdemo
1. Choose angular flavour
1. Choose Sidedrawer template

You now have a project that should build and run, you can check with ``` ns run android```.

### Add a service that we can test

We are going to need some code to test so let's add a simple service.

1. Create a file ```demo.service.ts``` in ```src/app/services``` folder
1. Add the content

    ```ts
    import { Injectable } from "@angular/core";

    @Injectable()
    export class DemoService {

        doSomething(): string {
            return "correct message";
        }
    }
    ```

    This is a simple service that we can inject into our controllers with a single method that returns a value.

1. Make the service available to the search controller

    In ```app.module.ts``` add the demo service as a provider i.e.
    ```ts
    import { DemoService } from './services/demo.service'

    @NgModule({
    bootstrap: [AppComponent],
    imports: [AppRoutingModule, NativeScriptModule, NativeScriptUISideDrawerModule],
    declarations: [AppComponent],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [ DemoService ]
    })
    ```
1. Import the service into the search controller (```src/app/search/search.component.ts``` )

    ```import {DemoService} from '../services/demo.service';```
1. Now inject the service into the search controller
    ```ts
    constructor(private demo: DemoService) {
        // Use the component constructor to inject providers.
    }
    ```
1. Add a method to the search controller which uses this service

    ```ts
    doDemo(): string {
        return this.demo.doSomething();
    }
    ```

## Add Testing to our project

1. ```ns test init```
1. Choose the framework jasmine
    
    This installs the various frameworks etc.

    If you execute ```ns test android``` at this point you will get compile errors, this is because we have not configured our tsconfig.json to compile the sample tests.

1. Configure the tsconfig.json for testing

    Add a new file tsconfig.spec.json to the root of the project ( alongside tsconfig.json ).

    Add the contents
    ```json
    {
        "extends": "./tsconfig.json",
        "include": [
            "./src/tests/test-main.ts",
            "./src/tests/*.spec.ts",
            "./src/tests/**/*.spec.ts",
            "**/*.d.ts"
        ]
    }
    ```
    Here we extend the exiting configuration, but add in our test spec files.

1. Rename example.ts to example.spec.ts ( to conform to what we have entered in the previous step).
1. Configure webpack to use this new tsconfig.spec.json when we are running tests:

    In the webpack.config.js add 
    ```ts
    	if (env.unitTesting == true) {

			webpack.chainWebpack((config) => {
				config.plugin("AngularWebpackPlugin").tap((args) => {
					args[0].tsconfig = "./tsconfig.spec.json";
					return args;
				});
			});
		}
    ```
    Here we are setting the tsconfig file to our specific test one when running tests ( in other words when ```env.unitTesting``` is true).

## Run the tests

Now we can execute the sample test.

1. Launch the android emulator 
1. Execute ```ns test android```

    As you watch the simulator you will see that the tests run, and then the app exits.  It would be nice to see the app after it has executed so that we can look at the detail etc. 

    In ```webpack.config.js``` add the following inside the chainwebpack call we added previously.
    ```js
        config.plugin('DefinePlugin').tap((args) => {

            args[0] = merge(args[0], {
            __TEST_RUNNER_STAY_OPEN__: true,
            });
            return args;
        });
    ```
    we need to require in the merge method at the top of the file.
    ```js
    const { merge } = require('webpack-merge');
    ```

    This sets a flag to keep the app running in the emulator after the test run has completed.

    Executing ```ns test android``` again you will see the tests have executed correctly.

    <image src="assets/TestsComplete.PNG" height="400">

## Setup Angular TestBed

The Service we created in our app is injected by angular into our controllers/components so we need to use Angular TestBed to test our components and have those services available to our tests.

1. Add setup code

    Add a new file in the ```tests``` folder named ```test-main.ts```
    
    Add the content

    ```ts
    import "@nativescript/core/globals";
    import "@nativescript/angular/polyfills";
    import "@nativescript/zone-js/dist/pre-zone-polyfills";
    import "zone.js";
    import "@nativescript/zone-js";
    import "zone.js/testing";
    import { TestBed } from "@angular/core/testing";
    import { NativeScriptTestingModule } from "@nativescript/angular/testing";
    import { platformBrowserDynamicTesting } from "@angular/platform-browser-dynamic/testing";

    TestBed.initTestEnvironment([NativeScriptTestingModule], platformBrowserDynamicTesting());

    ```
1. Update the karma.config.js for the new file

    Add ```tests/test-main.ts``` to the start of the ```filePatterns``` array.

1. Add our test for the doDemo method on our Search component.

    Add a new file ```angular-example.spec.ts``` to the ```tests``` folder
    Add the contents
    ```ts
    import { TestBed } from "@angular/core/testing";
    import { SearchComponent } from "../app/search/search.component";
    import { DemoService } from "../app/services/demo.service";
    import { Page } from "@nativescript/core";
    describe("search.component", () => {
    
        beforeEach(async () => {
            await TestBed.configureTestingModule({
                declarations: [SearchComponent],
                providers: [
                    DemoService, Page
                ]
            }).compileComponents();
        });

        it("should fail", async () => {
            const fixture = TestBed.createComponent(SearchComponent);
            const component = fixture.componentInstance as SearchComponent;
            expect(component.doDemo()).toEqual('angular-component-testing');
        });

        it("should succeed", async () => {
            const fixture = TestBed.createComponent(SearchComponent);
            const component = fixture.componentInstance as SearchComponent;
            expect(component.doDemo()).toEqual("correct message");
        });
    });

    ```
    * In the beforeEach we are setting up TestBed, telling it about our component and the providers required for it to function.
    * We have two tests, one will fail as it tests for the incorrect message.

    Running ```ns test android``` will now show our extra tests and that some fail.

    <image src="assets/TestsCompleteFail.PNG" height="400">

    As this is a live watch we can go ahead and change the "should fail" test to test for the correct value, save the file and see the tests now pass.

     <image src="assets/TestsCompleteFailOK.PNG" height="400">

## Sample Project

A sample project is available https://github.com/jcassidyav/nativescript-testing-demo

## Running Tests in a CI Environment

If you have a CI environment setup for your builds it is always great to have the tests also be a part of that, here are a couple of tips.

### Configure a reporter

Some CI Environments allow you to publish your tests results as part of the build, for example in Azure you can use the [Publish Test Task](https://docs.microsoft.com/en-us/azure/devops/pipelines/tasks/test/publish-test-results?view=azure-devops&tabs=trx%2Cyaml) to publish the results.

For this you will need to configure a reporter so output the results of the tests.

1. In the karma.conf.js file add 'junit' to the list of reporters
1. Configure the reporter as desired

e.g.

```js
 reporters: ['progress', 'junit'],

    junitReporter: {
      outputDir: '../TestResults',
      outputFile: 'TESTS_RESULTS.xml'
    },

```

### Launch the emulator

A CI environment introduces challanges around launching/killing the instances of an emulator on which to run your tests.

* If your CI is setup to run only one test run at a time, it is a good idea to kill the emulator at the start and end of each run.
* Passing -no-window to emulator.exe results in a headless emulator
* You can use adb to poll the emulator until it is booted before trying to run your tests.

    e.g. On windows Powershell:
    ```powershell
    do {
         $outVar=cmd /c "C:\Android\android-sdk\platform-tools\adb.exe shell getprop sys.boot_completed" '2>&1'
         $outVar=$outVar.Split([Environment]::NewLine) | Select -First 1
         echo $outVar
         Start-Sleep -Seconds 10
      } Until ($outVar -eq "1")
    ```