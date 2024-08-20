<?php

class DataDecryptor {
    private $privateKeyPath;

    public function __construct($privateKeyPath) {
        $this->privateKeyPath = $privateKeyPath;
    }

    public function decrypt($encryptedData) {
        $encryptedParts = explode('|', $encryptedData);
        
        // Extract encrypted key, data, and hash
        $encryptedKey = base64_decode($encryptedParts[0]);
        $encryptedData = base64_decode($encryptedParts[1]);
        $encryptedHash = base64_decode($encryptedParts[2]);



        //echo  $encryptedData;



        // Decrypt AES key and IV using private key
        $privateKey = file_get_contents($this->privateKeyPath);
        openssl_private_decrypt($encryptedKey, $keyData, $privateKey);
        list($aesIV, $aesKey) = explode('|', $keyData);

        // Decrypt data using AES
        $decryptedData = openssl_decrypt($encryptedData, 'aes-256-cbc', base64_decode($aesKey), OPENSSL_RAW_DATA, base64_decode($aesIV));

        // Compute hash of decrypted data
        $decryptedHash = hash('sha256', $decryptedData, true);

        // Compare hashes to verify integrity
        if (hash_equals($encryptedHash, $decryptedHash)) {
            return $decryptedData;
        } 
        
        // else {
        //     throw new Exception('Hash mismatch. Data may have been tampered with.');
        // }
        
        //   echo "Encrypted Key: " . bin2hex($encryptedKey) . "\n";
        // echo "Decrypted Key Data: " . $keyData . "\n";
        // echo "AES IV: " . $aesIV . "\n";
        // echo "AES Key: " . $aesKey . "\n";
        // echo "Encrypted Data: " . bin2hex($encryptedData) . "\n";
        //echo "Decrypted Data: " . $decryptedData . "\n";
        // echo "Encrypted Hash: " . bin2hex($encryptedHash) . "\n";
        // echo "Decrypted Hash: " . bin2hex($decryptedHash) . "\n";
        
        return $decryptedData;
      
    }
}

$domainName = $_SERVER['HTTP_HOST'];
if($domainName  === 'postlogin.stgserver.co.in'){
    $privateKeyPath = "./Privatekey.pem"; //staging
}else{
    $privateKeyPath = "./BBNP-private.pem";;//production
}

 $encryptedData =$_POST['result']; //Y|ABCPD1234E||KYC under Process
 $mfkyc=$_POST['MFKYC'];



try {

        $decryptor = new DataDecryptor($privateKeyPath);
        $decryptedData = $decryptor->decrypt($encryptedData);
        
        // Split the string using '|'
        $parts = explode('|', $decryptedData);
        
      $queryParams = [
            'param1' => $parts[0],
            'param2' => $parts[1],
            'param3' => $parts[2],
            'param4' => $parts[3]
        ]; 
       
        
        // Check the condition and set the POST data if necessary
        $postData = [];
        if ($parts[0] == 'Y') {
            if($mfkyc){
                $decryptedKYCData = $decryptor->decrypt($mfkyc);
                $queryParams['mfkyc'] = $decryptedKYCData;
            }else{
              $mfkyc='NA';  
            }
        }
        
        // Build the query string
        $queryString = http_build_query($queryParams);
        
        
       
            $domainName = $_SERVER['HTTP_HOST'];
            $baseUrl = 'https://' . $domainName . '/my-account';

          

        // Base URL (replace with your actual URL)
       // $baseUrl = 'https://postlogin.stgserver.co.in/my-account';
        // Complete URL with query string
        $url = $baseUrl . '?' . $queryString;
        
        header("Location: $url");
        exit();
        
       
}catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}

?>
