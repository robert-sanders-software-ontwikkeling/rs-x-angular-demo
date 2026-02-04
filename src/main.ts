import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { provideRouter, withDebugTracing, withViewTransitions } from '@angular/router';
import { provideBrowserGlobalErrorListeners } from '@angular/core';
import { providexRsx } from '@rs-x/angular';

bootstrapApplication(App, {
  providers: [
    provideRouter([], withDebugTracing(), withViewTransitions()),
    provideBrowserGlobalErrorListeners(),
    ...providexRsx(),
  ]
}).catch(err => console.error(err));
