#!/bin/bash

# Variables
REMOTE_USER="root"       # SSH username for the remote server
REMOTE_HOST="45.93.139.144" # Remote server IP or hostname
REMOTE_DB_URI="mongodb://shadeful:shadeful321123sc0rp10n@localhost:27017/eko-maistas?authSource=admin"
BACKUP_DIR="/tmp/mongo_backups"       # Temporary backup directory on the remote server
LOCAL_BACKUP_DIR="/Users/sc0rp10n/MyStuff/freelancing/eko-maistas" # Local directory to save the backup
DATE=$(date +"%Y%m%d_%H%M%S")        # Timestamp for backup naming

# Create backup on the remote server
echo "Starting backup on remote server..."
ssh -T ${REMOTE_USER}@${REMOTE_HOST} <<EOF
    mkdir -p ${BACKUP_DIR}/${DATE}
    mongodump --uri="${REMOTE_DB_URI}" --out=${BACKUP_DIR}/${DATE}
EOF

# Check if the backup folder was created
if ssh -T ${REMOTE_USER}@${REMOTE_HOST} "[ -d ${BACKUP_DIR}/${DATE} ]"; then
    echo "Backup created successfully on the remote server."
else
    echo "Backup creation failed."
    exit 1
fi

# Transfer the backup to the local system
echo "Transferring backup to local system..."
scp -v -r ${REMOTE_USER}@${REMOTE_HOST}:${BACKUP_DIR}/${DATE} ${LOCAL_BACKUP_DIR}

# Clean up remote server backup
# echo "Cleaning up remote backup files..."
# ssh -T ${REMOTE_USER}@${REMOTE_HOST} <<EOF
#     rm -rf ${BACKUP_DIR}/${DATE}
# EOF

echo "Backup and transfer completed successfully!"
