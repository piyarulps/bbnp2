import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { DashboardService } from "../../shared/services/dashboard.service";
import { ActivatedRoute, Router } from "@angular/router";
import { debounceTime, distinctUntilChanged } from "rxjs";
import { OtpVerificationComponent } from "../../shared/components/ui/modal/otp-verification/otp-verification.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FoliobaseotpComponent } from "../../shared/components/ui/modal/foliobaseotp/foliobaseotp.component";
import { DatePipe } from "@angular/common";
import { CongratulatinComponent } from "../../shared/components/ui/modal/congratulatin/congratulatin.component";
import { NotificationService } from "../../shared/services/notification.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { AddNomineeComponent } from "../../shared/components/ui/modal/add-nominee/add-nominee.component";
import { ExternalViewlinkModalComponent } from "../../shared/components/ui/modal/external-viewlink-modal/external-viewlink-modal.component";
import { environment } from "../../../environments/environment";
declare var gtag: any;
@Component({
  selector: "app-purchase",
  templateUrl: "./purchase.component.html",
  styleUrl: "./purchase.component.scss",
})
export class PurchaseComponent implements OnInit {
  loadingStatus: boolean;
  formGroup!: FormGroup;
  fundCode: any;
  selectedFundName: any;
  cartData: any;
  frequencydata: any;
  date: Date | undefined;
  date1: Date;
  folio: any = [];
  rianame: any;
  agentname: any;
  minAmount: any;
  userStatus: string | null;
  ExistingmandateData: any = [];
  spinnerLoader: boolean;
  calculatedValue: any = 0;
  selectedYr: any;
  calculatedPercentage: any;
  activeCustom: boolean;
  bankDetails: any;
  fundType: any;
  fundList: any;
  allFundsData: any[];
  quesrySchemid: any = "";
  isMobile: boolean;
  sidebarVisible2: boolean = false;
  Nomineedetails: any = [];
  selectedSipnoofinstallments: any = "200";
  NewNomice: any = [];
  disabledDatesArray: Date[];
  public subagentname: string;
  EUINData: any;
  visible: boolean = false;
  dialogType: any;
  startDateEndDate: any;
  mappedNomineeOptions: any;
  newNominee: string = "";
  selectedNominees: any[] = [];
  selectedNomine: any;
  planList: any = [];
  firstTwoCharsFundCode: any;
  disabledbutton: boolean;
  minDate: Date;
  defaultDate: Date;
  afterPaymentData: any;
  fundoptionAndPlanName: string;
  saveAfterPaymenytflag: boolean;
  buttonDisbale: boolean;
  InvestmentValue: any;
  prodCheck: any = environment.prod;
  maxDate: Date;

  constructor(
    private router: Router,
    private breakpointObserver: BreakpointObserver,
    private notification: NotificationService,
    private datePipe: DatePipe,
    private fb: FormBuilder,
    private modalService: NgbModal,
    private dashboardService: DashboardService,
    private route: ActivatedRoute
  ) {
    this.initConstOnload();
  }

  public initConstOnload() {
    this.formGroup = new FormGroup({
      Sipfrequency: new FormControl("Monthly", [Validators.required]),
      termsConditions: new FormControl(true, [Validators.required]),
      Folio: new FormControl("", [Validators.required]),
      Sipflag: new FormControl("Yes"),
      Amount: new FormControl("2000"),
      Investment: new FormControl("REGULAR"),
      Plan: new FormControl("", [Validators.required]),
      arnria: new FormControl(""),
      payout: new FormControl("Payout"),
      Ria: new FormControl("no"),
      customValue: new FormControl(""),
      Riadisclaimerflag: new FormControl(""),
      Sipnoofinstallments: new FormControl("0"),
      Umrnno: new FormControl(""),
      Paymode: new FormControl("DCB"),
      Sippaymode: new FormControl("ISIP"),
      Sipamount: new FormControl(""),
      // Schemeid: new FormControl(this.cartData.fund_code),
      Schemeid: new FormControl(""),
      Sipstartdate: new FormControl(""),
      Sipenddate: new FormControl(""),
      primaryemailrelationship: new FormControl(
        localStorage.getItem("emaildeclaration")
      ),
      primarymobilerelationship: new FormControl(
        localStorage.getItem("mobiledeclaration")
      ),
      Authenticationmode: new FormControl("No"),
      Optnominee: new FormControl("No"),
      Euinno: new FormControl(""),
      Euinopt: new FormControl(""),
      PAN: new FormControl(localStorage.getItem("pancard")),
      Distributorcode: new FormControl(""),
      modeofregistrations: new FormControl("ISIP"),
      selectedNomeniee: new FormControl(""),
      Nominee: new FormControl(""),
      Upiid: new FormControl(""),
      riaCode: new FormControl(""),
      Subarncode: new FormControl(""),
      payoutFrequency: new FormControl("Monthly"),
    });

    this.minDate = this.calculateStartDate();
    this.defaultDate = this.minDate;
    const maxDate = new Date(this.minDate);
    maxDate.setFullYear(this.minDate.getFullYear() + 1);
    this.maxDate = maxDate;
    this.disabledDatesArray=  this.disableDatesForCurrentMonth();

    this.route.queryParams.subscribe((params) => {
      if (params["schemid"]) {
        this.quesrySchemid = params["schemid"];
      }
      this.afterPaymentData = params;
      if (params && params["flag"] == "Y") {
        if (localStorage.getItem("transactionType") == "saveAfterPaymentNewUser") {
          this.saveAfterPaymentNewUser(params);
        } else {
          this.saveAfterPayment(params);
        }
      }
    });
    this.route.queryParams.subscribe((params) => {
      let repeatAmount = params["repeatAmount"];
      if (repeatAmount) {
        this.formGroup.controls["Amount"].setValue(repeatAmount);
      }
    });

    this.userStatus = localStorage.getItem("userstatus");
    const data: any = localStorage.getItem("cartData");

    if (data) {
      this.cartData = JSON.parse(data);
      this.cartData = this.cartData[0];
      this.fundCode = this.cartData.fund_code;

      if (this.cartData) {
        if (this.cartData.url == "/lumpsum-investment") {
          this.formGroup.controls["Sipflag"].setValue("No");
          this.formGroup.controls["Amount"].setValue(10000);

        } else {
          this.formGroup.controls["Sipflag"].setValue("Yes");
          this.formGroup.controls["Amount"].setValue(2000);

        }
      }
    }

    this.firstTwoCharsFundCode = this.fundCode.slice(0, 2);
    if (this.afterPaymentData && this.afterPaymentData["flag"] == "N") {
      this.congratulatin("");
    }
    this.route.queryParams.subscribe((params) => {
      if (params["Mode"]) {
        this.formGroup.controls["Investment"].setValue(params["Mode"]);
        this.getSchemesByCodeforTwoDigit();
        this.formGroup.controls["Plan"].setValue("");
      }
    });
  }

