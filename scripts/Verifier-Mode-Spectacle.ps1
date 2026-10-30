Write-Host ""
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "      GB LIVE - MODE SPECTACLE" -ForegroundColor Cyan
Write-Host "====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Profil d'alimentation :" -ForegroundColor Yellow
powercfg /getactivescheme

Write-Host ""
Write-Host "Connexion reseau :" -ForegroundColor Yellow
Get-NetConnectionProfile |
    ForEach-Object {
        Write-Host ("  {0} : {1}" -f $_.InterfaceAlias, $_.Name)
    }

Write-Host ""
Write-Host "Processus audio et spectacle :" -ForegroundColor Yellow
Get-Process |
    Where-Object {
        $_.ProcessName -match "serato|studio|universal|node"
    } |
    ForEach-Object {
        Write-Host ("  {0} (PID {1})" -f $_.ProcessName, $_.Id)
    }

Write-Host ""

Write-Host ""
Write-Host "Redemarrage Windows :" -ForegroundColor Yellow

$rebootKeys = @(
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending",
    "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired"
)

$rebootPending = $false

foreach ($key in $rebootKeys) {
    if (Test-Path $key) {
        $rebootPending = $true
    }
}

if ($rebootPending) {
    Write-Host "ATTENTION : un redemarrage peut etre necessaire !" -ForegroundColor Red
} else {
    Write-Host "Aucun redemarrage detecte par ces controles." -ForegroundColor Green
}

Write-Host ""
Write-Host "Alimentation du PC :" -ForegroundColor Yellow

$batterie = Get-CimInstance Win32_Battery

if ($null -eq $batterie) {
    Write-Host "Batterie non detectee : verification manuelle necessaire." -ForegroundColor Yellow
} else {
    Write-Host "Charge batterie : $($batterie.EstimatedChargeRemaining)%"

    switch ($batterie.BatteryStatus) {
        { $_ -in 2,6,7,8,9 } {
            Write-Host "Alimentation secteur detectee." -ForegroundColor Green
            break
        }
        1 {
            Write-Host "ATTENTION : branche le chargeur avant le spectacle !" -ForegroundColor Red
        }
        default {
            Write-Host "Etat alimentation a confirmer." -ForegroundColor Yellow
        }
    }
}



Write-Host ""
Write-Host "Serveur GB Live :" -ForegroundColor Yellow

$serveurTrouve = $false

foreach ($port in @(3000, 3001)) {
    try {
        $reponse = Invoke-WebRequest `
            -Uri "http://localhost:$port" `
            -UseBasicParsing `
            -TimeoutSec 3 `
            -ErrorAction Stop

        if ($reponse.StatusCode -eq 200) {
            Write-Host "Serveur HTTP actif sur le port $port." -ForegroundColor Green
            $serveurTrouve = $true
            break
        }
    }
    catch {
        # Port indisponible : essayer le suivant.
    }
}

if (-not $serveurTrouve) {
    Write-Host "ATTENTION : aucun serveur HTTP detecte sur 3000 ou 3001 !" -ForegroundColor Red
}

Write-Host ""
Write-Host "Ecran public GB Live :" -ForegroundColor Yellow

$ecranOK = $false

foreach ($port in @(3000, 3001)) {
    try {
        $reponse = Invoke-WebRequest `
            -Uri "http://localhost:$port/screen" `
            -UseBasicParsing `
            -TimeoutSec 5 `
            -ErrorAction Stop

        if ($reponse.StatusCode -eq 200) {
            Write-Host "Page /screen accessible sur le port $port." -ForegroundColor Green
            $ecranOK = $true
            break
        }
    }
    catch {
        # Essayer le port suivant.
    }
}

if (-not $ecranOK) {
    Write-Host "ATTENTION : page publique inaccessible !" -ForegroundColor Red
}

Write-Host ""

Write-Host ""
Write-Host "Serato DJ :" -ForegroundColor Yellow

$serato = Get-Process -ErrorAction SilentlyContinue |
    Where-Object {
        $_.ProcessName -match '^Serato DJ (Lite|Pro)$'
    }

if ($serato) {
    $serato | ForEach-Object {
        Write-Host "  $($_.ProcessName) : lance." -ForegroundColor Green
    }
} else {
    Write-Host "  ATTENTION : Serato DJ non lance." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Affichage du spectacle :" -ForegroundColor Yellow

try {
    Add-Type -AssemblyName System.Windows.Forms

    $ecrans = [System.Windows.Forms.Screen]::AllScreens
    $nombre = $ecrans.Count

    Write-Host "  Zones d'affichage : $nombre"

    if ($nombre -ge 4) {
        Write-Host "  Configuration multi-ecrans detectee." -ForegroundColor Green
    } else {
        Write-Host "  ATTENTION : moins de 4 zones d'affichage !" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "  Impossible de verifier les ecrans." -ForegroundColor Red
}

Write-Host ""
Write-Host "Television Samsung :" -ForegroundColor Yellow

$moniteurs = @(Get-CimInstance -Namespace root\wmi `
    -ClassName WmiMonitorID `
    -ErrorAction SilentlyContinue |
    Where-Object { $_.Active -eq $true })

$samsungDetectee = $false

foreach ($moniteur in $moniteurs) {
    $nom = -join ($moniteur.UserFriendlyName |
        Where-Object { $_ -ne 0 } |
        ForEach-Object { [char]$_ })

    if ($nom -match 'SAMSUNG') {
        $samsungDetectee = $true
        break
    }
}

if ($samsungDetectee) {
    Write-Host "  Television Samsung detectee : OK." -ForegroundColor Green
} else {
    Write-Host "  ATTENTION : television Samsung non detectee !" -ForegroundColor Red
}
Write-Host "====================================" -ForegroundColor Cyan
Write-Host "   DIAGNOSTIC GB LIVE TERMINE" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Cyan




