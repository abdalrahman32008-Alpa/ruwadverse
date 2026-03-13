# مخطط بناء Ruwadverse (Technical Blueprint)

هذا الملف هو خارطة طريق تقنية شاملة لإعادة بناء أو توسيع منصة Ruwadverse.

## 1. البنية التحتية والتقنيات (Tech Stack)
- **Frontend:** React 18+ (Vite), Tailwind CSS, Lucide Icons, Motion (for animations).
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime, Storage).
- **Deployment:** Cloud Run (via AI Studio Build).

## 2. هيكلية قاعدة البيانات (Supabase Schema)
- **profiles:** (id, user_type, onboarding_data (JSONB), raed_score, created_at, updated_at).
- **ideas:** (id, creator_id, title, description, funding_goal, status, created_at).
- **referrals:** (id, referrer_id, referee_id, created_at).

## 3. خطوات التنفيذ (Core Implementation)
1. **Setup:** تهيئة مشروع Vite مع Tailwind و Supabase.
2. **Auth:** تنفيذ نظام تسجيل الدخول (Google, Email) مع حفظ `user_metadata`.
3. **Onboarding:** تنفيذ تدفق إعداد المستخدم وحفظ البيانات في `profiles.onboarding_data`.
4. **Referral System:**
   - التقاط `ref` من URL أثناء التسجيل.
   - حفظ `referred_by` في `onboarding_data`.
   - استعلام `count` بناءً على كود الإحالة.
5. **Dashboard:** ربط لوحة التحكم ببيانات المستخدم الحقيقية.

## 4. خارطة الطريق للميزات المتقدمة (Disruptive Roadmap)

### أ. Automated Due Diligence (AI)
- **الفكرة:** التنبؤ بنجاح الشركات الناشئة بناءً على بيانات ما قبل الإطلاق.
- **الخطوات:**
  1. بناء نموذج ML (XGBoost) مدرب على بيانات Crunchbase.
  2. إنشاء API باستخدام FastAPI لاستقبال بيانات الشركة.
  3. ربط الـ API بـ Supabase لتحليل الأفكار الجديدة تلقائياً.

### ب. Hyper-Personalized Matchmaking (NLP)
- **الفكرة:** مطابقة المؤسسين بناءً على السمات النفسية (Big-5).
- **الخطوات:**
  1. استخدام Gemini API لتحليل السير الذاتية (Bios) واستخراج السمات الشخصية.
  2. تخزين السمات في `profiles` كـ JSON.
  3. استخدام خوارزميات المطابقة (Vector Similarity) في Supabase للبحث عن "شركاء متوافقين".

### ج. Dynamic Smart Contracts (Blockchain)
- **الفكرة:** توزيع الأسهم تلقائياً بناءً على المساهمات (Commits, Revenue).
- **الخطوات:**
  1. ربط GitHub API لتتبع الـ Commits.
  2. إنشاء Smart Contract على Ethereum/Polygon.
  3. استخدام Oracle لتغذية العقد الذكي ببيانات الأداء من Supabase.

---
*ملاحظة: هذا الملف هو مرجع تقني. للتنفيذ، ابدأ بتثبيت الحزم اللازمة لكل ميزة واستخدم Supabase كـ Source of Truth.*
