<?php
// Check if endpoint is provided in $_GET
if (!isset($_GET['endpoint'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['error' => 'Endpoint not specified']);
    exit;
}



$allowed_origins = ['https://invest.barodabnpparibasmf.in'];
if($_SERVER['REQUEST_METHOD'] == 'POST'){
    if (isset($_SERVER['HTTP_ORIGIN']) && in_array($_SERVER['HTTP_ORIGIN'], $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
    } else {
        header('HTTP/1.1 403 Forbidden');
         exit('Access denied: Unauthorized origin');
    }
}


// Retrieve endpoint from $_GET
$endpoint = $_GET['endpoint'];

// Define the base URL of the API
$apiBaseUrl = 'https://mfs.kfintech.com/bbnp/api/v1/';

// Construct the full API URL
$apiUrl = $apiBaseUrl . ltrim($endpoint, '/');

// Initialize cURL session
$ch = curl_init();

// Set the URL for the cURL request
curl_setopt($ch, CURLOPT_URL, $apiUrl);

// Set the return transfer option to true
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Set the request method
$method = isset($_SERVER['REQUEST_METHOD']) ? $_SERVER['REQUEST_METHOD'] : 'GET';
switch (strtoupper($method)) {
    case 'POST':
          curl_setopt($ch, CURLOPT_CUSTOMREQUEST, strtoupper($method));
        // Retrieve raw POST data from php://input
        $inputData = file_get_contents('php://input');
        
        // Set the POST data to CURLOPT_POSTFIELDS
        curl_setopt($ch, CURLOPT_POSTFIELDS, $inputData);
        
        $bearerToken='';
        foreach (getallheaders() as $name => $value) {
            if (strtolower($name) === 'authorization' && stripos($value, 'bearer ') === 0) {
                $bearerToken = $value; // This already includes 'Bearer '
            } 
        }
        
        
        // Set Content-Type header based on the data format
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json', // Adjust content type as needed
            'Content-Length: ' . strlen($inputData),
            // Include other headers as needed
            // Example Authorization header handling
             'Authorization:' . $bearerToken
        ]);
        break;
    // GET method is default
    default:
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        break;
}




// Execute the cURL request and get the response
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo 'Error:' . curl_error($ch);
}

// Decode the JSON response
$result = json_decode($response, true);

// Close the cURL session
curl_close($ch);

// Output the result
echo json_encode($result);
?>
