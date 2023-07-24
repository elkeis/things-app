import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { StoreModule } from '@ngrx/store';
import { AuthorizePageModule } from './pages/authorize/authorize.module';
import { WidgetsModule } from './widgets/widgets.module';
import { sessionReducer } from './store/session';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import { ComponentsModule } from './components/components.module';
import { thingsReducer } from './store/things';
import { ThingsPageModule } from './pages/things/things.module';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      mode: 'ios'
    }),
    AppRoutingModule,
    StoreModule.forRoot({
      session: sessionReducer,
      things: thingsReducer,
    }),
    ThingsPageModule,
    AuthorizePageModule,
    WidgetsModule,
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action, so you can see it in trace tab jumping directly to that part of code
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
    ComponentsModule,
    EffectsModule.forRoot([]),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
