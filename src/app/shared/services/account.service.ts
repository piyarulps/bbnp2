import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { AccountUser, AccountUserUpdatePassword } from "../interface/account.interface";
import { Stores } from "../interface/store.interface";
import * as JSEncrypt from 'jsencrypt';

@Injectable({
  providedIn: "root",
})
export class AccountService {
  private jsEncrypt: JSEncrypt.JSEncrypt;

  constructor(private http: HttpClient) {
    this.jsEncrypt = new JSEncrypt.JSEncrypt();
  }

  generateRSAKeys(): { publicKey: string, privateKey: string } {
    this.jsEncrypt.getKey();
    const publicKey = this.jsEncrypt.getPublicKey();
    const privateKey = this.jsEncrypt.getPrivateKey();
    return { publicKey, privateKey };
  }

  // Function to encrypt data using RSA public key
  encryptData(data: string, publicKey: string): string {
    this.jsEncrypt.setPublicKey(publicKey);
    const encrypted = this.jsEncrypt.encrypt(data);
    if (!encrypted) {
      throw new Error('Encryption failed.');
    }
    return encrypted;
  }

  // Function to decrypt data using RSA private key
  decryptData(encryptedData: string, privateKey: string): string {
    this.jsEncrypt.setPrivateKey(privateKey);
    const decrypted = this.jsEncrypt.decrypt(encryptedData);
    if (!decrypted) {
      throw new Error('Decryption failed.');
    }
    return decrypted;
  }














  getUserDetails(): Observable<AccountUser> {
    return this.http.get<AccountUser>(`${environment.URL}/self`);
  }

  updateProfile(payload: AccountUser): Observable<AccountUser> {
    return this.http.put<AccountUser>(`${environment.URL}/updateProfile`, payload);
  }

  updatePassword(payload: AccountUserUpdatePassword): Observable<AccountUserUpdatePassword> {
    return this.http.put<AccountUserUpdatePassword>(`${environment.URL}/updatePassword`, payload);
  }

  updateStore(payload: Stores): Observable<Stores> {
    return this.http.put<Stores>(`${environment.URL}/updateStoreProfile`, payload);
  }

}
