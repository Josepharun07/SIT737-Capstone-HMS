# Blueberry HMS - Complete Testing Guide

## Overview

This project uses a comprehensive testing strategy with 3 layers:

1. **Unit Tests** - Test individual functions/components
2. **Integration Tests** - Test API endpoints with database
3. **Load Tests** - Test system performance under stress

---

## Backend Testing (API)

### Technology: Jest + Supertest

### Location: `apps/api-core/src/**/*.spec.ts`

### Run Tests:

```bash
# Navigate to API directory
cd apps/api-core

# Run all tests
pnpm test

# Run in watch mode (auto-rerun on file changes)
pnpm test:watch

# Run with coverage report
pnpm test:cov

# Run specific test file
pnpm test app.service.spec.ts

# Debug tests
pnpm test:debug
```

### Writing Tests:

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { YourService } from './your.service';

describe('YourService', () => {
  let service: YourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YourService],
    }).compile();

    service = module.get<YourService>(YourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should do something', () => {
    const result = service.doSomething();
    expect(result).toBe('expected value');
  });
});
```

---

## Frontend Testing (Admin Panel)

### Technology: Vitest + React Testing Library

### Location: `apps/admin-panel/src/**/*.test.ts(x)`

### Run Tests:

```bash
# Navigate to admin panel
cd apps/admin-panel

# Run all tests
pnpm test

# Run in watch mode
pnpm test:watch

# Open visual test UI
pnpm test:ui

# Run with coverage
pnpm test:coverage
```

### Writing Component Tests:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from './test/utils/test-utils';
import { YourComponent } from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles click events', async () => {
    const { user } = render(<YourComponent />);
    const button = screen.getByRole('button');
    await user.click(button);
    expect(screen.getByText('Clicked!')).toBeInTheDocument();
  });
});
```

---

## Load Testing (k6)

### Technology: k6 (Grafana)

### Location: `tests/load/*.js`

### Prerequisites:

Install k6 first (see `tests/load/INSTALL.md`):

```bash
# Ubuntu/WSL
sudo apt-get update
sudo apt-get install k6

# Verify installation
k6 version
```

### Run Tests:

**Important:** Start the API first!

```bash
# Terminal 1: Start API
cd apps/api-core
pnpm run dev

# Terminal 2: Run load test
k6 run tests/load/api-basic-load.js

# With custom parameters
k6 run --vus 50 --duration 2m tests/load/api-basic-load.js
```

### Available Load Tests:

1. **api-basic-load.js** - Simulates normal daily traffic (10 users, 3 min)
2. **spike-test.js** - Simulates sudden traffic surge (0→100 users)

### Understanding Results:

**Good Performance:**
```
✓ http_req_duration..............: avg=245ms  p(95)=450ms
✓ http_req_failed................: 0.12%
  http_reqs......................: 1250 requests/sec
```

**Poor Performance (needs optimization):**
```
✗ http_req_duration..............: avg=1.2s   p(95)=3.5s
✗ http_req_failed................: 15.2%
  http_reqs......................: 45 requests/sec
```

---

## CI/CD Integration

### GitHub Actions Example:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: cd apps/api-core && pnpm install
      - run: cd apps/api-core && pnpm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: cd apps/admin-panel && pnpm install
      - run: cd apps/admin-panel && pnpm test
```

---

## Quick Reference

### Run All Tests:

```bash
# From root directory

# Backend
cd apps/api-core && pnpm test && cd ../..

# Frontend
cd apps/admin-panel && pnpm test && cd ../..

# Load (requires k6 + running API)
k6 run tests/load/api-basic-load.js
```

### Test Coverage Goals:

- **Backend:** >80% coverage on services and controllers
- **Frontend:** >70% coverage on components and utilities
- **Load:** Response time p(95) < 500ms, Error rate < 1%

---

## Troubleshooting

### Backend Tests Fail:

```bash
# Clear cache
cd apps/api-core
rm -rf node_modules coverage
pnpm install
pnpm test
```

### Frontend Tests Fail:

```bash
# Clear cache
cd apps/admin-panel
rm -rf node_modules coverage
pnpm install
pnpm test
```

### Load Tests Show High Error Rate:

1. Check if API is running: `curl http://localhost:4000/api/v1/health`
2. Check database is running: `docker ps | grep postgres`
3. Reduce concurrent users: `k6 run --vus 5 tests/load/api-basic-load.js`

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [k6 Documentation](https://k6.io/docs/)

---

**Last Updated:** $(date)
**Project:** Blueberry HMS
**Organization:** Mattel Group
