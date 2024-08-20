import { DOCUMENT, isPlatformBrowser } from "@angular/common";
import { Component, Inject, PLATFORM_ID } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Title } from "@angular/platform-browser";
import { NgbNavConfig } from "@ng-bootstrap/ng-bootstrap";
import { TranslateService } from "@ngx-translate/core";
import { ofActionDispatched, Actions, Select, Store } from "@ngxs/store";
import { Observable } from "rxjs";

import { SettingState } from "./shared/state/setting.state";
import { GetSettingOption } from "./shared/action/setting.action";
import { GetCountries } from "./shared/action/country.action";
import { GetStates } from "./shared/action/state.action";
import { Values } from "./shared/interface/setting.interface";
import { AuthService } from "./shared/services/auth.service";
import { OnDestroy } from "@angular/core";

import { Router, NavigationEnd, Event as NavigationEvent } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
declare var gtag: any;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy {
  @Select(SettingState.setting) setting$: Observable<Values>;

  public favIcon: HTMLLinkElement | null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    config: NgbNavConfig,
    private authService: AuthService,
    @Inject(DOCUMENT) document: Document,
    private actions: Actions,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private store: Store,
    private translate: TranslateService
  ) {
    this.navEndEventsSub = this.router.events
      .pipe(
        filter(
          (event: NavigationEvent): event is NavigationEnd =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: NavigationEnd) => {
        gtag("config", "G-V85VMS4EW1", {
          page_path: event.urlAfterRedirects,
        });
      });

    this.route.queryParams.subscribe((params) => {
      console.log(params["schemid"]);
    });

    // this.getIPAddr();
    this.translate.use("en");
    this.store.dispatch(new GetCountries());
    this.store.dispatch(new GetStates());
    //this.store.dispatch(new GetSettingOption());
    this.setting$.subscribe((setting) => {
      // Set Direction
      if (setting?.general?.admin_site_language_direction === "rtl") {
        document.getElementsByTagName("html")[0].setAttribute("dir", "rtl");
        document.body.classList.add("ltr");
      } else {
        document.getElementsByTagName("html")[0].removeAttribute("dir");
        document.body.classList.remove("ltr");
      }

      /******************* 
      // Set Favicon
      this.favIcon = document.querySelector('#appIcon');
      this.favIcon!.href = <string>setting?.general?.favicon_image?.original_url;

      // Set site title
      this.titleService.setTitle(setting?.general?.site_title && setting?.general?.site_tagline ? 
        `${setting?.general?.site_title} | ${setting?.general?.site_tagline}` : '' )
        
        
        ******/
    });
    // customize default values of navs used by this component tree
    config.destroyOnHide = false;
    config.roles = false;
  }

  getIPAddr() {
    this.authService.getIPAddrRemote().subscribe({
      next: (res) => {
        localStorage.setItem("remoteip", res.ip);
      },
      error: (error) => {},
      complete: () => {},
    });
  }

  private navEndEventsSub: Subscription;

  ngOnDestroy() {
    if (this.navEndEventsSub) {
      this.navEndEventsSub.unsubscribe();
    }
  }
}
