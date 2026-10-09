-- Требуется PostgreSQL 13 или новее.

-- +goose Up
CREATE TABLE testing_question_templates (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    options JSONB NULL,
    correct_option JSONB NOT NULL,

    CONSTRAINT testing_question_templates_text_not_blank
        CHECK (text ~ '[^[:space:]]'),

    CONSTRAINT testing_question_templates_correct_option_not_empty
        CHECK (
            correct_option NOT IN (
                'null'::JSONB,
                '[]'::JSONB,
                '{}'::JSONB
            )
            AND (
                jsonb_typeof(correct_option) <> 'string'
                OR (correct_option #>> '{}') ~ '[^[:space:]]'
            )
        )
);

CREATE TABLE employer_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    correct_option TEXT NOT NULL,
    employer_keycloak_user_id TEXT NOT NULL,

    CONSTRAINT employer_questions_text_not_blank
        CHECK (text ~ '[^[:space:]]'),

    CONSTRAINT employer_questions_correct_option_not_blank
        CHECK (correct_option ~ '[^[:space:]]'),

    CONSTRAINT employer_questions_employer_id_not_blank
        CHECK (employer_keycloak_user_id ~ '[^[:space:]]')
);

CREATE INDEX employer_questions_employer_keycloak_user_id_idx
    ON employer_questions (employer_keycloak_user_id);

-- +goose Down
DROP TABLE employer_questions;
DROP TABLE testing_question_templates;