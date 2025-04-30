import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {AsyncPipe} from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, Observable, shareReplay } from 'rxjs';
import { LoginComponent } from './ui/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'food-penguin';
  navBar = [
    {ref: "/home", title: "Home"},
    {ref: "/recipes", title: "Recipes"},
    {ref: "/add-new", title: "Add New"},
    {ref: "/categories", title: "Categories"},
    {ref: "/week-plan", title: "Week Planner"},
    {ref: "/empty-the-fridge", title: "Empty my Fridge"},
    {ref: "/shopping-list", title: "Shopping List"},
  ];
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Medium, Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  drawerOpened = signal(false);

  toggleDrawer() {
    this.drawerOpened.update(open => !open);
  }
}
