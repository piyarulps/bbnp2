<?php

class DataEncryptor {
    private $publicKeyPath;
    private $aesKey;
    private $aesIV;

    public function __construct($publicKeyPath) {
        $this->publicKeyPath = $publicKeyPath;
        $this->aesKey = openssl_random_pseudo_bytes(32); // AES-256 key
        $this->aesIV = openssl_random_pseudo_bytes(16); // AES-128 IV
    }

    public function encrypt($data) {
        // Encrypt data with AES
        $encryptedData = openssl_encrypt($data, 'aes-256-cbc', $this->aesKey, OPENSSL_RAW_DATA, $this->aesIV);
        $encryptedDataBase64 = base64_encode($encryptedData);
        

        // Create the hash of the plain data
        $hash = hash('sha256', $data, true);
        $hashbin=bin2hex($hash);
        $encryptedHash = openssl_encrypt($hashbin, 'aes-256-cbc', $this->aesKey, OPENSSL_RAW_DATA, $this->aesIV);
        $encryptedHashBase64 = base64_encode($encryptedHash);
      

        // Encrypt the AES key and IV with RSA
        $keyData = base64_encode($this->aesIV) . '|' . base64_encode($this->aesKey);
        $publicKey = file_get_contents($this->publicKeyPath);
        openssl_public_encrypt($keyData, $encryptedKey, $publicKey);
        $encryptedKeyBase64 = base64_encode($encryptedKey);

        return $encryptedKeyBase64 . '|' . $encryptedDataBase64 . '|' . $encryptedHashBase64;
        
    }
}

//https://postlogin.stgserver.co.in/assets/php/camskyc.php?pan=ANJPP7239C&email=patankarabhishek@gmail.com&mobile=9867503909
$publicKeyPath = "./CAMS_PUBLIC_KEY.pem";
if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['pan'])) {
    $pancard = $_GET['pan'];
    $email = $_GET['email'];
    $mobile = $_GET['mobile'];
    $url=$_GET['url'];

    $domainName = $_SERVER['HTTP_HOST'];

    if($domainName  === 'postlogin.stgserver.co.in'){
        $pass = 'Barbnpcams$0524';//staging
        $returnbaseUrl = 'https://www.' . $domainName . '/assets/php/camsdecrypt.php';
    }else{
        //$pass='BnpCams$0724';//production
        $pass = 'Barbnpcams$0524';//staging
        $returnbaseUrl = 'https://' . $domainName . '/assets/php/camsdecrypt.php';
    }

    

    try {
       
        $encryptor = new DataEncryptor($publicKeyPath);
        $data = "$pancard|$email|$mobile|BBNP|EKYC_BARODA|$pass|M|MFKYC3|SESS_ID";//Staging
        $data = "$pancard|$email|$mobile|BBNP|EKYC_BARODA|$pass|M|MFKYC3|SESS_ID";//Production
        $encryptedData = $encryptor->encrypt($data);
        
        // echo 'Data:      '. $data;
        // echo '---';
        // echo $encryptedData;

       
     


echo '<!DOCTYPE html>
<html>
<head>
    <title><center>Please wait We are redirecting your application.Do not refresh or close the browser.</center> </title>
    <script>
        document.addEventListener("DOMContentLoaded", function() {
            // Submit the form
            document.getElementById("myForm").submit();
            
             //window.close();
            
        });
    </script>
</head>
<body>
    <h1>You will be redirected to 3rd party CAMS website for E-KYC</h1>
    <form id="myForm" method="post" enctype="application/x-www-form-urlencoded" action="https://ekycuat.camsonline.com/Home/Home" target="_self">
        <input type="hidden" name="url" value="'. $returnbaseUrl.'" />
        <input type="hidden" name="ekyctype" value="I" />
        <input type="hidden" name="plkyc_type" value="INVESTOR" />
        <input type="hidden" name="kyc_data" value="' . htmlspecialchars($encryptedData) . '" />
        <input type="hidden" name="sess_id" value="abcd1234"/>
    </form>
</body>
</html>';



// $html_code = '<!DOCTYPE html>
// <html>
//   <head>
//     <title>You will now redirected to third party secured site for KYC modification</title>
//   </head>
//   <body>
//     <h1>You will now redirected to third party secured site for KYC modification</h1>
//     <form id="myForm">
//       <button type="button" onclick="postForm()">Submit</button>
//     </form>
    
//     <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
//     <script>
//       function postForm() {
//         var vUrl = "https://ekycuat.camsonline.com";
//         var vKycData = "' .$encryptedData. '" ;
//         var form = $(\'<form method="post" enctype="application/x-www-form-urlencoded" action="\' + vUrl + \'/Home/Home"></form>\');
//         $(form).hide();
//         $(form).append($(\'<input type="hidden" name="url" value="\' + vUrl + \'/Home/Default" />\'));
//         $(form).append($(\'<input type="hidden" name="ekyctype" value="I" />\'));
//         $(form).append($(\'<input type="hidden" name="plkyc_type" value="INVESTOR" />\'));
//         $(form).append($(\'<input type="hidden" name="kyc_data" value="\' + vKycData + \'" />\'));
//         $(form).append($(\'<input type="hidden" name="sess_id" value="abcd1234"/>\'));
//         $(form).appendTo("body").submit();
//       }
//     </script>
//   </body>
// </html>';
// echo $html_code;


        
    } catch (Exception $e) {
        echo 'Error: ' . $e->getMessage();
    }
} else {
    echo 'Invalid request.';
}

?>