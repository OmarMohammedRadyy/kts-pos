# KTS POS
## Frontend Architecture & Institutional Experience Design System — V2

### 1. فلسفة التصميم الجديدة

يتم تطوير واجهة **KTS POS** باعتبارها **Retail Operations Workspace** وليست Dashboard تقليدية.

الهدف هو بناء واجهة مؤسسية كويتية حديثة تجمع بين:

**Operational Clarity × Premium Institutional Design × High-Density Retail UX × Fast Cashier Interaction**

ويجب أن تبدو الواجهة كمنتج مؤسسي صُمم خصيصًا لجمعية المعلمين الكويتية، وليس كقالب Admin Dashboard أو تصميم مولّد بالذكاء الاصطناعي.

الهوية الجديدة تتجنب عمدًا:

- الـAI gradients.
- البنفسجي والنيون.
- Glassmorphism.
- البطاقات العائمة المبالغ فيها.
- الأيقونات ثلاثية الأبعاد.
- Emoji.
- Glow effects.
- كثرة الـRounded Cards.
- الشكل المعتاد لتطبيقات SaaS الجاهزة.

وتتبنى بدلًا منها:

- هندسة بصرية دقيقة.
- مساحات هادئة.
- خطوط مؤسسية قوية.
- Surfaces متدرجة وظيفيًا.
- حدود دقيقة.
- Contrast محسوب.
- Information Density مرتفعة ولكن منظمة.
- حركة قصيرة جدًا وهادفة.
- تصميم عربي RTL أصيل.

---

# 2. الهوية البصرية الجديدة

يتم التخلي عن اعتماد الكحلي + البرتقالي بالصورة التقليدية الموجودة حاليًا في الوثيقة، والتي تعرف `#0f2238` كلون Primary و`#ea580c` كلون Accent. 04_FRONTEND_ARCHITECTURE_AND_UI…

ويتم بناء هوية أكثر نضجًا باسم:

## KTS Institutional Slate

```css
:root {

  /* ==================================================
     KTS INSTITUTIONAL SLATE — CORE
     ================================================== */

  --ink-950: #101820;
  --ink-900: #18222C;
  --ink-800: #24313D;
  --ink-700: #344451;

  /* Association Heritage Accent */
  --heritage-700: #9A542E;
  --heritage-600: #B76538;
  --heritage-100: #F6EDE7;

  /* Warm Institutional Surfaces */
  --canvas: #F3F2EE;
  --surface-01: #FAFAF8;
  --surface-02: #FFFFFF;
  --surface-03: #ECECE8;
  --surface-hover: #F0F0EC;
  --surface-selected: #E7EAEB;

  /* Typography */
  --text-primary: #172027;
  --text-secondary: #5C666D;
  --text-tertiary: #858C91;
  --text-inverse: #FFFFFF;

  /* Structural Lines */
  --line-soft: #E4E3DE;
  --line-default: #D6D6D0;
  --line-strong: #BFC2C1;

  /* Functional */
  --success: #28755C;
  --success-soft: #E8F3EE;

  --warning: #A56A19;
  --warning-soft: #F8F0E1;

  --danger: #B33A3A;
  --danger-soft: #F8E9E8;

  --info: #3C647A;
  --info-soft: #E8F0F4;

  /* Geometry */
  --radius-xs: 4px;
  --radius-sm: 6px;
  --radius-md: 9px;
  --radius-lg: 12px;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;

  /* Motion */
  --motion-fast: 120ms;
  --motion-normal: 170ms;

  /* Typography */
  --font-ui:
      'IBM Plex Sans Arabic',
      'Noto Sans Arabic',
      'Segoe UI',
      sans-serif;

  --font-numeric:
      'IBM Plex Sans Arabic',
      'Segoe UI',
      sans-serif;
}
```

### الشخصية اللونية

اللون الداكن هنا ليس "أزرق تطبيقات"، بل **Charcoal Institutional Ink**.

واللون الدافئ لا يستخدم كـCTA في كل مكان، بل كـ**Heritage Accent** محدود مستوحى من الطابع الرسمي للجمعية.

الخلفية ليست أبيض ناصعًا أو رمادي SaaS باردًا، بل **Warm Architectural Canvas**.

والنتيجة:

