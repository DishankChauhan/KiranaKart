import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import AuthForm from '../components/auth/AuthForm';
import { useAuthStore } from '../store/authStore';
import { signInWithGoogle } from '../services/auth';

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const handleRegister = async (data: { email: string; password: string; name: string; role: 'store_owner' | 'customer' }) => {
    try {
      await signUp(data.email, data.password, data.name, data.role);
      toast.success('Successfully registered!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to register: ' + (error as Error).message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast.success('Successfully registered with Google!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to register with Google: ' + (error as Error).message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
      <AuthForm 
        type="register" 
        onSubmit={handleRegister}
        onGoogleSignIn={handleGoogleSignUp}
      />
    </div>
  );
};

export default Register;