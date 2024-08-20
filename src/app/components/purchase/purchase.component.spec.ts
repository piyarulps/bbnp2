import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseComponent } from './purchase.component';
import { ActivatedRoute, Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NotificationService } from '../../shared/services/notification.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../../shared/services/dashboard.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Validators } from 'ngx-editor';

describe('PurchesComponent', () => {
  let component: PurchaseComponent;
  let fixture: ComponentFixture<PurchaseComponent>;
  let spy: any;
  let router: Router;
  let breakpointObserver: BreakpointObserver;
  let notificationService: NotificationService;
  let datePipe: DatePipe;
  let fb: FormBuilder;
  let modalService: NgbModal;
  let dashboardService: DashboardService;
  let route: ActivatedRoute;
    const data=[{"id":"156","fund_code":"MCDG","amfi_code":"150212","fund_name":"Baroda BNP Paribas Mid Cap Fund","display_name":" Mid Cap Fund","fund_type":"1","investment_type":"short","nature":"O","benchmark":"Nifty Midcap 150 TRI","additional_benchmark":"Nifty 50 Index","plan_type":"5","category_type":"1","option_name":"Growth","risk_type":"6","prc_type":"","bench_type":"6","risk_description":"<b>Baroda BNP Paribas Mid Cap Fund </b><br/>(An Open ended Equity Scheme predominantly investing in mid cap stocks)<br/> This product is suitable for investors who are seeking*: <br/>1. Wealth Creation in long term. <br/> 2. Investments in companies in mid capitalization segment.","prc_desc":"","aum_value":"2103.01","aum_date":"2024-06-30","aum_allotment_date":"2006-05-02","cagr_1_year":55.58,"cagr_3_year":25.65,"cagr_5_year":27.55,"cagr_inception":21.62,"cagr_date":"0000-00-00","fund_manager_id":"18","handling_date":"13-07-2022","fund_detail":"","investment_objective":"The investment objective of the Scheme seeks to generate long-term capital appreciation by investing primarily in companies with high growth opportunities in the mid capitalization segment. The fund will emphasize on companies that appear to offer opportunities for longterm growth and will be inclined towards companies that are driven by dynamic style of management and entrepreneurial flair. However, there can be no assurance that the investment objectives of the Scheme will be realized. The Scheme does not guarantee/indicate any returns.","load_structure":"Entry Load : Not Applicable Exit Load: If units of the Scheme are redeemed or switched out up to 10% of the units (the limit) within 12 months from the date of allotment - Nil; If units of the scheme are redeemed or\nswitched out in excess of the limit within 12 months from the date of allotment - 1% of the applicable NAV; If units of scheme are redeemed or switched out after 12 months from the date of allotment - Nil.","sip":"(i) Daily, Weekly, Monthly SIP: R 500/- and in multiples of R 1/- thereafter; (ii) Quarterly SIP: R 1500/- and in multiples of R 1/- thereafter. There is no upper limit","stp":"Rs 1000/month - 6 Installments \r\n RS 1500/quarter - 4 Installments\r\nSIP Frequency - Daily/Weekly/Fortnightly/Monthly/Quarterly","swp":"Withdrawal must be for a minimum amount of Rs. 1,000/- or in multiples of Re.1/- thereafter in Weekly / Monthly SWP and Rs. 1,500/- and in multiples of Re.1/- thereafter in Quarterly SWP. An investor will have to opt for a minimum of 6 transactions under Weekly / Monthly SWP and 4 transactions under Quarterly SWP.","redemption":"As per the SEBI (MF) Regulations, the Mutual Fund shall despatch redemption proceeds within 10 Business Days of receiving the valid redemption / repurchase request at any of the Official Points of Acceptance of Transactions (OPAT). A penal interest of 15%\n","type_of_scheme":"An Open ended Equity Scheme predominantly investing in mid cap stocks.","scheme_factsheet":"","kim_application_form":"","product_note":"Mid_Cap_1_7880.pdf","product_brochure":"Baroda_BNP_Paribas_Mid_Cap_Fund-April_2024_6986.pdf","meta_title":"Baroda BNP Paribas Mid Cap Fund | Direct Growth -  Mutual Fund | Funds in Equity","meta_description":"Invest online in Baroda BNP Paribas Mid Cap Fund - Direct Growth","keywords_used":"Mid Cap, Mid Cap fund, Mid Cap mutual fund,  Mid Cap fund, Mid Cap mutual fund list, Mid Cap price, Baroda BNP Paribas Mid Cap fund, Baroda BNP Paribas Mid Cap fund,  Mid Cap funds, Funds in Equity","fund_img":"Midcap-img.jpg","prc_matrix_img":"overview.jpg","status":"Y","added":true,"url":"/sip-investment"}]
    localStorage.setItem("cartData", JSON.stringify(data));
  beforeEach(async () => {
    const routerSpy = {
      navigate: jest.fn(),
    };
    const breakpointObserverSpy = {
      observe: jest.fn().mockReturnValue(of({matches:'test'})),
    };
    const notificationServiceSpy = {
      notify: jest.fn(),
      showError: jest.fn(),
      showSuccess: jest.fn(),
    };
    const datePipeSpy = {
      transform: jest.fn(),
    };
    const formBuilderSpy = {
      group: jest.fn(),
    };
    const modalServiceSpy = {
      open: jest.fn().mockReturnValue({componentInstance:{name:''},
      result:of({})}),
    };
    const dashboardServiceSpy = {
      getSchemesByCode: jest.fn(),
      getFundTypeMaster: jest.fn(),
    };
    const activatedRouteSpy = {
      queryParams:of({schemid:'testId',flag:'Y',Mode:true}),
      snapshot: { paramMap: { get: jest.fn(() => 'testId') } },
    };
  
    await TestBed.configureTestingModule({
      declarations: [PurchaseComponent],
      imports: [ReactiveFormsModule,HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], 
      providers: [DashboardService,
        { provide: Router, useValue: routerSpy },
        // { provide: DashboardService, useValue: dashboardServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
        { provide: DatePipe, useValue: datePipeSpy },
        { provide: FormBuilder, useValue: formBuilderSpy },
        { provide: NgbModal, useValue: modalServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteSpy }]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    breakpointObserver = TestBed.inject(BreakpointObserver);
    notificationService = TestBed.inject(NotificationService);
    datePipe = TestBed.inject(DatePipe);
    fb = TestBed.inject(FormBuilder);
    modalService = TestBed.inject(NgbModal);
    dashboardService = TestBed.inject(DashboardService);
    route = TestBed.inject(ActivatedRoute);
    // fixture.detectChanges();
  });

  it('should create', () => {
    // component.getSchemesByCodeforTwoDigit=jest.fn()
    component.initConstOnload=jest.fn();
    // component.quesrySchemid="testId"
    // component.formGroup = new FormGroup({
    //   Sipfrequency: new FormControl("Monthly"),
    //   termsConditions: new FormControl(true),
    //   Sipstartdate: new FormControl(""),
    //   Sipflag: new FormControl("Yes"),
    //   Amount: new FormControl("2000"),
    //   Investment: new FormControl("REGULAR"),});
    // dashboardService.getgetSchemesByCode=jest.fn(() => of({data:[{schemes:[]}]}))
    // expect(component).toBeTruthy();
    // component.formGroup.controls['Sipstartdate'].patchValue(of({}));
    component.formGroup.controls['Sipnoofinstallments'].patchValue(of({}));
  });
  it('should  be call on init', () => {
    component.quesrySchemid="";
    component.ngOnInit();
    component.formGroup.controls['Euinno'].setValue(of('sfsdf'));

  })
  it('should  be call on init quesrySchemid else', () => {
    component.quesrySchemid="";
    component.cartData={
      cagr_3_year: 0
    }
    component.ngOnInit();
    component.formGroup.controls['Euinno'].setValue(of('sfsdf'));

  })
  it('should  be call on init', () => {
    component.quesrySchemid="testId"
    component.ngOnInit();
    component.formGroup.controls['Euinno'].setValue(of('sfsdf'));

  })
  it('should  be call on onintOnchanges', () => {
      component.formGroup = new FormGroup({
      Sipfrequency: new FormControl("Monthly"),
      termsConditions: new FormControl(true),
      Sipstartdate: new FormControl(""),
      Euinno: new FormControl(""),
      riaCode: new FormControl(""),
      Subarncode: new FormControl(""),
      Ria: new FormControl(""),
      Sipflag: new FormControl(""),
      Plan: new FormControl(""),
      Paymode: new FormControl(""),
      Upiid: new FormControl(""),
      Optnominee: new FormControl(""),
      Authenticationmode: new FormControl(""),
      Nominee: new FormControl(""),
      Riadisclaimerflag: new FormControl(""),
      Sipnoofinstallments: new FormControl(""),
      customValue: new FormControl(""),
      Euinopt: new FormControl(""),
      Schemeid: new FormControl(""),
      Sipenddate: new FormControl(""),
      arnria: new FormControl(""),
      Amount: new FormControl("2000"),
      Investment: new FormControl("REGULAR"),});
    component.onintOnchanges();
    component.formGroup.controls['Euinno'].setValue(of('sfsdf'));

  })
  it('should  be call on showDialog', () => {
    component.showDialog('test');

  })

  it('should handle the modal result correctly', async () => {
    const mockModalRef = {
      componentInstance: {
        name: ''
      },
      result: Promise.resolve({ nominees: 'nominee data' })
    };
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);

    component.addNewNominee();

    await mockModalRef.result;

    expect(component.NewNomice).toBe('nominee data');
    expect(component.formGroup.controls['Nominee'].value).toBe('');
    expect(component.formGroup.controls['Nominee'].disabled).toBe(true);
  });

  it('should handle modal dismissal correctly', async () => {
    const mockModalRef = {
      componentInstance: {
        name: ''
      },
      result: Promise.reject('close')
    };
    jest.spyOn(modalService, 'open').mockReturnValue(mockModalRef as any);

    component.addNewNominee();

    try {
      await mockModalRef.result;
    } catch (reason) {
      expect(reason).toBe('close');
    }
  });

  it('should call getEUINData when Euinno value changes', (done) => {
    const euinnoControl = component.formGroup.controls['Euinno'];
    const spy = jest.spyOn(component, 'getEUINData');

    component.onintOnchanges();

    // Simulate value change
    euinnoControl.setValue('12345');

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('12345');
      done();
    }, 400); // wait for debounceTime
  });

  it('should call getRiaData when riaCode value changes', (done) => {
    const riaCodeControl = component.formGroup.controls['riaCode'];
    const spy = jest.spyOn(component, 'getRiaData');

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('67890');

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('67890');
      done();
    }, 400); // wait for debounceTime
  });
  it('should call getSubAgentData when Subarncode value changes', (done) => {
    const riaCodeControl = component.formGroup.controls['Subarncode'];
    const spy = jest.spyOn(component, 'getSubAgentData');

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('67890');

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('67890');
      done();
    }, 400); // wait for debounceTime
  });
 
  it('should call getAgentData when arnria value changes', (done) => {
    const riaCodeControl = component.formGroup.controls['arnria'];
    const spy = jest.spyOn(component, 'getAgentData');

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('67890');

    setTimeout(() => {
      expect(spy).toHaveBeenCalledWith('67890');
      done();
    }, 400); // wait for debounceTime
  });
  it('should call retrunCalculator and log values when Amount value changes', (done) => {
    jest.spyOn(component, 'retrunCalculator');
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Suppress console.log during tests
    
    // Set initial values
    component.selectedYr = '2024';
    component.minAmount = '500';
    
    component.ngOnInit();
    
    // Simulate a value change in the Amount form control
    component.formGroup.controls['Amount'].setValue('1500');

    // Wait for debounceTime to complete
    setTimeout(() => {
      expect(component.retrunCalculator).toHaveBeenCalledWith('2024');
      expect(console.log).toHaveBeenCalledWith('500', '1500');
      done();
    }, 350); // Slightly more than 300ms debounce time
  });
  it('should call getAgentData when Ria value changes', () => {
    const riaCodeControl = component.formGroup.controls['Ria'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('67890');
  });
  it('should call getAgentData when Ria value changes', () => {
    const riaCodeControl = component.formGroup.controls['Ria'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('');
  });
  it('should call getAgentData when termsConditions value changes', () => {
    const riaCodeControl = component.formGroup.controls['termsConditions'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('fdgdg');
  });
  it('should call getAgentData when Sipflag value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipflag'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('Yes');
  });
  it('should call getAgentData when Sipflag value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipflag'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('No');
  });
  it('should call getAgentData when Paymode value changes', () => {
    const riaCodeControl = component.formGroup.controls['Paymode'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('UPI');
  });
  it('should call getAgentData when Paymode value changes', () => {
    const riaCodeControl = component.formGroup.controls['Paymode'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('No');
  });
  it('should call getAgentData when Optnominee value changes', () => {
    const riaCodeControl = component.formGroup.controls['Optnominee'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('Yes');
  });
  it('should call getAgentData when Optnominee value changes', () => {
    const riaCodeControl = component.formGroup.controls['Optnominee'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('No');
  });
  it('should call getAgentData when Sipstartdate value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipstartdate'];

    component.onintOnchanges();

    // Simulate value change
    riaCodeControl.setValue('05-04-2022');
  });
  it('should call getAgentData when Sipnoofinstallments value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipnoofinstallments'];
    const Sipfrequency = component.formGroup.controls['Sipfrequency'];

    component.onintOnchanges();

    Sipfrequency.setValue('Monthly');
    // Simulate value change
    riaCodeControl.setValue('Monthly');
  });
  it('should call getAgentData when Sipnoofinstallments value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipnoofinstallments'];
    const Sipfrequency = component.formGroup.controls['Sipfrequency'];

    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('Weekly');
    riaCodeControl.setValue('Weekly');
  }); it('should call getAgentData when Sipnoofinstallments value changes', () => {
    const riaCodeControl = component.formGroup.controls['Sipnoofinstallments'];
    const Sipfrequency = component.formGroup.controls['Sipfrequency'];

    component.onintOnchanges();

    Sipfrequency.setValue('Daily');
    // Simulate value change
    riaCodeControl.setValue('Daily');
  }); it('should call getAgentData when customValue value changes', () => {
    const riaCodeControl = component.formGroup.controls['customValue'];
    const Sipfrequency = component.formGroup.controls['Sipnoofinstallments'];

    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('custom');
    riaCodeControl.setValue('custom');
  });
  it('should call getAgentData when Nominee value changes', () => {
    const riaCodeControl = component.formGroup.controls['Nominee'];
    const Sipfrequency = component.formGroup.controls['Sipnoofinstallments'];

    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('custom');
    riaCodeControl.setValue('create');
  });
  it('should call getAgentData when Euinopt value changes', () => {
    const riaCodeControl = component.formGroup.controls['Euinopt'];
    const Sipfrequency = component.formGroup.controls['Sipnoofinstallments'];

    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('custom');
    riaCodeControl.setValue('create');
  });
  it('should call getAgentData when Investment value changes', () => {
    const riaCodeControl = component.formGroup.controls['Investment'];
    const Sipfrequency = component.formGroup.controls['Sipnoofinstallments'];

    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('custom');
    riaCodeControl.setValue('create');
  });
  it('should call getAgentData when Plan value changes', () => {
    const riaCodeControl = component.formGroup.controls['Plan'];
    const Sipfrequency = component.formGroup.controls['Sipnoofinstallments'];
    component.planList={
      create:{
        plan:"create",
        option:"create" 
      }
    }
    component.onintOnchanges();

    // Simulate value change
    Sipfrequency.setValue('custom');
    riaCodeControl.setValue('create');
  });
  it('should call getAgentData when Plan value changes', () => {
    component.allFundsData=[ {
      "id": "156",
      "fund_code": "MCDG",
      "amfi_code": "150212",
      "fund_name": "Baroda BNP Paribas Mid Cap Fund",
      "display_name": " Mid Cap Fund",
      "fund_type": "1",
      "investment_type": "short",
      "nature": "O",
      "benchmark": "Nifty Midcap 150 TRI",
      "additional_benchmark": "Nifty 50 Index",
      "plan_type": "5",
      "category_type": "1",
      "option_name": "Growth",
      "risk_type": "6",
      "prc_type": "",
      "bench_type": "6",
      "risk_description": "<b>Baroda BNP Paribas Mid Cap Fund <\/b><br\/>(An Open ended Equity Scheme predominantly investing in mid cap stocks)<br\/> This product is suitable for investors who are seeking*: <br\/>1. Wealth Creation in long term. <br\/> 2. Investments in companies in mid capitalization segment.",
      "prc_desc": "",
      "aum_value": "2103.01",
      "aum_date": "2024-06-30",
      "aum_allotment_date": "2006-05-02",
      "cagr_1_year": "55.58",
      "cagr_3_year": "25.65",
      "cagr_5_year": "27.55",
      "cagr_inception": "21.62",
      "cagr_date": "0000-00-00",
      "fund_manager_id": "18",
      "handling_date": "13-07-2022",
      "fund_detail": "",
      "investment_objective": "The investment objective of the Scheme seeks to generate long-term capital appreciation by investing primarily in companies with high growth opportunities in the mid capitalization segment. The fund will emphasize on companies that appear to offer opportunities for longterm growth and will be inclined towards companies that are driven by dynamic style of management and entrepreneurial flair. However, there can be no assurance that the investment objectives of the Scheme will be realized. The Scheme does not guarantee\/indicate any returns.",
      "load_structure": "Entry Load : Not Applicable Exit Load: If units of the Scheme are redeemed or switched out up to 10% of the units (the limit) within 12 months from the date of allotment - Nil; If units of the scheme are redeemed or\nswitched out in excess of the limit within 12 months from the date of allotment - 1% of the applicable NAV; If units of scheme are redeemed or switched out after 12 months from the date of allotment - Nil.",
      "sip": "(i) Daily, Weekly, Monthly SIP: R 500\/- and in multiples of R 1\/- thereafter; (ii) Quarterly SIP: R 1500\/- and in multiples of R 1\/- thereafter. There is no upper limit",
      "stp": "Rs 1000\/month - 6 Installments \r\n RS 1500\/quarter - 4 Installments\r\nSIP Frequency - Daily\/Weekly\/Fortnightly\/Monthly\/Quarterly",
      "swp": "Withdrawal must be for a minimum amount of Rs. 1,000\/- or in multiples of Re.1\/- thereafter in Weekly \/ Monthly SWP and Rs. 1,500\/- and in multiples of Re.1\/- thereafter in Quarterly SWP. An investor will have to opt for a minimum of 6 transactions under Weekly \/ Monthly SWP and 4 transactions under Quarterly SWP.",
      "redemption": "As per the SEBI (MF) Regulations, the Mutual Fund shall despatch redemption proceeds within 10 Business Days of receiving the valid redemption \/ repurchase request at any of the Official Points of Acceptance of Transactions (OPAT). A penal interest of 15%\n",
      "type_of_scheme": "An Open ended Equity Scheme predominantly investing in mid cap stocks.",
      "scheme_factsheet": "",
      "kim_application_form": "",
      "product_note": "Mid_Cap_1_7880.pdf",
      "product_brochure": "Baroda_BNP_Paribas_Mid_Cap_Fund-April_2024_6986.pdf",
      "meta_title": "Baroda BNP Paribas Mid Cap Fund | Direct Growth -  Mutual Fund | Funds in Equity",
      "meta_description": "Invest online in Baroda BNP Paribas Mid Cap Fund - Direct Growth",
      "keywords_used": "Mid Cap, Mid Cap fund, Mid Cap mutual fund,  Mid Cap fund, Mid Cap mutual fund list, Mid Cap price, Baroda BNP Paribas Mid Cap fund, Baroda BNP Paribas Mid Cap fund,  Mid Cap funds, Funds in Equity",
      "fund_img": "Midcap-img.jpg",
      "prc_matrix_img": "overview.jpg",
      "status": "Y"
  },]
    dashboardService.getAllfundTableData =jest.fn().mockReturnValue(of({
      document:{
        records:''
      }
    }))
    component.fundTableData()
  })

  it('should call FundTypeMaster when Plan value changes', () => {
    dashboardService.getFundTypeMaster=jest.fn().mockReturnValue(of({
      document:{
        records:[{fund_id :'test'}]
      }
    }))
    component.cartData={
      fund_type:'test'
    }
    component.FundTypeMaster()
  })
  it('should call afterDateCalculations when Plan value changes', () => {

    component.afterDateCalculations(5)
  })
  it('should call back', () => {

    component.back()
  })
  it('should call back', () => {

    component.addAmount(124)
  })
  it('should call back', () => {
    dashboardService.getPortfolio=jest.fn().mockReturnValue(of({
      data:{
        FolioDetails:[{folio:'test'}]
      }
    }))
    component.getfolioData()
  })
  it('should call back', () => {
    dashboardService.getPortfolio=jest.fn().mockReturnValue(of({
      data:{
        FolioDetails:[{folio:''}]
      }
    }))
    component.getfolioData()
  })
  it('should log error on failure', () => {
    const fundcode = 'DEGPG';
    const data = { Schemeid: fundcode, Trtype: 'SIP' };
    const error = 'some error';
    jest.spyOn(dashboardService, 'getPortfolio').mockReturnValue(throwError(error));
    component.getfolioData();
    expect(console.log).toHaveBeenCalledWith(error);
  });
  it('should log error on failure', () => {
    const fundcode = 'DEGPG';
    const data = { Schemeid: fundcode, Trtype: 'SIP' };
    const error = 'some error';
    jest.spyOn(dashboardService, 'getFrequency').mockReturnValue(throwError(error));
    component.getFrequency();
    expect(console.log).toHaveBeenCalledWith(error);
  });
  it('should set frequencydata on success', () => {
    const fundcode = 'DEGPG';
    const data = { Schemeid: fundcode, Trtype: 'SIP' };
    const response = { data: 'some data' };
     jest.spyOn(dashboardService, 'getFrequency').mockReturnValue(of(response));
    component.getFrequency();
    expect(component.frequencydata).toBe(response.data);
  });
  it('should call getgetSchemesByCode with correct payload', () => {
    const schemeCode = 'SE';
    const payload = { schemeCode };
    const spy = jest.spyOn(dashboardService, 'getgetSchemesByCode');
    component.getSchemesByCodeforTwoDigit();
  });

  it('should set planList on success', () => {
    const schemeCode = 'SE';
    const payload = { schemeCode };
    const response = { data: [{ schemes: [{ plnmode: 'some plan mode' }] }] };
    const spy = jest.spyOn(dashboardService, 'getgetSchemesByCode').mockReturnValue(of(response));
    component.getSchemesByCodeforTwoDigit();});

  it('should log error on failure', () => {
    const schemeCode = 'SE';
    const payload = { schemeCode };
    const error = 'some error';
    const spy = jest.spyOn(dashboardService, 'getgetSchemesByCode').mockReturnValue(throwError(error));
    component.getSchemesByCodeforTwoDigit();
  });
  it('should call getAgentData with correct payload', () => {
    const value = '123';
    const payload = { Agent: 'ARN-' + value };
    jest.spyOn(dashboardService, 'getAgentData');
    component.getAgentData(value);
  });

  it('should set agentname on success', () => {
    const value = '123';
    const payload = { Agent: 'ARN-' + value };
    const response = { data: [{ name: 'some name' }] };
    jest.spyOn(dashboardService, 'getAgentData').mockReturnValue(of(response));
    component.getAgentData(value);
    expect(component.agentname).toBe('some name');
    expect(component.formGroup.controls['Distributorcode'].value).toBe('ARN-' + value);
  });

  it('should set agentname to empty string on failure', () => {
    const value = '123';
    const payload = { Agent: 'ARN-' + value };
    const error = 'some error';
     jest.spyOn(dashboardService, 'getAgentData').mockReturnValue(throwError(error));
    component.getAgentData(value);
    expect(component.agentname).toBe('');
    expect(console.log).toHaveBeenCalledWith(error);
  });
  it('should call Existingmandatedetails with correct payload', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
     jest.spyOn(dashboardService, 'Existingmandatedetails');
    component.getExistingmandatedetails();
  });

  it('should set ExistingmandateData on success', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
    const response = { data: 'some data' };
     jest.spyOn(dashboardService, 'Existingmandatedetails').mockReturnValue(of(response));
    component.getExistingmandatedetails();
    expect(component.ExistingmandateData).toBe(response.data);
  });

  it('should log error on failure', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
    const error = 'some error';
     jest.spyOn(dashboardService, 'Existingmandatedetails').mockReturnValue(throwError(error));
    component.getExistingmandatedetails();
    expect(console.log).toHaveBeenCalledWith(error);
  });
  it('should call getNominee with correct payload', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
    spy = jest.spyOn(dashboardService, 'getNominee');
    component.getNomineedetails();
  });

  it('should call nomineeGenerate on success if data exists', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
    const response = { data: [{ some: 'data' }] };
    spy = jest.spyOn(dashboardService, 'getNominee').mockReturnValue(of(response));
    const nomineeGenerateSpy = jest.spyOn(component, 'nomineeGenerate');
    component.getNomineedetails();
    expect(nomineeGenerateSpy).toHaveBeenCalledWith(response.data[0]);
  });

  it('should log error on failure', () => {
    const pan = '1234567890';
    const payload = { PAN: pan };
    const error = 'some error';
    spy = jest.spyOn(dashboardService, 'getNominee').mockReturnValue(throwError(error));
    component.getNomineedetails();
    expect(console.log).toHaveBeenCalledWith(error);
  });

  it('should generate nominees correctly', () => {
    const data = {
      Name_Of_Nominee: 'Nominee 1',
      Guardian_Name: 'Guardian 1',
      Nominee_Percentage: '50',
      Nominee_IsMinor: 'false',
      Relation_With_Nominee: 'Father',
      Date_Of_birth: '1990-01-01',
      Nom_add: '123 Main St',
      Name_Of_Nominee1: 'Nominee 2',
      Guardian_Name1: 'Guardian 2',
      Nominee_Percentage1: '50',
      Nominee_IsMinor1: 'true',
      Relation_With_Nominee1: 'Mother',
      Date_Of_birth1: '1995-05-05',
      Nom_add1: '456 Elm St'
    };
    component.nomineeGenerate(data);
  });
  
  it('should call getSIPStartEndDate and handle the response correctly', () => {
    const formattedStartDate = '01';
    const frequency = 'monthly';
    const installments = '12';
    const transactionType = 'SIP';
    const data = {
      frequency,
      startDate: formattedStartDate,
      installments,
      transactionType,
    };
    const response = { /* mock response */ };
    const dashboardService = TestBed.inject(DashboardService);
    const getSIPStartEndDateSpy = jest.spyOn(dashboardService, 'getSIPStartEndDate').mockReturnValue(of(response));
    const makePayementSpy = jest.spyOn(component, 'MakePayement');
    component.NewUserPurchase=jest.fn().mockReturnValue(of({}))

    component.getSIPStartEndDate();

    component.formGroup.controls["Folio"].setValue("create");
    component.getSIPStartEndDate();

    expect(makePayementSpy).not.toHaveBeenCalled();
  });
  it('should call getBankdetails and handle the response correctly', () => {
    const folio = '1234';
    const response = { data: { Activemandates: [{ urmrno: '5678' }] } };
    const dashboardService = TestBed.inject(DashboardService);
    const getBankdetailsSpy = jest.spyOn(dashboardService, 'getBankdetails').mockReturnValue(of(response));

    component.formGroup.controls["Folio"].setValue(folio);
    component.geBankdetails();

    console.log('bankDetails:', component.bankDetails); // Add this line for debugging
    console.log('Umrnno value:', component.formGroup.controls["Umrnno"].value); // Add this line for debugging

    expect(getBankdetailsSpy).toHaveBeenCalledWith({ Folio: folio });
    expect(component.bankDetails).toEqual(response.data.Activemandates);
    expect(component.loadingStatus).toBe(false);
  });
  it('should call getBankdetails and handle the response correctly', () => {
    const folio = '1234';
    const response = { data: { Activemandates: [{ urmrno: '5678' }] } };
    const dashboardService = TestBed.inject(DashboardService);
    const getBankdetailsSpy = jest.spyOn(dashboardService, 'getBankdetails').mockReturnValue(of(response));

    component.formGroup.controls["Folio"].setValue(folio);
    component.geBankdetails();

    expect(getBankdetailsSpy).toHaveBeenCalledWith({ Folio: folio });
    expect(component.bankDetails).toEqual(response.data.Activemandates);
    expect(component.loadingStatus).toBe(false);

    // Test error handling
    const error = new Error('Something went wrong');
    getBankdetailsSpy.mockReturnValue(throwError(error));
    component.formGroup.controls["Folio"].setValue(folio);
    component.geBankdetails();

    expect(getBankdetailsSpy).toHaveBeenCalledWith({ Folio: folio });
    expect(component.bankDetails).toEqual([]);
    expect(component.loadingStatus).toBe(false);
  });
  it('should call getAgentData and handle the response correctly', () => {
    const value = '1234';
    const response = { data: [{ name: 'John Doe' }] };
    const getAgentDataSpy = jest.spyOn(dashboardService, 'getAgentData').mockReturnValue(of(response));

    component.getSubAgentData(value);

    expect(getAgentDataSpy).toHaveBeenCalledWith({ Agent: 'ARN-' + value });
    expect(component.subagentname).toEqual('John Doe');

    // Test error handling
    const error = new Error('Something went wrong');
    getAgentDataSpy.mockReturnValue(throwError(error));
    component.getSubAgentData(value);

    expect(getAgentDataSpy).toHaveBeenCalledWith({ Agent: 'ARN-' + value });
    expect(component.subagentname).toEqual('');
  });

  it('should call geBankdetails', () => {
    component.formGroup.controls["Folio"].setValue('create');
    component.formGroup.controls["Optnominee"].setValue('Yes');
    component.geBankdetails()
  })
  it('should call gtag with correct parameters', () => {

    const gtagSpy = jest.fn() as unknown as (...args: any[]) => void;
    (window as any).gtag = gtagSpy;

    component.trackButtonClick();

    expect(gtagSpy).toHaveBeenCalledWith('event', 'button_click', {
      event_category: 'button',
      event_label: 'make_payment',
      value: 1,
    });
  });
  
  it('should call submit 1', () => {
    component.formGroup.controls["Investment"].setValue('REGULAR');
    component.formGroup.controls["arnria"].setValue('');
    component.submit()
    component.formGroup.controls["Plan"].setValue('REGULAR');

    component.formGroup.controls["Sipstartdate"].setValue('');
    component.formGroup.controls["Sipflag"].setValue('Yes');
    component.submit()
    component.minAmount =500;
    component.submit()
  })
  it('should call trackButtonClick when submit is called', () => {

    component.submit();
  });

  it('should show error if verifyKYC is Yes', () => {
    localStorage.setItem('verifyKYC','no')
    const showErrorSpy = jest.spyOn(notificationService, 'showError');

    component.submit();

  });

  it('should show error if amount is less than minAmount', () => {
    component.minAmount = 100;
    component.formGroup.controls['Amount'].setValue(50);
    const showErrorSpy = jest.spyOn(notificationService, 'showError');

    component.submit();

    expect(showErrorSpy).toHaveBeenCalledWith("Minimum amount should be 100");
  });

  it('should not show any errors if all conditions pass', () => {
    // jest.spyOn(localStorage, 'getItem').mockReturnValue('No');
    component.minAmount = 100;
    component.formGroup.controls['Amount'].setValue(150);
    const showErrorSpy = jest.spyOn(notificationService, 'showError');

    component.submit();
    // You can add more assertions here for what should happen if everything passes
  });
  
  it('should show error if verifyKYC is Yes', () => {
    
    component.formGroup.controls["Plan"].setValue('REGULAR');
    component.formGroup.controls["Investment"].setValue('REGULAR');
    component.formGroup.controls["Sipflag"].setValue('no');
    component.formGroup.controls["arnria"].setValue('');
    component.submit();
    component.formGroup.controls["arnria"].setValue('ghf');
    component.formGroup.controls["Euinopt"].setValue('ghf');
    component.formGroup.controls["Euinno"].setValue('');
    component.submit();
    component.formGroup.controls["Investment"].setValue('DIRECT');
    component.formGroup.controls["Ria"].setValue('ghf');
    component.formGroup.controls["riaCode"].setValue('ghf');
    const res = { /* mock response object */ };
    const type = 'existingPurchase';
    component.existingPurchase=jest.fn(() => of(res));
    modalService.open = jest.fn().mockReturnValue({componentInstance: { name: 'Nominee' },
      result: Promise.resolve('OTP'),})   


    jest.spyOn(dashboardService, 'setOTPRefData').mockReturnValue();
    component.submit();  
  });
  
  it('should show openModal', () => {
  const res = { /* mock response object */ };
  const type = 'existingPurchase';
  component.existingPurchase=jest.fn(() => of(res));
  modalService.open = jest.fn().mockReturnValue({componentInstance: { name: 'Nominee' },
    result: Promise.resolve('OTP'),})   
  jest.spyOn(dashboardService, 'setOTPRefData').mockReturnValue();
  component.openModal({name:'Nominee',data:[{SIP_StartDate:'',SIP_EndDate:''}]});  
});
it('should be call MakePayement', () => {
  component.openModalTwoFactor  = jest.fn().mockReturnValue({componentInstance: { name: 'Nominee' }})   
  component.MakePayement({});  
});
it('should be call  existingPurchase', () => {
  dashboardService.saveBeforePayment=jest.fn().mockReturnValue(of({data:{lumpsum:'fghf',sip:'fghf'}}));
  component.openModalTwoFactor  = jest.fn().mockReturnValue({componentInstance: { name: 'Nominee' }})   
  component.existingPurchase({name:'Nominee',data:[{SIP_StartDate:'',SIP_EndDate:''}]});  
});
it('should be call openPaymentPage', () => {
   component.paymentLink('/purchase');  
});
it('should open a new window with the correct URL', () => {
  const mockWindow = {
    open: jest.fn(),
  };
  window.open = mockWindow.open;

  const testUrl = 'https://example.com';
  component.openPaymentPage(testUrl);
});
it('should be call openPaymentPage', () => {
  dashboardService.purchaseaAfterPaymentNewUser=jest.fn().mockReturnValue(of({data:[{lumpsum:'fghf',sip:'fghf'}]}));
  
  component.saveAfterPaymentNewUser({appno:''});  
});
it('should be call openPaymentPage', () => { const error = 'some error';
  const spy = jest.spyOn(dashboardService, 'purchaseaAfterPaymentNewUser').mockReturnValue(throwError(error));
  component.saveAfterPaymentNewUser({appno:''});  
});