  ngOnInit() {
    this.getSchemesByCodeforTwoDigit();
    this.breakpointObserver
      .observe([Breakpoints.Handset])
      .subscribe((result) => {
        this.isMobile = result.matches;
      });
      console.log(this.quesrySchemid);
      
    if (this.quesrySchemid) {
        this.getSchemesByCodeforTwoDigit();
        this.formGroup.controls["Plan"].setValue("");
      this.fundTableData();
    } else {
      if (this.cartData.cagr_3_year !== 0) {
        this.retrunCalculator(3);
      } else {
        this.retrunCalculator(1);
      }

      this.getFrequency();
      this.FundTypeMaster();
    }

    this.getfolioData();
    this.getExistingmandatedetails();
    this.onintOnchanges();
  }

  disableDatesForCurrentMonth() {
    const disabledDates: Date[] = [];
    const currentYear = new Date().getFullYear();
    const numberOfYearsToDisable = 1;

    for (let year = currentYear; year < currentYear + numberOfYearsToDisable; year++) {
        for (let month = 0; month < 24; month++) {
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            for (let day = 28; day <= 31; day++) {
                if (day <= daysInMonth) {
                  console.log(new Date(year, month, day));
                  
                    disabledDates.push(new Date(year, month, day));
                }
            }
        }
    }

    return disabledDates;
  }
  calculateStartDate(): Date {
    const today = new Date();
    const currentMonth = today.getMonth();
    const daysInCurrentMonth = new Date(today.getFullYear(), currentMonth + 1, 0).getDate();
  
    let startDate = new Date(today);
    startDate.setDate(today.getDate() + daysInCurrentMonth);
  
    // If the resulting date is on the 28th, 29th, 30th, or 31st, increment by one day
    const day = startDate.getDate();
    if ([28, 29, 30, 31].includes(day)) {
      startDate.setDate(day + 1); // Move to the next day
    }
  
    return startDate;
  }
  public onintOnchanges() {
    this.formGroup.controls["Euinno"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.getEUINData(value);
        }
      });

    this.formGroup.controls["riaCode"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.getRiaData(value);
        }
      });

    this.formGroup.controls["Subarncode"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.getSubAgentData(value);
        }
      });

    this.formGroup.controls["arnria"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        if (value) {
          this.getAgentData(value);
        }
      });

    this.formGroup.controls["Amount"].valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((value) => {
        this.retrunCalculator(this.selectedYr);
        console.log(this.minAmount, this.formGroup.controls["Amount"].value);

        // this.geSptMinAmount();
        // this.formGroup.controls['Sipamount'].setValue(value);
      });

    this.formGroup.controls["Ria"].valueChanges.subscribe((value) => {
      if (value) {
        this.formGroup.controls["riaCode"].setValidators([Validators.required]);
      } else {
        this.formGroup.controls["riaCode"].setValidators([]);
      }
    });

    this.formGroup.controls["termsConditions"].valueChanges.subscribe(
      (value) => {
        if (value) {
          this.showDialog("termsConditions");
        }
      }
    );
    this.formGroup.controls["Sipflag"].valueChanges.subscribe((value) => {
      this.minAmount = "";
      this.formGroup.controls["Plan"].setValue("");
      if (value == "Yes") {
        this.formGroup.controls["Amount"].setValue(2000);
        this.formGroup.controls["Sipfrequency"].setValidators([
          Validators.required,
        ]);
      } else {
        this.formGroup.controls["Amount"].setValue(10000);
        this.formGroup.controls["Sipfrequency"].setValidators([]);
      }
    });

    this.formGroup.controls["Paymode"].valueChanges.subscribe((value) => {
      if (value == "UPI") {
        this.formGroup.controls["Upiid"].setValidators([Validators.required]);
      } else {
        this.formGroup.controls["Upiid"].setValidators([]);
      }
    });

    this.formGroup.controls["Optnominee"].valueChanges.subscribe((value) => {
      this.formGroup.controls["Authenticationmode"].setValue(value);
      if (value == "Yes") {
        this.getNomineedetails();
      } else {
        this.formGroup.controls["Nominee"].setValue("");
        this.selectedNomine = [];
        this.NewNomice = [];
      }
    });
    this.formGroup.controls["Ria"].valueChanges.subscribe((value) => {
      this.formGroup.controls["Riadisclaimerflag"].setValue(
        value ? "Yes" : "No"
      );
    });
    this.formGroup.controls["Sipstartdate"].valueChanges.subscribe((value) => {
      const startDate = new Date(value); // Create a new Date object for the start date
      const afterFiveYears = new Date(startDate);
      afterFiveYears.setFullYear(startDate.getFullYear() + 5);

      this.formGroup.controls["Sipenddate"].setValue(afterFiveYears);
    });

    this.formGroup.controls["Sipnoofinstallments"].valueChanges.subscribe(
      (value) => {
        value == "custom"
          ? (this.activeCustom = true)
          : (this.activeCustom = false);
        if (this.formGroup.controls["Sipfrequency"].value == "Monthly") {
          this.selectedSipnoofinstallments = value == "0" ? "200" : value * 12;
        } else if (this.formGroup.controls["Sipfrequency"].value == "Weekly") {
          this.selectedSipnoofinstallments = value == "0" ? "200" : value * 48;
        } else if (this.formGroup.controls["Sipfrequency"].value == "Daily") {
          this.selectedSipnoofinstallments = value == "0" ? "200" : value * 365;
        }
      }
    );

    this.formGroup.controls["customValue"].valueChanges.subscribe((value) => {
      if (this.formGroup.controls["Sipnoofinstallments"].value == "custom") {
        this.selectedSipnoofinstallments =
          this.formGroup.controls["customValue"].value;
      }
    });

    this.formGroup.controls["Optnominee"].valueChanges.subscribe((value) => {
      this.formGroup.controls["Authenticationmode"].setValue(value);
    });
    this.formGroup.controls["Nominee"].valueChanges.subscribe((value) => {
      if (value !== "create") {
        this.selectedNomine = this.Nomineedetails[value];
      }
      if (value == "create") {
        this.addNewNominee();
      }
    });
    this.formGroup.controls["Euinopt"].valueChanges.subscribe((value) => {
      this.formGroup.controls["Euinno"].setValue("");
    });
    this.formGroup.controls["Ria"].valueChanges.subscribe((value) => {
      this.formGroup.controls["riaCode"].setValue("");
    });
    this.formGroup.controls["Investment"].valueChanges.subscribe((value) => {
      if (value) {
        this.InvestmentValue = true;
        this.getSchemesByCodeforTwoDigit();
        this.formGroup.controls["Plan"].setValue("");
        this.fundTableData();
      }
      this.getSchemesByCodeforTwoDigit();
      this.formGroup.controls["Plan"].setValue("");
    });
    this.formGroup.controls["Investment"].valueChanges.subscribe((value) => {
      this.formGroup.controls["riaCode"].setValue("");
      this.formGroup.controls["Euinno"].setValue("");
      this.formGroup.controls["Ria"].setValue(false);
      this.formGroup.controls["Euinopt"].setValue(false);
    });
    this.formGroup.controls["Plan"].valueChanges.subscribe((value) => {
      if (value) {
        const data = this.planList[value];
        const finalFundCode =
          this.firstTwoCharsFundCode + data.plan + data.option;
        console.log("Schemeid 5-->", finalFundCode);

        this.formGroup.controls["Schemeid"].setValue(finalFundCode);
        console.log("Schemeid", this.formGroup.controls["Schemeid"].value);
        // this.geSptMinAmount();
        if (this.formGroup.controls["Sipflag"].value == "Yes") {
          this.minAmount = data.sip_minamt;
          //this.notification.showWarn('Minimum amount should be ' + data.sip_minamt);
        } else {
          this.minAmount = data.new_minamt;
          // /this.notification.showWarn('Minimum amount should be ' + data.new_minamt);
        }
        this.getSchemesByCode();
      }
    });
  }
  showDialog(type: any) {
    this.visible = true;
    this.dialogType = type;
  }

  addNewNominee() {
    const modalRef = this.modalService.open(AddNomineeComponent);
    modalRef.componentInstance.name = "Nominee";
    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log("Received data:", result);
        this.NewNomice = result["nominees"];
        this.formGroup.controls["Nominee"].setValue("");
        this.formGroup.controls["Nominee"].disable();
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == "close") {
          console.log("Modal dismissed:", reason);
        }
      }
    );
  }

  fundTableData() {
    //this all Master database of Schemess
    const payload = [
      {
        columnName: "status",
        columnLogic: "LIKE",
        columnValue: "Y",
      },
    ];

    this.dashboardService.getAllfundTableData(payload).subscribe({
      next: (res: any) => {
        this.allFundsData = res.document.records;
        console.log("category end", this.allFundsData);
        this.allFundsData.forEach((product) => {
          product.cagr_1_year = parseFloat(product.cagr_1_year);
          product.cagr_3_year = parseFloat(product.cagr_3_year);
          product.cagr_5_year = parseFloat(product.cagr_5_year);
          product.cagr_inception =
            product.cagr_inception == "--" ||
            product.cagr_inception == "" ||
            product.cagr_inception == "N.A." ||
            product.cagr_inception == "NA"
              ? 0
              : parseFloat(product.cagr_inception);
        });
        const data = [...this.allFundsData];
        this.fundList = [...data];
        console.log(this.fundList);
        if (this.quesrySchemid && !this.InvestmentValue) {
          this.fundList.forEach((element: any) => {
            if (element.fund_code == this.quesrySchemid) {
              console.log("element", element);
              this.cartData = element;
              // this.formGroup.controls['Plan'].setValue(this.cartData.option_name=='IDCW' ?'dividend':'growth');
            }
          });
        }
        if (this.InvestmentValue) {
          this.fundList.forEach((element: any) => {
            const data =
              this.formGroup.controls["Investment"].value == "REGULAR"
                ? "1"
                : "5";
            if (
              element.fund_name == this.cartData.fund_name &&
              element.plan_type == data &&
              element.option_name == "Growth"
            ) {
              console.log("element", element);
              this.cartData = element;
              //  this.formGroup.controls['Plan'].setValue(this.cartData.option_name=='IDCW' ?'dividend':'growth');
            }
          });
        }

        this.FundTypeMaster();
        if (this.cartData.cagr_3_year !== 0) {
          this.retrunCalculator(3);
        } else {
          this.retrunCalculator(1);
        }
        this.getFrequency();

        console.log(this.cartData);
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  FundTypeMaster() {
    this.dashboardService.getFundTypeMaster().subscribe((res) => {
      console.log(res);
      this.fundType = res.document["records"];
      this.fundType.forEach((element: any) => {
        if (element.fund_id == this.cartData?.fund_type) {
          this.cartData.fund_type_name = element.fund_type_name;
        }
      });
    });
  }
  public  afterDateCalculations(value: any) {
    var today = new Date();
    var afterDays = new Date();
    afterDays.setDate(today.getDate() + Number(value));
    this.minDate = afterDays;
    this.formGroup.controls["Sipstartdate"].setValue(afterDays);
    console.log(afterDays);
  }

  back() {
    window.history.back();
  }

  retrunCalculator(value: any) {
    this.selectedYr = value;
    const c4 = this.formGroup.controls["Amount"].value;
    const cagr = "cagr_" + value.toString() + "_year";
    const c5 = this.cartData[cagr];
    const c6 = value;
    console.log("c4", c4);
    console.log("c5", c5);
    console.log("c6", c6);
    const data = this.dashboardService.retrunCalculator(c4, c5, c6);
    this.calculatedPercentage = data.percentage
      ? data.percentage.toFixed(2)
      : 0;
    this.calculatedValue = data.return.toFixed(2);
    this.buttonDisbale = Number(this.calculatedPercentage) ? true : false;
    console.log(this.calculatedPercentage);
    console.log(this.buttonDisbale);
  }

  addAmount(value: number) {
    this.formGroup.controls["Amount"].setValue(
      Number(this.formGroup.controls["Amount"].value) + value
    );
  }

  getfolioData() {
    this.loadingStatus = true;
    const pan = {
      PAN: localStorage.getItem("pancard"),
    };
    const userstatus = localStorage.getItem("userstatus");
    this.dashboardService.getPortfolio(pan).subscribe({
      next: (res) => {
        if (res.data) {
          const foliodatafromapi = res.data.FolioDetails.map(
            (item: any) => item.folio
          );
          this.folio = [...new Set(foliodatafromapi)];
        }

        console.log("Portfolio data: ", this.folio);
        if (this.folio.length) {
          this.formGroup.controls["Folio"].setValue(this.folio[0]);
        } else {
          this.formGroup.controls["Folio"].setValue("create");
        }
        // this.formGroup.addControl('Folio', this.fb.control(this.folio[0], [Validators.required]));

        this.geBankdetails();
        this.loadingStatus = false;
      },
      error: (error) => {
        console.log(error);
        this.loadingStatus = false;
      },
      complete: () => {},
    });
  }
  // to get plan option for given schemes

  getSchemesByCodeforTwoDigit() {
    const payload = {
      // "fundCode": "SEDD",//SE  scheme code  + plan code+ option
      // "option": "D"
      schemeCode: this.firstTwoCharsFundCode,
    };

    this.dashboardService.getgetSchemesByCode(payload).subscribe({
      next: (res) => {
        const data = res.data;
        this.planList = [];
        if (res.data) {
          data[0].schemes.forEach((element: any) => {
            if (
              element.plnmode == this.formGroup.controls["Investment"].value
            ) {
              this.planList.push(element);
              // if(element.option=='G'){
              //   this.formGroup.controls['Plan'].setValue(0);
              // }
            }
          });
        }
        console.log(this.planList);
      },
      error: (error) => {
        this.planList = [];
        console.log(error);
      },
      complete: () => {},
    });
  }
  getFrequency() {
    let fundcode = this.cartData.fund_code;
    fundcode = "DEGPG"; //REMOVE TESTiNG VALUE

    const data = {
      Schemeid: fundcode,
      Trtype: "SIP",
    };

    this.dashboardService.getFrequency(data).subscribe({
      next: (res) => {
        this.frequencydata = res.data;
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }

  getAgentData(value: any) {
    console.log(value);
    this.dashboardService
      .getAgentData({
        Agent: "ARN-" + value,
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res.data.length) {
            this.agentname = res.data[0]["name"];
            this.formGroup.controls["Distributorcode"].setValue("ARN-" + value);
          }
        },
        error: (error) => {
          this.agentname = "";
          console.log(error);
        },
        complete: () => {},
      });
  }
  getExistingmandatedetails() {
    this.dashboardService
      .Existingmandatedetails({
        PAN: localStorage.getItem("pancard"),
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          this.ExistingmandateData = res["data"];
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }

  getNomineedetails() {
    this.dashboardService
      .getNominee({
        PAN: localStorage.getItem("pancard"),
      })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          if (res["data"].length) {
            const data = res["data"][0];
            this.nomineeGenerate(data);
          }
          // this.formGroup.controls['Nominee'].setValue(this.Nomineedetails[0].Relation_With_Nominee)
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {},
      });
  }
  nomineeGenerate(data: any) {
    // Initialize an array to hold all nominees
    const allNominees = [];

    // Determine the number of nominees by checking keys in the data object
    const numberOfNominees: any = Object.keys(data).filter((key) =>
      key.startsWith("Name_Of_Nominee")
    ).length;

    // Loop through each nominee index and create their respective arrays
    for (let i = 1; i <= numberOfNominees; i++) {
      const nominee: any = {
        Name_Of_Nominee: data[`Name_Of_Nominee${i > 1 ? i : ""}`],
        Guardian_Name: data[`Guardian_Name${i > 1 ? i : ""}`],
        Nominee_Percentage: data[`Nominee_Percentage${i > 1 ? i : ""}`],
        Nominee_IsMinor: data[`Nominee_IsMinor${i > 1 ? i : ""}`],
        Relation_With_Nominee: data[`Relation_With_Nominee${i > 1 ? i : ""}`],
        Date_Of_birth: data[`Date_Of_birth${i > 1 ? i : ""}`],
        Nom_add: data[`Nom_add${i > 1 ? i : ""}`],
      };
      allNominees.push(nominee);
    }
    this.Nomineedetails = [...allNominees];
    console.log("All Nominees:", allNominees);
  }

  getSIPStartEndDate() {
    const formattedStartDate = this.datePipe.transform(
      this.formGroup.controls["Sipstartdate"].value,
      "dd"
    );

    const data = {
      frequency: this.formGroup.controls["Sipfrequency"].value,
      startDate: formattedStartDate,
      installments: this.selectedSipnoofinstallments.toString(),
      transactionType:
        this.formGroup.controls["Sipflag"].value === "Yes" ? "SIP" : "Lumpsum",
    };
    this.dashboardService.getSIPStartEndDate(data).subscribe({
      next: (res: any) => {
        console.log(res);
        if (
          this.folio.length &&
          this.formGroup.controls["Folio"].value !== "create"
        ) {
          this.MakePayement(res);
        } else {
          this.NewUserPurchase(res);
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {},
    });
  }
  geBankdetails() {
    if (this.formGroup.controls["Folio"].value !== "create") {
      this.dashboardService
        .getBankdetails({
          Folio: this.formGroup.controls["Folio"].value.toString(),
        })
        .subscribe({
          next: (res: any) => {
            console.log(res);
            this.bankDetails = res["data"].Activemandates;
            this.formGroup.controls["Umrnno"].setValue(
              this.bankDetails[0].umrnno
            );
            this.loadingStatus = false;
          },
          error: (error) => {
            this.bankDetails = [];
            this.loadingStatus = false;
            console.log(error);
          },
          complete: () => {},
        });
    } else {
      if (this.formGroup.controls["Optnominee"].value === "Yes") {
        this.getNomineedetails();
      }
    }
  }
  getSubAgentData(value: any) {
    console.log(value);
    this.dashboardService.getAgentData({ Agent: "ARN-" + value }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.subagentname = res.data[0]["name"];
      },
      error: (error) => {
        console.log(error);
        this.subagentname = "";
      },
      complete: () => {},
    });
  }
  trackButtonClick() {
  //  const Sippaymode=
  //   this.formGroup?.controls["Sippaymode"].value == "OTM"
  //     ? "SIP e-NACH"
  //     : "SIP ISIP";
  // const paymode=
  //   this.formGroup?.controls["Paymode"].value == "DCB"
  //     ? "Lumpsum Internet Banking"
  //     : "Lumpsum UPI";
  //   const value=localStorage.getItem("username")+(this.formGroup.controls["Sipflag"].value == "Yes" ? Sippaymode : paymode);
    gtag("event", "button_click", {
      event_category: "button",
      event_label: "make_payment",
      value:1,
    });
  }
  submit() {
    this.trackButtonClick();
    if (localStorage.getItem("verifyKYC")! == "Yes") {
      this.notification.showError(
        "Your KYC is incomplete. Please complete your KYC to make a purchase.  Please click on My Account link to complete KYC "
      );
      return;
    }
    if (this.minAmount > this.formGroup.controls["Amount"].value) {
      this.notification.showError("Minimum amount should be " + this.minAmount);
      return;
    }
    //  if(localStorage.getItem('Transaction_allow') =='N'){ // for testing
    const Transaction_allow = this.prodCheck
      ? localStorage.getItem("Transaction_allow")
      : "Y";

    if (Transaction_allow =="Y") {
      // for live

      if (this.formGroup.controls["Plan"].invalid) {
        this.notification.showError("Please Select your Plan ");
        return;
      }
      if (
        this.formGroup.controls["Sipstartdate"].value == "" &&
        this.formGroup.controls["Sipflag"].value == "Yes"
      ) {
        this.notification.showError("Please Select SIP Start Date");
        return;
      }
      if (this.formGroup.controls["Investment"].value == "REGULAR") {
        if (this.formGroup.controls["arnria"].value == "") {
          this.notification.showError("Please Enter ARN Number ");
          return;
        }
        if (
          this.formGroup.controls["Euinopt"].value &&
          this.formGroup.controls["Euinno"].value == ""
        ) {
          this.notification.showError("Please Enter your Euinno ");
          return;
        }
      }
      if (this.formGroup.controls["Investment"].value == "DIRECT") {
        if (
          this.formGroup.controls["Ria"].value =='yes' &&
          this.formGroup.controls["riaCode"].value == ""
        ) {
          if (!this.formGroup.controls["riaCode"].value) {
            this.notification.showError("Please Enter your Ria Code ");
            return;
          }
        }
      }

      if (this.formGroup.controls["termsConditions"].value) {
        this.spinnerLoader = true;

        if (this.formGroup.controls["Sipflag"].value == "Yes") {
          //SIP
          this.getSIPStartEndDate();
        } else {
          // Lumpsum
          if (
            this.folio.length &&
            this.formGroup.controls["Folio"].value !== "create"
          ) {
            this.MakePayement("");
          } else {
            this.NewUserPurchase("");
          }
        }
      } else {
        this.notification.showError("Please Check terms and conditions ");
      }
      // if (this.formGroup.controls['Optnominee'].value == 'Yes') {
      //   this.openModal();
      //
    } else {
      // this.notification.showError('Your KYC is incomplete. Please complete your KYC to make a purchase.  Please click on My Account link to complete KYC ');
      this.notification.showError(
        "Transaction not allowed for your Pancard please contact Admin via Helpdesk "
      );
    }
  }
  public  NewUserPurchase(res: any) {
    if (this.formGroup.controls["Optnominee"].value == "Yes") {
      this.openModal(res);
    } else {
      this.MakePayementNewUser(res);
    }
  }

  openModal(res: any) {
    const modalRef = this.modalService.open(FoliobaseotpComponent);
    modalRef.componentInstance.name = "Nominee";
    this.dashboardService.setOTPRefData(this.formGroup.controls["Folio"].value);

    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log("Received data:", result);
        this.MakePayementNewUser(res);
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == "close") {
          console.log("Modal dismissed:", reason);
          this.notification.showError("Verification failed ");
        }
      }
    );
  }

  openModalTwoFactor(res: any, type: string) {
    const modalRef = this.modalService.open(FoliobaseotpComponent);
    modalRef.componentInstance.name = "Nominee";
    this.dashboardService.setOTPRefData(this.formGroup.controls["Folio"].value);

    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log("Received data:", result);
        if (type == "existingPurchase") {
          this.existingPurchase(res);
        }
        if (type == "newPurchase") {
          this.newPurchase(res);
        }
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == "close") {
          console.log("Modal dismissed:", reason);
        }
      }
    );
  }

  MakePayement(res: any) {
    this.openModalTwoFactor(res, "existingPurchase");
  }
  public existingPurchase(res: any) {
    console.log(this.formGroup.value);
    const formattedStartDate = this.datePipe.transform(
      this.formGroup.controls["Sipstartdate"].value,
      "MM/dd/yyyy"
    );
    const formattedEndDate = this.datePipe.transform(
      this.formGroup.controls["Sipenddate"].value,
      "MM/dd/yyyy"
    );
    console.log(formattedStartDate, formattedEndDate);
    this.startDateEndDate =
      this.formGroup.controls["Sipflag"].value == "Yes" ? res.data[0] : "";

    const data = {
      Folio: Number(this.formGroup.controls["Folio"].value),
      Schemeid: this.formGroup.controls["Schemeid"].value,
      Amount: Number(this.formGroup.controls["Amount"].value),
      Sipfrequency:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Sipfrequency"].value
          : "",
      Sipamount:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? Number(this.formGroup.controls["Amount"].value)
          : "",
      Sipstartdate:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? res.data[0].SIP_StartDate
          : "",
      Sipenddate:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? res.data[0].SIP_EndDate
          : "",
      Sippaymode:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Sippaymode"].value
          : "",
      Sipnoofinstallments:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.selectedSipnoofinstallments.toString()
          : "",
      Subarncode: this.formGroup.controls["Subarncode"].value
        ? "ARN-" + this.formGroup.controls["Subarncode"].value
        : "",
      PAN: this.formGroup.controls["PAN"].value,
      Paymode: this.formGroup.controls["Paymode"].value,
      Euinno: this.formGroup.controls["Euinno"].value,
      Distributorcode: this.formGroup.controls["Distributorcode"].value,
      Euinopt: this.formGroup.controls["Euinopt"].value ? "Y" : "N",
      primaryemailrelationship:
        this.formGroup.controls["primaryemailrelationship"].value,
      primarymobilerelationship:
        this.formGroup.controls["primarymobilerelationship"].value,
      Sipflag: this.formGroup.controls["Sipflag"].value,
      Riadisclaimerflag: this.formGroup.controls["riaCode"].value
        ? "Yes"
        : "No",
      RiaCode: this.formGroup.controls["riaCode"].value,
      Subbroker: "",
      Upiid: this.formGroup.controls["Upiid"].value,
      Bankdepositreferenceno: "",
      Depositdate: "",
      Umrnno:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Umrnno"].value
          : "",
      Transtype:
        this.formGroup.controls["Sipflag"].value == "Yes" ? "ISIP" : "ADD",
    };
    this.dashboardService.saveBeforePayment(data).subscribe({
      next: (res) => {
        console.log("data: ", res);
        localStorage.setItem("amount", this.formGroup.controls["Amount"].value);
        localStorage.setItem(
          "type",
          this.formGroup.controls["Sipflag"].value == "Yes"
            ? "SIP :" +
                (this.formGroup.controls["Sippaymode"].value == "OTM"
                  ? "e-NACH"
                  : "ISIP")
            : "Lumpsum"
        );
        localStorage.setItem("folio", this.formGroup.controls["Folio"].value);
        localStorage.setItem("fundname", this.cartData.fund_name);
        if (res.data["lumpsum"]) {
          const lampsum = res.data["lumpsum"];

          if (lampsum.length) {
            localStorage.setItem("transactionType", "saveAfterPayment");
            // localStorage.setItem('parentihno',lampsum[0].parentihno);
            this.openPaymentPage(lampsum[0].paymentlink);
          }
        }
        if (res.data["sip"]) {
          const sip = res.data["sip"];
          this.saveAfterPayment(sip[0]);
        }

        // this.saveAfterPayment(res.data.sipflag == 'Yes' ? sip : lampsum);
        this.spinnerLoader = false;
      },
      error: (error) => {
        console.log(error);
        this.notification.showError(error.error.message);
        setTimeout(() => {
          this.spinnerLoader = false;
        }, 3000);
      },
      complete: () => {},
    });
  }

  openPaymentPage(link: any) {
    const paymentUrl = link;
    window.open(paymentUrl, "_blank");
  }
  paymentLink(res: any) {
    // const modalRef = this.modalService.open(ExternalViewlinkModalComponent);
    // modalRef.componentInstance.name = res[0];
    // modalRef.result.then(
    //   (result) => {
    //     // Handle the data received from the modal
    //     console.log('Received data:', result);
    //     this.NewNomice=result

    //   },
    //   (reason) => {
    //     // Handle modal dismissal (if needed)
    //     if (reason == 'close') {
    //       console.log('Modal dismissed:', reason);
    //     }
    //   });
    window.open(res, "_blank");

    // const modalRef = this.modalService.open(ExternalViewlinkModalComponent);
    // modalRef.componentInstance.data = res;

    // const modalRef = this.modalService.open(ExternalViewlinkModalComponent);
    // modalRef.componentInstance.paymentUrl = 'https://clientwebsitesuat3.kfintech.com/mfs/InvestorServices/OnlinePurchase/mobilePurchaseConfirmation_new.aspx?Mob=UA==&qparam=Nzc3ODA5MDE3';
  }

  saveAfterPayment(data: any) {
    const afterData = {
      Appno: data.appno,
      Bankrefno: data.bankrefno,
    };
    this.dashboardService.saveAfterPayment(afterData).subscribe({
      next: (res) => {
        console.log("data: ", res);
        this.spinnerLoader = false;
        if (res["data"].length) {
          this.saveAfterPaymenytflag = true;
          this.congratulatin(res["data"][0]);
        }
      },
      error: (error) => {
        console.log(error);
        this.spinnerLoader = false;
        this.notification.showError(error.error.message);
      },
      complete: () => {},
    });
  }

  MakePayementNewUser(res: any) {
    this.openModalTwoFactor(res, "newPurchase");
  }
  public newPurchase(res: any) {
    this.startDateEndDate =
      this.formGroup.controls["Sipflag"].value == "Yes" ? res.data[0] : "";
    const Nominee1DOB = this.NewNomice.length
      ? this.datePipe.transform(this.NewNomice[0]?.DOB, "MM/dd/yyyy")
      : this.selectedNomine?.Date_Of_birth;
    const Nominee1DOBname = this.NewNomice.length
      ? this.NewNomice[0]?.name
      : this.selectedNomine?.Guardian_Name;
    const Nominee1Rel = this.NewNomice.length
      ? this.NewNomice[0]?.relation
      : this.selectedNomine?.Relation_With_Nominee;
    const Nominee1PerAllo = this.NewNomice.length
      ? this.NewNomice[0]?.percentageAllocation
      : this.selectedNomine?.Nominee_Percentage;
    const Nominee1Nominee_IsMinor = this.NewNomice.length
      ? this.NewNomice[0]?.Nominee_IsMinor
      : this.selectedNomine?.Nominee_IsMinor;
    const nominee1Guardian = this.NewNomice.length
      ? this.NewNomice[0]?.nomineeGuardian
      : this.selectedNomine?.Guardian_Name;
    const nominee1GuardianPan = this.NewNomice.length
      ? this.NewNomice[0]?.nomineeGuardianPan
      : this.selectedNomine?.nomineeGuardianPan;

    const Nominee2DOB = this.NewNomice.length
      ? this.datePipe.transform(this.NewNomice[1]?.DOB, "MM/dd/yyyy")
      : "";
    const Nominee2DOBname = this.NewNomice.length
      ? this.NewNomice[1]?.name
      : "";
    const Nominee2Rel = this.NewNomice.length
      ? this.NewNomice[1]?.relation
      : "";
    const Nominee2PerAllo = this.NewNomice.length
      ? this.NewNomice[1]?.percentageAllocation
      : 0;
    const Nominee2Nominee_IsMinor = this.NewNomice.length
      ? this.NewNomice[1]?.Nominee_IsMinor
      : "";
    const nominee2Guardian = this.NewNomice.length
      ? this.NewNomice[1]?.nomineeGuardian
      : "";
    const nominee2GuardianPan = this.NewNomice.length
      ? this.NewNomice[1]?.nomineeGuardianPan
      : "";

    const Nominee3DOB = this.NewNomice.length
      ? this.datePipe.transform(this.NewNomice[2]?.DOB, "MM/dd/yyyy")
      : "";
    const Nominee3DOBname = this.NewNomice.length
      ? this.NewNomice[2]?.name
      : "";
    const Nominee3Rel = this.NewNomice.length
      ? this.NewNomice[2]?.relation
      : "";
    const Nominee3PerAllo = this.NewNomice.length
      ? this.NewNomice[2]?.percentageAllocation
      : 0;
    const Nominee3Nominee_IsMinor = this.NewNomice.length
      ? this.NewNomice[2]?.Nominee_IsMinor
      : "";
    const nominee3Guardian = this.NewNomice.length
      ? this.NewNomice[2]?.nomineeGuardian
      : "";
    const nominee3GuardianPan = this.NewNomice.length
      ? this.NewNomice[2]?.nomineeGuardianPan
      : "";

    const data = {
      Transtype:
        this.formGroup.controls["Sipflag"].value == "Yes" ? "SINI" : "NEW",
      Schemeid: this.formGroup.controls["Schemeid"].value,
      Amount: Number(this.formGroup.controls["Amount"].value),
      Sipfrequency:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Sipfrequency"].value
          : "",
      Sipamount:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? Number(this.formGroup.controls["Amount"].value)
          : "",
      Sipstartdate:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? res.data[0].SIP_StartDate
          : "",
      Sipenddate:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? res.data[0].SIP_EndDate
          : "",
      Sippaymode:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Sippaymode"].value
          : "",
      Sipnoofinstallments:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.selectedSipnoofinstallments.toString()
          : "",
      Subarncode: this.formGroup.controls["Subarncode"].value
        ? "ARN-" + this.formGroup.controls["Subarncode"].value
        : "",
      PAN: this.formGroup.controls["PAN"].value,
      Paymode: this.formGroup.controls["Paymode"].value,
      Euinno: this.formGroup.controls["Euinno"].value,
      Upiid: this.formGroup.controls["Upiid"].value,
      Distributorcode: this.formGroup.controls["Distributorcode"].value,
      Euinopt: this.formGroup.controls["Euinopt"].value ? "Y" : "N",
      Authenticationmode:
        this.formGroup.controls["Optnominee"].value == "Yes" ? "2FA" : "",
      Optnominee: this.formGroup.controls["Optnominee"].value,
      primaryemailrelationship:
        this.formGroup.controls["primaryemailrelationship"].value,
      primarymobilerelationship:
        this.formGroup.controls["primarymobilerelationship"].value,
      Sipflag: this.formGroup.controls["Sipflag"].value,
      Riadisclaimerflag: this.formGroup.controls["Ria"].value ? "Yes" : "No",
      RiaCode: this.formGroup.controls["riaCode"].value,
      Subbroker: "",
      Bankdepositreferenceno: "",
      Depositdate: "",
      Umrnno:
        this.formGroup.controls["Sipflag"].value == "Yes"
          ? this.formGroup.controls["Umrnno"].value
          : "",
      nominee1Name: Nominee1DOBname,
      nominee1Relation: Nominee1Rel,
      nominee1DOB: Nominee1DOB,
      nominee1IsMinor: Nominee1Nominee_IsMinor,
      nominee1Guardian: nominee1Guardian,
      nominee1GuardianPan: nominee1GuardianPan,
      nominee1percentage: Number(Nominee1PerAllo),
      nominee2Name: Nominee2DOBname,
      nominee2Relation: Nominee2Rel,
      nominee2DOB: Nominee2DOB,
      nominee2IsMinor: Nominee2Nominee_IsMinor,
      nominee2Guardian: nominee2Guardian,
      nominee2GuardianPan: nominee2GuardianPan,
      nominee2percentage: Number(Nominee2PerAllo) ? Number(Nominee2PerAllo) : 0,
      nominee3Name: Nominee3DOBname,
      nominee3Relation: Nominee3Rel,
      nominee3DOB: Nominee3DOB,
      nominee3IsMinor: Nominee3Nominee_IsMinor,
      nominee3Guardian: nominee3Guardian,
      nominee3GuardianPan: nominee3GuardianPan,
      nominee3percentage: Number(Nominee3PerAllo) ? Number(Nominee3PerAllo) : 0,
    };
    if (this.formGroup.valid) {
      this.dashboardService.purchaseBeforePaymentNewUser(data).subscribe({
        next: (res) => {
          console.log("data: ", res);
          const lampsum = res.data["lumpsum"];
          const sip = res.data["sip"];
          localStorage.setItem(
            "amount",
            this.formGroup.controls["Amount"].value
          );
          localStorage.setItem(
            "type",
            this.formGroup.controls["Sipflag"].value == "Yes"
              ? "SIP :" +
                  (this.formGroup.controls["Sippaymode"].value == "OTM"
                    ? "e-NACH"
                    : "ISIP")
              : "Lumpsum"
          );
          localStorage.setItem("folio", this.formGroup.controls["Folio"].value);
          localStorage.setItem("fundname", this.cartData.fund_name);
          if (res.data["lumpsum"]) {
            const lampsum = res.data["lumpsum"];
            if (lampsum.length && lampsum[0].paymentlink) {
              localStorage.setItem(
                "transactionType",
                "saveAfterPaymentNewUser"
              );
              localStorage.setItem("parentihno", lampsum[0].parentihno);
              this.openPaymentPage(lampsum[0].paymentlink);
            }
          }
          if (res.data["sip"]) {
            const sip = res.data["sip"];
            this.saveAfterPaymentNewUser(sip[0]);
          }
          this.spinnerLoader = false;
        },
        error: (error) => {
          console.log(error);
          this.notification.showError(error.error.message);

          this.spinnerLoader = false;
        },
        complete: () => {},
      });
    }
  }

  getSchemesByCode() {
    let a = this.formGroup.controls["Schemeid"].value;
    let firstFour = a.substring(0, 4); // Extracts the first four characters
    let lastOne = a.charAt(a.length - 1); // Extracts the last character
    const payload = {
      fundCode: firstFour, //SE  scheme code  + plan code+ option
      option: lastOne,
    };
    this.dashboardService.getgetSchemesByCode(payload).subscribe({
      next: (res) => {
        console.log(res);
        if (res.data) {
          if (this.formGroup.controls["Sipflag"].value == "Yes") {
            if (res.data[0].sipallow == "Y") {
              this.disabledbutton = false;
            } else {
              this.disabledbutton = true;
              this.notification.showError("SIP not allowed fo this scheme");
            }
          } else {
            if (res.data[0].purallow == "Y") {
              this.disabledbutton = false;
            } else {
              this.disabledbutton = true;
              this.notification.showError("SIP not allowed fo this scheme");
            }
          }
        }
      },
    });
  }
  saveAfterPaymentNewUser(data: any) {
    const afterData = {
      Appno: data.appno,
      Bankrefno: "",
      Parentihno: localStorage.getItem("parentihno"),
    };
    this.dashboardService.purchaseaAfterPaymentNewUser(afterData).subscribe({
      next: (res) => {
        console.log("data: ", res);
        this.spinnerLoader = false;
        if (res["data"].length) {
          this.saveAfterPaymenytflag = true;
          this.congratulatin(res["data"][0]);
        }
      },
      error: (error) => {
        console.log(error);
        this.spinnerLoader = false;
        this.notification.showError(error.error.message);
      },
      complete: () => {},
    });
  }

  congratulatin(res: any) {
    var today = new Date();
    const data = {
      Amount: this.formGroup?.controls["Amount"].value,
      date: today,
      ihno: res.ihno,
      type:
        this.formGroup?.controls["Sipflag"].value == "Yes" ? "SIP" : "Lampsum",
      folio: res?.folio ? res.folio : this.formGroup.controls["Folio"].value,
      startendDate: this.startDateEndDate,
      Sippaymode:
        this.formGroup?.controls["Sippaymode"].value == "OTM"
          ? "SIP e-NACH"
          : "SIP ISIP",
      paymode:
        this.formGroup?.controls["Paymode"].value == "DCB"
          ? "Internet Banking"
          : "UPI",
      flag: this.saveAfterPaymenytflag ? "Y" : this.afterPaymentData.flag,
      fundname: this.cartData.fund_name,
      refno: this.afterPaymentData.bankrefno,
    };
    this.dashboardService.modalData = data;
    const modalRef = this.modalService.open(CongratulatinComponent, {
      size: "lg",
      windowClass: "modal-xl",
    });
    modalRef.componentInstance.name = data;
    this.dashboardService.setOTPRefData(this.formGroup.controls["Folio"].value);

    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log("Received data:", result);
        localStorage.removeItem("transactionType");
        this.router.navigate(["/dashboard"]);
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == "close") {
          console.log("Modal dismissed:", reason);
          localStorage.removeItem("transactionType");
          this.router.navigate(["/dashboard"]);
        }
      }
    );
  }

  getRiaData(value: any) {
    console.log(value);
    this.dashboardService.getRiaData({ Ria: value }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.rianame = res.data[0]["name"];
      },
      error: (error) => {
        console.log(error);
        this.rianame = "";
      },
      complete: () => {},
    });
  }
  getEUINData(value: any) {
    console.log(value);
    this.dashboardService.getEUINData({ Agent: value }).subscribe({
      next: (res: any) => {
        console.log(res);
        this.EUINData = res.data[0]["name"];
      },
      error: (error) => {
        console.log(error);
        this.EUINData = "";
      },
      complete: () => {},
    });
  }
  clear() {
    // this.NewNomice =[];
    // this.formGroup.controls['Nominee'].setValue('');
    // this.formGroup.controls['Nominee'].enable();
    this.addNewNominee();
    this.dashboardService.setNomineeData(this.NewNomice);
  }
  disabled:boolean = false;
  disabledFuture:boolean = false;
  

  disableDatePickerPrev(event: any) {
    const { month, year } = event;

    this.disabled = (year === this.minDate.getFullYear() && month <= this.minDate.getMonth());
    this.disabledFuture = (year === this.maxDate.getFullYear() && month >= this.maxDate.getMonth());

    console.log(this.disabled, this.disabledFuture);
  }
  
}
