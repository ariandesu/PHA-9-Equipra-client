import fs from 'node:fs';
import path from 'node:path';
import { MongoClient } from 'mongodb';
import { getAuth } from '../src/lib/auth.js';
import { equipment as demoEquipment } from '../src/lib/mock/data.js';

// Next.js loads .env.local for the app; a plain node script must read it itself.
// Only key names are ever logged, never values.
function loadEnvFiles() {
  for (const name of ['.env.local', '.env']) {
    const file = path.join(process.cwd(), name);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnvFiles();

// Refuse anything that is not one of the two known databases, so a typo can
// never point the seed at an unrelated cluster.
const ALLOWED_DBS = ['equipra_dev', 'equipra'];

function parseArgs(argv) {
  const index = argv.indexOf('--db');
  const value = index !== -1 ? argv[index + 1] : process.env.DB_NAME;
  return { dbName: value };
}

const { dbName } = parseArgs(process.argv.slice(2));

if (!ALLOWED_DBS.includes(dbName)) {
  console.error(`Refusing to seed "${dbName || '(empty)'}". Use --db equipra_dev or --db equipra.`);
  process.exit(1);
}

if (!process.env.MONGODB_URI) {
  console.error('Refusing to seed: MONGODB_URI is not set.');
  process.exit(1);
}

// BetterAuth builds its own Mongo client from MONGODB_URI plus DB_NAME, so the
// target database is selected before getAuth() is called for the first time.
// The script's own client below is separate and only used for direct writes.
process.env.DB_NAME = dbName;

const SEED_ACCOUNTS = [
  { email: 'admin@equipra.app', name: 'Nasrin Akter', password: process.env.SEED_ADMIN_PASSWORD, role: 'admin' },
  { email: 'mahfuz@riverbank-plant.test', name: 'Riverbank Plant', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'tanisha@framecraft-studio.test', name: 'FrameCraft Studio', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'nabil@equipra-demo.test', name: 'Nabil Rahman', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'siam@equipra-demo.test', name: 'Siam Hossain', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  // Counterparts referenced by the demo bookings/favorites so those rows can be
  // seeded too (they appear in the customer, owner and admin booking tables).
  { email: 'tania@equipra-demo.test', name: 'Tania Sultana', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'asif@equipra-demo.test', name: 'Asif Mahmud', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'mim@equipra-demo.test', name: 'Mim Akter', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'rifat@equipra-demo.test', name: 'Rifat Karim', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'joyonto@equipra-demo.test', name: 'Joyonto Das', password: process.env.SEED_USER_PASSWORD, role: 'customer' },
  { email: 'priya@stageline-events.test', name: 'StageLine Events', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'sakib@voltedge-power.test', name: 'VoltEdge Power', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'arman@sheba-transport.test', name: 'Sheba Transport', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'ripon@greenfield-agro.test', name: 'GreenField Agro', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
  { email: 'hossain@dholaikhal-machinery.test', name: 'Dholaikhal Machinery', password: process.env.SEED_USER_PASSWORD, role: 'owner' },
];

const client = new MongoClient(process.env.MONGODB_URI);
const created = { users: 0, existingUsers: 0, equipment: 0, bookings: 0, favorites: 0 };

async function ensureUser(auth, db, account) {
  const existing = await db.collection('user').findOne({ email: account.email });
  if (existing) {
    created.existingUsers += 1;
    return existing;
  }

  if (!account.password) {
    throw new Error(`Missing password env var for ${account.email}`);
  }

  // Passwords must be hashed by BetterAuth, never written by hand.
  await auth.api.signUpEmail({
    body: { email: account.email, password: account.password, name: account.name },
  });

  await db.collection('user').updateOne(
    { email: account.email },
    { $set: { role: account.role, emailVerified: true, updatedAt: new Date() } }
  );

  created.users += 1;
  return db.collection('user').findOne({ email: account.email });
}

async function main() {
  console.log(`Seeding database "${dbName}" (connection details are never printed).`);
  await client.connect();
  console.log('Connected.');
  const db = client.db(dbName);
  const auth = getAuth();
  console.log('Auth ready.');

  const usersByEmail = {};
  for (const account of SEED_ACCOUNTS) {
    usersByEmail[account.email] = await ensureUser(auth, db, account);
    console.log(`User ready: ${account.email} (${account.role})`);
  }

  // Equipment rows come from the same data file the mock source uses, so the
  // demo catalog is identical in both modes. Statuses are preserved verbatim.
  const ownerByMockId = {
    o1: usersByEmail['mahfuz@riverbank-plant.test'],
    o2: usersByEmail['tanisha@framecraft-studio.test'],
    o3: usersByEmail['arman@sheba-transport.test'],
    o4: usersByEmail['ripon@greenfield-agro.test'],
    o5: usersByEmail['sakib@voltedge-power.test'],
    o6: usersByEmail['priya@stageline-events.test'],
    o7: usersByEmail['hossain@dholaikhal-machinery.test'],
  };

  for (const row of demoEquipment) {
    const ownerUser = ownerByMockId[row.owner.id];
    const owner = {
      id: String(ownerUser._id),
      name: ownerUser.name || '',
      email: ownerUser.email || '',
      image: ownerUser.image || null,
    };

    // Upsert on name+owner so re-running the seed refreshes rather than duplicates.
    await db.collection('equipment').updateOne(
      { name: row.name, 'owner.id': owner.id },
      {
        $set: {
          description: row.description,
          category: row.category,
          location: row.location,
          price: row.price,
          rentalType: row.rentalType,
          quantity: row.quantity,
          condition: row.condition,
          brand: row.brand,
          model: row.model,
          image: row.image,
          imagePosition: row.imagePosition,
          terms: row.terms,
          status: row.status,
          owner,
          updatedAt: new Date(row.updatedAt),
        },
        $setOnInsert: { createdAt: new Date(row.createdAt) },
      },
      { upsert: true }
    );
    created.equipment += 1;
  }

  // Same bookings and favorites as the mock, keyed by equipment name.
  const { bookings: demoBookings, favorites: demoFavorites } = await import('../src/lib/mock/data.js');
  const equipmentByName = {};
  for (const doc of await db.collection('equipment').find({}).toArray()) {
    equipmentByName[doc.name] = doc;
  }

  for (const row of demoBookings) {
    const equipmentDoc = equipmentByName[row.equipment.name];
    if (!equipmentDoc) {
      console.log(`  skip booking ${row.id}: equipment "${row.equipment.name}" not in db`);
      continue;
    }

    const customer = await db.collection('user').findOne({ email: row.customer.email });
    if (!customer) {
      console.log(`  skip booking ${row.id}: customer ${row.customer.email} not in db`);
      continue;
    }

    const owner = await db.collection('user').findOne({ email: row.owner.email });
    if (!owner) {
      console.log(`  skip booking ${row.id}: owner ${row.owner.email} not in db`);
      continue;
    }

    const filter = {
      'customer.id': String(customer._id),
      'equipment.name': row.equipment.name,
      createdAt: new Date(row.createdAt),
    };

    await db.collection('bookings').updateOne(
      filter,
      {
        $set: {
          equipmentId: equipmentDoc._id,
          equipment: row.equipment,
          owner: { id: String(owner._id), name: owner.name || '', email: owner.email || '' },
          customer: {
            id: String(customer._id),
            name: customer.name || '',
            email: customer.email || '',
            image: customer.image || null,
          },
          startDate: new Date(row.startDate),
          endDate: new Date(row.endDate),
          quantity: row.quantity,
          days: row.days,
          units: row.units,
          totalAmount: row.totalAmount,
          phone: row.phone,
          address: row.address,
          notes: row.notes,
          status: row.status,
          paymentStatus: row.paymentStatus,
          holdExpiresAt: row.holdExpiresAt ? new Date(row.holdExpiresAt) : null,
          transactionId: row.transactionId,
          updatedAt: new Date(row.updatedAt),
        },
        $setOnInsert: { checkoutSessionId: null },
      },
      { upsert: true }
    );
    created.bookings += 1;

    if (row.paymentStatus === 'paid') {
      // Payments use the session id as the unique key, so the seed derives a
      // deterministic pseudo-session from the booking identity.
      const sessionId = `seed_${equipmentDoc._id}_${row.id}`;
      const bookingDoc = await db.collection('bookings').findOne(filter, { projection: { _id: 1 } });
      await db.collection('payments').updateOne(
        { sessionId },
        {
          $set: { bookingId: bookingDoc._id },
          $setOnInsert: {
            sessionId,
            transactionId: row.transactionId,
            amount: row.totalAmount * 100,
            currency: 'bdt',
            customerEmail: customer.email || '',
            ownerEmail: owner.email || '',
            status: 'paid',
            createdAt: new Date(row.createdAt),
          },
        },
        { upsert: true }
      );
    }
  }

  for (const favorite of demoFavorites) {
    const customer = await db.collection('user').findOne({ email: 'nabil@equipra-demo.test' });
    if (!customer) continue;

    const source = demoEquipment.find((row) => row.id === favorite.equipmentId);
    const equipmentDoc = source ? equipmentByName[source.name] : null;
    if (!equipmentDoc) continue;

    await db.collection('favorites').updateOne(
      { userId: String(customer._id), equipmentId: equipmentDoc._id },
      {
        $setOnInsert: {
          userId: String(customer._id),
          equipmentId: equipmentDoc._id,
          createdAt: new Date(favorite.createdAt),
        },
      },
      { upsert: true }
    );
    created.favorites += 1;
  }

  console.log(
    `Seed complete: users +${created.users} (${created.existingUsers} already existed), ` +
      `equipment ${created.equipment} upserted, bookings ${created.bookings} upserted, ` +
      `favorites ${created.favorites} upserted.`
  );

  await client.close().catch(() => {});

  // BetterAuth's adapter keeps its own pool open, so exit explicitly instead of
  // waiting for the event loop to drain.
  process.exit(0);
}

main().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await client.close().catch(() => {});
  process.exit(1);
});
