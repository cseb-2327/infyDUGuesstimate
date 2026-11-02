CREATE DATABASE IF NOT EXISTS business_estimate;
USE business_estimate;

-- Tables are also automatically created by Hibernate.
-- These inserts are optional sample records.

INSERT INTO LobInfo (LOBNAME, DUAnchor)
SELECT 'FS', 'John'
WHERE NOT EXISTS (SELECT 1 FROM LobInfo WHERE LOBNAME = 'FS');

INSERT INTO LobInfo (LOBNAME, DUAnchor)
SELECT 'RETAIL', 'Priya'
WHERE NOT EXISTS (SELECT 1 FROM LobInfo WHERE LOBNAME = 'RETAIL');

INSERT INTO LobInfo (LOBNAME, DUAnchor)
SELECT 'HEALTHCARE', 'Arun'
WHERE NOT EXISTS (SELECT 1 FROM LobInfo WHERE LOBNAME = 'HEALTHCARE');
