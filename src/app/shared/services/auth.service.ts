import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AuthUserForgotModel, AuthUserStateModel, UpdatePasswordModel, VerifyEmailOtpModel } from "../interface/auth.interface";
import { AuthModel } from "../interface/auth.interface";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(private http: HttpClient) {}

  getIPAddrRemote(): Observable<any> {
    return this.http.get<any>(`http://api.ipify.org/?format=json`);
  }


  getrelationDeclaration(): Observable < any > {
    return this.http.get < any > (`${environment.api}masterData/getrelationDeclaration`);
  }


  getBannerData(): Observable<any> {
    return this.http.get<any>(`${environment.api}banners.json`);
  }
  
  verifyToken(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}token/validate`, payload);
  }

  login(payload:any): Observable<any> {
//wrapper.phppanExistOrNot&method=POST
//'{"PAN": "ABCDE1234F"}'
// $response = $api->handleAPICall('newPan', 'POST', [
//     'PAN' => $pan,
//     'InvName' => $invName,
//     'Email' => $email,
//     'Mobile' => $mobile,
//     'MobileDeclaration' => $mobileDeclaration,
//     'EmailDeclaration' => $emailDeclaration
// ]);

    //return this.http.post<any>(`${environment.api}panExistOrNot&method=POST`, payload);
     return this.http.post<any>(`${environment.api}services/panExistOrNot`, payload);
  }

  panBasedOtpGenerate(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}otp/generateOtpPan`, payload);
  }
  verifyOtp(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}otp/validate`, payload);
  }
  getCheckTransactionAllow(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}services/regulatoryValidation`, payload);
  }
  panBasedOtpverify(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}otp/validateOtpPan`, payload);
  }
  newpan(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}services/newPan`, payload);
  }
  
  register(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}onboarding`, payload);
  }

  forgotPassword(payload: AuthUserForgotModel) {
    return this.http.post(`${environment.api}forgot-password`, payload);
  }

  verifyEmailOtp(payload: VerifyEmailOtpModel) {
    return this.http.post(`${environment.api}verify-token`, payload);
  }

  updatePassword(payload: UpdatePasswordModel) {
    return this.http.post(`${environment.api}update-password`, payload);
  }

  logout() {
    return this.http.post<string>(`${environment.api}logout`, {});
  }

  FolioBasedOtpGenerate(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}otp/generateOtpFolio`, payload);
  }
  FolioBasedOtpverify(payload:any): Observable<any> {
    return this.http.post<any>(`${environment.api}otp/validateOtpFolio`, payload);
  }

}
