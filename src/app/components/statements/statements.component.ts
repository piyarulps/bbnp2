import {
  Component,
  OnInit,
  inject
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';
import {
  DashboardService
} from '../../shared/services/dashboard.service';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter
} from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '../../shared/services/notification.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-statements',
  templateUrl: './statements.component.html',
  styleUrl: './statements.component.scss',
  providers:[DatePipe]
})
export class StatementsComponent implements OnInit {

  formGroup!: FormGroup;
  selectedTab: string = 'account';
  stateOptions: any[] = [{
      label: 'By Folio',
      value: 'folio'
    },
    {
      label: 'Pan Based',
      value: 'pan'
    }
  ];
  isWhatsappDisabled = true;
  folio: any =[];
  spinnerLoader: boolean;
  minDate: Date;

  constructor(private notification: NotificationService,private FormBuilder: FormBuilder, private dashboardService: DashboardService,private datePipe: DatePipe) {
    const today = new Date();
    this.minDate = today;
    this.formGroup = this.FormBuilder.group({
      Folio: new FormControl(''),
      Pan: new FormControl(localStorage.getItem('pancard')),
      FolioPan: new FormControl('folio'),
      curretFnYear: new FormControl('current'),
      Mailback: new FormControl('N'),
      Fromdate: new FormControl(''),
      Todate: new FormControl(''),
    })
  }

