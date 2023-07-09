CREATE TABLE IF NOT EXISTS soduku_lb (
	id      SERIAL PRIMARY KEY,
	date    timestamp NOT NULL DEFAULT NOW(),
    ip      text NOT null,
    name    text NOT null,
    diff   text NOT null,
	mistake NUMERIC NOT null,
	time        text NOT null
);