-- +goose Up
ALTER TABLE public.candidates
    ADD COLUMN industry TEXT,
    ADD COLUMN verified_specialization TEXT,
    ADD COLUMN verified_industry TEXT;


UPDATE public.candidates
SET verified_specialization = specialization
WHERE testing_status = 'verified' AND verified_grade IS NOT NULL;


CREATE TABLE public.testing_question_metadata (
    question_id UUID PRIMARY KEY REFERENCES public.testing_question_templates(id) ON DELETE CASCADE,
    specialization TEXT NOT NULL,
    grade TEXT NOT NULL CHECK (grade IN ('Junior','Middle','Senior','Lead')),
    topic TEXT NOT NULL CHECK (topic IN ('go','sql','http','concurrency','design')),
    difficulty TEXT NOT NULL CHECK (difficulty IN ('easy','medium','hard')),
    enabled BOOLEAN NOT NULL DEFAULT FALSE
);
CREATE INDEX testing_question_metadata_selection_idx ON public.testing_question_metadata(specialization, grade, topic) WHERE enabled;

CREATE TABLE public.testing_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id),
    industry TEXT NOT NULL,
    specialization TEXT NOT NULL,
    target_grade TEXT NOT NULL CHECK (target_grade IN ('Junior','Middle','Senior','Lead')),
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','completed','expired')),
    started_at TIMESTAMPTZ NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    finished_at TIMESTAMPTZ,
    pass_percent INTEGER NOT NULL DEFAULT 80 CHECK (pass_percent BETWEEN 1 AND 100),
    policy_version TEXT NOT NULL DEFAULT 'backend-v1',
    submission_hash TEXT,
    result JSONB,
    CHECK (expires_at > started_at),
    CHECK ((status = 'completed') = (result IS NOT NULL))
);
CREATE UNIQUE INDEX testing_attempts_one_active_idx ON public.testing_attempts(candidate_id) WHERE status = 'in_progress';
CREATE INDEX testing_attempts_history_idx ON public.testing_attempts(candidate_id, started_at DESC);

CREATE TABLE public.testing_attempt_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES public.testing_attempts(id) ON DELETE CASCADE,
    source_question_id UUID NOT NULL, -- deliberately no FK: bank deletion must not change an issued test
    ordinal INTEGER NOT NULL CHECK (ordinal >= 0),
    question_text TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    options JSONB NOT NULL CHECK (jsonb_typeof(options) = 'array'),
    correct_index INTEGER NOT NULL CHECK (correct_index >= 0 AND correct_index < jsonb_array_length(options)),
    selected_index INTEGER CHECK (selected_index >= 0 AND selected_index < jsonb_array_length(options)),
    UNIQUE (attempt_id, ordinal),
    UNIQUE (attempt_id, source_question_id)
);

CREATE TABLE public.invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id TEXT NOT NULL REFERENCES public.employers(id),
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id),
    employer_company TEXT NOT NULL CHECK (btrim(employer_company) <> ''),
    offer_description TEXT NOT NULL CHECK (btrim(offer_description) <> ''),
    contact_method TEXT NOT NULL CHECK (btrim(contact_method) <> ''),
    salary_min BIGINT NOT NULL CHECK (salary_min > 0),
    salary_max BIGINT NOT NULL CHECK (salary_max >= salary_min AND salary_max <= 1000000000),
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent','accepted','rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT clock_timestamp(),
    responded_at TIMESTAMPTZ,
    idempotency_key TEXT,
    CHECK ((status = 'sent') = (responded_at IS NULL)),
    UNIQUE (employer_id, idempotency_key)
);
CREATE UNIQUE INDEX invitations_one_pending_idx ON public.invitations(employer_id, candidate_id) WHERE status = 'sent';
CREATE INDEX invitations_inbox_idx ON public.invitations(candidate_id, created_at DESC);
CREATE INDEX invitations_outbox_idx ON public.invitations(employer_id, created_at DESC);
CREATE INDEX invitations_contact_access_idx ON public.invitations(employer_id, candidate_id) WHERE status = 'accepted';

-- +goose Down
DROP TABLE public.invitations;
DROP TABLE public.testing_attempt_questions;
DROP TABLE public.testing_attempts;
DROP TABLE public.testing_question_metadata;
ALTER TABLE public.candidates DROP COLUMN verified_industry, DROP COLUMN verified_specialization, DROP COLUMN industry;
