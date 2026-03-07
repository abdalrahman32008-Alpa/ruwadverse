import React from 'react';

export const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1 className="text-4xl font-bold mb-8 text-[#FFD700]">سياسة الخصوصية</h1>
        <p className="text-gray-400 mb-8">آخر تحديث: 6 مارس 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">1. مقدمة</h2>
          <p className="text-gray-300">
            نحن في رواد فيرس نلتزم بحماية خصوصيتك وبياناتك الشخصية. توضح هذه السياسة كيفية جمعنا واستخدامنا وحمايتنا لمعلوماتك عند استخدامك لمنصتنا.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">2. البيانات التي نجمعها</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>المعلومات الشخصية (الاسم، البريد الإلكتروني، رقم الهاتف).</li>
            <li>بيانات الملف المهني (المهارات، الخبرات، المشاريع).</li>
            <li>تفاصيل الأفكار والمشاريع التي تقوم بإضافتها.</li>
            <li>بيانات التفاعل والاستخدام للمنصة.</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">3. كيف نستخدم بياناتك</h2>
          <p className="text-gray-300">
            نستخدم البيانات لتقديم خدماتنا، وتحسين تجربة المستخدم، ومطابقة الشركاء المناسبين باستخدام خوارزميات الذكاء الاصطناعي (RAED)، ولأغراض الأمان والامتثال القانوني.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">4. مشاركة البيانات</h2>
          <p className="text-gray-300">
            لا نقوم ببيع بياناتك لأطراف ثالثة. قد نشارك بعض المعلومات مع شركاء موثوقين فقط لغرض تقديم الخدمة (مثل معالجة المدفوعات أو الاستضافة السحابية) وبموجب اتفاقيات سرية صارمة.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">5. حقوقك</h2>
          <p className="text-gray-300">
            لك الحق في الوصول إلى بياناتك، وتصحيحها، وحذفها، والاعتراض على معالجتها في أي وقت من خلال إعدادات حسابك أو التواصل معنا.
          </p>
        </section>
      </div>
    </div>
  );
};
