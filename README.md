# InfyDU Guesstimate

Spring Boot 3 + Java 17 + MySQL REST backend.

## 1. Requirements

- Java 21.0.11+
- Maven 3.8+
- MySQL 8+
- IDE such as IntelliJ IDEA / Eclipse / STS

## 2. Database

Create the database:

```sql
CREATE DATABASE business_estimate;
```

Update `src/main/resources/application.properties`:

```properties
spring.datasource.username=root
spring.datasource.password=root
```

Hibernate will create/update the tables automatically.

## 3. Run

```bash
mvn clean install
mvn spring-boot:run
```

Application:

http://localhost:8080

## 4. Main APIs

### LOB

POST `/api/lobs`

```json
{
  "lobName": "FS",
  "duAnchor": "John"
}
```

GET `/api/lobs`

GET `/api/lobs/FS`

PUT `/api/lobs/FS`

```json
{
  "lobName": "FS",
  "duAnchor": "David"
}
```

DELETE `/api/lobs/FS`

### Add Volume + Revenue

POST `/api/forms`

```json
{
  "lob": "FS",
  "quarter": "Q1",
  "year": 2026,
  "quarterVolume": [
    {
      "month": "Apr",
      "confident": 10,
      "opportunities": 5,
      "supplySupportNeed": 8
    },
    {
      "month": "May",
      "confident": 12,
      "opportunities": 4,
      "supplySupportNeed": 9
    },
    {
      "month": "Jun",
      "confident": 15,
      "opportunities": 6,
      "supplySupportNeed": 10
    }
  ],
  "quarterRevenue": [
    {
      "month": "Apr",
      "forecastedRevenue": 100,
      "actualRevenue": 90
    },
    {
      "month": "May",
      "forecastedRevenue": 120,
      "actualRevenue": 110
    },
    {
      "month": "Jun",
      "forecastedRevenue": 150,
      "actualRevenue": 140
    }
  ]
}
```

Change `2026` to the current year when running the application in another year.

### Update Volume + Revenue

PUT `/api/forms/FS/Q1`

```json
{
  "quarterVolume": [
    {
      "month": "Apr",
      "confident": 20,
      "opportunities": 8,
      "supplySupportNeed": 15
    }
  ],
  "quarterRevenue": [
    {
      "month": "Apr",
      "forecastedRevenue": 200,
      "actualRevenue": 180
    }
  ]
}
```

### Volume

GET `/api/volume/FS/2026`

GET `/api/volume/FS/2026/Q1`

GET `/api/volume/year`

### Revenue

GET `/api/revenue/FS/2026`

GET `/api/revenue/FS/2026/Q1`

GET `/api/revenue/year`

### Graph

GET `/api/graph/year-volume`

GET `/api/graph/year-revenue`

## 5. Quarter mapping

Q1 = Apr, May, Jun

Q2 = Jul, Aug, Sep

Q3 = Oct, Nov, Dec

Q4 = Jan, Feb, Mar

## Notes

The problem statement says the year cannot be greater than the current year and less than the current year. This implementation interprets that requirement as: the year must equal the current calendar year.

The project uses Spring Boot 3 / Jakarta Persistence, so imports use `jakarta.persistence.*` and `jakarta.validation.*`.


## JDK / IntelliJ IDEA configuration

This project is configured specifically for **JDK 21**.

Recommended:
- JDK: Oracle OpenJDK 21.0.11
- Project SDK: 21
- Language level: 21
- Maven runner JRE: 21
- Maven importer JDK: 21

If IntelliJ still reports `JVM target 5`, open:

`File -> Project Structure -> Project`

Set:
- SDK = JDK 21
- Language level = 21

Then:

`Settings -> Build, Execution, Deployment -> Build Tools -> Maven -> Runner`

Set JRE = JDK 21.

Also check:

`Settings -> Build, Execution, Deployment -> Build Tools -> Maven -> Importing`

Set JDK for importer = JDK 21.

Finally reload Maven and run:

```bash
mvn clean
mvn package
mvn spring-boot:run
```

The Maven compiler plugin explicitly uses `release=21`, `source=21`, and `target=21`, so Maven will not compile this project for JVM target 5.


## Frontend

A React + Vite frontend lives in `frontend/`. Run the backend, then:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. See `frontend/README.md` for details.
