<?php

//2 parameters will be flag and pancard ACYPL1023G
$flag=$_GET['flag'];

if($flag == 2){
verifyKYC();
}

if($flag == 3){
downloadKYC();
}

 

function getPassword() {
    $xmlPayload = '<?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
            <GetPassword xmlns="https://camskra.com/">
                <PASSWORD>Kras$428242</PASSWORD>
                <PASSKEY>UAT</PASSKEY>
            </GetPassword>
        </soap:Body>
    </soap:Envelope>';

    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://eiscuat1.camsonline.com/cispl/SERVICES_kycenquiry_uat.asmx', // Replace with the actual endpoint URL
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => '',
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 0,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => $xmlPayload,
        CURLOPT_HTTPHEADER => array(
            'Content-Type: text/xml; charset="utf-8"'
        ),
    ));

    $response = curl_exec($curl);

    if (curl_errno($curl)) {
        $error_msg = curl_error($curl);
        curl_close($curl);
        return $error_msg;
    }

    curl_close($curl);

    // Parse the response to extract the password
    $xml = simplexml_load_string($response, null, null, "http://schemas.xmlsoap.org/soap/envelope/");
    $xml->registerXPathNamespace('ns', 'https://camskra.com/');
    $password = $xml->xpath('//ns:GetPasswordResult');

    return (string)$password[0];
}

function verifyKYC() {
    $getpassword = getPassword();
    
    $pancard=$_GET['pancard'];

    if (empty($getpassword)) {
        throw new Exception("Failed to retrieve the password.");
    }

    $endpoint = "https://eiscuat1.camsonline.com/cispl/services_kycenquiry_uat.asmx";
    $request = '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <VerifyPANDetails_eKYC xmlns="https://camskra.com/">
            <InputXML>
                <APP_REQ_ROOT>
                    <APP_PAN_INQ>
                        <APP_PAN_NO>'.$pancard.'</APP_PAN_NO>
                        <APP_PAN_DOB>25-Jun-2023</APP_PAN_DOB>
                        <APP_IOP_FLG>RS</APP_IOP_FLG>
                        <APP_POS_CODE>M</APP_POS_CODE>
                    </APP_PAN_INQ>
                    <APP_SUMM_REC>
                        <APP_OTHKRA_CODE>BARODAPUAT</APP_OTHKRA_CODE>
                        <APP_OTHKRA_BATCH>05062020</APP_OTHKRA_BATCH>
                        <APP_REQ_DATE>05-06-2020</APP_REQ_DATE>
                        <APP_TOTAL_REC>1</APP_TOTAL_REC>
                    </APP_SUMM_REC>
                </APP_REQ_ROOT>
            </InputXML>
            <USERNAME>BARODAPUAT</USERNAME>
            <POSCODE>M</POSCODE>
            <PASSWORD>' . htmlspecialchars($getpassword, ENT_QUOTES, 'UTF-8') . '</PASSWORD>
            <PASSKEY>UAT</PASSKEY>
        </VerifyPANDetails_eKYC>
    </soap:Body>
</soap:Envelope>';

    $ch = curl_init($endpoint);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: text/xml; charset=utf-8',
        'Content-Length: ' . strlen($request)
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($ch);
    if (curl_errno($ch)) {
        throw new Exception(curl_error($ch));
    }
    curl_close($ch);

    echo $response;
}

function downloadKYC(){
    
    $getpassword=getPassword();  // Sb0j0j0GuBBCgOUVITiJaw==
 


        $endpoint = "https://eiscuat1.camsonline.com/cispl/services_kycenquiry_uat.asmx";
        $request = '<?xml version="1.0" encoding="utf-8"?>
<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
        <DownloadPANDetails_eKYC xmlns="https://camskra.com/">
            <InputXML>
                <APP_REQ_ROOT>
                    <APP_PAN_INQ>
                        <APP_PAN_NO>'.$pancard.'</APP_PAN_NO>
                        <APP_PAN_DOB>25-Jun-2023</APP_PAN_DOB>
                        <APP_IOP_FLG>RS</APP_IOP_FLG>
                        <APP_POS_CODE>M</APP_POS_CODE>
                    </APP_PAN_INQ>
                    <APP_SUMM_REC>
                        <APP_OTHKRA_CODE>BARODAPUAT</APP_OTHKRA_CODE>
                        <APP_OTHKRA_BATCH>05062020</APP_OTHKRA_BATCH>
                        <APP_REQ_DATE>05-06-2020</APP_REQ_DATE>
                        <APP_TOTAL_REC>1</APP_TOTAL_REC>
                    </APP_SUMM_REC>
                </APP_REQ_ROOT>
            </InputXML>
            <USERNAME>M</USERNAME>
            <POSCODE>M</POSCODE>
           <PASSWORD>Sb0j0j0GuBBCgOUVITiJaw==</PASSWORD>
            <PASSKEY>UAT</PASSKEY>
        </DownloadPANDetails_eKYC>
    </soap:Body>
</soap:Envelope>';
        
        $ch = curl_init($endpoint);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: text/xml; charset=utf-8',
            'Content-Length: ' . strlen($request)
        ]);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $request);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        
        $response = curl_exec($ch);
        if(curl_errno($ch)){
            throw new Exception(curl_error($ch));
        }
        curl_close($ch);
        
        echo $response;

    
}



