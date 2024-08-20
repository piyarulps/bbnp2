import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { ExploreFund } from "../interface/explore-funds.interface";
import { Params } from "../interface/core.interface";

@Injectable({
  providedIn: "root",
})
export class ExploreFundsService {

  constructor(private http: HttpClient) {}

  getSchemes(): Observable<ExploreFund> {
    return this.http.get<ExploreFund>(`${environment.URL}/masterData/getSchemes`);
  }

}
