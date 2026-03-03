# Edit the .env file
cd /mnt/c/Users/Arun\ Joseph/Documents/blueberryhills/blueberry-hms

# Update DB_HOST from "postgres" to "localhost"
cat > .env << 'EOF'
# === BLUEBERRY HMS CONFIGURATION ===

# === PROJECT DETAILS ===
PROJECT_NAME="Blueberry HMS"
PROPERTY_NAME="Blueberry Hills Resort"
PROPERTY_DOMAIN="blueberryhillsmunnar.in"
NODE_ENV=development

# === DATABASE (PostgreSQL) ===
# IMPORTANT: Use "localhost" when running API outside Docker
# Use "postgres" only when API runs inside Docker
DB_HOST=localhost
DB_PORT=5432
DB_USER=blueberry_admin
DB_PASSWORD=change_this_password_in_production
DB_NAME=blueberry_hms

# === API CONFIGURATION ===
API_PORT=4000
API_URL=http://localhost:4000

# === AUTHENTICATION (Keycloak) ===
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=blueberry
KEYCLOAK_CLIENT_ID=hms-backend
KEYCLOAK_CLIENT_SECRET=your-secret-here

# === CMS (Strapi) ===
STRAPI_PORT=1337
STRAPI_URL=http://localhost:1337
STRAPI_ADMIN_EMAIL=admin@blueberryhillsmunnar.in
STRAPI_ADMIN_PASSWORD=change_this_in_production

# === FRONTEND PORTS ===
GUEST_WEB_PORT=3000
ADMIN_PANEL_PORT=5173
POS_PORT=5174

# === SECURITY ===
JWT_SECRET=super_long_random_string_change_in_production_min_32_chars
JWT_EXPIRATION=7d

# === REDIS (Cache & Queues) ===
REDIS_HOST=localhost
REDIS_PORT=6379

# === FILE UPLOADS ===
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
EOF