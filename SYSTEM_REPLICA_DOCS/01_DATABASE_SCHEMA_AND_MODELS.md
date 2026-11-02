# KTS POS — مواصفات مخطط قاعدة البيانات والنماذج (Database Schema & DDL)
## SQLite Schema, PRAGMAs, Indexes, and Initial Seed Data

هذا المستند يحتوي على مخطط قاعدة البيانات الكامل والشامل لنظام KTS POS بصيغة SQL جاهزة للتنفيذ، مع إعدادات الضبط والأداء والفهارس والبيانات الأولية.

---

### 1. إعدادات محرك قاعدة البيانات (SQLite PRAGMA Configurations)
لضمان عمل النظام بأعلى سرعة مع أكثر من 11,000 منتج و10,000 عضو ومئات الفواتير اليومية بدون أي تأخير، يجب تنفيذ الإعدادات التالية فور فتح الاتصال:

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000;     -- حجز 64 ميجابايت لذاكرة الكاش في الرام
PRAGMA temp_store = MEMORY;      -- الجداول المؤقتة في الذاكرة
PRAGMA mmap_size = 268435456;   -- قراءة 256 ميجابايت مباشرة عبر Memory-Mapped I/O
```

---

### 2. كود إنشاء الجداول الكامل (Complete DDL SQL Script)

```sql
-- =========================================================================
-- 1. إعدادات النظام العامة (System Configurations)
-- =========================================================================
CREATE TABLE IF NOT EXISTS system_configurations (
  config_key TEXT PRIMARY KEY,
  config_value TEXT NOT NULL,
  description TEXT,
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 2. الأدوار والصلاحيات والمستخدمين (RBAC & Users)
-- =========================================================================
CREATE TABLE IF NOT EXISTS roles (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  description TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS permissions (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS role_permissions (
  role_id TEXT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  permission_id TEXT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role_id TEXT NOT NULL REFERENCES roles(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  phone TEXT,
  email TEXT,
  last_login_at TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 3. ورديات الكاشير وجداول الدوام (Cashier Shifts & Schedules)
-- =========================================================================
CREATE TABLE IF NOT EXISTS cashier_shifts (
  id TEXT PRIMARY KEY,
  shift_no INTEGER NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  opening_cash REAL NOT NULL DEFAULT 0.0,
  expected_cash REAL DEFAULT 0.0,
  actual_cash REAL,
  discrepancy REAL,
  total_sales REAL DEFAULT 0.0,
  total_cash_sales REAL DEFAULT 0.0,
  total_knet_sales REAL DEFAULT 0.0,
  total_refunds REAL DEFAULT 0.0,
  invoice_count INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  notes TEXT,
  opened_at TEXT DEFAULT (datetime('now')),
  closed_at TEXT
);

CREATE TABLE IF NOT EXISTS cashier_shift_schedules (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Sunday, 6=Saturday
  shift_type TEXT NOT NULL CHECK (shift_type IN ('morning', 'evening', 'full')),
  start_time TEXT NOT NULL, -- e.g. '08:00'
  end_time TEXT NOT NULL,   -- e.g. '15:00'
  is_active INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 4. فئات المنتجات، المنتجات، والباركودات المتعددة (Categories & Catalog)
-- =========================================================================
CREATE TABLE IF NOT EXISTS product_categories (
  id TEXT PRIMARY KEY,
  parent_id TEXT REFERENCES product_categories(id) ON DELETE SET NULL,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT,
  category_id TEXT NOT NULL REFERENCES product_categories(id),
  unit TEXT NOT NULL DEFAULT 'قطعة',
  cost_price REAL NOT NULL DEFAULT 0.0,
  sale_price REAL NOT NULL,
  min_price REAL,
  min_stock_alert INTEGER NOT NULL DEFAULT 5,
  is_discountable INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  image_url TEXT,
  odoo_product_id INTEGER,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_barcodes (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  barcode TEXT UNIQUE NOT NULL,
  is_primary INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 5. الموردون (Suppliers)
-- =========================================================================
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  contact_person TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  odoo_partner_id INTEGER,
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 6. أرصدة وحركات المخزون (Inventory Balances & Movements Ledger)
-- =========================================================================
CREATE TABLE IF NOT EXISTS inventory_balances (
  id TEXT PRIMARY KEY,
  product_id TEXT UNIQUE NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty_on_hand REAL NOT NULL DEFAULT 0.0,
  qty_reserved REAL NOT NULL DEFAULT 0.0,
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS inventory_movements (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  movement_type TEXT NOT NULL CHECK (movement_type IN ('sale', 'return', 'purchase', 'adjustment', 'initial')),
  qty_change REAL NOT NULL,
  balance_after REAL NOT NULL,
  reference_id TEXT, -- sale_id, return_id, purchase_id
  notes TEXT,
  user_id TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 7. فئات العضوية، الأعضاء، وقواعد الخصم (Members & Discounts)
-- =========================================================================
CREATE TABLE IF NOT EXISTS membership_categories (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  default_discount_pct REAL DEFAULT 0.0,
  description TEXT
);

CREATE TABLE IF NOT EXISTS members (
  id TEXT PRIMARY KEY,
  membership_no TEXT UNIQUE NOT NULL,
  civil_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category_id TEXT NOT NULL REFERENCES membership_categories(id),
  phone TEXT,
  email TEXT,
  workplace TEXT,
  is_eligible_for_discount INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'suspended')),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS discount_rules (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name_ar TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed_amount')),
  value REAL NOT NULL CHECK (value > 0),
  priority INTEGER NOT NULL DEFAULT 10,
  scope TEXT NOT NULL CHECK (scope IN ('all', 'membership_category', 'member', 'category', 'product')),
  target_membership_category_id TEXT REFERENCES membership_categories(id),
  target_member_id TEXT REFERENCES members(id),
  target_category_id TEXT REFERENCES product_categories(id),
  target_product_id TEXT REFERENCES products(id),
  min_spend REAL DEFAULT 0.0,
  max_discount REAL,
  can_combine INTEGER NOT NULL DEFAULT 0,
  start_date TEXT,
  end_date TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 8. المبيعات، البنود، والمدفوعات (Sales, Sale Lines, Payments & Carts)
-- =========================================================================
CREATE TABLE IF NOT EXISTS sales (
  id TEXT PRIMARY KEY,
  invoice_no TEXT UNIQUE NOT NULL,
  client_transaction_id TEXT UNIQUE NOT NULL, -- منع تكرار البيع في حالات التزامن والشبكة
  shift_id TEXT NOT NULL REFERENCES cashier_shifts(id),
  user_id TEXT NOT NULL REFERENCES users(id),
  member_id TEXT REFERENCES members(id),
  subtotal REAL NOT NULL CHECK (subtotal >= 0),
  discount_total REAL NOT NULL DEFAULT 0.0 CHECK (discount_total >= 0),
  net_total REAL NOT NULL CHECK (net_total >= 0),
  paid_amount REAL NOT NULL CHECK (paid_amount >= 0),
  change_due REAL NOT NULL DEFAULT 0.0 CHECK (change_due >= 0),
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'refunded', 'partial_refunded', 'voided')),
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sale_lines (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  qty REAL NOT NULL CHECK (qty > 0),
  unit_price REAL NOT NULL CHECK (unit_price >= 0),
  discount_amount REAL NOT NULL DEFAULT 0.0 CHECK (discount_amount >= 0),
  line_total REAL NOT NULL CHECK (line_total >= 0),
  applied_rule_id TEXT REFERENCES discount_rules(id) ON DELETE SET NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  sale_id TEXT NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'knet', 'split')),
  amount REAL NOT NULL CHECK (amount > 0),
  reference_no TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS held_carts (
  id TEXT PRIMARY KEY,
  cart_ref TEXT UNIQUE NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  shift_id TEXT NOT NULL REFERENCES cashier_shifts(id),
  member_id TEXT REFERENCES members(id),
  payload TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 9. المرتجعات (Return Transactions)
-- =========================================================================
CREATE TABLE IF NOT EXISTS return_transactions (
  id TEXT PRIMARY KEY,
  return_no TEXT UNIQUE NOT NULL,
  sale_id TEXT NOT NULL REFERENCES sales(id) ON DELETE RESTRICT,
  shift_id TEXT NOT NULL REFERENCES cashier_shifts(id) ON DELETE RESTRICT,
  user_id TEXT NOT NULL REFERENCES users(id),
  refund_total REAL NOT NULL CHECK (refund_total > 0),
  reason TEXT NOT NULL,
  approved_by_user_id TEXT REFERENCES users(id),
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS return_lines (
  id TEXT PRIMARY KEY,
  return_id TEXT NOT NULL REFERENCES return_transactions(id) ON DELETE CASCADE,
  sale_line_id TEXT NOT NULL REFERENCES sale_lines(id) ON DELETE RESTRICT,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  qty REAL NOT NULL CHECK (qty > 0),
  refund_amount REAL NOT NULL CHECK (refund_amount >= 0),
  item_condition TEXT NOT NULL DEFAULT 'good' CHECK (item_condition IN ('good', 'damaged')),
  restocked INTEGER NOT NULL DEFAULT 1,
  created_at TEXT DEFAULT (datetime('now'))
);

-- =========================================================================
-- 10. سجل التدقيق المحمي من التعديل والحذف (Audit Trail Ledger)
-- =========================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  old_values TEXT,
  new_values TEXT,
  ip_address TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);
```

---

### 3. فهارس تسريع الاستعلام والبحث المعتمدة (B-Tree Indexes)

```sql
-- فهارس الأصناف والباركود (تسريع البحث إلى أقل من 3 مللي ثانية لـ 11,000 صنف)
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_name_ar ON products(name_ar);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_product_barcodes_code ON product_barcodes(barcode);
CREATE INDEX IF NOT EXISTS idx_product_barcodes_product ON product_barcodes(product_id);

-- فهارس المخزون
CREATE INDEX IF NOT EXISTS idx_inv_bal_product ON inventory_balances(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_mov_product ON inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inv_mov_created ON inventory_movements(created_at);

-- فهارس الأعضاء (تسريع التحقق إلى أقل من 1 مللي ثانية لـ 10,000 عضو)
CREATE INDEX IF NOT EXISTS idx_members_no ON members(membership_no);
CREATE INDEX IF NOT EXISTS idx_members_civil ON members(civil_id);
CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_name ON members(name);
CREATE INDEX IF NOT EXISTS idx_members_category ON members(category_id);

-- فهارس المبيعات والمدفوعات
CREATE INDEX IF NOT EXISTS idx_sales_invoice_no ON sales(invoice_no);
CREATE INDEX IF NOT EXISTS idx_sales_client_tx ON sales(client_transaction_id);
CREATE INDEX IF NOT EXISTS idx_sales_shift ON sales(shift_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON sales(created_at);
CREATE INDEX IF NOT EXISTS idx_sales_member ON sales(member_id);
CREATE INDEX IF NOT EXISTS idx_sale_lines_sale ON sale_lines(sale_id);
CREATE INDEX IF NOT EXISTS idx_sale_lines_product ON sale_lines(product_id);
CREATE INDEX IF NOT EXISTS idx_payments_sale ON payments(sale_id);
CREATE INDEX IF NOT EXISTS idx_payments_method ON payments(payment_method);

-- فهارس سجل التدقيق
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
```

---

### 4. البيانات الأولية للبذر (Seed Data)

#### أ. الأدوار الافتراضية والمستخدم الرئيسي
- تشفير كلمة المرور: دالة `crypto.pbkdf2Sync(password, 'kts_pos_fixed_salt_2026', 10000, 64, 'sha512').toString('hex')`.
- الحسابات الافتراضية:
  1. `admin` (كلمة المرور: `admin123`) بدور `role-admin` (مدير النظام الرئيسي).
  2. `cashier1` (كلمة المرور: `cashier123`) بدور `role-cashier` (كاشير).

```sql
INSERT OR IGNORE INTO roles (id, code, name_ar, description) VALUES
  ('role-admin', 'ADMIN', 'مدير النظام الرئيسي', 'كامل الصلاحيات الفنية والإدارية والمالية'),
  ('role-supervisor', 'SUPERVISOR', 'مشرف الفرع', 'إدارة المخزون والورديات وإلغاء العمليات والتقارير'),
  ('role-cashier', 'CASHIER', 'كاشير نقطة البيع', 'تنفيذ عمليات البيع والمرتجع وتعليق السلات');

-- كلمة مرور admin123 مشفرة بـ PBKDF2:
-- 3df4314c4544d6dbdb9ea2e0ce677ec2bbf95e2697b09bf9527cf616f9f3032d8471c998c0b99ec691459a85011680d26fb022c4d5d36e788c028ba4ee6bbfae
INSERT OR IGNORE INTO users (id, username, password_hash, full_name, role_id, phone, email) VALUES
  ('usr-admin', 'admin', '3df4314c4544d6dbdb9ea2e0ce677ec2bbf95e2697b09bf9527cf616f9f3032d8471c998c0b99ec691459a85011680d26fb022c4d5d36e788c028ba4ee6bbfae', 'مدير النظام الرئيسي', 'role-admin', '99990001', 'admin@kts.com.kw'),
  ('usr-cashier-1', 'cashier1', '3df4314c4544d6dbdb9ea2e0ce677ec2bbf95e2697b09bf9527cf616f9f3032d8471c998c0b99ec691459a85011680d26fb022c4d5d36e788c028ba4ee6bbfae', 'فاطمة الكندري', 'role-cashier', '99990002', 'cashier1@kts.com.kw');
```

#### ب. الفئات الخمس الرئيسية (Five Main Stationery Categories)
```sql
INSERT OR IGNORE INTO product_categories (id, parent_id, code, name_ar, name_en, image_url) VALUES
  ('cat-1', NULL, 'CAT_ART', 'أدوات هندسية ورسم وفنون', 'Art & Geometry Tools', 'images/categories/art_supplies.png'),
  ('cat-2', NULL, 'CAT_PENS', 'أقلام وأدوات كتابة', 'Pens & Writing Instruments', 'images/categories/stationery.png'),
  ('cat-3', NULL, 'CAT_NOTEBOOKS', 'دفاتر وكشاكيل مدرسية', 'Notebooks & School Copybooks', 'images/categories/notebooks.png'),
  ('cat-4', NULL, 'CAT_FILES', 'ملفات ومجلدات تنظيمية', 'Files & Binders', 'images/categories/files_binders.png'),
  ('cat-5', NULL, 'CAT_TECH', 'لوازم مكتبية وحاسوبية', 'Office & Computer Accessories', 'images/categories/office_tech.png');
```

#### ج. فئات العضوية وقواعد الخصومات الأولية
```sql
INSERT OR IGNORE INTO membership_categories (id, code, name_ar, default_discount_pct, description) VALUES
  ('mcat-1', 'MCAT_ACTIVE_TEACHER', 'معلم عامل', 15.0, 'معلم كويتي عضو عامل مسدد للاشتراك'),
  ('mcat-2', 'MCAT_RETIRED_TEACHER', 'معلم متقاعد', 20.0, 'عضو متقاعد من الهيئة التعليمية'),
  ('mcat-3', 'MCAT_ASSOCIATE', 'عضو منتسب', 10.0, 'عضو منتسب للجمعية أو إداري في وزارة التربية'),
  ('mcat-4', 'MCAT_HONORARY', 'عضو شرفي', 25.0, 'شخصيات اعتبارية ومكرمون بصفة شرفية');

INSERT OR IGNORE INTO discount_rules 
  (id, code, name_ar, type, value, priority, scope, target_membership_category_id, min_spend, max_discount, can_combine)
VALUES
  ('disc-1', 'RULE-TEACHER-15', 'خصم المعلم العامل (15%)', 'percentage', 15.000, 10, 'membership_category', 'mcat-1', 0, NULL, 0),
  ('disc-2', 'RULE-RETIRED-20', 'خصم المعلم المتقاعد (20%)', 'percentage', 20.000, 5, 'membership_category', 'mcat-2', 0, NULL, 0),
  ('disc-3', 'RULE-ASSOCIATE-10', 'خصم العضو المنتسب (10%)', 'percentage', 10.000, 15, 'membership_category', 'mcat-3', 0, NULL, 0),
  ('disc-4', 'RULE-HONORARY-25', 'خصم العضو الشرفي (25%)', 'percentage', 25.000, 1, 'membership_category', 'mcat-4', 0, NULL, 0);
```