> مكتبة مؤسسية حديثة + نظام مالي تشغيلي + هوية كويتية رسمية.

---

# 3. Typography System

يتم تغيير فلسفة الخط من مجرد Cairo في كل شيء إلى Typography System أكثر مؤسسية.

## الخط الأساسي

**IBM Plex Sans Arabic** إن كان متاحًا محليًا ومسموحًا ضمن المشروع.

Fallback:

```css
font-family:
  'IBM Plex Sans Arabic',
  'Noto Sans Arabic',
  'Segoe UI',
  sans-serif;
```

ولا تتم إضافة dependency خارجية إن لم تكن موجودة؛ في هذه الحالة يتم استخدام أفضل خط متاح بالفعل.

### المستويات

| المستوى | الحجم | الوزن |
|---|---:|---:|
| Display Total | 30px | 700 |
| Page Heading | 20px | 650 |
| Section Heading | 15px | 650 |
| Product Name | 14px | 600 |
| UI Body | 13px | 450–500 |
| Secondary | 12px | 450 |
| Metadata | 11px | 450 |
| Keyboard Badge | 10–11px | 600 |

الأرقام المالية تستخدم:

```css
font-variant-numeric: tabular-nums;
```

حتى تبقى:

`0.350`
`10.750`
`125.000`

مصطفة بصريًا.

---

# 4. هندسة الشاشة الجديدة

بدل الإحساس الحالي بـ:

> Header + Boxes + Boxes داخل Boxes

تصبح الشاشة:

```text
┌────────────────────────────────────────────────────────────────────────────────────┐
│                         KTS OPERATIONS BAR                                          │
├──────────────────────────────────────────────────────────────┬─────────────────────┤
│                                                              │ MEMBER CONTEXT      │
│  PRODUCT COMMAND                                             ├─────────────────────┤
│                                                              │                     │
│  CATEGORY RAIL                                               │ TRANSACTION CART    │
│                                                              │                     │
│  CATALOG CONTEXT                                             │                     │
│                                                              │                     │
│  PRODUCT WORKSPACE                                           │                     │
│                                                              ├─────────────────────┤
│                                                              │ PAYMENT             │
│                                                              ├─────────────────────┤
│                                                              │ TOTAL + CHECKOUT    │
└──────────────────────────────────────────────────────────────┴─────────────────────┘
```

النسب الجديدة:

```css
grid-template-columns:
  minmax(0, 1fr)
  clamp(360px, 25vw, 440px);
```

بدل الاعتماد الجامد على النسب فقط.

وهذا يحافظ على فلسفة التقسيم الموجودة حاليًا، لكن يجعل Transaction Rail أكثر ثباتًا بينما يستفيد الكتالوج من بقية المساحة.

---

# 5. KTS Operations Bar

الترويسة الحالية محددة بـ58px وتتضمن الشعار والتنقل والحالة والوردية والكاشير والاختصارات. 04_FRONTEND_ARCHITECTURE_AND_UI…

في التصميم الجديد تصبح:

## Operations Bar — 68px

ثلاث مناطق واضحة:

**Brand / Workspace Navigation / Session Context**

بدون مجموعة Buttons منفصلة.

### Brand Zone

شعار الجمعية بحجم محسوب.

بجواره:

**جمعية المعلمين الكويتية**

وتحتها بخط صغير:

`KTS / Retail Operations`

بدل جعل الاسم الفرعي طويلًا ومنافسًا للمحتوى.

### Navigation

شاشة الكاشير  
المرتجعات  
الإدارة والمخزون

تصبح **Text Navigation** مؤسسية.

الحالة النشطة لا توضع داخل زر ضخم.

بل:

```text
شاشة الكاشير
──────────
```

Indicator دقيق أسفلها.

### Session Context

تظهر:

`وردية 13`

`غير متصل`

`أحمد محمد`

مع separators رأسية رفيعة.

---

# 6. Offline / Online Presence

بدل Badge أحمر كبير:

```text
● غير متصل
```

نقطة 7px + النص.

Offline:

```css
color: var(--danger);
background: var(--danger-soft);
```

Online:

```css
color: var(--success);
```

وبذلك تكون الحالة واضحة دون سرقة الانتباه من عملية البيع.

---

# 7. Product Command Surface

