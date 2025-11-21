-- Optional seed data for Elegant Women Clothing Platform

-- Create an admin user with a predefined password hash (password: "admin123")
-- NOTE: Replace the password_hash with a securely generated hash in production.
INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@example.com', '$2b$10$wYlEJx5cG3azQvC5X7r6B.In2tOQ2ZJ2uT4d2m1GQd8q2gkH2J3lS', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Sample products
INSERT INTO products (name, description, price, stock, category, image_url) VALUES
('Classic Blue Dress', 'Elegant blue dress for any occasion.', 79.99, 25, 'Dresses', ''),
('Amber Knit Sweater', 'Warm and cozy sweater with amber tones.', 59.50, 40, 'Tops', ''),
('Ocean Breeze Skirt', 'Flowy skirt with ocean-inspired colors.', 49.00, 30, 'Skirts', '')
ON CONFLICT DO NOTHING;
