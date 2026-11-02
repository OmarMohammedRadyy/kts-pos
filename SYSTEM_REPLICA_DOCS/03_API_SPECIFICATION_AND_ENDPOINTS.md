# KTS POS — مواصفات واجهات برمجة التطبيقات (API Specification & Endpoints)
## الدليل الكامل لمسارات REST API، نماذج الطلبات والاستجابات

يعمل الخادم المحلي على المنفذ الافتراضي `http://127.0.0.1:5000` (أو المنفذ المحدد في البيئة). تدعم جميع المسارات التبادل بصيغة `application/json` وتتطلب ترويسة التوثيق `Authorization: Bearer <token>` للمسارات المحمية.

---

### 1. مسارات التوثيق والمستخدمين (`/api/auth`)

#### `POST /api/auth/login`
- **الوصف:** تسجيل دخول الكاشير أو المدير والتحقق من كلمة المرور.
- **جسم الطلب (Request Body):**
  ```json
  {
    "username": "cashier1",
    "password": "cashier123"
  }
  ```
- **استجابة النجاح (200 OK):**
  ```json
  {
    "success": true,
    "token": "kts_token_xxxxxxxxxxxx",
    "user": {
      "id": "usr-cashier-1",
      "username": "cashier1",
      "full_name": "فاطمة الكندري",
      "role": "CASHIER",
      "role_name_ar": "كاشير نقطة البيع",
      "permissions": ["pos_sale", "pos_return", "pos_hold_cart"]
    }
  }
  ```

#### `GET /api/auth/me`
- **الوصف:** استرجاع بيانات الجلسة الحالية والتحقق من صلاحية التوكن.
- **استجابة النجاح (200 OK):**
  ```json
  {
    "authenticated": true,
    "user": { ... }
  }
  ```

---

### 2. مسارات نقطة البيع والمبيعات (`/api/pos`)

#### `POST /api/pos/checkout`
- **الوصف:** إتمام عملية البيع الذرية، خصم المخزون، وتوليد الفاتورة.
- **جسم الطلب (Request Body):**
  ```json
  {
    "client_transaction_id": "c1f8a845-728b-4b20-8025-a7b2d56d11b3",
    "shift_id": "shf-20261011-01",
    "member_id": "mem-001",
    "selected_discount_rule_id": "disc-1",
    "items": [
      {
        "product_id": "prod-101",
        "qty": 2,
        "unit_price": 1.250
      },
      {
        "product_id": "prod-205",
        "qty": 1,
        "unit_price": 0.750
      }
    ],
    "subtotal": 3.250,
    "discount_total": 0.488,
    "net_total": 2.762,
    "paid_amount": 2.762,
    "payments": [
      { "payment_method": "cash", "amount": 1.381 },
      { "payment_method": "knet", "amount": 1.381 }
    ],
    "notes": ""
  }
  ```
- **استجابة النجاح (201 Created):**
  ```json
  {
    "success": true,
    "invoice": {
      "id": "sal-20261011-0001",
      "invoice_no": "INV-20261011-0001",
      "net_total": 2.762,
      "paid_amount": 2.762,
      "change_due": 0.000,
      "created_at": "2026-10-11 20:30:15",
      "cashier_name": "فاطمة الكندري",
      "items_count": 2
    }
  }
  ```

#### `POST /api/pos/hold-cart`
- **الوصف:** تعليق السلة الحالية لحساب عميل آخر.
- **جسم الطلب:**
  ```json
  {
    "shift_id": "shf-20261011-01",
    "member": { "id": "mem-001", "name": "د. يوسف أحمد الكندري" },
    "items": [ ... ],
    "notes": "سلة معلقة رقم 1"
  }
  ```
- **استجابة النجاح (200 OK):**
  ```json
  {
    "success": true,
    "cart_ref": "CART-847291",
    "held_at": "2026-10-11 20:35:00"
  }
  ```

#### `GET /api/pos/held-carts`
- **الوصف:** استرجاع جميع السلات المعلقة المتاحة للوردية الحالية.

#### `DELETE /api/pos/held-carts/:id`
- **الوصف:** حذف أو استرجاع سلة معلقة بعد إعادتها إلى شاشة الكاشير.

---

### 3. مسارات المنتجات والفئات والباركود (`/api/products`, `/api/categories`)

#### `GET /api/products/search?q=:term`
- **الوصف:** البحث السريع الفوري بالباركود، رمز SKU، أو اسم الصنف (عربي/إنجليزي).
- **استجابة النجاح (200 OK):**
  ```json
  [
    {
      "id": "prod-101",
      "sku": "NB-A4-200S",
      "name_ar": "دفتر سلك جامعي A4 عدد 200 ورقة عربي غلاف مقوى",
      "sale_price": 1.250,
      "cost_price": 0.850,
      "category_id": "cat-3",
      "category_name": "دفاتر وكشاكيل مدرسية",
      "qty_on_hand": 149,
      "is_discountable": 1,
      "image_url": "images/products/nb_a4_200.png",
      "barcodes": ["6281001234567", "6281001234568"]
    }
  ]
  ```

#### `GET /api/products/category/:categoryId`
- **الوصف:** جلب قائمة أصناف الفئة المحددة للكتالوج البصري.

#### `POST /api/products` (يدعم `multipart/form-data`)
- **الوصف:** إضافة منتج جديد مع دعم إدخال باركودات متعددة، واختيار رفع صورة من الجهاز أو رابط.
- **الحقول:** `sku`, `name_ar`, `name_en`, `category_id`, `sale_price`, `cost_price`, `min_stock_alert`, `is_discountable`, `barcodes` (مصفوفة نصية), `image` (ملف اختياري), `image_url` (رابط اختياري).

