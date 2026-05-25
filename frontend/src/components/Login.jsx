import React, { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import AuthContext from '../context/AuthContext';
import { pageBackground, formCard, formTitle, labelClass, inputClass, formGroup, submitBtn, errorClass, loadingClass } from '../styles/common';

function Login() {
  const navigate = useNavigate();
  const { login, isAuthenticated, currentUser, loading, error } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      role: 'user',
    },
  });

  // Side effect: If already authenticated, redirect to appropriate dashboard
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const role = currentUser.role;
      if (role === 'user') {
        navigate('/user-dashboard');
      } else if (role === 'author') {
        navigate('/author-dashboard');
      } else if (role === 'admin') {
        navigate('/admin-dashboard');
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  const onSubmit = async (data) => {
    try {
      console.log('Login form data:', { email: data.email, hasPassword: !!data.password, role: data.role });
      const loginRes = await login(data.email, data.password, data.role);
      console.log('Authenticated user details:', {
        email: loginRes?.user?.email || data.email,
        role: loginRes?.user?.role || data.role,
        userId: loginRes?.user?._id,
      });
      // Navigation happens automatically via useEffect after login state updates
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  if (loading) {
    return (
      <div className={pageBackground}>
        <div className="flex min-h-screen items-center justify-center">
          <p className={loadingClass}>Logging in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={pageBackground}>
      <div className="px-4 py-10 sm:px-6">
        <div className={formCard}>
          <h2 className={formTitle}>Login</h2>

          {error && (
            <div className={errorClass}>
              {error}
            </div>
          )}
        
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-indigo-900">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 transition hover:border-indigo-400">
                  <input
                    type="radio"
                    value="user"
                    {...register('role', { required: 'Role is required' })}
                    className="h-4 w-4 accent-blue-600"
                  />
                  User
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm text-indigo-900 transition hover:border-indigo-400">
                  <input
                    type="radio"
                    value="author"
                    {...register('role', { required: 'Role is required' })}
                    className="h-4 w-4 accent-blue-600"
                  />
                  Author
                </label>
              </div>
              {errors.role && (
                <p className={errorClass}>{errors.role.message}</p>
              )}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Invalid email address' },
                })}
                className={inputClass}
                placeholder="your@email.com"
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>

            <div className={formGroup}>
              <label className={labelClass}>Password</label>
              <input
                type="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Password must be at least 6 characters' },
                })}
                className={inputClass}
                placeholder="••••••••"
              />
              {errors.password && <p className={errorClass}>{errors.password.message}</p>}
            </div>

            <button type="submit" className={submitBtn} disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <p className="text-center text-sm text-indigo-900/80">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="font-medium text-indigo-600 hover:underline"
              >
                Register here
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;