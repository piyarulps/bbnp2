import { Component, Inject } from "@angular/core";;
import { NavService } from "../../services/nav.service";
import { Values, Language } from "../../interface/setting.interface";
import { DOCUMENT } from "@angular/common";
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]

})
export class HeaderComponent {


  public unreadNotificationCount: number;

  public active: boolean = false;
  public profileOpen: boolean = false;
  public open: boolean = false;
 


  public languages: Language[] = [
    {
      language: 'English',
      code: 'en',
      icon: 'us'
    },
    {
      language: 'Français',
      code: 'fr',
      icon: 'fr'
    },
  ];

  public selectedLanguage: Language = {
    language: 'English',
    code: 'en',
    icon: 'us'
  }
  public elem: any;
  public url: string;
  isMobile: boolean;

  constructor(private breakpointObserver: BreakpointObserver, public navServices: NavService,
    
    @Inject(DOCUMENT) private document: any) {
    
    
    

    /*** 
    this.setting$.subscribe(setting => {
      this.url = setting.general.site_url;
      document.body.classList.add(setting?.general?.mode!);
    })
**/
    this.elem = document.documentElement;
    this.breakpointObserver.observe([Breakpoints.Handset])
    .subscribe(result => {
      console.log(result);
      this.isMobile = result.matches;
      console.log(this.isMobile);
    });
  }

  sidebarToggle() {
    this.navServices.collapseSidebar = !this.navServices.collapseSidebar;
  }

  clickHeaderOnMobile(){
    this.navServices.search = true;
  }

  toggleFullScreen() {
    this.sidebarToggle()
    this.navServices.fullScreen = !this.navServices.fullScreen;
    if (this.navServices.fullScreen) {
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
    } else {
      if (!this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }

}
