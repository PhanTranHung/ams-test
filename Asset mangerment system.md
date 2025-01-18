# Asset mangerment system

## VOCABULARY

Explaination of some terminology in this document
-Organization: Organizations using the service
-Location: Has many locations belonging to the
-Device: Has many devices belonging to the location

Assets are produced from BR company, this company will provide API get assets.

| STT | Location_id | Location_name | Organization | Status   |
| --- | ----------- | ------------- | ------------ | -------- |
| 1   | 1           | Da Nang       | PNS          | actived  |
| 2   | 2           | Ha Noi        | PNS          | unactive |
| 3   | 3           | Ho Chi Minh   | PNS          | actived  |
| 4   | 4           | Nha Trang     | PLJ          | actived  |
| 5   | 5           | Can Tho       | PLJ          | actived  |

## USER REQUIREMENT

Use mysql database:

- Connection.
- Migration of necessary tables and columns including relationships
- Seen data or can insert directly according to the form above.

Create Cronjob:

- Synchronize assets from BR Company to the database above.
- Fetch API: https://669ce22d15704bb0e304842d.mockapi.io/assets to get information, here is a response example

```json
[
  {
    "type": "CIA1-10",
    "serial": "0000001",
    "status": "actived",
    "description": "description 1",
    "created_at": 1721559505,
    "updated_at": 1721559505,
    "location_id": 1,
    "id": "1"
  },
  {
    "type": "CIA1-10",
    "serial": "0000002",
    "status": "actived",
    "description": "description 2",
    "created_at": 1721559445,
    "updated_at": 1721559445,
    "location_id": 1,
    "id": "2"
  }
]
```

Handle logic

- It will sync every minute.
- Synchronize assets when the location already exists in the database and status equal actived.
- Only sync assets created in the past.

## EVALUATION

Evaluation based on opinions:

- Create Cronjob simply.
- Connect database, migration data use typeorm.
- Clean code.
- Handle transaction, rollback.
- Fetch API data.
- Handling API status.
- Handling seen migration data.
- Database is package with docker.
- Provide apis to get assets based on location_id or organization_id.
