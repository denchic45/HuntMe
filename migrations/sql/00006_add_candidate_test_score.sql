-- +goose Up
ALTER TABLE public.candidates
    ADD COLUMN test_score NUMERIC(5, 2)
    CHECK (test_score >= 0 AND test_score <= 100);

-- +goose Down
ALTER TABLE public.candidates DROP COLUMN test_score;
