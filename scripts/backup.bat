@echo off
setlocal enabledelayedexpansion

REM Variables
set REMOTE_USER=root
set REMOTE_HOST=45.93.139.144
set REMOTE_DB_URI="mongodb://shadeful:shadeful321123sc0rp10n@localhost:27017/eko-maistas?authSource=admin"
set BACKUP_DIR=/tmp/mongo_backups
set LOCAL_BACKUP_DIR="C:\Users\oskar\Desktop\EkoFood\Website Backup"
for /f "tokens=2 delims==" %%I in ('powershell -NoProfile -Command "[datetime]::Now.ToString('yyyyMMdd_HHmmss')"') do set DATE=%%I

REM Create backup on the remote server
echo Starting backup on remote server...
ssh -T %REMOTE_USER%@%REMOTE_HOST% ^
"mkdir -p %BACKUP_DIR%/%DATE% && mongodump --uri=%REMOTE_DB_URI% --out=%BACKUP_DIR%/%DATE%"

REM Check if the backup folder was created
ssh -T %REMOTE_USER%@%REMOTE_HOST% ^
"[ -d %BACKUP_DIR%/%DATE% ]"
if errorlevel 1 (
    echo Backup creation failed.
    exit /b 1
) else (
    echo Backup created successfully on the remote server.
)

REM Transfer the backup to the local system
echo Transferring backup to local system...
scp -v -r %REMOTE_USER%@%REMOTE_HOST%:%BACKUP_DIR%/%DATE% %LOCAL_BACKUP_DIR%

REM Clean up remote server backup (optional)
REM echo Cleaning up remote backup files...
REM ssh -T %REMOTE_USER%@%REMOTE_HOST% "rm -rf %BACKUP_DIR%/%DATE%"

echo Backup and transfer completed successfully!