يتم تحويل البحث إلى **Command Surface** وليس Input عادي.

ارتفاع:

`56px`

يمتد بعرض Product Workspace تقريبًا بالكامل.

```text
[ Barcode ]   امسح الباركود أو ابحث باسم الصنف / SKU                F2
```

لا يوجد زر Search ضخم ما لم تكن الوظيفة الحالية تتطلبه.

Focus:

```css
border-color: var(--ink-700);
box-shadow: 0 0 0 3px rgba(... very subtle ...);
```

بدون glow.

ويظل `posSearchInput` ووظائف Enter وF2 وLive Search كما هي تمامًا؛ فالوثيقة الحالية تنص صراحة على هذه السلوكيات. 04_FRONTEND_ARCHITECTURE_AND_UI…

---

# 8. Live Search Overlay

نتائج البحث لا تظهر كـDropdown تقليدي طويل.

تصبح **Command Results Panel**.

كل نتيجة:

```text
[IMAGE]   دفتر سلك جامعي A4
          NB-A4-200S

          متوفر 149                 1.250 د.ك
```

ارتفاع النتيجة 58–64px.

Keyboard highlight واضح.

Enter يظل ينفذ السلوك الحالي.

---

# 9. Category Rail

الفئات الخمس الحالية ووظيفة الفلترة الفورية تبقى كما هي تمامًا. 04_FRONTEND_ARCHITECTURE_AND_UI…

لكن Presentation يتغير جذريًا.

لا Cards كبيرة.

تصبح:

```text
الكل     هندسة ورسم     أقلام وكتابة     دفاتر     ملفات     مكتبية وحاسوبية
         10 أصناف        10 أصناف        10         10        10
```

كل عنصر يتكون من:

Icon 20–22px  
Category name  
Count صغير

Active Category:

- خط سفلي Heritage.
- النص يصبح Ink-950.
- Background طفيف جدًا.

بدون ألوان زرقاء كبيرة.

---

# 10. Iconography

يتم اعتماد نظام:

**Monoline Institutional SVG**

خصائصه:

```text
Stroke: 1.7–1.9px
Corners: controlled rounded
No fill-heavy icons
No emoji
No 3D
No gradients
No AI sparkle
```

الأحجام:

Navigation: 18px  
Input: 18px  
Category: 21px  
Action: 17px  
Empty State: 30px

ويظل شرط الوثيقة الحالية بعدم استخدام Emoji في بطاقة العضوية قائمًا. 04_FRONTEND_ARCHITECTURE_AND_UI…

---

# 11. Catalog Context Bar

بين الفئات والمنتجات يظهر خط Context بسيط:

```text
دفاتر وكشاكيل مدرسية

1,240 صنف                     عرض: شبكة  ▦     ترتيب ▾
```

لا يتحول إلى Toolbar ثقيل.

وظائف F3 الحالية لا تتغير؛ إذ يظل F3 مسؤولًا عن التبديل بين الكتالوج وجدول السلة وفق الوثيقة. 04_FRONTEND_ARCHITECTURE_AND_UI…

---

# 12. Product Workspace

يتم استخدام CSS Grid مرن:

```css
grid-template-columns:
repeat(auto-fill, minmax(170px, 1fr));
```

مع تحديد Maximum Card Width عند الحاجة.

على 1920×1080:

**5–6 منتجات** تقريبًا في الصف وفق عرض Transaction Rail.

الهدف ليس جعل Cards أكبر، بل:

> رؤية منتجات أكثر مع قراءة أسرع.

---

# 13. Product Card — التصميم الجديد

البطاقة تصبح شبه Flat.

```text
┌──────────────────────┐
│                      │
│      PRODUCT         │
│       IMAGE          │
│                      │
│ دفتر سلك جامعي A4    │
│ 200 ورقة             │
│                      │
│ NB-A4-200S            │
│                      │
│ متوفر 149             │
│                      │
│ 1.250 د.ك        ＋   │
└──────────────────────┘
```

لا يوجد Button أزرق ضخم.

لا يوجد Price Box.

لا يوجد Shadow واضح حول كل بطاقة.

الحد:

`1px solid var(--line-soft)`

Hover:

```css
border-color: var(--line-strong);
transform: translateY(-1px);
```

