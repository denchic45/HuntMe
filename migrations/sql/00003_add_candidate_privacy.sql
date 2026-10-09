-- +goose Up
ALTER TABLE public.candidates
    ADD COLUMN is_public BOOLEAN NOT NULL DEFAULT FALSE,
    ADD COLUMN hide_current_company BOOLEAN NOT NULL DEFAULT TRUE;

-- +goose Down
ALTER TABLE public.candidates
    DROP COLUMN hide_current_company,
    DROP COLUMN is_public;