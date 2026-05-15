ALTER TABLE results
ADD CONSTRAINT fk_responses_results
FOREIGN KEY (attempt_id)
REFERENCES responses(attempt_id)
ON DELETE CASCADE
ON UPDATE CASCADE;
