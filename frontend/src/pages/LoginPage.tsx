import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import useAuth from '@/hooks/useAuth';
import { ROUTES } from '@/routes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LoginPage: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(ROUTES.MEMBER_DASHBOARD);
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <Layout>
        <section className="py-16 px-4 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-lg text-[#333333]">Loading authentication state...</p>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="py-16 px-4 bg-[#F5F5F5] min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mb-8">
            Welcome to Vikram's Fitness Studio
          </h1>
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 md:p-10">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login" className="text-lg font-semibold data-[state=active]:bg-[#F26419] data-[state=active]:text-white transition-all duration-200">Login</TabsTrigger>
                <TabsTrigger value="register" className="text-lg font-semibold data-[state=active]:bg-[#F26419] data-[state=active]:text-white transition-all duration-200">Register</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0D1B2A] mb-6">Login to Your Account</h2>
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <h2 className="text-2xl md:text-3xl font-semibold text-[#0D1B2A] mb-6">Create a New Account</h2>
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default LoginPage;