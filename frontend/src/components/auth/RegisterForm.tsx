import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuth from '@/hooks/useAuth';
import { RegisterRequest } from '@/types/register';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@radix-ui/react-label';

const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Confirm Password must be at least 6 characters'),
  email: z.string().email('Invalid email address'),
  firstName: z.string().min(1, 'First Name is required'),
  lastName: z.string().min(1, 'Last Name is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const { registerUser } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const registerRequest: RegisterRequest = {
        username: data.username,
        password: data.password,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      await registerUser(registerRequest);
      // Optionally redirect or show success message
    } catch (error: any) {
      setError('root', {
        type: 'manual',
        message: error.message || 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="register-username">Username</Label>
        <Input
          id="register-username"
          type="text"
          {...register('username')}
          className="mt-1 block w-full"
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
      </div>
      <div>
        <Label htmlFor="register-email">Email</Label>
        <Input
          id="register-email"
          type="email"
          {...register('email')}
          className="mt-1 block w-full"
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="register-firstName">First Name</Label>
        <Input
          id="register-firstName"
          type="text"
          {...register('firstName')}
          className="mt-1 block w-full"
        />
        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
      </div>
      <div>
        <Label htmlFor="register-lastName">Last Name</Label>
        <Input
          id="register-lastName"
          type="text"
          {...register('lastName')}
          className="mt-1 block w-full"
        />
        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
      </div>
      <div>
        <Label htmlFor="register-password">Password</Label>
        <Input
          id="register-password"
          type="password"
          {...register('password')}
          className="mt-1 block w-full"
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <Label htmlFor="register-confirmPassword">Confirm Password</Label>
        <Input
          id="register-confirmPassword"
          type="password"
          {...register('confirmPassword')}
          className="mt-1 block w-full"
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      {errors.root && <p className="text-red-500 text-sm mt-1">{errors.root.message}</p>}
      <Button
        type="submit"
        className="w-full bg-[#F26419] hover:bg-[#E05A15] text-white font-semibold rounded-full px-8 py-3 transition-all duration-200"
      >
        Register
      </Button>
    </form>
  );
};

export default RegisterForm;