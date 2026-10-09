
-- +goose Up
CREATE TABLE public.employers (
    id TEXT PRIMARY KEY,
    company_name TEXT NOT NULL,
    industry TEXT,
    description TEXT,
    website TEXT,
    contact_person TEXT
);

-- +goose Down
DROP TABLE public.employers;
