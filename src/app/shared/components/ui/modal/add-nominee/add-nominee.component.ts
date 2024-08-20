import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../../../services/dashboard.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../services/auth.service';
import { NotificationService } from '../../../../services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-nominee',
  templateUrl: './add-nominee.component.html',
  styleUrl: './add-nominee.component.scss',
  providers:[DatePipe]
})
export class AddNomineeComponent {
  submitted: boolean;
  public display: any;
  public resendOtp: boolean = false;
  public displayTimer: boolean = false;
  status: any;
  refno: any;
  panCard: string | null;
  refData: any;
  form: FormGroup;
  maxNominees: number = 3;
  remainingPercentage: number = 100;
  relationshipdataArr: any;
  editNomineeData: any=[];
  isLoading:boolean=false
  constructor(private datePipe:DatePipe, private dashboardService:DashboardService ,public activeModal: NgbActiveModal,private formBuilder:FormBuilder, private modalService: NgbModal,private authService:AuthService,private notificaiton:NotificationService) {
    this.dashboardService.nomineeData
      .subscribe(sharedData => {
        this.editNomineeData = sharedData;
        console.log(this.editNomineeData);
      });
  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      nominees: this.formBuilder.array([])
    });

    // Initially add nominee forms if editNomineeData is present
    if (this.editNomineeData && this.editNomineeData.length > 0) {
      this.populateNomineeForms(this.editNomineeData);
    } else {
      this.addNomineeForm();
    }
    
    this.getRelationshipData();
    
    this.form.valueChanges.subscribe(() => {
      this.updateRemainingPercentage();
    });
  }
  
  getRelationshipData() {
    this.isLoading=true;
    this.authService.getrelationDeclaration().subscribe({
      next: res => {
       this.relationshipdataArr = res.data['nomineeRelationDeclaration'];
        this.isLoading=false;

      },
      error: (error) => {
        this.isLoading=false;
        console.log(error);
      }
    });
  }

  onDateChange(event: any, index: number) {
    const birthDate = new Date(event);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    const nomineeForm = this.nomineesForms.at(index) as FormGroup;
    const isMinor = age < 18;
    nomineeForm.get('Nominee_IsMinor')?.setValue(isMinor ? 'Yes' : 'No');
    console.log(nomineeForm.get('Nominee_IsMinor')?.value);
    console.log(age);
    console.log(isMinor);
    if (isMinor) {
      nomineeForm.addControl('nomineeGuardian', this.formBuilder.control('', Validators.required));
      nomineeForm.addControl('nomineeGuardianPan', this.formBuilder.control('', Validators.required));
    } else {
      if (nomineeForm.contains('nomineeGuardian')) {
        nomineeForm.removeControl('nomineeGuardian');
      }
      if (nomineeForm.contains('nomineeGuardianPan')) {
        nomineeForm.removeControl('nomineeGuardianPan');
      }
    }
  }

  updateRemainingPercentage() {
    const totalAllocation = this.nomineesForms.controls.reduce((acc, curr) => {
      const value = curr.get('percentageAllocation')?.value;
      return acc + (value ? parseInt(value, 10) : 0);
    }, 0);
  
    this.remainingPercentage = 100 - totalAllocation;
  }
  

  get nomineesForms() {
    return this.form.get('nominees') as FormArray;
  }

  canAddNominee(): boolean {
    return this.nomineesForms.length < this.maxNominees;
  }

  addNomineeForm() {
    const nomineeForm = this.formBuilder.group({
      name: ['', Validators.required],
      relation: ['', Validators.required],
      DOB: ['', Validators.required],
      percentageAllocation: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      Nominee_IsMinor: ['No', Validators.required]
    });

    this.nomineesForms.push(nomineeForm);
  }

  populateNomineeForms(nomineesData: any[]) {
    nomineesData.forEach(nominee => {
    if(nominee.Name_Of_Nominee){
      const nomineeForm: FormGroup = this.formBuilder.group({
        name: [nominee.Name_Of_Nominee, Validators.required],
        relation: [nominee.Relation_With_Nominee, Validators.required],
        DOB: [this.datePipe.transform(nominee.Date_Of_birth, "MM/dd/yyyy")  , Validators.required],
        percentageAllocation: [nominee.Nominee_Percentage, [Validators.required, Validators.min(0), Validators.max(100)]],
        Nominee_IsMinor: [nominee.Nominee_IsMinor, Validators.required]
      });
  
      if (nominee.Nominee_IsMinor === 'Yes') {
        const guardianControl: FormControl = this.formBuilder.control(nominee?.Guardian_Name || '', Validators.required);
        const guardianPanControl: FormControl = this.formBuilder.control(nominee?.nomineeGuardianPan || '');
        
        nomineeForm.addControl('nomineeGuardian', guardianControl);
        nomineeForm.addControl('nomineeGuardianPan', guardianPanControl);
      }
      this.nomineesForms.push(nomineeForm);
    }else{
      const nomineeForm: FormGroup = this.formBuilder.group({
        name: [nominee.name, Validators.required],
        relation: [nominee.relation, Validators.required],
        DOB: [nominee.DOB, Validators.required],
        percentageAllocation: [nominee.percentageAllocation, [Validators.required, Validators.min(0), Validators.max(100)]],
        Nominee_IsMinor: [nominee.Nominee_IsMinor, Validators.required]
      });
  
      if (nominee.Nominee_IsMinor === 'Yes') {
        const guardianControl: FormControl = this.formBuilder.control(nominee?.nomineeGuardian || '', Validators.required);
        const guardianPanControl: FormControl = this.formBuilder.control(nominee?.nomineeGuardianPan || '', Validators.required);
        
        nomineeForm.addControl('nomineeGuardian', guardianControl);
        nomineeForm.addControl('nomineeGuardianPan', guardianPanControl);
      }
      this.nomineesForms.push(nomineeForm);

    }

     
  
    });
    console.log(this.nomineesForms.value);
    
    this.updateRemainingPercentage();
  }
  
  
  removeNomineeForm(index: number) {
    this.nomineesForms.removeAt(index);
    this.updateRemainingPercentage();
  }

  submit() {
    console.log(this.form.value);
    this.activeModal.close(this.form.value);
  }

  close() {
    this.modalService.dismissAll('close');
  }
}
