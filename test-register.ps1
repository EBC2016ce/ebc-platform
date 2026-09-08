try {
  $body = @{firstName="Test";lastName="User";email="test@test.com";mobile="0400000000";address="Test St";projectType="New home";consent=$true} | ConvertTo-Json
  $response = Invoke-WebRequest -Uri http://localhost:3000/api/register -Method POST -Body $body -ContentType "application/json"
  Write-Output $response.Content
} catch {
  $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
  Write-Output $reader.ReadToEnd()
}