#### `PUT /api/products/:id`
- **الوصف:** تعديل بيانات المنتج وتحديث أسعاره وصوره.

#### `DELETE /api/products/:id`
- **الوصف:** حذف منتج (أو تعطيله في حال وجود مبيعات تاريخية مرتبطة لمنع كسر التكامل).

#### `GET /api/categories`
- **الوصف:** جلب كافة فئات القرطاسية الخمس الأساسية والفئات الفرعية مع صورها وإحصائيات الأصناف التابعة.

#### `POST /api/categories` و `PUT /api/categories/:id`
- **الوصف:** إضافة وتعديل الفئات مع دعم رفع صور مخصصة لكل فئة.

---

### 4. مسارات الأعضاء والخصومات (`/api/members`, `/api/discounts`)

#### `GET /api/members/search-pos?q=:term`
- **الوصف:** التحقق السريع من العضو في شاشة الكاشير بالرقم المدني، رقم العضوية، أو الهاتف.
- **استجابة النجاح (200 OK):**
  ```json
  [
    {
      "id": "mem-001",
      "membership_no": "KTS-M001",
      "civil_id": "285010101234",
      "name": "د. يوسف أحمد الكندري",
      "category_id": "mcat-1",
      "category_name": "معلم عامل",
      "phone": "99887766",
      "is_eligible_for_discount": 1,
      "status": "active"
    }
  ]
  ```

#### `GET /api/discounts/rules`
- **الوصف:** جلب كافة قواعد الخصم المعتمدة النشطة لعرضها في النافذة المنبثقة.
- **استجابة النجاح (200 OK):**
  ```json
  [
    {
      "id": "disc-1",
      "code": "RULE-TEACHER-15",
      "name_ar": "خصم استثنائي معتمد للمهرجان السنوي (30%)",
      "type": "percentage",
      "value": 30.0,
      "scope": "membership_category",
      "min_spend": 0.0,
      "max_discount": null,
      "status": "active"
    }
  ]
  ```

#### `POST /api/discounts/calculate-cart`
- **الوصف:** استدعاء محرك الخصومات لحساب الإجماليات بدقة لجميع الأصناف في السلة.
- **جسم الطلب:**
  ```json
  {
    "items": [ ... ],
    "member": { ... },
    "selected_discount_rule_id": "disc-1"
  }
  ```
- **استجابة النجاح (200 OK):**
  ```json
  {
    "subtotal": 3.250,
    "discount_total": 0.488,
    "net_total": 2.762,
    "items": [
      {
        "product_id": "prod-101",
        "qty": 2,
        "unit_price": 1.250,
        "discount_amount": 0.375,
        "line_total": 2.125,
        "applied_rule_id": "disc-1"
      }
    ]
  }
  ```

---

### 5. مسارات الورديات وجداول الدوام (`/api/shifts`)

#### `GET /api/shifts/current`
- **الوصف:** جلب حالة الوردية الحالية المفتوحة للكاشير المسجل.

#### `POST /api/shifts/open`
- **الوصف:** فتح وردية جديدة بالرصيد الافتتاحي للنقدية.
- **جسم الطلب:** `{ "opening_cash": 50.000, "notes": "افتتاح الفترة الصباحية" }`

#### `POST /api/shifts/close`
- **الوصف:** إغلاق الوردية ومطابقة النقد الفعلي بالمتوقع.
- **جسم الطلب:** `{ "actual_cash": 284.500, "notes": "تم الجرد والمطابقة" }`
- **استجابة النجاح:**
  ```json
  {
    "success": true,
    "expected_cash": 284.500,
    "actual_cash": 284.500,
    "discrepancy": 0.000,
    "status": "closed",
    "closed_at": "2026-10-11 22:00:00"
  }
  ```

#### `GET /api/shifts/schedules` و `POST /api/shifts/schedules`
- **الوصف:** إدارة جداول دوام الكاشيرات الأسبوعية (صباحي / مسائي / كامل).

---

### 6. مسارات المرتجعات (`/api/returns`)

#### `GET /api/returns/verify-invoice/:invoiceNo`
- **الوصف:** التحقق من صلاحية الفاتورة المراد إرجاع أصناف منها وعرض الكميات القابلة للإرجاع.

#### `POST /api/returns`
- **الوصف:** إتمام عملية المرتجع واسترداد النقدية أو كي نت وتحديث المخزون.
- **جسم الطلب:**
  ```json
  {
    "sale_id": "sal-20261011-0001",
    "shift_id": "shf-20261011-01",
    "reason": "خطأ في مقاس الكشكول",
    "items": [
      {
        "sale_line_id": "sline-101",
        "product_id": "prod-101",
        "qty": 1,
        "refund_amount": 0.875,
        "item_condition": "good"
      }
    ]
  }
  ```

---

### 7. مسارات التقارير وتصدير Excel (`/api/reports`)

#### `GET /api/reports/sales-daily?date=YYYY-MM-DD`
- **الوصف:** تقرير المبيعات اليومي المفصل.

#### `GET /api/reports/sales-summary?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **الوصف:** التقرير التجميعي الشامل حسب الكاشير والفئات وقنوات الدفع.

#### `GET /api/reports/export-excel?type=daily&date=YYYY-MM-DD`
- **الوصف:** تحميل ملف Excel الرسمي المنسق بشعار جمعية المعلمين وهوية الخطوط والحسابات التلقائية.
- **نوع المحتوى المرتجع:** `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.