فقط.

---

# 14. Product Imagery

الصورة داخل مساحة ثابتة بنسبة تقريبية:

`4:3`

```css
object-fit: contain;
```

الخلفية:

`surface-01`

إذا لم توجد صورة، يستخدم Placeholder بسيط جدًا.

شعار الجمعية لا ينبغي أن يصبح العنصر البصري المهيمن على عشرات المنتجات المتجاورة.

لكن **لا يتغير fallback logic الحالي**.

---

# 15. Product Information Architecture

الترتيب الإجباري:

**Product Name**

ثم:

`SKU`

ثم:

Stock State

ثم:

**Price**

### اسم المنتج

سطران بحد أقصى.

### SKU

```css
font-size: 11px;
color: var(--text-tertiary);
direction: ltr;
```

### Stock

بدل Badge أخضر ممتلئ:

```text
● متوفر 149
```

أو:

```text
● مخزون منخفض 4
```

### السعر

```text
1.250 د.ك
```

17–18px / 700.

---

# 16. Add Product Interaction

بدل زر سلة ضخم، يستخدم:

`＋`

داخل Action Button صغير 34×34.

لكن كامل البطاقة يمكن أن تظل Clickable إذا كان هذا هو السلوك الحالي.

عند الإضافة:

Border يتحول للحظة إلى Heritage.

ثم يعود خلال:

`170ms`

بدون Animation استعراضية.

---

# 17. Transaction Rail

هذه أكبر إعادة هندسة بصرية.

الـSidebar لا يبدو كأربعة Cards مستقلة.

بل يصبح **Transaction Rail واحدًا**.

```text
MEMBER
────────────────

CART
────────────────

PAYMENT
────────────────

SUMMARY
────────────────

CHECKOUT
```

الفصل يتم بواسطة:

spacing + hairline divider

وليس Card داخل Card.

---

# 18. Member Context

قبل اختيار عضو:

```text
العضوية

┌────────────────────────────┐
│ رقم العضوية           F8   │
└────────────────────────────┘

[ تحقق ]
```

بعد نجاح التحقق:

```text
● عضوية معتمدة

أحمد عبدالله محمد
123456

عضو عامل
خصم العضوية                     10%
```

لا Avatar ضخم.

لا Profile Card يشبه Social Media.

الهوية هنا **Transaction Context** وليست صفحة Profile.

وظيفة `member-profile-card` والخصم النشط تبقى كما هي منطقيًا. 04_FRONTEND_ARCHITECTURE_AND_UI…

---

# 19. Discount Interaction

بطاقة الخصم تصبح:

```text
الخصم المطبق
خصم العضوية                         10%
```

كل السطر Clickable.

Chevron صغير.

ويفتح نفس:

`#memberDiscountModal`

بدون أي تغيير في المنطق.

---

# 20. Discount Modal V2

تبقى كل خيارات الخصم الحالية كما هي، بما فيها 0% والخصومات المعتمدة وزر اعتماد الخصم. 04_FRONTEND_ARCHITECTURE_AND_UI…

لكن النافذة تصبح أكثر مؤسسية.

عرض:

`520–560px`

Header:

```text
خيارات الخصم
أحمد عبدالله محمد · 123456
```

ثم خيارات تشبه Selection Rows بدل بطاقات كبيرة:

```text
○ بدون خصم                                      0%
──────────────────────────────────────────────────
● خصم العضوية                                  10%
──────────────────────────────────────────────────
○ خصم معتمد آخر                                20%
```

Footer:

`إلغاء` — Text/Secondary

`اعتماد الخصم` — Primary Ink Button

Backdrop مظلم بنسبة منخفضة.

بدون Glassmorphism.

---

# 21. Cart Architecture

السلة تصبح أكثر كثافة.

Header:

```text
السلة                              7 قطع
```

ثم Rows.

```text
دفتر مدرسي A4
0.750 د.ك

−    2    +                     1.500
```

مع زر إزالة صغير.

لا تستخدم Product Cards داخل Cart.

---

# 22. Empty Cart

عند عدم وجود أصناف:

أيقونة Basket line صغيرة.

**السلة فارغة**

`امسح الباركود أو اختر صنفًا من الكتالوج`

بدون Illustration.

---

