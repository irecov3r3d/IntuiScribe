import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import Database from 'better-sqlite3';
import fs from 'fs';
import * as cheerio from 'cheerio';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('therapy.db');

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );
  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    content TEXT,
    type TEXT,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    role TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings if not present
const seedSettings = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
seedSettings.run('theme', 'dark');
seedSettings.run('tier', 'free');
seedSettings.run('user_name', 'User');
seedSettings.run('belief_system', 'none');
seedSettings.run('doctrine', 'none');
seedSettings.run('assistant_name', 'Scribe');
seedSettings.run('onboarding_complete', 'false');

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/settings', (req, res) => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = rows.reduce((acc: any, row: any) => {
      let val: any = row.value;
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      acc[row.key] = val;
      return acc;
    }, {});
    res.json(settings);
  });

  app.post('/api/settings', (req, res) => {
    const { settings } = req.body;
    const upsert = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    for (const [key, value] of Object.entries(settings)) {
      upsert.run(key, String(value));
    }
    res.json({ status: 'ok' });
  });

  app.get('/api/docs', (req, res) => {
    const docs = db.prepare('SELECT * FROM documents ORDER BY createdAt DESC').all();
    res.json(docs);
  });

  app.post('/api/docs', (req, res) => {
    const { title, content, type } = req.body;
    const info = db.prepare('INSERT INTO documents (title, content, type) VALUES (?, ?, ?)').run(title, content, type);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete('/api/docs/:id', (req, res) => {
    db.prepare('DELETE FROM documents WHERE id = ?').run(req.params.id);
    res.json({ status: 'ok' });
  });

  app.post('/api/fetch-url', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) return res.status(400).json({ error: 'URL is required' });
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.statusText}`);
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove unnecessary elements
      $('script, style, noscript, iframe, img, svg, nav, footer, header').remove();
      
      const title = $('title').text() || url;
      const content = $('body').text().replace(/\s+/g, ' ').trim();
      
      res.json({ title, content });
    } catch (error) {
      console.error('Error fetching URL:', error);
      res.status(500).json({ error: 'Failed to fetch URL content' });
    }
  });

  app.get('/api/history', (req, res) => {
    const history = db.prepare('SELECT * FROM messages ORDER BY timestamp ASC').all();
    res.json(history);
  });

  app.post('/api/history', (req, res) => {
    const { role, content } = req.body;
    db.prepare('INSERT INTO messages (role, content) VALUES (?, ?)').run(role, content);
    res.json({ status: 'ok' });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
