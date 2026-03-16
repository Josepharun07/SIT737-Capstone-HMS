# Load Testing Quick Start

## Prerequisites

1. Install k6 (see INSTALL.md)
2. Start the API: `pnpm run dev:api`
3. Ensure database is running: `pnpm run docker:up`

## Run Tests

### Basic Load Test:
```bash
k6 run tests/load/api-basic-load.js
```

### Spike Test:
```bash
k6 run tests/load/spike-test.js
```

### Custom Parameters:
```bash
k6 run --vus 50 --duration 2m tests/load/api-basic-load.js
```

## Interpreting Results

### Good Results ✅
```
✓ http_req_duration..............: avg=245ms  p(95)=450ms
✓ http_req_failed................: 0.12%
  http_reqs......................: 1250/s
```

### Bad Results ❌
```
✗ http_req_duration..............: avg=1.2s   p(95)=3.5s
✗ http_req_failed................: 15.2%
  http_reqs......................: 45/s
```

## What Each Test Does

1. **api-basic-load.js**: Normal daily traffic simulation
2. **spike-test.js**: Sudden traffic surge (viral post, promotion)

## Next Steps

After installing k6, test your API:
```bash
# Make sure API is running first
cd apps/api-core && pnpm run dev

# In another terminal, run load test
k6 run tests/load/api-basic-load.js
```
