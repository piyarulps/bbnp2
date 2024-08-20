export const camsKYC ={
    "KS100": {
      "Description": "KYC Already completed. Investor transaction can be continued.",
      "Action_to_be_taken": "Allow Investor to continue transaction/investment. This needs to be handled by the calling application."
    },
    "KS101": {
      "Description": "KYC record not available. KYC can be done.",
      "Action_to_be_taken": "Allow investor to proceed with the KYC process."
    },
    "KS102": {
      "Description": "KYC status is incomplete, please update KYC with your current KRA through Point of Service of any KRA Intermediary.",
      "Action_to_be_taken": "Should not be allowed for CAMSeKYC. Customer need to contact their respective KRA to complete the KYC. This needs to be informed to investor suitably. Detailed information about the KYC status can be obtained from the KRA websites."
    },
    "KS103": {
      "Description": "KYC is pending for verification.",
      "Action_to_be_taken": "KYC is pending for verification. Inform investor suitably."
    },
    "KS999": {
      "Description": "Connectivity to a KRA is not available for KYC Status verification. Please try after some time.",
      "Action_to_be_taken": "One of the KRA connectivity is not available, hence retry after some time. This needs to be informed to investor suitably. If the error persists for long time contact CAMS support team."
    }
  }
 
  export const errorCodeCams={
    "EK-100": {
      "Description": "Insufficient input parameters/Invalid Email ID/Invalid Mobile No"
    },
    "EK-101": {
      "Description": "Invalid Login credentials"
    },
    "EK-105": {
      "Description": "Invalid PAN provided - Income Tax Department"
    },
    "EK-106": {
      "Description": "PAN verification service failure"
    },
    "EK-107": {
      "Description": "Submitting KRA data has failed due to service or technical issue."
    },
    "EK-108": {
      "Description": "Invalid Intermediary ID provided"
    },
    "EK-109": {
      "Description": "KYC status could not be ascertained due to non-availability of one of the KRA systems"
    },
    "EK-110": {
      "Description": "Current Status of KYC for the PAN is not eligible for eKYC."
    },
    "EK-111": {
      "Description": "Error in verifying KYC Status"
    },
    "EK-112": {
      "Description": "Incorrect PAN"
    },
    "EK-127": {
      "Description": "Invalid return data structure in request"
    },
    "EK-128": {
      "Description": "Invalid eKYC Type"
    },
    "EK-131": {
      "Description": "Digital Signature verification failed for Aadhaar XML"
    },
    "EK-135": {
      "Description": "User has chosen exit option. Hence, cancelling the KYC process"
    },
    "EK-146": {
      "Description": "User data insufficient/unavailable/blocked for Authentication - Max retries exhausted"
    },
    "EK-999": {
      "Description": "Internal Error"
    }
  }
  export const state=[
    {
      key: "001",
      value: "Jammu and Kashmir",
    },
    {
      key: "002",
      value: "Himachal Pradesh",
    },
    {
      key: "003",
      value: "Punjab",
    },
    {
      key: "004",
      value: "Chandigarh",
    },
    {
      key: "005",
      value: "Uttarakhand",
    },
    {
      key: "006",
      value: "Haryana",
    },
    {
      key: "007",
      value: "Delhi",
    },
    {
      key: "008",
      value: "Rajasthan",
    },
    {
      key: "009",
      value: "Uttar Pradesh",
    },
    {
      key: "010",
      value: "Bihar",
    },
    {
      key: "011",
      value: "Sikkim",
    },
    {
      key: "012",
      value: "Arunachal Pradesh",
    },
    {
      key: "013",
      value: "Assam",
    },
    {
      key: "014",
      value: "Manipur",
    },
    {
      key: "015",
      value: "Mizoram",
    },
    {
      key: "016",
      value: "Tripura",
    },
    {
      key: "017",
      value: "Meghalaya",
    },
    {
      key: "018",
      value: "Nagaland",
    },
    {
      key: "019",
      value: "West Bengal",
    },
    {
      key: "020",
      value: "Jharkhand",
    },
    {
      key: "021",
      value: "Odisha",
    },
    {
      key: "022",
      value: "Chhattisgarh",
    },
    {
      key: "023",
      value: "Madhya Pradesh",
    },
    {
      key: "024",
      value: "Gujarat",
    },
    {
      key: "025",
      value: "Daman and Diu",
    },
    {
      key: "026",
      value: "Dadra and Nagar Haveli",
    },
    {
      key: "027",
      value: "Maharashtra",
    },
    {
      key: "028",
      value: "Andhra Pradesh",
    },
    {
      key: "029",
      value: "Karnataka",
    },
    {
      key: "030",
      value: "Goa",
    },
    {
      key: "031",
      value: "Lakshadweep",
    },
    {
      key: "032",
      value: "Kerala",
    },
    {
      key: "033",
      value: "Tamil Nadu",
    },
    {
      key: "034",
      value: "Puducherry",
    },
    {
      key: "035",
      value: "Andaman and Nicobar Islands",
    },
    {
      key: "037",
      value: "Telangana",
    },
    {
      key: "099",
      value: "Others",
    },
  ];
  export const SourceofWealth =[
    {
      value: "",
      label: "Select Source Of Wealth",
    },
    {
      value: "Ancestral Property",
      label: "Ancestral Property",
    },
    {
      value: "Business Income",
      label: "Business Income",
    },
    {
      value: "Gift",
      label: "Gift",
    },
    {
      value: "Prize money",
      label: "Prize money",
    },
    {
      value: "Rental Income",
      label: "Rental Income",
    },
    {
      value: "Royalty",
      label: "Royalty",
    },
    {
      value: "Salary",
      label: "Salary",
    },
    {
      value: "Others",
      label: "Others",
    },
  ];