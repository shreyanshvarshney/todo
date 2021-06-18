import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/service/auth.service';
import { User } from './../../data-models/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  loggedIn: boolean;
  userDetails: User

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authStateListener().subscribe((data) => {
      this.loggedIn = data?.loggedIn;
      this.userDetails = data?.userDetails;
    });
  }

  onLogout() {
    this.authService.logout();
  }

}
