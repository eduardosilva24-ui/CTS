@echo off
REM Iniciador rápido do projeto CTS - Manipulação Psicológica em Apostas Online

echo ============================================
echo  CTS - Simulador de Manipulacao Psicologica
echo ============================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Python nao esta instalado!
    echo Baixe em: https://www.python.org
    pause
    exit /b 1
)

echo [OK] Python encontrado
echo.

REM Instalar dependências se necessário
echo [1] Instalando dependências Python...
cd backend
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependências
    pause
    exit /b 1
)
echo [OK] Dependências instaladas
cd ..
echo.

REM Iniciar servidor backend
echo [2] Iniciando servidor Backend (Flask)...
echo Servidor estará disponível em: http://localhost:5000
echo.

start cmd /k "cd backend && python app.py"

REM Dar tempo para servidor iniciar
timeout /t 3 >nul

REM Abrir frontend
echo [3] Abrindo frontend...
start http://localhost:5000/../frontend/index.html
REM Alternativa se a anterior não funcionar - abrir arquivo local
if not exist "frontend\index.html" (
    echo [ERRO] Arquivo frontend/index.html nao encontrado!
) else (
    start "" "frontend\index.html"
)

echo.
echo ============================================
echo [OK] Projeto iniciado!
echo.
echo Frontend: frontend/index.html
echo Backend:  http://localhost:5000
echo.
echo Pressione CTRL+C no terminal do Backend para parar
echo ============================================
echo.

pause
