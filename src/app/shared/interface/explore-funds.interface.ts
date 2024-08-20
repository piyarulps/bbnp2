export interface Scheme {
    code: string;
    schemeid: string;
    sip_minamt: number;
}

export interface Fund {
    scheme: string;
    schdesc: string;
    category: string;
    subcategory: string;
    risktype: string;
    schemes: Scheme[];
}

export interface FundData {
	fundname: string;
	funds: Fund[];
}

export interface ExploreFund {
    statusCode: string;
    message: string;
    data: FundData;
}
