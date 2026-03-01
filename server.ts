import express from 'express';
import { createServer as createViteServer } from 'vite';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from './src/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // --- API Routes ---

  // Auth Middleware
  const authenticateAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.cookies.admin_token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
      jwt.verify(token, JWT_SECRET);
      next();
    } catch (err) {
      res.status(401).json({ error: 'Invalid token' });
    }
  };

  // Login
  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;
    
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
      res.cookie('admin_token', token, { 
        httpOnly: true, 
        secure: true,
        sameSite: 'none'
      });
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.json({ success: true });
  });

  app.get('/api/auth/check', authenticateAdmin, (req, res) => {
    res.json({ authenticated: true });
  });

  // Public Endpoints
  app.get('/api/settings', (req, res) => {
    const settings = db.prepare('SELECT * FROM site_settings').all() as any[];
    const result = settings.reduce((acc, curr) => ({ ...acc, [curr.key]: curr.value }), {});
    res.json(result);
  });

  app.get('/api/announcements', (req, res) => {
    const data = db.prepare('SELECT * FROM announcements ORDER BY date DESC').all();
    res.json(data);
  });

  app.get('/api/notices', (req, res) => {
    const data = db.prepare('SELECT * FROM notices ORDER BY date DESC').all();
    res.json(data);
  });

  app.get('/api/facilities', (req, res) => {
    const data = db.prepare('SELECT * FROM facilities').all();
    res.json(data);
  });

  app.get('/api/faculties', (req, res) => {
    const data = db.prepare('SELECT * FROM faculties').all();
    res.json(data);
  });

  app.get('/api/results', (req, res) => {
    const data = db.prepare('SELECT * FROM results ORDER BY year DESC').all();
    res.json(data);
  });

  // Admin Endpoints (Protected)
  app.put('/api/settings', authenticateAdmin, (req, res) => {
    const settings = req.body;
    const stmt = db.prepare('INSERT OR REPLACE INTO site_settings (key, value) VALUES (?, ?)');
    db.transaction(() => {
      for (const [key, value] of Object.entries(settings)) {
        stmt.run(key, String(value));
      }
    })();
    res.json({ success: true });
  });

  // Generic CRUD for Admin
  const tables = ['announcements', 'notices', 'facilities', 'faculties', 'results'];
  
  tables.forEach(table => {
    app.post(`/api/${table}`, authenticateAdmin, (req, res) => {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const placeholders = keys.map(() => '?').join(',');
      const stmt = db.prepare(`INSERT INTO ${table} (${keys.join(',')}) VALUES (${placeholders})`);
      const info = stmt.run(...values);
      res.json({ id: info.lastInsertRowid, ...req.body });
    });

    app.put(`/api/${table}/:id`, authenticateAdmin, (req, res) => {
      const keys = Object.keys(req.body);
      const values = Object.values(req.body);
      const setClause = keys.map(k => `${k} = ?`).join(',');
      const stmt = db.prepare(`UPDATE ${table} SET ${setClause} WHERE id = ?`);
      stmt.run(...values, req.params.id);
      res.json({ id: req.params.id, ...req.body });
    });

    app.delete(`/api/${table}/:id`, authenticateAdmin, (req, res) => {
      db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(req.params.id);
      res.json({ success: true });
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
