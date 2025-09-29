import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

/**
 * Application entry point.
 *
 * Bootstraps the root Angular module {@link AppModule} and starts
 * the Angular application in the browser.
 *
 * @remarks
 * This file is executed first when the application is loaded.
 * `ngZoneEventCoalescing` is used for performance optimization.
 */
platformBrowserDynamic().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));

  