  ngOnInit(): void {
    this.getfolioData()

    this.formGroup.controls['FolioPan'].valueChanges.subscribe(value => {
      if (value == 'pan') {
        this.formGroup.controls['Pan'].setValue(localStorage.getItem('pancard'));
        this.formGroup.controls['Pan'].disable()
        this.formGroup.controls['Folio'].setValue('');

      } else {
        this.formGroup.controls['Pan'].setValue('');
        this.formGroup.controls['Folio'].setValue('');
      }
      console.log(this.formGroup.value);
    });
    console.log(this.formGroup.value);

  }
  formattedDateas(year: any) {

    const startdate = year.start.replace(/\//g, "-").toString()
    const endDate = year.end.replace(/\//g, "-").toString()
    return {
      startdate: startdate,
      endDate: endDate
    }
  }
  submit() {
    if(this.formGroup.controls['FolioPan'].value == 'folio' && this.formGroup.controls['Folio'].value == ''){
      this.notification.showError('Folio can not be Empty');
      return
    }
    if(this.formGroup.controls['curretFnYear'].value == 'custom' && this.formGroup.controls['Fromdate'].value == ''){
      this.notification.showError('Fromdate can not be Empty');
      return 
    }
    if( this.formGroup.controls['curretFnYear'].value == 'custom' &&this.formGroup.controls['Todate'].value == ''){
      this.notification.showError('Todate can not be Empty');
      return 
    }
  
    this.spinnerLoader = true;
    let currentYear = new Date().getFullYear(); // Get the current year
    let endDate ;
    let startDate;
    console.log(currentYear);
   
    if (this.formGroup.controls['curretFnYear'].value == 'current') {
      var currentFinancialYear = this.getFinancialYearDates(currentYear);
      endDate = currentFinancialYear.end;
      startDate = currentFinancialYear.start;
    }
    if (this.formGroup.controls['curretFnYear'].value == 'previous') {
      var lastFinancialYear = this.getLastFinancialYearDates(currentYear);
      endDate = lastFinancialYear.end;
      startDate = lastFinancialYear.start;
    }

    if (this.formGroup.controls['curretFnYear'].value == 'custom') {
      console.log(this.fromDate);
        startDate =this.formGroup.controls['Fromdate'].value
       // startDate = `${this.fromDate.year}-${this.fromDate.month}-${this.fromDate.day}`;
        console.log(startDate);
       // endDate = `${this.toDate?.year}-${this.toDate?.month}-${this.toDate?.day}`
        endDate =this.formGroup.controls['Todate'].value;
        console.log(endDate);
    }
 
   const formattedStartDate = this.datePipe.transform(startDate, 'MM-dd-yyyy');
   const formattedEndDate = this.datePipe.transform(endDate, 'MM-dd-yyyy');
    console.log(formattedStartDate, formattedEndDate);
    if (this.selectedTab === 'account') {
      const formData = {
         // "Fund": "178",
        // "Refno": this.formGroup.controls['Folio'].value,
        // "Stmttype": 1,
        // "Flaglogo": "true",
        // "Soatype": "PDF",
        "Pwd": this.formGroup.controls['Pan'].value,
        // "Todate": formattedEndDate,
        // "Fromdate": formattedStartDate,
        // [this.formGroup.controls['FolioPan'].value == 'folio' ? "Refno" : "PAN"]: this.formGroup.controls['FolioPan'].value == 'folio' ?
        //   this.formGroup.controls['Folio'].value : this.formGroup.controls['Pan'].value,
        "Folio":  this.formGroup.controls['FolioPan'].value == 'folio' ? Number(this.formGroup.controls['Folio'].value) : 0,
        "Todate": formattedEndDate,
        "Fromdate": formattedStartDate,
        "Mailback":this.formGroup.controls['Mailback'].value,
        "PAN":  this.formGroup.controls['FolioPan'].value == 'pan' ? this.formGroup.controls['Pan'].value : "",
        "Entby":localStorage.getItem('pancard')
      }
      console.log(formData);
      console.log(this.formGroup.value);

      if (this.formGroup.valid) {
        this.dashboardService.accountFormSubmit(formData).subscribe({
          next: res => {
            if(res?.data){
              console.log('data: ', res);
              const data = res.data['data'];
              if (this.formGroup.controls['Mailback'].value == 'N') {
                this.downloadPdf(data, 'account_statement');
              }
              if (this.formGroup.controls['Mailback'].value == 'Y') {
                if(res.data?.message){
                  this.notification.showSuccess(res.data?.message);
                }
              }

            // Convert Base64 to binary
            }
            if(res?.message =='No Data found'){
              this.notification.showError(res.message);
            }
            this.spinnerLoader = false;

          },
          error: (error) => {
            console.log(error);
            this.notification.showError(error.error.message);
            this.spinnerLoader = false;

          },
          complete: () => {}
        })
      }

    } else {
      const capitalGain = {
        // "Fund": "178",
        // "Refno": this.formGroup.controls['Folio'].value,
        // "Stmttype": 1,
        // "Flaglogo": "true",
        // "Soatype": "PDF",
        "Pwd": this.formGroup.controls['Pan'].value,
        // "Todate": formattedEndDate,
        // "Fromdate": formattedStartDate,
        // [this.formGroup.controls['FolioPan'].value == 'folio' ? "Refno" : "PAN"]: this.formGroup.controls['FolioPan'].value == 'folio' ?
        //   this.formGroup.controls['Folio'].value : this.formGroup.controls['Pan'].value,
        "Folio":  this.formGroup.controls['FolioPan'].value == 'folio' ? Number(this.formGroup.controls['Folio'].value) : 0,
        "Todate": formattedEndDate,
        "Fromdate": formattedStartDate,
        "Mailback":this.formGroup.controls['Mailback'].value,
        "PAN":  this.formGroup.controls['FolioPan'].value == 'pan' ? this.formGroup.controls['Pan'].value : ""

      }
      console.log(capitalGain);
      console.log(this.formGroup.value);
      if (this.formGroup.valid) {
        this.dashboardService.capitalGainForm(capitalGain).subscribe({
          next: res => {
            if(res?.data){
              console.log('data: ', res);
              const data = res.data['data'];
              if (this.formGroup.controls['Mailback'].value == 'N') {
                this.downloadPdf(data, 'capitalgain_statement');
              }
              if (this.formGroup.controls['Mailback'].value == 'Y') {
                if(res.data?.message){
                  this.notification.showSuccess(res.data?.message);
                }
              }
            }
            if(res?.message =='No Data found'){
              this.notification.showError(res.message);

            }
            this.spinnerLoader = false;

          },
          error: (error) => {
            console.log(error);
            this.notification.showError(error.error.message);
            this.spinnerLoader = false;

          },
          complete: () => {}
        })
      }
    }
  }

  downloadPdf(data: any, type: string) {
    const binaryData = atob(data);
    // Create an array buffer to store binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    // Create a view to interpret the binary data
    const uint8Array = new Uint8Array(arrayBuffer);
    // Fill the uint8Array with the binary data
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
    // Create a Blob from the binary data
    const blob = new Blob([uint8Array], {
      type: 'application/pdf'
    });

    // Create URL for the Blob
    const downloadURL = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadURL;
    link.download = type + ".pdf";

    // Trigger download
    link.click();

    // Clean up
    window.URL.revokeObjectURL(downloadURL);
  }

  tabView(value: string) {

    this.selectedTab = value;

  }
  getfolioData() {

    const pan = {
      PAN: localStorage.getItem('pancard')
    }
    const userstatus = localStorage.getItem('userstatus');
    this.dashboardService.getPortfolio(pan).subscribe({
      next: res => {
        if(res.data){
          console.log('Portfolio data: ', res.data.FolioDetails);
          const foliodatafromapi = res.data.FolioDetails.map((item: any) => item.folio);
          this.folio = [...new Set(foliodatafromapi)];
        }
      
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {}
    })

  }

  // Function to calculate the financial year start and end dates
  getLastFinancialYearDates(currentYear: any) {

    const previousYear = currentYear - 1;

    const previousFinancialYearEndDate = new Date(currentYear, 2, 31);
    const previousFinancialYearStartDate = new Date(previousYear, 3, 1);

    // Format the dates
    const options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    const formattedPreviousStartDate = previousFinancialYearStartDate;
    const formattedPreviousEndDate = previousFinancialYearEndDate;

    // Print the results
    console.log("Previous Financial Year:", previousYear + "-" + currentYear);

    return {
      start: formattedPreviousStartDate,
      end: formattedPreviousEndDate
    };
  }
  getFinancialYearDates(currentYear: any) {

    // Determine the start date of the financial year (April 1st)
    const financialYearStartDate = new Date(currentYear, 3, 1);

    // Determine the end date of the financial year (March 31st of the next year)
    const nextYear = currentYear + 1;
    const financialYearEndDate = new Date(nextYear, 2, 31);
    const previousYear = currentYear - 1;

    const previousFinancialYearEndDate = new Date(currentYear, 2, 31);
    const previousFinancialYearStartDate = new Date(previousYear, 3, 1);

    // Format the dates
    const options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    };
    const formattedStartDate = financialYearStartDate;
    const formattedEndDate = financialYearEndDate;
    console.log("Financial Year:", currentYear + "-" + nextYear);

    return {
      start: formattedStartDate,
      end: formattedEndDate
    };


  }
  calendar = inject(NgbCalendar);
  formatter = inject(NgbDateParserFormatter);

  hoveredDate: NgbDate | null = null;
  fromDate: NgbDate | null = this.calendar.getToday();
  toDate: NgbDate | null = this.calendar.getNext(this.calendar.getToday(), 'd', 10);

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


}