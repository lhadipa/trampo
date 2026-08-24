<#
.SYNOPSIS
  Sobe o ambiente completo do Trampo para a apresentacao.

.DESCRIPTION
  Inicia, em ordem, os tres servicos que a demo precisa:
    1. Postgres (container Docker, porta 55433)
    2. API local Express (porta 3001, ouvindo em 0.0.0.0 para o celular alcancar)
    3. Expo em modo LAN (porta 8081) para ler o QR code no Expo Go

  Ao final imprime o IP da maquina, que e' o endereco que o celular usa.

.EXAMPLE
  .\apresentacao.ps1
  .\apresentacao.ps1 -ComWeb     # sobe tambem o app web original na porta 8080
#>

param(
  [switch]$ComWeb
)

$ErrorActionPreference = "Stop"
$raiz = $PSScriptRoot

function Escrever($texto, $cor = "White") { Write-Host $texto -ForegroundColor $cor }

Escrever "`n=== Trampo — ambiente de apresentacao ===`n" "Cyan"

# --- IP da LAN: e' por ele que o celular fala com a API e com o Metro ---
$ip = (Get-NetIPAddress -AddressFamily IPv4 |
  Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' -and $_.InterfaceAlias -notmatch 'vEthernet|WSL|Loopback' } |
  Select-Object -First 1).IPAddress

if (-not $ip) { $ip = "localhost" }
Escrever "IP desta maquina: $ip" "Yellow"

# --- 1. Postgres ---
Escrever "`n[1/3] Subindo Postgres..." "Cyan"
docker info *> $null
if ($LASTEXITCODE -ne 0) {
  Escrever "  Docker nao esta rodando. Abrindo o Docker Desktop..." "Yellow"
  Start-Process "C:\Program Files\Docker\Docker\Docker Desktop.exe"
  Escrever "  Aguardando o daemon subir (pode levar ~1 min)..." "Yellow"
  $tentativas = 0
  do {
    Start-Sleep -Seconds 5
    $tentativas++
    docker info *> $null
  } while ($LASTEXITCODE -ne 0 -and $tentativas -lt 24)

  if ($LASTEXITCODE -ne 0) { throw "Docker nao subiu a tempo. Abra o Docker Desktop e rode de novo." }
}

docker compose -f "$raiz\docker-compose.local.yml" up -d postgres | Out-Null
Escrever "  Postgres ok (localhost:55433)" "Green"

# --- 2. API local ---
Escrever "`n[2/3] Subindo API local..." "Cyan"
$apiViva = $false
try {
  $resposta = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -TimeoutSec 3
  $apiViva = $resposta.ok -eq $true
} catch { $apiViva = $false }

if ($apiViva) {
  Escrever "  API ja estava rodando" "Green"
} else {
  Start-Process -FilePath "node" -ArgumentList "server/index.js" -WorkingDirectory $raiz -WindowStyle Minimized
  Start-Sleep -Seconds 3
  Escrever "  API ok (http://${ip}:3001)" "Green"
}

# --- 3. App web original (opcional) ---
if ($ComWeb) {
  Escrever "`n[extra] Subindo app web..." "Cyan"
  Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -WorkingDirectory $raiz -WindowStyle Minimized
  Escrever "  Web ok (http://localhost:8080)" "Green"
}

# --- 4. Expo ---
Escrever "`n[3/3] Subindo Expo (modo LAN)..." "Cyan"
Escrever "`n  >> Abra o Expo Go no celular e leia o QR code que vai aparecer." "Yellow"
Escrever "  >> Celular e PC precisam estar no MESMO Wi-Fi.`n" "Yellow"

Set-Location "$raiz\mobile"
npx expo start --lan
