import { CookieserviceService } from './cookieservice.service';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-cookie-policy',
    templateUrl: './cookie-policy.component.html',
    styleUrls: ['./cookie-policy.component.scss'],
})
export class CookiePolicyComponent implements OnInit {
    constructor(public cookieserviceService: CookieserviceService) {}
    // cookieInfo;
    // showLoading = false;
    ngOnInit() {
        // this.Cookiepolicy();
    }
    // Cookiepolicy() {
    //   this.showLoading = true;
    //   this.cookieserviceService.getcookieinfo().subscribe( (res: Cookie) => {
    //   this.showLoading = false;
    //   this.cookieInfo = res.data;
    //   });
    // }
}
// export interface Cookie {
//   data: [ { } ];
// }
