// Internationalisation (i18n) — ossature de l'application.
// Le français est la langue de base et le repli. La liste est extensible :
// ajoutez une entrée dans LANGUAGES et un bloc de traductions dans MESSAGES.

const LANGUAGES = [
  { code: 'fr', label: 'Français', dir: 'ltr' },
  { code: 'en', label: 'English', dir: 'ltr' },
  { code: 'ar', label: 'العربية', dir: 'rtl' },
  { code: 'es', label: 'Español', dir: 'ltr' },
  { code: 'ko', label: '한국어', dir: 'ltr' },
  { code: 'zh', label: '中文（普通话）', dir: 'ltr' },
  { code: 'ru', label: 'Русский', dir: 'ltr' },
  { code: 'uk', label: 'Українська', dir: 'ltr' },
];

const MESSAGES = {
  fr: {
    'nav.home': 'Accueil', 'nav.books': 'Nos ouvrages', 'nav.pricing': 'Tarifs', 'nav.about': 'À propos',
    'nav.login': 'Connexion', 'nav.register': 'Créer un compte',
    'menu.space': 'Mon espace', 'menu.messages': 'Messages', 'menu.guide': "Guide d'utilisation",
    'menu.guides': "Guides d'utilisation", 'menu.searchCoach': 'Rechercher un coach', 'menu.profile': 'Mon profil',
    'menu.referral': 'Parrainage & gains', 'menu.admins': 'Administrateurs', 'menu.settings': 'Paramètres',
    'menu.users': 'Utilisateurs', 'menu.account': 'Mon compte', 'menu.viewParent': 'Vue Parent',
    'menu.viewCoach': 'Vue Coach', 'menu.logout': 'Déconnexion',
    'help.title': "Besoin d'aide ?", 'help.desc': "Consultez le guide d'utilisation de votre espace.", 'help.cta': 'Consulter le guide',
    'lang.title': 'Langue de lecture', 'lang.desc': "Choisissez la langue d'affichage de l'application.",
    'fab.help': 'Aide',
  },
  en: {
    'nav.home': 'Home', 'nav.books': 'Our books', 'nav.pricing': 'Pricing', 'nav.about': 'About',
    'nav.login': 'Log in', 'nav.register': 'Sign up',
    'menu.space': 'My space', 'menu.messages': 'Messages', 'menu.guide': 'User guide',
    'menu.guides': 'User guides', 'menu.searchCoach': 'Find a coach', 'menu.profile': 'My profile',
    'menu.referral': 'Referrals & earnings', 'menu.admins': 'Administrators', 'menu.settings': 'Settings',
    'menu.users': 'Users', 'menu.account': 'My account', 'menu.viewParent': 'Parent view',
    'menu.viewCoach': 'Coach view', 'menu.logout': 'Log out',
    'help.title': 'Need help?', 'help.desc': 'Read the user guide for your space.', 'help.cta': 'Open the guide',
    'lang.title': 'Reading language', 'lang.desc': 'Choose the app display language.',
    'fab.help': 'Help',
  },
  ar: {
    'nav.home': 'الرئيسية', 'nav.books': 'كتبنا', 'nav.pricing': 'الأسعار', 'nav.about': 'حول',
    'nav.login': 'تسجيل الدخول', 'nav.register': 'إنشاء حساب',
    'menu.space': 'مساحتي', 'menu.messages': 'الرسائل', 'menu.guide': 'دليل المستخدم',
    'menu.guides': 'أدلة المستخدم', 'menu.searchCoach': 'البحث عن مدرب', 'menu.profile': 'ملفي الشخصي',
    'menu.referral': 'الإحالات والأرباح', 'menu.admins': 'المسؤولون', 'menu.settings': 'الإعدادات',
    'menu.users': 'المستخدمون', 'menu.account': 'حسابي', 'menu.viewParent': 'عرض ولي الأمر',
    'menu.viewCoach': 'عرض المدرب', 'menu.logout': 'تسجيل الخروج',
    'help.title': 'تحتاج مساعدة؟', 'help.desc': 'اطّلع على دليل المستخدم الخاص بمساحتك.', 'help.cta': 'فتح الدليل',
    'lang.title': 'لغة القراءة', 'lang.desc': 'اختر لغة عرض التطبيق.',
    'fab.help': 'مساعدة',
  },
  es: {
    'nav.home': 'Inicio', 'nav.books': 'Nuestros libros', 'nav.pricing': 'Tarifas', 'nav.about': 'Acerca de',
    'nav.login': 'Iniciar sesión', 'nav.register': 'Crear cuenta',
    'menu.space': 'Mi espacio', 'menu.messages': 'Mensajes', 'menu.guide': 'Guía del usuario',
    'menu.guides': 'Guías del usuario', 'menu.searchCoach': 'Buscar un coach', 'menu.profile': 'Mi perfil',
    'menu.referral': 'Referidos y ganancias', 'menu.admins': 'Administradores', 'menu.settings': 'Configuración',
    'menu.users': 'Usuarios', 'menu.account': 'Mi cuenta', 'menu.viewParent': 'Vista Padre',
    'menu.viewCoach': 'Vista Coach', 'menu.logout': 'Cerrar sesión',
    'help.title': '¿Necesitas ayuda?', 'help.desc': 'Consulta la guía del usuario de tu espacio.', 'help.cta': 'Abrir la guía',
    'lang.title': 'Idioma de lectura', 'lang.desc': 'Elige el idioma de la aplicación.',
    'fab.help': 'Ayuda',
  },
  ko: {
    'nav.home': '홈', 'nav.books': '도서', 'nav.pricing': '요금', 'nav.about': '소개',
    'nav.login': '로그인', 'nav.register': '회원가입',
    'menu.space': '내 공간', 'menu.messages': '메시지', 'menu.guide': '사용 설명서',
    'menu.guides': '사용 설명서', 'menu.searchCoach': '코치 찾기', 'menu.profile': '내 프로필',
    'menu.referral': '추천 및 수익', 'menu.admins': '관리자', 'menu.settings': '설정',
    'menu.users': '사용자', 'menu.account': '내 계정', 'menu.viewParent': '학부모 보기',
    'menu.viewCoach': '코치 보기', 'menu.logout': '로그아웃',
    'help.title': '도움이 필요하세요?', 'help.desc': '내 공간의 사용 설명서를 확인하세요.', 'help.cta': '가이드 열기',
    'lang.title': '표시 언어', 'lang.desc': '앱 표시 언어를 선택하세요.',
    'fab.help': '도움말',
  },
  zh: {
    'nav.home': '首页', 'nav.books': '我们的图书', 'nav.pricing': '价格', 'nav.about': '关于',
    'nav.login': '登录', 'nav.register': '注册',
    'menu.space': '我的空间', 'menu.messages': '消息', 'menu.guide': '用户指南',
    'menu.guides': '用户指南', 'menu.searchCoach': '寻找教练', 'menu.profile': '我的资料',
    'menu.referral': '推荐与收益', 'menu.admins': '管理员', 'menu.settings': '设置',
    'menu.users': '用户', 'menu.account': '我的账户', 'menu.viewParent': '家长视图',
    'menu.viewCoach': '教练视图', 'menu.logout': '退出登录',
    'help.title': '需要帮助？', 'help.desc': '查看您空间的用户指南。', 'help.cta': '打开指南',
    'lang.title': '阅读语言', 'lang.desc': '选择应用显示语言。',
    'fab.help': '帮助',
  },
  ru: {
    'nav.home': 'Главная', 'nav.books': 'Наши книги', 'nav.pricing': 'Тарифы', 'nav.about': 'О нас',
    'nav.login': 'Вход', 'nav.register': 'Создать аккаунт',
    'menu.space': 'Мой кабинет', 'menu.messages': 'Сообщения', 'menu.guide': 'Руководство пользователя',
    'menu.guides': 'Руководства пользователя', 'menu.searchCoach': 'Найти коуча', 'menu.profile': 'Мой профиль',
    'menu.referral': 'Рефералы и доходы', 'menu.admins': 'Администраторы', 'menu.settings': 'Настройки',
    'menu.users': 'Пользователи', 'menu.account': 'Мой аккаунт', 'menu.viewParent': 'Просмотр (родитель)',
    'menu.viewCoach': 'Просмотр (коуч)', 'menu.logout': 'Выйти',
    'help.title': 'Нужна помощь?', 'help.desc': 'Откройте руководство пользователя вашего кабинета.', 'help.cta': 'Открыть руководство',
    'lang.title': 'Язык интерфейса', 'lang.desc': 'Выберите язык отображения приложения.',
    'fab.help': 'Помощь',
  },
  uk: {
    'nav.home': 'Головна', 'nav.books': 'Наші книги', 'nav.pricing': 'Тарифи', 'nav.about': 'Про нас',
    'nav.login': 'Увійти', 'nav.register': 'Створити акаунт',
    'menu.space': 'Мій кабінет', 'menu.messages': 'Повідомлення', 'menu.guide': 'Посібник користувача',
    'menu.guides': 'Посібники користувача', 'menu.searchCoach': 'Знайти коуча', 'menu.profile': 'Мій профіль',
    'menu.referral': 'Реферали та доходи', 'menu.admins': 'Адміністратори', 'menu.settings': 'Налаштування',
    'menu.users': 'Користувачі', 'menu.account': 'Мій акаунт', 'menu.viewParent': 'Перегляд (батьки)',
    'menu.viewCoach': 'Перегляд (коуч)', 'menu.logout': 'Вийти',
    'help.title': 'Потрібна допомога?', 'help.desc': 'Перегляньте посібник користувача вашого кабінету.', 'help.cta': 'Відкрити посібник',
    'lang.title': 'Мова відображення', 'lang.desc': 'Оберіть мову відображення застосунку.',
    'fab.help': 'Допомога',
  },
};

function isValid(code) {
  return LANGUAGES.some((l) => l.code === code);
}

function dirFor(code) {
  const l = LANGUAGES.find((x) => x.code === code);
  return l ? l.dir : 'ltr';
}

// Traduit une clé ; repli sur le français, puis sur la clé brute.
function t(lang, key) {
  return (MESSAGES[lang] && MESSAGES[lang][key]) || MESSAGES.fr[key] || key;
}

module.exports = { LANGUAGES, MESSAGES, isValid, dirFor, t };
