import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  isGuestUser!: boolean;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //   // Überprüfen Sie, ob die URL die Gast-Endung enthält
    //   this.isGuestUser = this.route.snapshot.url.some(
    //     (segment) => segment.path === 'guest'
    //   );
    //   // Setzen Sie den Gastbenutzerstatus in Ihrem UserService entsprechend
    //   this.userService.isGuestUser = this.isGuestUser;
    // }
  }
}
