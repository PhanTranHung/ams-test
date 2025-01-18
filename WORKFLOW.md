# Asset Management System - Implementation Workflow

## Project Overview

This project implements an asset management system using NestJS and TypeORM with the following key features:
- Organization and location management
- Asset synchronization from BR company API
- Database migrations and seeding
- Automated cronjob for asset synchronization
- RESTful APIs for asset querying

## Database Design

### Tables Structure

1. **organizations**
   - id (PK)
   - name
   - created_at
   - updated_at

2. **locations**
   - id (PK)
   - name
   - organization_id (FK)
   - status (enum: 'actived', 'unactive')
   - created_at
   - updated_at

3. **assets**
   - id (PK)
   - external_id (from BR API)
   - type
   - serial
   - status
   - description
   - location_id (FK)
   - created_at
   - updated_at

### Relationships
- Organization (1) -> (*) Locations
- Location (1) -> (*) Assets

## Implementation Steps

1. **Database Setup**
   - Configure TypeORM connection
   - Create entity classes
   - Set up migrations
   - Create seeder for initial location data

2. **Asset Synchronization Service**
   - Implement BR API client
   - Create asset sync service
   - Implement sync logic with validation:
     - Check location existence and active status
     - Validate timestamp for past-only sync
     - Handle API errors and retries

3. **Cronjob Implementation**
   - Configure NestJS scheduler
   - Set up minute-interval sync job
   - Implement transaction handling and rollback

4. **API Endpoints**
   - GET /assets?locationId=X
   - GET /assets?organizationId=X
   - Include proper error handling and response formats

## Code Structure

```
src/
├── config/
│   └── database.config.ts
├── entities/
│   ├── organization.entity.ts
│   ├── location.entity.ts
│   └── asset.entity.ts
├── migrations/
│   └── ...
├── modules/
│   ├── assets/
│   │   ├── assets.controller.ts
│   │   ├── assets.service.ts
│   │   └── assets.module.ts
│   ├── locations/
│   │   └── ...
│   └── organizations/
│       └── ...
├── services/
│   ├── br-api.service.ts
│   └── asset-sync.service.ts
└── app.module.ts
```

## Technical Considerations

1. **Error Handling**
   - API failure recovery
   - Transaction rollback on sync failures
   - Proper error logging

2. **Performance**
   - Batch processing for asset sync
   - Efficient database queries
   - Index optimization

3. **Data Validation**
   - Input validation for APIs
   - Data integrity checks
   - Status validation for locations

4. **Monitoring**
   - Sync job status logging
   - Error tracking
   - Performance metrics

## Testing Strategy

1. **Unit Tests**
   - Service methods
   - Data validation
   - Business logic

2. **Integration Tests**
   - API endpoints
   - Database operations
   - BR API integration

3. **E2E Tests**
   - Complete sync workflow
   - API response validation

## Deployment Considerations

1. **Environment Variables**
   - Database credentials
   - BR API endpoints
   - API keys

2. **Docker Setup**
   - Database container
   - Application container
   - Network configuration

3. **Monitoring**
   - Health checks
   - Logging setup
   - Error tracking
