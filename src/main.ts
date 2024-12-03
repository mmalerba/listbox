import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './demo-app/app.component';
import { appConfig } from './demo-app/app.config';

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
