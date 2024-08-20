import { Component, ViewChild, TemplateRef, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbModalRef, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TableClickedAction } from '../../../../interface/table.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../../../environments/environment';

@Component({
  selector: 'app-external-viewlink-modal',
  templateUrl: './external-viewlink-modal.component.html',
  styleUrl: './external-viewlink-modal.component.scss'
})
export class ExternalViewlinkModalComponent implements OnInit {

  public closeResult: string;
  public modalOpen: boolean = false;
  public userAction: TableClickedAction;

  @ViewChild("confirmationModal", { static: false }) ConfirmationModal: TemplateRef<any>;


  externalProjectUrl: string = ''; // Replace with the URL of the other project
  safeExternalUrl: SafeResourceUrl ;
  @Input() data: any;
  constructor(private sanitizer: DomSanitizer,private modalService: NgbModal,public activeModal: NgbActiveModal) {
    
   }
   ngOnInit(): void {
    this.safeExternalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data);
     
   }
   close() {
    this.activeModal.close();
  }



  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }

}
