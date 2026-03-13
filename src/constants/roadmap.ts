export interface RoadmapStage {
  id: string;
  title: string;
  titleEn: string;
  goal: string;
  required: string;
  icon: string;
  color: string;
}

export const STARTUP_ROADMAP: RoadmapStage[] = [
  {
    id: 'opportunity',
    title: 'تحديد الفرصة',
    titleEn: 'Opportunity Identification',
    goal: 'البحث عن مشكلة حقيقية في السوق أو حاجة غير ملباة، أو فرصة يمكن استغلالها.',
    required: 'ملاحظة الفجوات في السوق، أو الاستماع لشكاوى العملاء، أو متابعة التوجهات الجديدة.',
    icon: 'Search',
    color: 'blue'
  },
  {
    id: 'development',
    title: 'تطوير الفكرة',
    titleEn: 'Idea Development',
    goal: 'تحويل المشكلة أو الفرصة إلى مفهوم منتج أو خدمة قابلة للتنفيذ.',
    required: 'العصف الذهني، تحديد ميزات المنتج، وصياغة فكرة أولية واضحة.',
    icon: 'Lightbulb',
    color: 'yellow'
  },
  {
    id: 'validation',
    title: 'التحقق من السوق',
    titleEn: 'Market Validation',
    goal: 'التأكد من أن الفكرة لها طلب حقيقي وأن العملاء مستعدون لشرائها.',
    required: 'إجراء مقابلات، استبيانات، دراسة المنافسين، وتحليل حجم السوق المستهدف.',
    icon: 'CheckCircle',
    color: 'green'
  },
  {
    id: 'business-model',
    title: 'تصميم نموذج العمل',
    titleEn: 'Business Model Design',
    goal: 'تحديد كيفية كسب المال من المشروع (الإيرادات) وهيكل التكاليف.',
    required: 'اختيار نموذج الإيرادات المناسب (مثل الاشتراكات، البيع المباشر، الإعلانات) ورسم خطة العمل الأولية.',
    icon: 'Layout',
    color: 'purple'
  },
  {
    id: 'mvp',
    title: 'بناء المنتج الأدنى (MVP)',
    titleEn: 'Minimum Viable Product',
    goal: 'تطوير نسخة مبسطة من المنتج تحتوي على الوظائف الأساسية فقط، لإطلاقها بأقل جهد وتكلفة.',
    required: 'التركيز على الميزات الأساسية التي تحل المشكلة الرئيسية، وتجنب التعقيد.',
    icon: 'Box',
    color: 'orange'
  },
  {
    id: 'testing',
    title: 'الاختبار والتعلم',
    titleEn: 'Testing & Learning',
    goal: 'جمع ردود فعل المستخدمين الأوائل على المنتج، والتعلم من أدائه في السوق.',
    required: 'تحليل البيانات، الاستماع للملاحظات، وإجراء تحسينات سريعة بناءً على ما تتعلمه.',
    icon: 'FlaskConical',
    color: 'cyan'
  },
  {
    id: 'scaling',
    title: 'توسيع المشروع',
    titleEn: 'Scaling the Venture',
    goal: 'بعد التأكد من نجاح النموذج، يتم التوسع في العمليات والتسويق والوصول لشرائح أكبر.',
    required: 'زيادة فريق العمل، الدخول لأسواق جديدة، تحسين البنية التحتية، وزيادة الاستثمارات.',
    icon: 'TrendingUp',
    color: 'red'
  }
];
