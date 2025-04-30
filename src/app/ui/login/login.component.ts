declare var google: any;
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);

  get user() {
    return this.userService.user;
  }
  loggedIn = this.userService.loggedIn;
  showLogoutBtn = false;

  ngOnInit(): void {
    if(this.userService.googleReady) {
      this.createLoginBtn();
    } else {
      this.userService.googleReadyEvt.subscribe(() => this.createLoginBtn());
    }
    this.userService.loginEvt.subscribe(() => {
      location.reload();
    });
  }

  toggleLogoutBtn() {
    this.showLogoutBtn = !this.showLogoutBtn;
  }

  logout() {
    this.userService.logout();
    location.reload();
  }

  private createLoginBtn() {
    if(!this.userService.loggedIn) {
        google.accounts.id.renderButton(document.getElementById('google-btn'), {
        text: 'signin',
        theme: 'filled_black',
        size: 'medium',
        shape: 'pill',
        locale: 'en_us'
      });
    }
  }
}
