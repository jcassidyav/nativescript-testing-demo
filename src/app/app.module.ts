import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core'
import { NativeScriptModule } from '@nativescript/angular'
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DemoService } from './services/demo.service'

@NgModule({
  bootstrap: [AppComponent],
  imports: [AppRoutingModule, NativeScriptModule, NativeScriptUISideDrawerModule],
  declarations: [AppComponent],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [ DemoService ]
})
export class AppModule {}