# 23. Large Cart UX

السلة تصبح:

```css
overflow-y: auto;
min-height: 0;
```

وتستوعب:

1  
5  
15  
30  
50+

عنصرًا دون تغيير باقي الشاشة.

Header يبقى ثابتًا.

Summary وCheckout لا يختفيان.

---

# 24. Payment Method

بدل ثلاثة Buttons ثقيلة:

```text
طريقة الدفع

┌─────────────┬─────────────┬─────────────┐
│    نقدًا    │    K-Net    │ تقسيم الدفع │
└─────────────┴─────────────┴─────────────┘
```

Segmented Control.

Selected:

Ink background.

Unselected:

Transparent / Surface.

بدون أخضر للكاش.

وبدون أزرق K-Net لمجرد اللون.

الألوان هنا تدل على **الحالة** لا نوع الدفع.

---

# 25. Split Payment V2

يظل منطق الحساب المتبادل و50/50 والمطابقة كما هو تمامًا؛ هذه وظائف منصوص عليها أصلًا في الوثيقة. 04_FRONTEND_ARCHITECTURE_AND_UI…

Presentation الجديد:

```text
تقسيم المبلغ

نقدًا
┌─────────────┐
│ 2.000 د.ك   │
└─────────────┘

K-Net
┌─────────────┐
│ 1.550 د.ك   │
└─────────────┘

[ توزيع بالتساوي ]

المبلغ موزع بالكامل                         ✓
```

لا نقاط زرقاء/خضراء كبيرة.

---

# 26. Transaction Summary

يتم التخلص من ثلاثة أرقام ضخمة متنافسة.

تصبح:

```text
المجموع                         3.550 د.ك
الخصم                          −0.000 د.ك
──────────────────────────────────────────

الصافي المستحق
3.550 د.ك
```

الصافي هو العنصر الوحيد الكبير.

`30–32px`

---

# 27. Checkout Action

زر:

**إتمام البيع وطباعة الفاتورة**

يصبح Action Bar بعرض Transaction Rail.

```text
إتمام البيع وطباعة الفاتورة                    F10
```

ارتفاع:

`56px`

Ink-950.

لا Gradient.

لا Glow.

Hover:

Ink-800.

Pressed:

Ink-950 + subtle inset response.

Disabled:

Surface-03 + muted text.

---

# 28. Keyboard Interaction Layer

يتم الحفاظ على الاختصارات الحالية حرفيًا:

F1 — دليل الاختصارات  
F2 — البحث والباركود  
F3 — تبديل الكتالوج/السلة  
F4 — تعليق السلة  
F8 — العضوية  
F9 — السلات المعلقة  
F10 — إتمام البيع  
Esc — إغلاق النافذة

وهي الوظائف المحددة أصلًا في الوثيقة. 04_FRONTEND_ARCHITECTURE_AND_UI…

لكن الـShortcut Badge يصبح:

```text
 F2
```

داخل مستطيل صغير:

```css
background: var(--surface-03);
border: 1px solid var(--line-default);
border-radius: 4px;
font-size: 10px;
```

كأنه مفتاح لوحة مفاتيح فعلي ولكن بأسلوب Minimal.

---

# 29. Navigation Motion

لا Page Transitions استعراضية.

يتم استخدام:

`120–170ms`

لـ:

- Hover
- Selection
- Tabs
- Modal entrance
- Dropdown
- Product add feedback

Modal:

Opacity + translateY(4px).

Dropdown:

Opacity + translateY(-2px).

لا:

Scale bounce  
Spring  
Blur animation  
3D motion.

---

# 30. Scroll Architecture

الشاشة نفسها لا ينبغي أن تصبح صفحة ويب طويلة.

Viewport:

`100dvh`

ثم:

**Product Workspace** → scroll مستقل.

**Cart** → scroll مستقل.

Category Rail → horizontal scroll عند الحاجة.

Top Operations Bar → ثابت.

Transaction Summary → ثابت في الجزء السفلي.

---

# 31. Responsive Desktop Matrix

### 1920×1080

Transaction Rail: 400–430px  
Products: 5–6 columns

### 1600×900

Rail: 380–410px  
Products: 4–5 columns

### 1366×768

Rail: 350–380px  
Products: 4 columns تقريبًا

