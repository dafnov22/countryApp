import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  countries = []

  constructor() { }

  ngOnInit(): void {
  }

}
