<?php
// Enable CORS for this script
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Accept');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Configuration
$apiKey = '8406|OC8orSbCvsMy6H4R8gFCfSKgkv7f2RiKeYUHSlmv';
$campaignId = '516562';

// Get the endpoint from query string (optional, default to teams)
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : 'teams';

// Build the full API URL - use the correct format
$apiUrl = "https://api.givebutter.com/v1/campaigns/{$campaignId}/{$endpoint}";

// Log debug info
error_log("API Proxy Request: " . $apiUrl);
error_log("API Key: " . substr($apiKey, 0, 10) . "...");

// Initialize cURL
$curl = curl_init();
curl_setopt_array($curl, [
    CURLOPT_URL => $apiUrl,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 10,
    CURLOPT_SSL_VERIFYPEER => false,
    CURLOPT_HTTPHEADER => [
        'Authorization: Bearer ' . $apiKey,
        'Accept: application/json',
        'Content-Type: application/json'
    ]
]);

// Execute the request
$response = curl_exec($curl);
$httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);
$curlError = curl_error($curl);
$curlInfo = curl_getinfo($curl);
curl_close($curl);

// Log response info
error_log("API Response Code: " . $httpCode);
error_log("API Response Length: " . strlen($response));
error_log("API Response: " . substr($response, 0, 500));

// Handle cURL errors
if ($curlError) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Curl error',
        'message' => $curlError,
        'apiUrl' => $apiUrl
    ]);
    exit;
}

// Handle empty response
if (empty($response)) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Empty response from API',
        'httpCode' => $httpCode,
        'apiUrl' => $apiUrl
    ]);
    exit;
}

// Forward the HTTP status code and response
http_response_code($httpCode);
echo $response;
?>
