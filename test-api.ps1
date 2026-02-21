$body = ConvertTo-Json @{ input = "I keep thinking about a presentation." }
Write-Host "Sending request..."
Write-Host "Body: $body"

try {
    $response = Invoke-WebRequest -Uri http://localhost:3001/api/clarity `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -TimeoutSec 15
    
    Write-Host "Success! Status Code: $($response.StatusCode)"
    Write-Host "Response: $($response.Content)"
} catch {
    Write-Host "Error: $($_.Exception.Message)"
    Write-Host "Status: $($_.Exception.Response.StatusCode)"
    if ($_.ErrorDetails) {
        Write-Host "Details: $($_.ErrorDetails.Message)"
    }
}
