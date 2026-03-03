# Blueberry HMS (Hotel Management Suite)

**Version:** 1.0.0 - Foundation Phase  
**Property:** Blueberry Hills Resort, Munnar (Mattel Group)  
**Domain:** blueberryhillsmunnar.in

## 🏨 Project Overview

Blueberry HMS is a production-grade, self-hosted Hotel Management Operating System built with a modular architecture.

## 🏗 Architecture

- **Modular Monolith** with feature flag system
- **Strict MVC** patterns for security
- **Docker-based** deployment
- **FQDN routing** for all services

## 📦 Technology Stack

- **Backend:** NestJS (TypeScript)
- **Database:** PostgreSQL
- **Auth:** Keycloak
- **CMS:** Strapi
- **Guest Web:** Next.js
- **Admin Panel:** React + Vite
- **Proxy:** Caddy

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Start development environment
docker-compose up -d

# Start all apps
pnpm dev
