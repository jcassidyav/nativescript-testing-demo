import { NativeScriptDocument } from "@nativescript/angular";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { inject, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { DOCUMENT, Location } from "@angular/common";
import { SearchModule } from "../app/search/search.module";
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
