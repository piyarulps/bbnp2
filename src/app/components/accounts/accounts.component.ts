import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { DashboardService } from "../../shared/services/dashboard.service";
import { HttpClient } from "@angular/common/http";
import * as CryptoJS from "crypto-js";
import { AccountService } from "../../shared/services/account.service";
import { DatePipe } from "@angular/common";
import { environment } from "../../../environments/environment";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../../shared/services/notification.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AddNomineeComponent } from "../../shared/components/ui/modal/add-nominee/add-nominee.component";
import { camsKYC, errorCodeCams, SourceofWealth, state } from "./account.constant";
import { CongratulatinComponent } from "../../shared/components/ui/modal/congratulatin/congratulatin.component";
@Component({
  selector: "app-accounts",
  templateUrl: "./accounts.component.html",
  styleUrls: ["./accounts.component.css"],
  providers: [DatePipe],
})
export class AccountsComponent implements OnInit {
  formGroup!: FormGroup;
  selectedtabs: string = "Demographic";
  kycData: any;
  nomineeData: any = [];
  noFolio: boolean = false;
  stateData = state
  sourcesOfWealth: any = SourceofWealth;
  tabIndex: number = 0;
  foliodata: any;
  onlyfolionos: any=[];
  isLoading: boolean;
  spinnerLoader: boolean;
  showform: boolean;
  loadingStatus:boolean
  getInvestorNominee: boolean 
  decodedKYCStatus: any;
  kycstatus: string | null;
  kycstatusButton: string | null;
  kycLargeDescription: string | null;
  verifyKYC: string | null;
  camsStatusCode:any=camsKYC;
  camsErrorStatusCode:any=errorCodeCams;
  folioDetails: any=[];

