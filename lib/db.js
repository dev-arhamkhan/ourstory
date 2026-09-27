import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

let pool;
if (process.env.DATABASE_URL) {
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL.includes('localhost') ? false : { rejectUnauthorized: false },
    connectionTimeoutMillis: 5000,
  });
}

let isPgConnected = false;
let initPromise = null;

// In-memory fallback data structures for local dev / testing
const inMemorySpaces = new Map();
const inMemoryMoments = [];
let memoryMomentIdCounter = 1;

export async function initDb() {
  if (!process.env.DATABASE_URL || !pool) {
    isPgConnected = false;
    return;
  }

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const client = await pool.connect();
        await client.query(`
          CREATE TABLE IF NOT EXISTS spaces (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            started_at DATE,
            created_at TIMESTAMP DEFAULT NOW()
          );
        `);

        await client.query(`
          CREATE TABLE IF NOT EXISTS moments (
            id SERIAL PRIMARY KEY,
            space_id UUID REFERENCES spaces(id) ON DELETE CASCADE,
            title TEXT NOT NULL,
            description TEXT,
            moment_date DATE NOT NULL,
            photo_url TEXT,
            category TEXT,
            created_at TIMESTAMP DEFAULT NOW()
          );
        `);
        client.release();
        isPgConnected = true;
        console.log('[DB] PostgreSQL initialized successfully.');
      } catch (err) {
        console.warn('[DB] PostgreSQL connection failed. Falling back to in-memory store:', err.message);
        isPgConnected = false;
      }
    })();
  }

  await initPromise;
}

/**
 * Helper to format DATE objects or YYYY-MM-DD strings to standard YYYY-MM-DD
 */
function formatDateString(dateVal) {
  if (!dateVal) return null;
  if (typeof dateVal === 'string') {
    return dateVal.split('T')[0];
  }
  if (dateVal instanceof Date) {
    return dateVal.toISOString().split('T')[0];
  }
  return String(dateVal);
}

// -------------------------------------------------------------
// SPACES
// -------------------------------------------------------------

