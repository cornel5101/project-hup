import { isDevMode, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { MainComponent } from './layout/main/main.component';
import { ListProjectsComponent } from './features/project/list-projects/list-projects.component';
import { ListTasksComponent } from './features/task/list-tasks/list-tasks.component';

//ngrx store import
import { provideStore, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { DatePipe } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { RelativeTimePipe } from './pipes/relative-time.pipe';
 


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    DashboardComponent,
    MainComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RelativeTimePipe
],
  providers: [
    provideHttpClient(),
    DatePipe,
    RelativeTimePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