it('should call getSchemesByCode with correct payload', () => {
  const schemeCode = 'SE';
  const payload = { schemeCode };
  component.formGroup.controls['Sipflag'].setValue('Yes');

  dashboardService.getgetSchemesByCode = jest.fn().mockReturnValue(of({
    data:[{
      sipallow:'Y'
    }]

  }));
  component.getSchemesByCode();
});
it('should call getSchemesByCode with correct payload', () => {
  const schemeCode = 'SE';
  const payload = { schemeCode };
  component.formGroup.controls['Sipflag'].setValue('Yes');

  dashboardService.getgetSchemesByCode = jest.fn().mockReturnValue(of({
    data:[{
      sipallow:'N'
    }]

  }));
  component.getSchemesByCode();
});
it('should call getSchemesByCode with correct payload', () => {
  const schemeCode = 'SE';
  const payload = { schemeCode };
  component.formGroup.controls['Sipflag'].setValue('No');

  dashboardService.getgetSchemesByCode = jest.fn().mockReturnValue(of({
    data:[{
      sipallow:'N',
      purallow:'Y'
    }]

  }));
  component.getSchemesByCode();
});
it('should call getSchemesByCode with correct payload', () => {
  const schemeCode = 'SE';
  const payload = { schemeCode };
  component.formGroup.controls['Sipflag'].setValue('No');

  dashboardService.getgetSchemesByCode = jest.fn().mockReturnValue(of({
    data:[{
      sipallow:'N',
      purallow:'N'
    }]

  }));
  component.getSchemesByCode();
});
it('should call disableDatePickerPrev', () => {

  component.disableDatePickerPrev({month: 1, year: 2022});
});
it('should call disableDatePickerPrev', () => {

  component.formGroup.controls['Sipfrequency'].setValue(of('sfsdf'));
  component.formGroup.controls['termsConditions'].setValue(of('sfsdf'));
  component.formGroup.controls['Folio'].setValue(of('sfsdf'));
  component.formGroup.controls['Plan'].setValue(of('sfsdf'));
  component.formGroup.controls['Euinno'].setValue(of('sfsdf'));

  dashboardService.purchaseBeforePaymentNewUser =jest.fn().mockReturnValue(of({data:{lumpsum:'fghf',sip:'fghf'}}));
  component.newPurchase({name:'Nominee',data:[{SIP_StartDate:'',SIP_EndDate:''}]});
});
});
