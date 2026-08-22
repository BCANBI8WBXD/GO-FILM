-- External Reviews table (OMDb, IMDb, etc)
CREATE TABLE external_reviews (
  id SERIAL PRIMARY KEY,
  movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  source VARCHAR(100) NOT NULL, -- 'imdb', 'rotten_tomatoes', 'metacritic'
  rating DECIMAL(3,1),
  url VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(movie_id, source)
);

-- Index for fast lookups
CREATE INDEX idx_external_reviews_movie_id ON external_reviews(movie_id);
CREATE INDEX idx_external_reviews_source ON external_reviews(source);
