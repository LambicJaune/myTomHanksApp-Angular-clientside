import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [];

/**
 * Application routing module.
 *
 * @remarks
 * Currently empty. Routes are defined in {@link AppModule}.
 * Can be extended to separate routing configuration.
 */
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
