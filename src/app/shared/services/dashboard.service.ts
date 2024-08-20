import {
  HttpClient
} from "@angular/common/http";
import {
  Injectable
} from "@angular/core";
import {
  Observable,
  throwError
} from "rxjs";
import {
  environment
} from "../../../environments/environment";
import {
  StatisticsCount,
  RevenueChart
} from "../interface/dashboard.interface";
import {
  Params
} from "../interface/core.interface";
import {
  Subject
} from 'rxjs';
import {
  catchError,
  map
} from 'rxjs/operators';
import {
  NotificationService
} from "./notification.service";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  public cartAdd$: Subject < any > = new Subject < any > ();
  currentCartData = this.cartAdd$.asObservable();
  public cartRemove$: Subject < any > = new Subject < any > ();
  RemoveCartData = this.cartRemove$.asObservable();
  public OTPRefData$: Subject < any > = new Subject < any > ();
  OTPRefData = this.OTPRefData$.asObservable();
  public nomineeData$: Subject < any > = new Subject < any > ();
  nomineeData = this.nomineeData$.asObservable();

  public notificationsdata$: Subject < any > = new Subject < any > ();
  notificationsdata = this.notificationsdata$.asObservable();

  public modalData: any;

  constructor(private notificaiton: NotificationService, private http: HttpClient) {}



  retrunCalculator(c4: any, c5: any, c6: any) {
    const calculatedValue = Number(c4) * Math.pow(1 + c5 / 100, c6);
    const calculatedPercentage = ((calculatedValue - c4) / c4) * 100;
    return {
      return: calculatedValue,
      percentage: calculatedPercentage
    }
  }
  setData(updatedData: any) {
    this.cartAdd$.next(updatedData);

  }
  removeData(updatedData: any) {
    this.cartRemove$.next(updatedData);

  }
  setOTPRefData(updatedData: any) {
    this.OTPRefData$.next(updatedData);

  }
  setNomineeData(updatedData: any) {
    this.nomineeData$.next(updatedData);

  }
  setNotificationsData(updatedData: any) {
    this.notificationsdata$.next(updatedData);

  }

  onboarding(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}onboarding`, payload);
  }
  navLatest(fundCode: any) {
    this.getlatestDailyNav(fundCode).subscribe({
      next: (res: any) => {
        console.log(res);
        return res['document'].net_asset_value
      },
      error: (error) => {
        this.notificaiton.showError('karvy Nav API returned No value');
        console.log(error);
      },
      complete: () => {}
    })
  }

  //   getAllfundTableData(): Observable<any> {
  //     return this.http.get<any>(`${environment.localURL}funddetail/read.php?pageno=1&pagesize=500`);
  //  }

  getFrequency(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/Frequencymaster`, payload);
  }
  getgetSchemesByCode(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}masterData/getSchemesByCode`, payload);
  }
  getSchemes(): Observable < any > {
    return this.http.get < any > (`${environment.api}masterData/getSchemes`);
  }
  getrelationDeclaration(): Observable < any > {
    return this.http.get < any > (`${environment.api}masterData/getrelationDeclaration`);
  }
  sipCancellationReason(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}systematicInvestmentPlan/sipCancellationReasons`, payload);
  }

  getAllMySchemes(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}systematicInvestmentPlan/mySystematicPlans`, payload);
  }
  sipCancelorPause(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}systematicInvestmentPlan/sipCancelorPause`, payload);
  }

  getAllfundTableData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.localURL}funddetail/search_by_column.php?orAnd=AND&pageno=1&pagesize=500`, payload);
  }

  getReadTenTopFunds(): Observable < any > {
    return this.http.get < any > (`${environment.localURL}funddetail/readTenTopFunds.php`);
  }

  getFundReturnMasterData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.localURL}fund_return_master/search_by_column.php?orAnd=AND&pageno=1&pagesize=30`, payload);
  }
  getFundMAnager(id: any): Observable < any > {
    return this.http.get < any > (`${environment.localURL}fundmanagermaster/read_one.php?id=` + id, );
  }
  getfundNavData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.localURL}fundnavdividend/search_by_column.php?orAnd=AND&pageno=1&pagesize=1`, payload);
  }
  getFundTypeMaster(): Observable < any > {
    return this.http.get < any > (`${environment.localURL}fund_type_master/read.php`);
  }
  getFAQData(): Observable < any > {
    return this.http.get < any > (`${environment.serverURL}/faq.json`);
  }

  contactRequest(payload: any) {
    return this.http.get < any > (`${environment.camsURL}/helpdeskemail.php?subject=${payload.subject}&from=${payload.from}&fromName=${payload.fromName}&body=${payload.body}`);

  }
  SubscribeRequest(payload: any) {
    return this.http.get < any > (`${environment.camsURL}/subscribeemail.php?email=${payload.email}`);

  }
  switchafterotp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/switchAfterOtp`, payload);
  }


  switchbeforeotp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/switchBeforeOtp`, payload);
  }


  redeemafterotp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/redemptionAfterOtp`, payload);
  }
  swpafterOTP(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/swpafterOTP`, payload);
  }


  redeembeforeotp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/redemptionBeforeOtp`, payload);
  }
  stpBeforeOtp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/stpBeforeOtp`, payload);
  }
  STPafterOTP(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/STPafterOTP`, payload);
  }
  swpBeforeOTP(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/swpBeforeOTP`, payload);
  }

  getBanks(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.serverURL}/banks.json`, payload);
  }

  getNotificationsData(param: any): Observable < any > {
    return this.http.get < any > (`${environment.serverURL}/notifications.json?page=` + param);
  }
  getGetInsightData(param: any): Observable < any > {
    return this.http.get < any > (`${environment.serverURL}/insights.json?page=` + param);
  }
  emailSubscribes(param: any): Observable < any > {
    return this.http.get < any > (`${environment.serverURL}/subscribe`);
  }

  getBlogsData(): Observable < any > {
    return this.http.get < any > (`${environment.serverURL}/blogs.json`);
  }

  getfundCardData(): Observable < any > {
    return this.http.get < any > (`${environment.api}masterData/getSchemes`);
  }


  getDailyNav(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/dailyNav`, payload);
  }
  getlatestDailyNav(param: any): Observable < any > {
    return this.http.get < any > (`${environment.localURL}fundnavdividend/read_one.php?id=${param}`);
  }
  gettransactionhistory(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/transactionhistory`, payload);
  }

  getPortfolio(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}Portfolio`, payload);
  }
  
  Foliodetails(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/Foliodetails`, payload);
  }
  folioToGetBankDetails(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/getregistredbanks`, payload);
  }
  getAgentData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/ARNvalidation`, payload);
  }

  getcalculateCycleDay(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/calculateCycleDay`, payload);
  }
  getRiaData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/RIAvalidation`, payload);
  }
  getEUINData(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/EUINlist`, payload);
  }
  saveBeforePayment(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/saveBeforePayment`, payload);
  }
  saveAfterPayment(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/saveAfterPayment`, payload);
  }
  purchaseBeforePaymentNewUser(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/purchaseBeforePayment`, payload);
  }
  purchaseaAfterPaymentNewUser(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/purchaseAfterPayment`, payload);
  }
  capitalGainForm(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/capitalgainstatement`, payload);
  }

  accountFormSubmit(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}newPurchase/accountStatement`, payload);
  }

  getMinAmountSp(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/Specialproductminamount`, payload);
  }
  Existingmandatedetails(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/Existingmandatedetails`, payload);
  }
  getNominee(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/getNomineeDetails`, payload);
  }
  getSIPStartEndDate(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/getSIPStartEndDate`, payload);
  }
  getInvestorDetails(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}onboarding/investorDetails`, payload);
  }
  getBankdetails(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/getregistredbanks`, payload);
  }

  transctionHistory(payload: any): Observable < any > {
    return this.http.post < any > (`${environment.api}transaction/transactionhistory`, payload);
  }
  submitKYC(payload: any): Observable < any > {
    return this.http.post < any > (`https://ekycuat.camsonline.com/Home/Home`, payload);
  }
  postXmlData(payload: any): Observable < any > {
    return this.http.post < any > (`https://eiscuat1.camsonline.com/cispl/services_kycenquiry_uat.asmx`, payload);
  }
  postCamsGetPassword(payload: any): Observable < any > {
    const url = `${environment.camsURL}/iop.php`; // Replace with your API endpoint
    const headers = {
      'Content-Type': 'text/xml; charset=utf-8'
    };
    return this.http.post(url, payload, {
      responseType: 'text'
    })
  }
  private apiUrl = `${environment.camsURL}/iop.php`;

  verifyKYC(payload: any): Observable < any > {
    const url = `${this.apiUrl}?flag=${payload.flag}&pancard=${payload.pancard}`;
    return this.http.get(url, {
      responseType: 'text'
    }); // Specify responseType as 'text'
  }
  paymentLinkKYC(payload: any, random: number) {
    return this.http.get < any > (`${environment.camsURL}/camskyc.php?random=${random}&pan=${payload.pan}&email=${payload.email}&mobile=${payload.mobile}`);

  }
  getKYCData(payload: any, random: number): Observable < any > {
    return this.http.get < any > (`${environment.camsURL}/camskyc.php?random=${random}&pan=${payload.pan}&email=${payload.email}&mobile=${payload.mobile}`);
  }
  getDownloadKYC(payload: any): Observable < any > {
     return this.http.get(`${environment.camsURL}/iop.php?flag=${payload.flag}&pancard=${payload.pancard}`)

    // const url =`${environment.camsURL}/iop.php?flag=${payload.flag}&pancard=${payload.pancard}`
    // return this.http.get(url, { responseType: 'text' }).pipe(
    //   map((xmlString) => this.parseXml(xmlString))
    // );
  }

  private parseXml(xmlString: string): any {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
    return this.xmlToJson(xmlDoc);
  }

  private xmlToJson(xml: any): any {
    let obj: any = {}; // Use 'let' here
    if (xml.nodeType === 1) { // element node
      if (xml.attributes.length > 0) {
        obj["@attributes"] = {};
        for (let j = 0; j < xml.attributes.length; j++) {
          const attribute = xml.attributes.item(j);
          obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
        }
      }
    } else if (xml.nodeType === 3) { // text node
      obj = xml.nodeValue;
    }
    
    if (xml.hasChildNodes()) {
      for (let i = 0; i < xml.childNodes.length; i++) {
        const item = xml.childNodes.item(i);
        const nodeName = item.nodeName;
        if (typeof(obj[nodeName]) === "undefined") {
          obj[nodeName] = this.xmlToJson(item);
        } else {
          if (typeof(obj[nodeName].push) === "undefined") {
            const old = obj[nodeName];
            obj[nodeName] = [];
            obj[nodeName].push(old);
          }
          obj[nodeName].push(this.xmlToJson(item));
        }
      }
    }
    return obj;
  }

  getparseXml(xmlString: string): any {
    const result: any = {};
    const regex = /<([^>]+)>([^<]*)<\/\1>/g; // Regex to match XML tags and content

    let match;
    while ((match = regex.exec(xmlString)) !== null) {
      const key = match[1];
      const value = match[2];

      if (value.trim() !== '') {
        result[key] = value.trim(); // Store tag content in result object
      }
    }

    return result;
  }
}