  constructor(
    private modalService: NgbModal,
    private notification: NotificationService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private dashboardService: DashboardService,
    private http: HttpClient,
    private FormBuilder: FormBuilder,
    private dashboard: DashboardService,
    private cryptoService: AccountService
  ) {
    this.formGroup = this.FormBuilder.group({
      Folio: new FormControl({ value: "", disabled:false }),
      Pan: new FormControl({ value: localStorage.getItem("pancard"), disabled:true }),
      name: new FormControl({ value: "", disabled:true }),
      gender: new FormControl({ value: "Male", disabled:true }),
      date: new FormControl({ value: "", disabled:true }),
      Email: new FormControl({ value: "", disabled:true }),
      Father_Name: new FormControl({ value: "", disabled:true }),
      Mobile: new FormControl({ value: "", disabled:true }),
      Marital_Status: new FormControl({ value: "", disabled:true }),
      PlaceofBirth: new FormControl({ value: "", disabled:true }),
      Occupation: new FormControl({ value: "", disabled:true }),
      CountryofBirth: new FormControl({ value: "", disabled:true }),
      Name_Of_Nominee: new FormControl({ value: "", disabled:true }),
      Name_Of_Nominee2: new FormControl({ value: "", disabled:true }),
      Name_Of_Nominee3: new FormControl({ value: "", disabled:true }),
      Guardian_Name: new FormControl({ value: "", disabled:true }),
      Guardian_Name2: new FormControl({ value: "", disabled:true }),
      Guardian_Name3: new FormControl({ value: "", disabled:true }),
      Nominee_Percentage: new FormControl({ value: "", disabled:true }),
      Nominee_Percentage2: new FormControl({ value: "", disabled:true }),
      Nominee_Percentage3: new FormControl({ value: "", disabled:true }),
      Nominee_IsMinor: new FormControl({ value: "", disabled:true }),
      Nominee_IsMinor2: new FormControl({ value: "", disabled:true }),
      Nominee_IsMinor3: new FormControl({ value: "", disabled:true }),
      Relation_With_Nominee: new FormControl({ value: "", disabled:true }),
      Relation_With_Nominee2: new FormControl({ value: "", disabled:true }),
      Relation_With_Nominee3: new FormControl({ value: "", disabled:true }),
      Date_Of_birth1: new FormControl({ value: "", disabled:true }),
      Date_Of_birth2: new FormControl({ value: "", disabled:true }),
      Date_Of_birth3: new FormControl({ value: "", disabled:true }),
      Account_Number: new FormControl({ value: "", disabled:true }),
      Account_Holder_Name: new FormControl({ value: "", disabled:true }),
      IFSC_Code: new FormControl({ value: "", disabled:true }),
      Bank_Name: new FormControl({ value: "", disabled:true }),
      Account_Type: new FormControl({ value: "", disabled:true }),
      Address1: new FormControl({ value: "", disabled:true }),
      Address2: new FormControl({ value: "", disabled:true }),
      Pin_code: new FormControl({ value: "", disabled:true }),
      City: new FormControl({ value: "", disabled:true }),
      State: new FormControl({ value: "", disabled:true }),
      SourceofWealth: new FormControl({ value: "", disabled: false }),
      AnnualIncome: new FormControl({ value: "", disabled: false }),
      CitizenOtherCountry: new FormControl({ value: "", disabled: false }),
      TaxOtherCountry: new FormControl({ value: false, disabled: false }),
      Pep: new FormControl({ value: false, disabled: false }),
      PAN: new FormControl({ value: localStorage.getItem("pancard"), disabled:true }),
      Completedpercentage: new FormControl({ value: "", disabled:true }),
      Entby: new FormControl({ value: "", disabled:true }),
      IdentificationType: new FormControl({ value: "", disabled: false }),
      Nationality: new FormControl({ value: "", disabled: false }),
      Overseas_Address: new FormControl({ value: "", disabled: false }),
      fCity: new FormControl({ value: "", disabled: false }),
      fPIN: new FormControl({ value: "", disabled: false }),
      fState: new FormControl({ value: "", disabled: false }),
      fCountry: new FormControl({ value: "", disabled: false }),
    });
    this.kycstatus =localStorage.getItem('kycstatus');
    this.kycstatusButton =localStorage.getItem('kycstatusButton');
    this.kycLargeDescription =localStorage.getItem('kycLargeDescription');
    this.verifyKYC =localStorage.getItem('verifyKYC');
    // this.verifyKYC = "No"; //For testing to be removed later

    this.route.queryParams.subscribe((params) => {
      console.log(params);
      if (params["param1"] == "Y") {
        const data = params["param3"];
        if (data && !params['mfkyc']) {
          if(data.includes("KS")){
            this.decodedKYCStatus =this.camsStatusCode[data].Description;
            localStorage.setItem('decodedKYCStatus',this.decodedKYCStatus)
            this.notification.showSuccess(this.decodedKYCStatus);
          }else{
            this.decodedKYCStatus =this.camsErrorStatusCode[data].Description;
            localStorage.setItem('decodedKYCStatus',this.decodedKYCStatus)
            this.notification.showError(this.decodedKYCStatus);
          }
        } else {
          this.showform=true;
          this.kycstatus=params["param4"];
          this.kycLargeDescription='';
          this.kycstatusButton='Modify KYC'
          localStorage.setItem('kycstatus',params["param4"]);
          localStorage.setItem('kycLargeDescription','');
          localStorage.setItem('kycstatusButton','Modify KYC');
          if(params['mfkyc']){
            this.mfKYCData(params['mfkyc'])
          }
        }
       
      }
      if (params["param1"] == "N") {
        this.showform=false;
        this.decodedKYCStatus = decodeURIComponent(params["param4"]);
        this.decodedKYCStatus=(this.camsErrorStatusCode[params["param3"]]).Description;
        localStorage.setItem('decodedKYCStatus',this.decodedKYCStatus)
        console.log(this.decodedKYCStatus); 
        this.notification.showError(this.decodedKYCStatus);
      }
    });

    if(this.verifyKYC=='Yes'){
      this.showform=true;
      this.getInvestorDetails();
    }else{
      this.verifyKYC='No'
    }
  }
  private mfKYCData(inputString:any) {
    // Input string
    // const inputString =
    //   "PIYARUL SEKH|PIYARUL SEKH|MOHIBUL SEKH|MALE|Married|04-02-1994|INDIAN|FQQPS6016F|RESIDENT|BHAKURI DAKSHIN,BALARAMPUR,Berhampore,Murshidabad,019,7|42101,India||Murshidabad|019|742101|9046217689|piyarul@celesttechnologies.in||Professional|Residential|000601570119|ICIC0000006|SB|KOLKATA R N MUKHERJEE|KOLKATA";

    // Key template
    const keyTemplate = [
      "IT_PAN_NAME",
      "AADHAAR_NAME",
      "FATHER_NAME",
      "GENDER",
      "MARITAL_STATUS",
      "DOB",
      "NATIONALITY",
      "PAN",
      "RESIDENTIAL_STATUS",
      "ADDRESS1",
      "ADDRESS2",
      "ADDRESS3",
      "CITY",
      "STATE",
      "PINCODE",
      "MOBILE_NO",
      "EMAIL",
      "APP_MOTHER_NAME",
      "APP_OCCU",
      "ADDRESS_TYPE",
      "BANK_ACC_NO",
      "IFSC_CODE",
      "ACCOUNT_TYPE",
      "BRANCH_NAME",
      "BANK_CITY",
    ];

    // Split the input string into an array of values
    const values = inputString.split("|");

    // Create an object by mapping values to keys
    const resultObject: Record<string, string> = keyTemplate.reduce(
      (obj: any, key, index) => {
        obj[key] = values[index] || ""; // Use empty string if value is undefined
        return obj;
      },
      {}
    );
    console.log(resultObject);

    this.setValueInForm(resultObject);
    // Output the result object
  }

