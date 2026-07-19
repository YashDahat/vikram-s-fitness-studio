// Assembled from routes.ts by the route registry — re-derived every attempt.
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import BlogPage from './pages/BlogPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import ClassesPage from './pages/ClassesPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import MemberDashboardPage from './pages/MemberDashboardPage';
import MembershipPage from './pages/MembershipPage';
import MyBookingsPage from './pages/MyBookingsPage';
import MyProgressPage from './pages/MyProgressPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminBlogPage from './pages/AdminBlogPage';
import AdminClassesPage from './pages/AdminClassesPage';
import AdminMembershipPlansPage from './pages/AdminMembershipPlansPage';
import NotFoundPage from './pages/NotFoundPage';

const queryClient = new QueryClient()

export default function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog-post/:id" element={<BlogPostDetailPage />} />
            <Route path="/classes" element={<ClassesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/member-dashboard" element={<MemberDashboardPage />} />
            <Route path="/membership" element={<MembershipPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/my-progress" element={<MyProgressPage />} />
            <Route path="/payment-success" element={<PaymentSuccessPage />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
            <Route path="/admin/blog" element={<ProtectedRoute><AdminBlogPage /></ProtectedRoute>} />
            <Route path="/admin/classes" element={<ProtectedRoute><AdminClassesPage /></ProtectedRoute>} />
            <Route path="/admin/membership-plans" element={<ProtectedRoute><AdminMembershipPlansPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}
