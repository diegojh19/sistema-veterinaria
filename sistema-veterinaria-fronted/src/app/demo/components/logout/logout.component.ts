import { Component } from '@angular/core';
import { SessionStorageService } from '../../service/session-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {

  constructor(private sessionStorage: SessionStorageService, private router : Router){}
  ngOnInit(): void {
    console.log('LogoutComponent: ' +this.sessionStorage.getItem('token'))
    this.sessionStorage.removeItem('token');
    console.log('LogoutComponent eliminado: ' +this.sessionStorage.getItem('token'))
    this.router.navigate(['/']);

  }

}