  // Example usage
  ngOnInit() {
    //this.setValueInForm(this.kycData)
    if(this.verifyKYC=='Yes'){
    this.getfolioData();
    this.formGroup.controls['Folio'].valueChanges.subscribe(res=>{
      this.getfolioDattails(res);
    })
  }
  }
  getfolioData() {
    this.isLoading = true;
    const pan = {
      PAN: localStorage.getItem("pancard"),
    };
    const userstatus = localStorage.getItem("userstatus");
    this.dashboardService.getPortfolio(pan).subscribe({
      next: (res) => {
        if(res.data){
          this.foliodata = res.data.FolioDetails;
          const foliodatafromapi = res.data.FolioDetails.map(
            (item: any) => item.folio
          );
          this.onlyfolionos = [...new Set(foliodatafromapi)];
  
          console.log("Portfolio data: ", res.data.FolioDetails);
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.noFolio = error.error.message;

        this.isLoading = false;

        console.log(error);
      },
      complete: () => {},
    });
  }

  getfolioDattails(res:string) {
    this.loadingStatus = true;
    const Folio = {
      Folio: res,
    };
    this.dashboardService.Foliodetails(Folio).subscribe({
      next: (res) => {
        if(res.data){
          this.folioDetails = res.data;
          console.log(this.folioDetails);
        }
        this.loadingStatus = false;
      },
      error: (error) => {
        this.noFolio = error.error.message;

        this.loadingStatus = false;

        console.log(error);
      },
      complete: () => {},
    });
  }
  getInvestorDetails() {
    const data = {
      PAN: localStorage.getItem("pancard"),
    };
    this.dashboard.getInvestorDetails(data).subscribe(
      (response) => {
        console.log("API response:", response);
        if (response.data) {
          this.kycData = response.data;
          this.setValueInFormGetInvestor(response.data)
        }

        // Handle response here
      },
      (error) => {
        console.error("API error:", error);
        // Handle error here
      }
    );
  }
  setValueInForm(res: any) {
    this.stateData.forEach(ele=>{
      if(ele.key== res.STATE){
         this.formGroup.controls["State"].setValue(ele.value);
      }
    })
    this.formGroup.controls["Pan"].setValue(res.PAN);
    this.formGroup.controls["date"].setValue(
      this.datePipe.transform(res.DOB, "MM/dd/yyyy")
    );
    this.formGroup.controls["PlaceofBirth"].setValue(res.CITY);
    this.formGroup.controls["Mobile"].setValue(res.MOBILE_NO);
    this.formGroup.controls["Email"].setValue(res.EMAIL);
    this.formGroup.controls["name"].setValue(res.IT_PAN_NAME);

    this.formGroup.controls["gender"].setValue(res.GENDER);
    this.formGroup.controls["Occupation"].setValue(res.APP_OCCU);
    this.formGroup.controls["CountryofBirth"].setValue(res.NATIONALITY);
    this.formGroup.controls["Marital_Status"].setValue(res.MARITAL_STATUS);
    this.formGroup.controls["Father_Name"].setValue(res.FATHER_NAME);

    this.formGroup.controls["Name_Of_Nominee"].setValue("");
    this.formGroup.controls["Name_Of_Nominee2"].setValue("");
    this.formGroup.controls["Name_Of_Nominee3"].setValue("");
    this.formGroup.controls["Guardian_Name"].setValue("");
    this.formGroup.controls["Guardian_Name2"].setValue("");
    this.formGroup.controls["Guardian_Name3"].setValue("");
    this.formGroup.controls["Nominee_Percentage"].setValue("");
    this.formGroup.controls["Nominee_Percentage2"].setValue("");
    this.formGroup.controls["Nominee_Percentage3"].setValue("");
    this.formGroup.controls["Nominee_IsMinor"].setValue("");
    this.formGroup.controls["Nominee_IsMinor2"].setValue("");
    this.formGroup.controls["Nominee_IsMinor3"].setValue("");
    this.formGroup.controls["Relation_With_Nominee"].setValue("");
    this.formGroup.controls["Relation_With_Nominee2"].setValue("");
    this.formGroup.controls["Relation_With_Nominee3"].setValue("");
    this.formGroup.controls["Date_Of_birth1"].setValue("");
    this.formGroup.controls["Date_Of_birth2"].setValue("");
    this.formGroup.controls["Date_Of_birth3"].setValue("");

    this.formGroup.controls["SourceofWealth"].setValue("");
    this.formGroup.controls["AnnualIncome"].setValue("");
    this.formGroup.controls["CitizenOtherCountry"].setValue("");
    this.formGroup.controls["Completedpercentage"].setValue("100");
    this.formGroup.controls["TaxOtherCountry"].setValue(false);
    this.formGroup.controls["Pep"].setValue(false);

    this.formGroup.controls["Account_Number"].setValue(res.BANK_ACC_NO);
    this.formGroup.controls["Account_Holder_Name"].setValue(res.AADHAAR_NAME);
    this.formGroup.controls["IFSC_Code"].setValue(res.IFSC_CODE);
    this.formGroup.controls["Bank_Name"].setValue(res.BRANCH_NAME);
    this.formGroup.controls["Account_Type"].setValue(res.ACCOUNT_TYPE);

    this.formGroup.controls["Address1"].setValue(res.ADDRESS1);
    this.formGroup.controls["Address2"].setValue(res.ADDRESS2);
    this.formGroup.controls["Pin_code"].setValue(res.PINCODE);
    this.formGroup.controls["City"].setValue(res.CITY);

    console.log(this.formGroup.value);
    this.submitKYC()

  }
  nomineeGenerate(data: any) {
    // Initialize an array to hold all nominees
    const allNominees = [];

    // Determine the number of nominees by checking keys in the data object
    const numberOfNominees = Object.keys(data).filter(key => key.startsWith('Name_Of_Nominee')).length;

    // Loop through each nominee index and create their respective objects
    for (let i = 1; i <= numberOfNominees; i++) {
        const suffix = i === 1 ? '' : i;
        const nominee = {
            Name_Of_Nominee: data[`Name_Of_Nominee${suffix}`],
            Guardian_Name: data[`Guardian_Name${suffix}`],
            Nominee_Percentage: data[`Nominee_Percentage${suffix}`],
            Nominee_IsMinor: data[`Nominee_IsMinor${suffix}`],
            Relation_With_Nominee: data[`Relation_With_Nominee${suffix}`],
            Date_Of_birth: data[`Date_Of_birth${i}`], // Note the index `i` here
            Nom_add: data[`Nom_add${suffix}`]
        };

        // Check if the nominee has a name to be considered valid
        if (nominee.Name_Of_Nominee) {
            allNominees.push(nominee);
        }
    }

    // Update the component's nominee data
    this.nomineeData = [...allNominees];
    console.log("All Nominees:", allNominees);
}

  setValueInFormGetInvestor(res:any){
    this.formGroup.controls['Pan'].setValue(res.profileDetails?.PAN);
    this.formGroup.controls['date'].setValue( this.datePipe.transform(res.profileDetails.Date_Of_Birth, 'MM/dd/yyyy')  );
    this.formGroup.controls['PlaceofBirth'].setValue(res.profileDetails?.PlaceofBirth);
    this.formGroup.controls['Mobile'].setValue(res.profileDetails?.Mobile);
    this.formGroup.controls['Email'].setValue(res.profileDetails?.Email);
    this.formGroup.controls['name'].setValue(res.profileDetails?.Name);

    this.formGroup.controls['gender'].setValue(res.personalDetails?.Gender);
    this.formGroup.controls['Occupation'].setValue(res.personalDetails?.Occupation);
    this.formGroup.controls['CountryofBirth'].setValue(res.personalDetails?.Country_Of_Birth);
    this.formGroup.controls['Marital_Status'].setValue(res.personalDetails?.Marital_Status);
    this.formGroup.controls['Father_Name'].setValue(res.personalDetails?.Father_Name);
    if(res.nomineeDetails.Name_Of_Nominee){
      this.getInvestorNominee=true;
      this.nomineeGenerate(res.nomineeDetails);

    }
    this.formGroup.controls['Name_Of_Nominee'].setValue(res.nomineeDetails?.Name_Of_Nominee);
    this.formGroup.controls['Name_Of_Nominee2'].setValue(res.nomineeDetails?.Name_Of_Nominee2);
    this.formGroup.controls['Name_Of_Nominee3'].setValue(res.nomineeDetails?.Name_Of_Nominee3); 
    this.formGroup.controls['Guardian_Name'].setValue(res.nomineeDetails?.Guardian_Name); 
    this.formGroup.controls['Guardian_Name2'].setValue(res.nomineeDetails?.Guardian_Name2); 
    this.formGroup.controls['Guardian_Name3'].setValue(res.nomineeDetails?.Guardian_Name3); 
    this.formGroup.controls['Nominee_Percentage'].setValue(res.nomineeDetails?.Nominee_Percentage); 
    this.formGroup.controls['Nominee_Percentage2'].setValue(res.nomineeDetails?.Nominee_Percentage2); 
    this.formGroup.controls['Nominee_Percentage3'].setValue(res.nomineeDetails?.Nominee_Percentage3); 
    this.formGroup.controls['Nominee_IsMinor'].setValue(res.nomineeDetails?.Nominee_IsMinor); 
    this.formGroup.controls['Nominee_IsMinor2'].setValue(res.nomineeDetails?.Name_Of_Nominee3); 
    this.formGroup.controls['Nominee_IsMinor3'].setValue(res.nomineeDetails?.Nominee_IsMinor3); 
    this.formGroup.controls['Relation_With_Nominee'].setValue(res.nomineeDetails?.Relation_With_Nominee); 
    this.formGroup.controls['Relation_With_Nominee2'].setValue(res.nomineeDetails?.Relation_With_Nominee2); 
    this.formGroup.controls['Relation_With_Nominee3'].setValue(res.nomineeDetails?.Relation_With_Nominee3); 
    this.formGroup.controls['Date_Of_birth1'].setValue(this.datePipe.transform(res.nomineeDetails?.Date_Of_birth1, 'MM/dd/yyyy') ); 
    this.formGroup.controls['Date_Of_birth2'].setValue(res.nomineeDetails?.Date_Of_birth2); 
    this.formGroup.controls['Date_Of_birth3'].setValue(res.nomineeDetails?.Date_Of_birth3); 

    this.formGroup.controls['SourceofWealth'].setValue(res.fatcaDetails?.Source_Of_Wealth);
    this.formGroup.controls['AnnualIncome'].setValue(res.fatcaDetails?.Annual_Income);
    this.formGroup.controls['CitizenOtherCountry'].setValue(res.fatcaDetails?.Citizen_Other_Country); 
    this.formGroup.controls['TaxOtherCountry'].setValue(res.fatcaDetails.TAX_Other_Country  == "true" ?true:false); 
    this.formGroup.controls['Pep'].setValue(res.fatcaDetails.PEP == "true" ?true:false); 

    this.formGroup.controls['Account_Number'].setValue(res.bankDetails?.Account_Number);
    this.formGroup.controls['Account_Holder_Name'].setValue(res.bankDetails?.Account_Holder_Name);
    this.formGroup.controls['IFSC_Code'].setValue(res.bankDetails?.IFSC_Code); 
    this.formGroup.controls['Bank_Name'].setValue(res.bankDetails?.Bank_Name); 
    this.formGroup.controls['Account_Type'].setValue(res.bankDetails?.Account_Type); 

    this.formGroup.controls['Address1'].setValue(res.addressDetails?.Address1);
    this.formGroup.controls['Address2'].setValue(res.addressDetails?.Address2);
    this.formGroup.controls['Pin_code'].setValue(res.addressDetails?.Pin_code); 
    this.formGroup.controls['City'].setValue(res.addressDetails?.City); 
    this.formGroup.controls['State'].setValue(res.addressDetails?.State); 
  }
  addNewNominee() {
    const modalRef = this.modalService.open(AddNomineeComponent);
    modalRef.componentInstance.name = "Nominee";
    modalRef.result.then(
      (result) => {
        // Handle the data received from the modal
        console.log("Received data:", result);
        this.nomineeData = result["nominees"];
        this.updateNominee(result["nominees"]);
      },
      (reason) => {
        // Handle modal dismissal (if needed)
        if (reason == "close") {
          console.log("Modal dismissed:", reason);
        }
      }
    );
  }
  updateNominee(res: any) {
    if (res && res.length > 0) {
      // First Nominee
      this.formGroup.controls["Name_Of_Nominee"].setValue(res[0].name || "");
      this.formGroup.controls["Guardian_Name"].setValue(
        res[0].nomineeGuardian || ""
      );
      this.formGroup.controls["Nominee_Percentage"].setValue(
        res[0].percentageAllocation || ""
      );
      this.formGroup.controls["Nominee_IsMinor"].setValue(
        res[0].Nominee_IsMinor || ""
      );
      this.formGroup.controls["Relation_With_Nominee"].setValue(
        res[0].relation || ""
      );
      this.formGroup.controls["Date_Of_birth1"].setValue(   this.datePipe.transform(res[0].DOB, "MM/dd/yyyy")  || "");

      // Second Nominee
      if (res.length > 1) {
        this.formGroup.controls["Name_Of_Nominee2"].setValue(res[1].name || "");
        this.formGroup.controls["Guardian_Name2"].setValue(
          res[1].nomineeGuardian || ""
        );
        this.formGroup.controls["Nominee_Percentage2"].setValue(
          res[1].percentageAllocation || ""
        );
        this.formGroup.controls["Nominee_IsMinor2"].setValue(
          res[1].Nominee_IsMinor || ""
        );
        this.formGroup.controls["Relation_With_Nominee2"].setValue(
          res[1].relation || ""
        );
        this.formGroup.controls["Date_Of_birth2"].setValue(this.datePipe.transform(res[1].DOB, "MM/dd/yyyy") || "");
      }

      // Third Nominee
      if (res.length > 2) {
        this.formGroup.controls["Name_Of_Nominee3"].setValue(res[2].name || "");
        this.formGroup.controls["Guardian_Name3"].setValue(
          res[2].nomineeGuardian || ""
        );
        this.formGroup.controls["Nominee_Percentage3"].setValue(
          res[2].percentageAllocation || ""
        );
        this.formGroup.controls["Nominee_IsMinor3"].setValue(
          res[2].Nominee_IsMinor || ""
        );
        this.formGroup.controls["Relation_With_Nominee3"].setValue(
          res[2].relation || ""
        );
        this.formGroup.controls["Date_Of_birth3"].setValue(this.datePipe.transform(res[2].DOB, "MM/dd/yyyy") || "");
      }
    } else {
      // Resetting values if the array is empty
      this.formGroup.controls["Name_Of_Nominee"].setValue("");
      this.formGroup.controls["Name_Of_Nominee2"].setValue("");
      this.formGroup.controls["Name_Of_Nominee3"].setValue("");
      this.formGroup.controls["Guardian_Name"].setValue("");
      this.formGroup.controls["Guardian_Name2"].setValue("");
      this.formGroup.controls["Guardian_Name3"].setValue("");
      this.formGroup.controls["Nominee_Percentage"].setValue("");
      this.formGroup.controls["Nominee_Percentage2"].setValue("");
      this.formGroup.controls["Nominee_Percentage3"].setValue("");
      this.formGroup.controls["Nominee_IsMinor"].setValue("");
      this.formGroup.controls["Nominee_IsMinor2"].setValue("");
      this.formGroup.controls["Nominee_IsMinor3"].setValue("");
      this.formGroup.controls["Relation_With_Nominee"].setValue("");
      this.formGroup.controls["Relation_With_Nominee2"].setValue("");
      this.formGroup.controls["Relation_With_Nominee3"].setValue("");
      this.formGroup.controls["Date_Of_birth1"].setValue("");
      this.formGroup.controls["Date_Of_birth2"].setValue("");
      this.formGroup.controls["Date_Of_birth3"].setValue("");
    }
  }

  tabSelection(tab: string) {
    this.selectedtabs = tab;
    // Logic to update the tab index based on the selected tab
    switch (tab) {
      case "Demographic":
        this.tabIndex = 0;
        break;
      case "FATCA":
        this.tabIndex = 1;
        break;
      case "Communications":
        this.tabIndex = 2;
        break;
      case "Nominee":
        this.tabIndex = 3;
        break;
      case "Bank":
        this.tabIndex = 4;
        break;
      case "Folio":
        this.tabIndex = 5;
        break;
      default:
        this.tabIndex = 0;
        break;
    }
  }

  downloadKYC() {
    const data = {
      flag: 3,
      pancard: localStorage.getItem("pancard"),
    };
    this.dashboard.getDownloadKYC(data).subscribe(
      (response) => {
        console.log("API response:", response.ROOT["KYC_DATA"]);
        this.setValueIndownloadKYC(response.ROOT["KYC_DATA"]);
        // const xmlData = this.dashboardService.getparseXml(response);
        //  console.log('API response:', xmlData);
        // Handle response here
      },
      (error) => {
        console.error("API error:", error);
        // Handle error here
      }
    );
  }
  setValueIndownloadKYC(res: any) {
    this.formGroup.controls["Pan"].setValue(res.APP_PAN_NO);
    this.formGroup.controls["date"].setValue(res.APP_DOB_DT);
    this.formGroup.controls["PlaceofBirth"].setValue("");
    this.formGroup.controls["Mobile"].setValue(res.APP_MOB_NO);
    this.formGroup.controls["Email"].setValue(res.APP_EMAIL);
    this.formGroup.controls["name"].setValue(res.APP_NAME);

    this.formGroup.controls["gender"].setValue(
      res.APP_GEN == "M" ? "Male" : "Female"
    );
    this.formGroup.controls["Occupation"].setValue("");
    this.formGroup.controls["CountryofBirth"].setValue("");
    this.formGroup.controls["Marital_Status"].setValue("");
    this.formGroup.controls["Father_Name"].setValue(res.APP_F_NAME);

    this.formGroup.controls["SourceofWealth"].setValue("");
    this.formGroup.controls["AnnualIncome"].setValue("");
    this.formGroup.controls["CitizenOtherCountry"].setValue("");
    this.formGroup.controls["TaxOtherCountry"].setValue(false);
    this.formGroup.controls["Pep"].setValue(false);

    this.formGroup.controls["Account_Number"].setValue("");
    this.formGroup.controls["Account_Holder_Name"].setValue("");
    this.formGroup.controls["IFSC_Code"].setValue("");
    this.formGroup.controls["Bank_Name"].setValue("");
    this.formGroup.controls["Account_Type"].setValue("");

    this.formGroup.controls["Address1"].setValue("");
    this.formGroup.controls["Address2"].setValue("");
    this.formGroup.controls["Pin_code"].setValue("");
    this.formGroup.controls["City"].setValue("");
    this.formGroup.controls["State"].setValue("");
  }

  getKYCData() {
    // pan,enail and mobile
    const data = {
      pan: localStorage.getItem("pancard"),
      email: localStorage.getItem("userid"),
      mobile: localStorage.getItem("usermobile"),
    };
    const randomNumber = this.generateRandomNumber();
    console.log(randomNumber);

    const url = `${environment.camsURL}/camskyc.php?random=${randomNumber}&pan=${data.pan}&email=${data.email}&mobile=${data.mobile}`;
    window.open(url, "_blank");
  }

  generateRandomNumber(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }
  kycSubmit() {
    this.getKYCData();
  }

  nextTab() {
    if (this.tabIndex < 5) {
      // Update the limit based on your tabs
      this.tabIndex++;
      this.selectTabByIndex(this.tabIndex);
    }
  }

  prevTab() {
    if (this.tabIndex > 0) {
      this.tabIndex--;
      this.selectTabByIndex(this.tabIndex);
    }
  }

  selectTabByIndex(index: number) {
    switch (index) {
      case 0:
        this.tabSelection("Demographic");
        break;
      case 1:
        this.tabSelection("FATCA");
        break;
      case 2:
        this.tabSelection("Communications");
        break;
      case 3:
        this.tabSelection("Nominee");
        break;
      case 4:
        this.tabSelection("Bank");
        break;
      case 5:
        this.tabSelection("Folio");
        break;
      default:
        this.tabSelection("Demographic");
        break;
    }
  }

  submitKYC() {
    this.spinnerLoader = true;
    this.loadingStatus=true;
    this.congratulatin()
    this.accountDataSubmit();

  }
  congratulatin() {
    this.dashboardService.modalData='';
    const modalRef = this.modalService.open(CongratulatinComponent, {
      size: 'md',
      windowClass: 'modal-md',
       backdrop: 'static', // Disable closing on backdrop click
      keyboard: false // Disable closing on ESC ke
    });
    modalRef.result.then(
      (result) => {
      },
      (reason) => {
      
      })
  }
  private accountDataSubmit() {
    const payload = {
      PAN: this.formGroup.controls['Pan'].value,
      Completedpercentage: "100",
      Entby: this.formGroup.controls['Entby'].value,
      profileDetails: {
        Name: this.formGroup.controls['name'].value,
        Email: this.formGroup.controls['Email'].value,
        Dateofbirth: this.formGroup.controls['date'].value,
        Mobile: this.formGroup.controls['Mobile'].value
      },
      bankDetails: {
        Accountholdername: this.formGroup.controls['Account_Holder_Name'].value,
        Accountnumber: this.formGroup.controls['Account_Number'].value,
        Ifsccode: this.formGroup.controls['IFSC_Code'].value,
        Bankname: this.formGroup.controls['Bank_Name'].value,
        Accounttype: this.formGroup.controls['Account_Type'].value == 'SB' ? 'Saving' : 'Current',
        PAN: this.formGroup.controls['Pan'].value,
        Completedpercentage: '40',
        Entby: this.formGroup.controls['Entby'].value
      },
      personalDetails: {
        Maritalstatus: this.formGroup.controls['Marital_Status'].value,
        Gender: this.formGroup.controls['gender'].value,
        Occupation: this.formGroup.controls['Occupation'].value,
        Fathername: this.formGroup.controls['Father_Name'].value,
        Countryofbirth: this.formGroup.controls['CountryofBirth'].value,
        PAN: this.formGroup.controls['Pan'].value,
        Completedpercentage: '50',
        Entby: this.formGroup.controls['Entby'].value
      },
      addressDetails: {
        Address1: this.formGroup.controls['Address1'].value,
        Address2: this.formGroup.controls['Address2'].value,
        Pincode: this.formGroup.controls['Pin_code'].value,
        City: this.formGroup.controls['City'].value,
        State: this.formGroup.controls['State'].value,
        PAN: this.formGroup.controls['Pan'].value,
        Completedpercentage: '70',
        Entby: this.formGroup.controls['Entby'].value
      },
      nomineeDetails: {
        Relationwithnominee: this.formGroup.controls['Relation_With_Nominee'].value,
        Relationwithnominee2: this.formGroup.controls['Relation_With_Nominee2'].value,
        Relationwithnominee3: this.formGroup.controls['Relation_With_Nominee3'].value,
        Dateofbirth1: this.formGroup.controls['Date_Of_birth1'].value,
        Dateofbirth2: this.formGroup.controls['Date_Of_birth2'].value,
        Dateofbirth3: this.formGroup.controls['Date_Of_birth3'].value,
        Nameofnominee: this.formGroup.controls['Name_Of_Nominee'].value,
        Nameofnominee2: this.formGroup.controls['Name_Of_Nominee2'].value,
        Nameofnominee3: this.formGroup.controls['Name_Of_Nominee3'].value,
        Guardianname: this.formGroup.controls['Guardian_Name'].value,
        Guardianname2: this.formGroup.controls['Guardian_Name2'].value,
        Guardianname3: this.formGroup.controls['Guardian_Name3'].value,
        Nomineepercentage: this.formGroup.controls['Nominee_Percentage'].value,
        Nomineepercentage2: this.formGroup.controls['Nominee_Percentage2'].value,
        Nomineepercentage3: this.formGroup.controls['Nominee_Percentage3'].value,
        Nomineeisminor: this.formGroup.controls['Nominee_IsMinor'].value,
        Nomineeisminor2: this.formGroup.controls['Nominee_IsMinor2'].value,
        Nomineeisminor3: this.formGroup.controls['Nominee_IsMinor3'].value,
        Completedpercentage: '80',
        Entby: this.formGroup.controls['Entby'].value
      },
      declarationDetails: {
        SourceofWealth: this.formGroup.controls['SourceofWealth'].value,
        AnnualIncome: this.formGroup.controls['AnnualIncome'].value,
        CitizenOtherCountry: this.formGroup.controls['CitizenOtherCountry'].value,
        TaxOtherCountry: this.formGroup.controls['TaxOtherCountry'].value,
        Pep: this.formGroup.controls['Pep'].value,
        PAN: this.formGroup.controls['Pan'].value,
        Completedpercentage: '100',
        Entby: this.formGroup.controls['Entby'].value
      }
    };
    console.log(this.formGroup.value);
    console.log(payload);
    // return
    this.dashboard.onboarding(payload).subscribe(res => {
      console.log(res);
      this.notification.showSuccess('Successfully submitted');
      this.spinnerLoader = false;
      this.loadingStatus = false;
      this.modalService.dismissAll('close');
    }, error => {
      this.notification.showError(error.error.message);
      this.spinnerLoader = false;
      this.loadingStatus = false;
      this.modalService.dismissAll('close');

    });
  }

  editNominee() {
    console.log(this.nomineeData);
    
    this.addNewNominee();
    this.dashboardService.setNomineeData(this.nomineeData);
  }
}
