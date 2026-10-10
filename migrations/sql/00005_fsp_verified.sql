-- +goose Up
ALTER TABLE public.candidates
    ADD COLUMN has_fsp_verified BOOLEAN NOT NULL DEFAULT FALSE;

-- +goose Down
ALTER TABLE public.candidates
    DROP COLUMN has_fsp_verified;