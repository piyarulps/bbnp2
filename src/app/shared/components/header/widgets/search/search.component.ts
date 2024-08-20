import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { Sidebar } from '../../../../interface/sidebar.interface';
import { NavService } from '../../../../../shared/services/nav.service';
import * as data from '../../../../../shared/data/menu'

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent {
  
  public menuItems: Sidebar[];
  public items: Sidebar[] = data.menu;

  public searchResult: boolean = false;
  public searchResultEmpty: boolean = false;
  public text: string;
  public open = false

  @ViewChild('toggleButton') toggleButton: ElementRef;
  @ViewChild('menu') menu: ElementRef;
  @ViewChild('dropdownContainer', { static: false }) dropdownContainer: ElementRef;

  constructor(public navServices: NavService, private renderer: Renderer2) {}

  closeSearch() {
    this.navServices.search = false;
    this.text='';
  }

  openDropDown(text: string) {
    text && (this.searchResult = !this.searchResult);
    var element = document.getElementsByTagName("body")[0]
    element.classList.toggle("overlay-search");
  }

  searchTerm(term?: string)  {
    // if (!term) return (this.menuItems = []);
    if(term){
      this.addFix()
      let items: Sidebar[] = [];
      term = term.toLowerCase();
      this.items.filter((menuItems) => {
        if (!menuItems?.title) return false;
  
        if (menuItems.title.toLowerCase().includes(term!) && menuItems.type === "sub") {
          items.push(menuItems);
        }
        return (this.checkSearchResultEmpty(items),this.menuItems = items)
      });
    }else {
      this.removeFix();
      return this.menuItems = []
    }
    console.log(this.menuItems);
    
    return this.menuItems;
  }
  
  
  checkSearchResultEmpty(items: Sidebar[]) {
    if (!items.length) this.searchResultEmpty = true;
    else this.searchResultEmpty = false;
  }

  addFix() {
    this.searchResult = true;
    document.getElementsByTagName("body")[0].classList.add("overlay-search");
  }

  removeFix() {
    this.searchResult = false;
    this.text = "";
    document.getElementsByTagName("body")[0].classList.remove("overlay-search");
  }

  clickOutside(): void {
    this.searchResult = false
  }
}