يتم تقليل:

spacing

قبل تقليل:

font size.

---

# 32. Focus System

كل العناصر التفاعلية تحصل على Focus State موحد.

```css
:focus-visible {
    outline: 2px solid var(--ink-700);
    outline-offset: 2px;
}
```

لكن Inputs تستخدم Border Focus داخليًا.

يجب أن يتمكن الكاشير من تشغيل النظام بلوحة المفاتيح دون فقدان مكان المؤشر.

---

# 33. Feedback System

### Success

لا Popup أخضر ضخم.

استخدم Toast صغير:

`تمت إضافة الصنف إلى السلة`

### Warning

`المخزون منخفض`

### Error

`تعذر إتمام العملية`

### Offline

يبقى دائمًا في Operations Bar.

الحركة:

150–180ms.

---

# 34. Empty / Loading / Error States

كل منطقة لها State مخصص.

### No Products

**لا توجد أصناف مطابقة**

`جرّب البحث باسم مختلف أو SKU`

### No Member

لا تظهر Profile Placeholder ضخم.

فقط Input العضوية.

### Loading

Skeleton هندسي بسيط.

لا Spinner ضخم في منتصف الشاشة.

---

# 35. Border Philosophy

ممنوع تقريبًا:

```text
Card
  Card
    Input
    Badge
```

القاعدة الجديدة:

**Structure through space before borders.**

الأولوية:

1. Spacing
2. Typography
3. Surface
4. Divider
5. Border
6. Shadow

Shadow هو الخيار الأخير.

---

# 36. Elevation

ثلاثة مستويات فقط.

### Level 0
Page / standard surfaces

بدون Shadow.

### Level 1
Search overlay / Dropdown

Shadow خفيف.

### Level 2
Modal

Shadow أوضح.

لا Product Card shadows إلا عند Hover وبدرجة شبه غير ملحوظة.

---

# 37. RTL Engineering

الواجهة:

```css
direction: rtl;
```

لكن:

SKU  
Barcode  
Reference Numbers

تستخدم عند الحاجة:

```css
direction: ltr;
unicode-bidi: isolate;
```

العملة تبقى:

`1.250 د.ك`

ولا تسمح RTL بإعادة ترتيب الرقم.

---

# 38. Density Mode

KTS POS ليس موقعًا تسويقيًا.

لذلك يتم استخدام:

**Comfortable Operational Density**

وليس:

Ultra Spacious SaaS.

يجب أن يستطيع الكاشير رؤية:

الفئات + 10–18 منتجًا + السلة + الإجمالي + الدفع

في Viewport واحد قدر الإمكان.

---

# 39. Receipt Experience

لا يتغير منطق الفاتورة إطلاقًا.

وتظل فاتورة 80mm متضمنة بيانات الجمعية والفرع والفاتورة والوقت والوردية والكاشير والأصناف والدفع والباركود وسياسة الاسترجاع كما تحدد الوثيقة الحالية. 04_FRONTEND_ARCHITECTURE_AND_UI…

لكن Preview على الشاشة يستخدم:

Paper Surface.

```css
background: #fff;
border: 1px solid var(--line-soft);
```

بدون تصميم Decorative.

لأن المخرج النهائي Thermal Print.

---

# 40. Architecture Protection

## NON-NEGOTIABLE

هذا التحديث:

**Frontend Presentation Refactor ONLY.**

لا يجوز تغيير:

```text
Backend
Database
Database Schema
API
Endpoints
Authentication
Permissions
Odoo
Accounting Integration
Inventory Logic
Discount Logic
Member Logic
Payment Logic
Offline Logic
Synchronization Logic
Barcode Logic
Receipt Logic
Business Rules
```

ولا يجوز تغيير:

```text
posSearchInput
member-profile-card
active-discount-display-card
memberDiscountModal
split-payment-inline-box
```

أو أي IDs / selectors / hooks أخرى يعتمد عليها JavaScript، إلا في Styling غير المؤثر وظيفيًا.

---

# 41. Frontend Architecture Protection

كذلك لا يتم:

- تغيير Framework.
- Migration.
- إدخال UI Framework جديد.
- إعادة كتابة التطبيق.
- استبدال Architecture الحالية.
- إعادة تسمية Events.
- حذف DOM hooks.
- تعديل Data Contracts.
- تغيير Event Flow.

