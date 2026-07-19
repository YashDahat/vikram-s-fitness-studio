// GENERATED from the architecture plan — do not edit by hand.
// The complete navigation contract: every page, its route, and its nav
// metadata. Link via ROUTES.*, render nav from routeTable — never hardcode
// a path string. This file imports NOTHING by design (cycle-safe).

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  BLOG: '/blog',
  BLOG_POST_DETAIL: '/blog-post/:id',
  CLASSES: '/classes',
  CONTACT: '/contact',
  LOGIN: '/login',
  MEMBER_DASHBOARD: '/member-dashboard',
  MEMBERSHIP: '/membership',
  MY_BOOKINGS: '/my-bookings',
  MY_PROGRESS: '/my-progress',
  PAYMENT_SUCCESS: '/payment-success',
  ADMIN_DASHBOARD: '/admin',
  ADMIN_BLOG: '/admin/blog',
  ADMIN_CLASSES: '/admin/classes',
  ADMIN_MEMBERSHIP_PLANS: '/admin/membership-plans',
  NOT_FOUND: '*',
} as const;

export interface RouteEntry {
  key: keyof typeof ROUTES;
  path: string;
  page: string;        // component name, e.g. 'AdminOrdersPage'
  importPath: string;  // string metadata only — App.tsx does the importing
  label: string;
  admin: boolean;
  nav: boolean;
}

export const routeTable: RouteEntry[] = [
  { key: 'HOME', path: ROUTES.HOME, page: 'HomePage', importPath: './pages/HomePage', label: 'Home', admin: false, nav: true },
  { key: 'ABOUT', path: ROUTES.ABOUT, page: 'AboutPage', importPath: './pages/AboutPage', label: 'About', admin: false, nav: true },
  { key: 'BLOG', path: ROUTES.BLOG, page: 'BlogPage', importPath: './pages/BlogPage', label: 'Blog', admin: false, nav: true },
  { key: 'BLOG_POST_DETAIL', path: ROUTES.BLOG_POST_DETAIL, page: 'BlogPostDetailPage', importPath: './pages/BlogPostDetailPage', label: 'Blog Post', admin: false, nav: false },
  { key: 'CLASSES', path: ROUTES.CLASSES, page: 'ClassesPage', importPath: './pages/ClassesPage', label: 'Classes', admin: false, nav: true },
  { key: 'CONTACT', path: ROUTES.CONTACT, page: 'ContactPage', importPath: './pages/ContactPage', label: 'Contact', admin: false, nav: true },
  { key: 'LOGIN', path: ROUTES.LOGIN, page: 'LoginPage', importPath: './pages/LoginPage', label: 'Login', admin: false, nav: false },
  { key: 'MEMBER_DASHBOARD', path: ROUTES.MEMBER_DASHBOARD, page: 'MemberDashboardPage', importPath: './pages/MemberDashboardPage', label: 'Member Dashboard', admin: false, nav: true },
  { key: 'MEMBERSHIP', path: ROUTES.MEMBERSHIP, page: 'MembershipPage', importPath: './pages/MembershipPage', label: 'Membership', admin: false, nav: true },
  { key: 'MY_BOOKINGS', path: ROUTES.MY_BOOKINGS, page: 'MyBookingsPage', importPath: './pages/MyBookingsPage', label: 'My Bookings', admin: false, nav: true },
  { key: 'MY_PROGRESS', path: ROUTES.MY_PROGRESS, page: 'MyProgressPage', importPath: './pages/MyProgressPage', label: 'My Progress', admin: false, nav: true },
  { key: 'PAYMENT_SUCCESS', path: ROUTES.PAYMENT_SUCCESS, page: 'PaymentSuccessPage', importPath: './pages/PaymentSuccessPage', label: 'Payment Success', admin: false, nav: true },
  { key: 'ADMIN_DASHBOARD', path: ROUTES.ADMIN_DASHBOARD, page: 'AdminDashboardPage', importPath: './pages/AdminDashboardPage', label: 'Dashboard', admin: true, nav: true },
  { key: 'ADMIN_BLOG', path: ROUTES.ADMIN_BLOG, page: 'AdminBlogPage', importPath: './pages/AdminBlogPage', label: 'Blog', admin: true, nav: true },
  { key: 'ADMIN_CLASSES', path: ROUTES.ADMIN_CLASSES, page: 'AdminClassesPage', importPath: './pages/AdminClassesPage', label: 'Classes', admin: true, nav: true },
  { key: 'ADMIN_MEMBERSHIP_PLANS', path: ROUTES.ADMIN_MEMBERSHIP_PLANS, page: 'AdminMembershipPlansPage', importPath: './pages/AdminMembershipPlansPage', label: 'Membership Plans', admin: true, nav: true },
  { key: 'NOT_FOUND', path: ROUTES.NOT_FOUND, page: 'NotFoundPage', importPath: './pages/NotFoundPage', label: 'Not Found', admin: false, nav: false },
];
