import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatModule } from './chat/chat.module';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { ConnectorModule } from './connector/connector.module';
import { ConnectionService } from './chat/shared/services/connection.service';
import { ChatComponent } from './chat/chat.component';
import { DialogUserComponent } from './chat/dialog-user/dialog-user.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MDBBootstrapModule,
    AppRoutingModule,
    ChatModule,
    SharedModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ConnectorModule
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  providers: [ConnectionService, ChatComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
