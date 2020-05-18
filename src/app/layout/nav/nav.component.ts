import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  firstConnection = true;

  constructor() { }

  ngOnInit(): void {
    if (localStorage.getItem('user') !== null) {
      this.firstConnection = false;

      console.log(this.firstConnection);
    }
  }

  onRegistered(registered: boolean) {
    registered ? this.firstConnection = false : true;
  }
}
