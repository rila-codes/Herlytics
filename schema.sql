-- Users Table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    oauth_provider VARCHAR(50),
    oauth_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Refresh Tokens Table
CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) UNIQUE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessments Table
CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    risk_percentage DOUBLE PRECISION NOT NULL,
    confidence_score DOUBLE PRECISION NOT NULL,
    risk_category VARCHAR(50) NOT NULL,
    explanation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assessment Answers Table
CREATE TABLE assessment_answers (
    id BIGSERIAL PRIMARY KEY,
    assessment_id BIGINT REFERENCES assessments(id) ON DELETE CASCADE,
    question_key VARCHAR(100) NOT NULL,
    answer_value TEXT NOT NULL
);

-- Lifestyle Logs Table
CREATE TABLE lifestyle_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL,
    water_intake_ml INT DEFAULT 0,
    sleep_duration_hours DOUBLE PRECISION DEFAULT 0.0,
    exercise_duration_minutes INT DEFAULT 0,
    mood VARCHAR(50),
    weight_kg DOUBLE PRECISION,
    bmi DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_date UNIQUE (user_id, log_date)
);

-- Menstrual Logs Table
CREATE TABLE menstrual_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    log_date DATE NOT NULL, -- Date when period started
    cycle_length INT,
    period_duration INT,
    symptoms JSONB, -- Checked symptoms list
    mood VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Recipes Table
CREATE TABLE recipes (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(512),
    cooking_time_minutes INT NOT NULL,
    difficulty VARCHAR(50) NOT NULL,
    nutrition JSONB, -- {calories, protein, carbs, fat}
    ingredients JSONB, -- array of strings
    steps JSONB, -- array of strings
    tags JSONB, -- array of categories e.g. ["Vegetarian", "PCOS Friendly"]
    is_pcos_friendly BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Bookmarked Recipes
CREATE TABLE user_recipes_bookmarks (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    recipe_id BIGINT REFERENCES recipes(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, recipe_id)
);

-- Articles Table
CREATE TABLE articles (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    reading_time_minutes INT NOT NULL,
    image_url VARCHAR(512),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Bookmarked Articles
CREATE TABLE user_articles_bookmarks (
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    article_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, article_id)
);
