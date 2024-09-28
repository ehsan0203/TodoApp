import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms'; // FormsModule برای ngModel
import { routes } from './app/app.routes';
import { provideRouter } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';


bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(FormsModule), // برای ngModel
    importProvidersFrom(BrowserAnimationsModule ),
    importProvidersFrom(HttpClientModule ),



    provideRouter(routes),
  ],
}).catch(err => console.error(err));
