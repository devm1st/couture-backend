-- USERS (Admin)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  gender TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- MEASUREMENTS (History-based, TEXT fields)
DROP TABLE IF EXISTS measurements;

CREATE TABLE IF NOT EXISTS measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,

  sleeve TEXT,
  shoulder TEXT,
  round_sleeve TEXT,
  shirt_length TEXT,
  trouser_length TEXT,
  neck TEXT,
  chest TEXT,
  tummy TEXT,
  lap TEXT,
  waist TEXT,
  trouser_hip TEXT,
  cuff_links TEXT,
  agbada_length TEXT,

  note TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  measurement_id INTEGER NOT NULL,

  style_name TEXT NOT NULL,
  style_description TEXT,
  style_image_url TEXT,

  fabric_type TEXT,
  fabric_color TEXT,
  fabric_notes TEXT,

  price TEXT,
  status TEXT DEFAULT 'pending',
  due_date TEXT,

  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (measurement_id) REFERENCES measurements(id)
);