المسموح:

```text
CSS
Design Tokens
Spacing
Typography
Layout Presentation
Responsive Rules
Visual States
SVG Presentation
Micro-interactions
Accessible Styling
DOM wrappers الآمنة فقط عند الضرورة
```

---

# 42. Functional Preservation

بعد التنفيذ يجب أن تظل رحلة المستخدم:

```text
مسح باركود
      ↓
العثور على المنتج
      ↓
إضافته للسلة
      ↓
اختيار/التحقق من العضو
      ↓
تطبيق الخصم
      ↓
اختيار الدفع
      ↓
تقسيم الدفع عند الحاجة
      ↓
احتساب الإجماليات
      ↓
F10
      ↓
إتمام البيع
      ↓
طباعة الفاتورة
```

**مطابقة تمامًا للنظام الحالي.**

التغيير الوحيد:

> كيف يرى المستخدم هذه الرحلة ويتفاعل معها بصريًا.

---

# 43. Design Quality Gate

يُرفض التصميم إذا بدا مثل:

ChatGPT Clone  
AI Dashboard  
Bootstrap Admin  
Tailwind Template  
Generic SaaS  
Crypto Dashboard  
Banking App  
Gaming Interface  
Futuristic AI UI.

ويقبل فقط إذا كان الانطباع:

> **Purpose-built Kuwaiti Institutional Retail System**

---

# 44. النتيجة النهائية المطلوبة

عند فتح KTS POS بعد التطوير يجب أن يلاحظ المستخدم فورًا:

**هدوء أكبر.**

**منتجات أكثر في الشاشة.**

**حدود أقل.**

**مساحات أكثر ذكاءً.**

**قراءة أسرع.**

**سلة أكثر كفاءة.**

**أرقام مالية أوضح.**

**هوية أكثر نضجًا.**

**تنقل أسرع.**

**خطوط أكثر رسمية.**

**Hierarchy أكثر قوة.**

لكن بعد بدء البيع يجب ألا يحتاج الكاشير إلى تعلم النظام من جديد؛ لأن **منطق الاستخدام نفسه لم يتغير**.

---

## 45. Definition of Done

التطوير مكتمل فقط إذا تحقق:

- ✓ هوية KTS Institutional Slate الجديدة.
- ✓ إعادة تصميم Top Operations Bar.
- ✓ إعادة تصميم Product Command.
- ✓ Category Rail جديدة.
- ✓ Product Grid أعلى كثافة.
- ✓ Product Cards جديدة كليًا.
- ✓ Transaction Rail موحد.
- ✓ Member Context جديد.
- ✓ Discount Modal جديد بصريًا.
- ✓ Cart عالي الكثافة.
- ✓ Payment Selector جديد.
- ✓ Split Payment جديد بصريًا.
- ✓ Financial Summary أوضح.
- ✓ Checkout Action مؤسسي.
- ✓ SVG Iconography موحدة.
- ✓ RTL مضبوط.
- ✓ Keyboard UX محفوظ.
- ✓ Responsive 1920 / 1600 / 1366.
- ✓ لا AI visual clichés.
- ✓ لا Emoji.
- ✓ لا Gradients استعراضية.
- ✓ لا Glassmorphism.
- ✓ لا Backend Changes.
- ✓ لا Database Changes.
- ✓ لا API Changes.
- ✓ لا Business Logic Changes.
- ✓ لا Integration Changes.
- ✓ لا تغيير لمنطق Offline.
- ✓ لا تغيير لمنطق العضوية والخصومات.
- ✓ لا تغيير لمنطق الدفع.
- ✓ لا تغيير لمنطق الفاتورة.
- ✓ جميع اختصارات لوحة المفاتيح تعمل كما كانت.

**المبدأ النهائي:**

> **Preserve the system. Reimagine the experience.**

هذه في رأيي أنسب من مجرد تغيير ألوان الملف الحالي؛ لأنها تغيّر **لغة التصميم نفسها**: من Cards زرقاء/بيضاء تقليدية إلى واجهة Retail Operations مؤسسية ذات طابع Architectural، مع إبقاء السلوك التشغيلي الذي وثّقته كما هو.