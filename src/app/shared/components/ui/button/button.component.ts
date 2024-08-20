import { Component, Input } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {

  @Input() class: string = 'btn btn-theme ms-auto mt-4';
  @Input() iconClass: string | null;
  @Input() id: string;
  @Input() label: string = 'Submit';
  @Input() type: string  = 'submit';
  @Input() spinner:  boolean = false;
  @Input() disabled: boolean = false;

  public buttonId: string | null;


  constructor() {

  }

  public onClick(id: string): void {
    this.buttonId = id;
  }

}