export async function createSpace({ name, started_at }) {
  await initDb();
  const formattedStartedAt = started_at ? formatDateString(started_at) : null;

  if (isPgConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO spaces (name, started_at) VALUES ($1, $2) RETURNING id, name, started_at, created_at`,
        [name, formattedStartedAt]
      );
      const row = res.rows[0];
      return {
        ...row,
        started_at: formatDateString(row.started_at)
      };
    } catch (err) {
      console.error('[DB] Failed to create space in Postgres:', err.message);
    }
  }

  // Fallback in-memory
  const id = crypto.randomUUID();
  const spaceRecord = {
    id,
    name,
    started_at: formattedStartedAt,
    created_at: new Date().toISOString()
  };
  inMemorySpaces.set(id, spaceRecord);
  return spaceRecord;
}

export async function getSpaceById(id) {
  await initDb();

  if (isPgConnected && pool) {
    try {
      const spaceRes = await pool.query(`SELECT id, name, started_at, created_at FROM spaces WHERE id = $1`, [id]);
      if (spaceRes.rows.length === 0) return null;

      const space = {
        ...spaceRes.rows[0],
        started_at: formatDateString(spaceRes.rows[0].started_at)
      };

      const momentsRes = await pool.query(
        `SELECT id, space_id, title, description, moment_date, photo_url, category, created_at 
         FROM moments WHERE space_id = $1 
         ORDER BY moment_date ASC, created_at ASC`,
        [id]
      );

      const moments = momentsRes.rows.map(m => ({
        ...m,
        moment_date: formatDateString(m.moment_date)
      }));

      return { ...space, moments };
    } catch (err) {
      console.error('[DB] Failed to query space from Postgres:', err.message);
    }
  }

  // Fallback in-memory
  const space = inMemorySpaces.get(id);
  if (!space) return null;

  const moments = inMemoryMoments
    .filter(m => m.space_id === id)
    .sort((a, b) => {
      const dateA = new Date(a.moment_date).getTime();
      const dateB = new Date(b.moment_date).getTime();
      if (dateA !== dateB) return dateA - dateB;
      return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });

  return { ...space, moments };
}

// -------------------------------------------------------------
// MOMENTS
// -------------------------------------------------------------

export async function addMoment(spaceId, { title, description, moment_date, photo_url, category }) {
  await initDb();
  const formattedDate = formatDateString(moment_date);
  const formattedCategory = category ? category.trim().toLowerCase() : 'uncategorized';

  if (isPgConnected && pool) {
    try {
      const res = await pool.query(
        `INSERT INTO moments (space_id, title, description, moment_date, photo_url, category)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING id, space_id, title, description, moment_date, photo_url, category, created_at`,
        [spaceId, title, description || '', formattedDate, photo_url || null, formattedCategory]
      );
      const row = res.rows[0];
      return {
        ...row,
        moment_date: formatDateString(row.moment_date)
      };
    } catch (err) {
      console.error('[DB] Failed to insert moment into Postgres:', err.message);
    }
  }

  // Fallback in-memory
  const momentRecord = {
    id: memoryMomentIdCounter++,
    space_id: spaceId,
    title,
    description: description || '',
    moment_date: formattedDate,
    photo_url: photo_url || null,
    category: formattedCategory,
    created_at: new Date().toISOString()
  };
  inMemoryMoments.push(momentRecord);
  return momentRecord;
}

export async function updateMoment(momentId, { title, description, moment_date, photo_url, category }) {
  await initDb();
  const numericId = parseInt(momentId, 10);
  if (isNaN(numericId)) return null;

  const formattedDate = formatDateString(moment_date);
  const formattedCategory = category ? category.trim().toLowerCase() : 'uncategorized';

  if (isPgConnected && pool) {
    try {
      const res = await pool.query(
        `UPDATE moments 
         SET title = $1, description = $2, moment_date = $3, photo_url = $4, category = $5
         WHERE id = $6
         RETURNING id, space_id, title, description, moment_date, photo_url, category, created_at`,
        [title, description || '', formattedDate, photo_url || null, formattedCategory, numericId]
      );
      if (res.rows.length === 0) return null;
      const row = res.rows[0];
      return {
        ...row,
        moment_date: formatDateString(row.moment_date)
      };
    } catch (err) {
      console.error('[DB] Failed to update moment in Postgres:', err.message);
    }
  }

  // Fallback in-memory
  const index = inMemoryMoments.findIndex(m => m.id === numericId);
  if (index === -1) return null;

  const existing = inMemoryMoments[index];
  const updated = {
    ...existing,
    title: title !== undefined ? title : existing.title,
    description: description !== undefined ? description : existing.description,
    moment_date: formattedDate || existing.moment_date,
    photo_url: photo_url !== undefined ? photo_url : existing.photo_url,
    category: formattedCategory || existing.category
  };
  inMemoryMoments[index] = updated;
  return updated;
}

export async function deleteMoment(momentId) {
  await initDb();
  const numericId = parseInt(momentId, 10);
  if (isNaN(numericId)) return false;

  if (isPgConnected && pool) {
    try {
      const res = await pool.query(`DELETE FROM moments WHERE id = $1 RETURNING id`, [numericId]);
      return res.rows.length > 0;
    } catch (err) {
      console.error('[DB] Failed to delete moment from Postgres:', err.message);
    }
  }

  // Fallback in-memory
  const index = inMemoryMoments.findIndex(m => m.id === numericId);
  if (index === -1) return false;
  inMemoryMoments.splice(index, 1);
  return true;
}

// -------------------------------------------------------------
// RECAP LOGIC (COMPUTED ON THE FLY)
// -------------------------------------------------------------

export async function getRecapBySpaceId(id) {
  const spaceData = await getSpaceById(id);
  if (!spaceData) return null;

  const { started_at, moments = [] } = spaceData;

  // 1. Days Together
  let daysTogether = 0;
  if (started_at) {
    const startMs = new Date(started_at + 'T00:00:00').getTime();
    const nowMs = new Date().getTime();
    if (!isNaN(startMs) && nowMs >= startMs) {
      daysTogether = Math.floor((nowMs - startMs) / (1000 * 60 * 60 * 24));
    }
  }

  // 2. Total Moments
  const totalMoments = moments.length;

  // 3. First & Latest Moments (moments sorted by moment_date ASC)
  let firstMoment = null;
  let latestMoment = null;

  if (totalMoments > 0) {
    const first = moments[0];
    const latest = moments[moments.length - 1];
    firstMoment = {
      id: first.id,
      title: first.title,
      date: first.moment_date,
      description: first.description,
      photo_url: first.photo_url,
      category: first.category
    };
    latestMoment = {
      id: latest.id,
      title: latest.title,
      date: latest.moment_date,
      description: latest.description,
      photo_url: latest.photo_url,
      category: latest.category
    };
  }

  // 4. Busiest Month (e.g. "March 2026")
  const monthCounts = {};
  moments.forEach(m => {
    if (m.moment_date) {
      const d = new Date(m.moment_date + 'T00:00:00');
      if (!isNaN(d.getTime())) {
        const monthYear = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
      }
    }
  });

  let busiestMonth = null;
  let maxMonthCount = 0;
  for (const [monthStr, count] of Object.entries(monthCounts)) {
    if (count > maxMonthCount) {
      maxMonthCount = count;
      busiestMonth = monthStr;
    }
  }

  // 5. Category Counts
  const categoryCounts = {};
  moments.forEach(m => {
    const cat = m.category || 'uncategorized';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
  });

  return {
    spaceName: spaceData.name,
    startedAt: started_at,
    daysTogether,
    totalMoments,
    firstMoment,
    latestMoment,
    busiestMonth,
    categoryCounts
  };
}
