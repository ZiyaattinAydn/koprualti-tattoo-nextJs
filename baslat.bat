@echo off
setlocal
cd /d "%~dp0"
if errorlevel 1 (
  echo Proje klasorune gecilemedi.
  pause
  exit /b 1
)

if not exist "package.json" (
  echo package.json bulunamadi. ZIP dosyasini tamamen ayiklayip baslat.bat dosyasini proje klasorunden calistirin.
  pause
  exit /b 1
)
if not exist "scripts\local-launch.cjs" (
  echo Baslatma dosyalari eksik. ZIP dosyasini tamamen ayiklayin.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js bulunamadi. Node.js 20.9 veya daha yeni surumunu kurup yeniden deneyin.
  pause
  exit /b 1
)
node -e "const [major,minor]=process.versions.node.split('.').map(Number);process.exit(major>20||(major===20&&minor>=9)?0:1)"
if errorlevel 1 (
  echo Bu proje Node.js 20.9 veya daha yeni surum gerektirir.
  pause
  exit /b 1
)
where npm >nul 2>&1
if errorlevel 1 (
  echo npm bulunamadi. Node.js kurulumunu kontrol edin.
  pause
  exit /b 1
)

if not exist "node_modules\next\package.json" (
  echo Ilk calistirma: paketler kuruluyor. Bu islem birkac dakika surebilir.
  call npm ci --no-audit --no-fund
  if errorlevel 1 (
    echo Paket kurulumu tamamlanamadi. Yukaridaki hata mesajini kontrol edin.
    pause
    exit /b 1
  )
)

node "scripts\local-launch.cjs" --check-port
if errorlevel 1 (
  echo 3000 numarali port kullanimda. O programi kapatip yeniden deneyin.
  pause
  exit /b 1
)

echo Site baslatiliyor: http://127.0.0.1:3000/
echo Sunucu hazir olunca tarayici acilacak. Kapatmak icin Ctrl+C.
start "" /b node "scripts\local-launch.cjs" --open-when-ready
call npm run dev -- --hostname 127.0.0.1 --port 3000
if errorlevel 1 (
  echo Sunucu baslatilamadi. Yukaridaki hata mesajini kontrol edin.
  pause
  exit /b 1
)
endlocal
