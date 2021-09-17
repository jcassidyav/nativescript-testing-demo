import { Injectable } from "@angular/core";

@Injectable()
export class DemoService {

    doSomething(): string {
        return "correct message";
    }
}