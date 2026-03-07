import React from 'react';

export const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0C0E] text-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <h1 className="text-4xl font-bold mb-8 text-[#FFD700]">شروط الاستخدام</h1>
        <p className="text-gray-400 mb-8">آخر تحديث: 6 مارس 2026</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">1. قبول الشروط</h2>
          <p className="text-gray-300">
            باستخدامك لمنصة رواد فيرس، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء منها، يرجى عدم استخدام المنصة.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">2. الحسابات والتسجيل</h2>
          <p className="text-gray-300">
            يجب أن تكون المعلومات التي تقدمها دقيقة وكاملة. أنت مسؤول عن الحفاظ على سرية كلمة المرور الخاصة بحسابك وعن جميع الأنشطة التي تحدث تحت حسابك.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">3. المحتوى والملكية الفكرية</h2>
          <p className="text-gray-300">
            تحتفظ بجميع حقوق الملكية الفكرية للمحتوى الذي تنشره (مثل الأفكار والمشاريع). بمنحك ترخيصًا محدودًا لنا لعرض هذا المحتوى على المنصة لغرض التوفيق بين الشركاء.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">4. السلوك المحظور</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>نشر محتوى غير قانوني أو مسيء أو مضلل.</li>
            <li>انتحال شخصية الآخرين أو تقديم معلومات كاذبة.</li>
            <li>محاولة اختراق المنصة أو تعطيل خدماتها.</li>
            <li>استخدام المنصة لأغراض التسويق غير المصرح به (Spam).</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">5. إنهاء الخدمة</h2>
          <p className="text-gray-300">
            نحتفظ بالحق في تعليق أو إنهاء حسابك في أي وقت إذا انتهكت هذه الشروط، دون إشعار مسبق.
          </p>
        </section>
      </div>
    </div>
  );
};
