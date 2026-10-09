-- +goose Up
CREATE TABLE public.candidates (
    id TEXT PRIMARY KEY,

    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    city TEXT,

    specialization TEXT,
    claimed_grade TEXT,
    verified_grade TEXT,
    category TEXT,

    experience_years NUMERIC(5, 2)
        CHECK (experience_years >= 0),

    desired_salary NUMERIC(14, 2)
        CHECK (desired_salary >= 0),

    skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    soft_skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],

    fsp_id TEXT,
    fsp_achievements JSONB NOT NULL DEFAULT '[]'::JSONB
        CHECK (jsonb_typeof(fsp_achievements) = 'array'),

    testing_status TEXT,
    last_test_date TIMESTAMPTZ,
    can_retake_test_after TIMESTAMPTZ
);

-- +goose Down
DROP TABLE public.candidates;