import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';

const db = new Database('school.db');

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    date TEXT,
    is_important BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    date TEXT,
    link TEXT
  );

  CREATE TABLE IF NOT EXISTS facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    description TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS faculties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    designation TEXT,
    department TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT,
    class TEXT,
    percentage TEXT,
    year TEXT,
    image_url TEXT
  );

  CREATE TABLE IF NOT EXISTS site_settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
`);

// Insert default admin if not exists
const adminExists = db.prepare('SELECT id FROM users WHERE username = ?').get('admin');
if (!adminExists) {
  const hash = bcrypt.hashSync('admin123', 10);
  db.prepare('INSERT INTO users (username, password) VALUES (?, ?)').run('admin', hash);
}

// Insert default settings if not exists
const settingsExist = db.prepare('SELECT key FROM site_settings').get();
if (!settingsExist) {
  const defaultSettings = [
    ['hero_image', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'],
    ['hero_title', "Welcome to St. Xavier's School"],
    ['hero_subtitle', 'Empowering Minds, Shaping Futures in Newadhiya Jaunpur'],
    ['about_text', "St. Xavier's School is committed to providing a holistic education that nurtures the intellectual, physical, and moral growth of every student."],
    ['contact_email', 'info@stxaviersnewadhiya.edu'],
    ['contact_phone', '+91 98765 43210'],
    ['address', 'Newadhiya, Jaunpur, Uttar Pradesh, India']
  ];
  const insertSetting = db.prepare('INSERT INTO site_settings (key, value) VALUES (?, ?)');
  for (const [key, value] of defaultSettings) {
    insertSetting.run(key, value);
  }
}

export default db;
