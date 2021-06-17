import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  authState: boolean;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.authStateListener().subscribe((data) => {this.authState = data});
  }

  onLogout() {
    this.authService.logout();
  }

}
