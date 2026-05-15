-- SELECT statements:
SELECT district
FROM address;

SELECT *
FROM actor;

SELECT city_id, country_id
FROM city;

SELECT * 
FROM category;

-- ORDER BY & Sorting: 
SELECT district
FROM address
ORDER BY city_id ASC;

SELECT district
FROM address
ORDER BY city_id DESC;

SELECT last_name
FROM actor
ORDER BY last_update ASC, first_name DESC;

-- DISTINCT:
SELECT DISTINCT store_id
FROM customer;

SELECT DISTINCT last_update
FROM country;

SELECT DISTINCT film_id, language_id
FROM film;

-- WHERE & Comparisons
SELECT district
FROM address
WHERE postal_code != 97401;

SELECT last_update
FROM actor
WHERE actor_id > 20;

SELECT category_id
FROM category
WHERE last_update = '2006-02-15 04:46:27';

-- LIKE:
SELECT first_name
FROM actor
WHERE last_name LIKE 'A%';

SELECT last_name
FROM actor
WHERE first_name LIKE '%d';

SELECT last_name
FROM customer
WHERE email LIKE '%@%';

-- LIST with IN
SELECT last_name
FROM actor
WHERE first_name IN ('Annie', 'David', 'Sally');

SELECT customer_id
FROM customer
WHERE address_id IN (1, 2, 10);

-- NULL vs Empty String, IS NULL
SELECT last_name
FROM actor
WHERE last_update IS NULL;

SELECT last_name
FROM actor
WHERE first_name = '';

-- Logical Operators: AND, OR, NOT
SELECT district
FROM address
WHERE city_id AND postal_code;

SELECT city
FROM city
WHERE city_id OR country_id;

SELECT rating
FROM film
WHERE NOT('NC-17');

-- Aliases
SELECT postal_code AS 'Postal Code'
FROM address;

SELECT t.rating
FROM film AS t;

-- COUNT & CONCAT
SELECT COUNT(*) AS 'Row Count'
FROM film;

SELECT CONCAT(rating, ' ', release_year) AS 'Combined'
FROM film;