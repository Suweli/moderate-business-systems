param(
  [Parameter(Mandatory = $true)]
  [string]$BaseUrl,
  [string]$AdminUsername,
  [string]$AdminPassword,
  [switch]$NoMutation,
  [switch]$Cleanup
)

$ErrorActionPreference = 'Stop'

$base = $BaseUrl.Trim().TrimEnd('/')
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$checks = New-Object System.Collections.Generic.List[object]
$createdId = $null
$createdEmail = $null

function Add-Check {
  param(
    [string]$Name,
    [bool]$Passed,
    [string]$Detail
  )

  $checks.Add([pscustomobject]@{
    check = $Name
    passed = $Passed
    detail = $Detail
  }) | Out-Null
}

function Invoke-Api {
  param(
    [string]$Method,
    [string]$Path,
    $Body = $null
  )

  $uri = "$base$Path"
  $args = @{
    Uri = $uri
    Method = $Method
    WebSession = $session
    Headers = @{ Accept = 'application/json' }
  }

  if ($null -ne $Body) {
    $args.ContentType = 'application/json'
    $args.Body = ($Body | ConvertTo-Json -Depth 8)
  }

  try {
    return Invoke-RestMethod @args
  } catch {
    $statusCode = $null
    $statusText = ''
    $rawBody = ''

    if ($_.Exception.Response) {
      $statusCode = [int]$_.Exception.Response.StatusCode
      $statusText = [string]$_.Exception.Response.StatusDescription
      try {
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
          $reader = New-Object System.IO.StreamReader($stream)
          $rawBody = $reader.ReadToEnd()
          $reader.Dispose()
        }
      } catch {
        $rawBody = ''
      }
    }

    $message = "HTTP request failed: $Method $uri"
    if ($statusCode) {
      $message += " -> $statusCode $statusText"
    }
    if ($rawBody) {
      $message += " | body: $rawBody"
    }

    throw $message
  }
}

try {
  $public = Invoke-Api -Method 'GET' -Path '/api/testimonials?page=1&limit=6'
  $hasPublicShape = (
    ($public.PSObject.Properties.Name -contains 'items') -and
    ($public.PSObject.Properties.Name -contains 'stats')
  )
  Add-Check -Name 'Public testimonials API responds with expected shape' -Passed $hasPublicShape -Detail 'GET /api/testimonials?page=1&limit=6'

  $hasStatsShape = (
    ($public.stats.PSObject.Properties.Name -contains 'averageRating') -and
    ($public.stats.PSObject.Properties.Name -contains 'totalReviews') -and
    ($public.stats.PSObject.Properties.Name -contains 'recommendationRate') -and
    ($public.stats.PSObject.Properties.Name -contains 'ratingDistribution')
  )
  Add-Check -Name 'Public stats object present' -Passed $hasStatsShape -Detail "totalReviews=$($public.stats.totalReviews)"

  if (-not $AdminUsername -or -not $AdminPassword) {
    Add-Check -Name 'Admin flow skipped' -Passed $true -Detail 'Provide -AdminUsername and -AdminPassword for full moderation verification.'
  } else {
    $loginBody = @{ username = $AdminUsername; password = $AdminPassword }
    $login = Invoke-Api -Method 'POST' -Path '/api/admin/auth/login' -Body $loginBody
    $loginOk = ($login.message -eq 'Authenticated.')
    Add-Check -Name 'Admin login works' -Passed $loginOk -Detail 'POST /api/admin/auth/login'

    $adminBefore = Invoke-Api -Method 'GET' -Path '/api/admin/dashboard-stats'
    $beforeTotal = [int]($adminBefore.stats.totalReviews)
    Add-Check -Name 'Admin stats endpoint works' -Passed ($null -ne $adminBefore.stats) -Detail "totalReviews(before)=$beforeTotal"

    if (-not $NoMutation) {
      $stamp = Get-Date -Format 'yyyyMMddHHmmss'
      $nonce = ([guid]::NewGuid().ToString('N')).Substring(0, 8)
      $createdEmail = "prod.verify.$stamp.$nonce@example.com"
      $message = "Production verification testimonial $stamp $nonce. This message is intentionally longer than twenty characters."

      $submission = @{
        name = 'Prod Verify Bot'
        company = 'Moderate Business Systems Ltd'
        position = 'QA Automation'
        industry = 'Software'
        email = $createdEmail
        message = $message
        rating = 5
        honey = ''
        startedAt = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds() - 5000
      }

      $submit = Invoke-Api -Method 'POST' -Path '/api/testimonials' -Body $submission
      $submitOk = ($submit.message -like 'Thank you!*')
      Add-Check -Name 'Public submit creates pending review' -Passed $submitOk -Detail "POST /api/testimonials email=$createdEmail"

      $pending = Invoke-Api -Method 'GET' -Path '/api/admin/testimonials?status=pending'
      $created = $pending.items | Where-Object { $_.email -eq $createdEmail } | Select-Object -First 1
      $foundPending = $null -ne $created
      if ($foundPending) {
        $createdId = [int]$created.id
      }
      Add-Check -Name 'New submission appears in admin pending list' -Passed $foundPending -Detail "pending id=$createdId"

      if ($foundPending) {
        $approveBody = @{ id = $createdId; status = 'approved' }
        $approve = Invoke-Api -Method 'PATCH' -Path '/api/admin/testimonials' -Body $approveBody
        $approvedOk = ($approve.message -eq 'Testimonial updated.')
        Add-Check -Name 'Admin approve action succeeds' -Passed $approvedOk -Detail "PATCH /api/admin/testimonials id=$createdId"

        $publicAfter = Invoke-Api -Method 'GET' -Path '/api/testimonials?page=1&limit=24'
        $visible = ($publicAfter.items | Where-Object { $_.email -eq $createdEmail } | Select-Object -First 1)
        Add-Check -Name 'Approved testimonial appears publicly' -Passed ($null -ne $visible) -Detail "public lookup email=$createdEmail"

        $adminAfter = Invoke-Api -Method 'GET' -Path '/api/admin/dashboard-stats'
        $afterTotal = [int]($adminAfter.stats.totalReviews)
        Add-Check -Name 'Approved review updates stats in real time' -Passed ($afterTotal -ge ($beforeTotal + 1)) -Detail "before=$beforeTotal after=$afterTotal"

        if ($Cleanup) {
          $deleteBody = @{ id = $createdId }
          $delete = Invoke-Api -Method 'DELETE' -Path '/api/admin/testimonials' -Body $deleteBody
          $deletedOk = ($delete.message -eq 'Testimonial deleted.')
          Add-Check -Name 'Cleanup delete succeeds' -Passed $deletedOk -Detail "DELETE /api/admin/testimonials id=$createdId"
        }
      }
    } else {
      Add-Check -Name 'Mutation flow skipped' -Passed $true -Detail 'No submission/approval/delete executed because -NoMutation was provided.'
    }
  }
} catch {
  Add-Check -Name 'Verification run' -Passed $false -Detail $_.Exception.Message
}

$failed = $checks | Where-Object { -not $_.passed }
$result = [pscustomobject]@{
  baseUrl = $base
  timestamp = (Get-Date).ToString('o')
  createdTestimonialId = $createdId
  createdTestimonialEmail = $createdEmail
  checks = $checks
  pass = ($failed.Count -eq 0)
}

$result | ConvertTo-Json -Depth 8

if ($failed.Count -gt 0) {
  exit 1
}

exit 0
