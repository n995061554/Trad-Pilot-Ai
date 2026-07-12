
import React, { useState } from 'react';
import { TradeXCloudLogo } from './icons';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const switchView = (newView: 'login' | 'signup' | 'forgot') => {
    setError('');
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
    setView(newView);
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(String(email).toLowerCase());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    onLogin(); 
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
        setError('Please fill in all fields.');
        return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    alert('Account created successfully! (Simulation)\nPlease sign in with your new credentials.');
    switchView('login');
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return;
    }
    setError('');
    alert(`If an account exists for ${email}, a password reset link has been sent. (Simulation)`);
    switchView('login');
  };
  
  const renderLoginView = () => (
    <>
      <div className="text-center relative z-10">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-primary/20 rounded-full backdrop-blur-sm border border-brand/10 shadow-xl">
             <TradeXCloudLogo className="w-24 h-24 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
          </div>
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary drop-shadow-sm">
          <span className="text-brand">Trade</span>{' '}
          <span className="text-orange-500">X</span>{' '}
          <span className="text-brand">Cloud</span>
        </h2>
        <p className="text-brand text-[10px] uppercase tracking-[0.25em] font-bold mt-1 mb-2">
          Your AI Co-Pilot for Global Trade Success
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your credentials to access your dashboard.
        </p>
      </div>
      <form className="mt-8 space-y-6 relative z-10" onSubmit={handleLogin}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address-login" className="sr-only">Email address</label>
            <input
              id="email-address-login"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-t-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password-login" className="sr-only">Password</label>
            <input
              id="password-login"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-b-md focus:outline-none focus:ring-brand focus:border-brand focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-brand bg-primary border-accent rounded focus:ring-brand" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-secondary">
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <button type="button" onClick={() => switchView('forgot')} className="font-medium text-brand hover:text-opacity-80">
              Forgot your password?
            </button>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-brand hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand shadow-lg shadow-brand/20 transition-all active:scale-95"
          >
            Sign in
          </button>
        </div>
      </form>
      <div className="text-center relative z-10">
        <p className="text-sm text-text-secondary">
          Don't have an account?{' '}
          <button type="button" onClick={() => switchView('signup')} className="font-medium text-brand hover:text-opacity-80">
            Create one now
          </button>
        </p>
        <p className="text-xs text-text-secondary mt-4 bg-primary/20 p-2 rounded-md border border-accent/20">
          This is a simulated login for demonstration purposes.
        </p>
      </div>
    </>
  );

  const renderSignUpView = () => (
    <>
      <div className="text-center relative z-10">
        <div className="flex justify-center mb-4">
             <TradeXCloudLogo className="w-20 h-20 text-brand drop-shadow-md" />
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary">
          <span className="text-brand">Trade</span>{' '}
          <span className="text-orange-500">X</span>{' '}
          <span className="text-brand">Cloud</span>
        </h2>
        <p className="text-brand text-[10px] uppercase tracking-[0.25em] font-bold mt-1 mb-2">
          Your AI Co-Pilot for Global Trade Success
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Join the platform to start your export journey.
        </p>
      </div>
      <form className="mt-8 space-y-6 relative z-10" onSubmit={handleSignUp}>
        <div className="rounded-md shadow-sm space-y-4">
           <input name="name" type="text" required className="appearance-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
           <input name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
           <input name="password" type="password" required className="appearance-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
           <input name="confirmPassword" type="password" required className="appearance-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-brand hover:bg-opacity-80 transition-all active:scale-95 shadow-lg shadow-brand/20">
            Sign Up
          </button>
        </div>
      </form>
      <div className="text-center relative z-10">
        <p className="text-sm text-text-secondary">
          Already have an account?{' '}
          <button type="button" onClick={() => switchView('login')} className="font-medium text-brand hover:text-opacity-80">
            Sign in
          </button>
        </p>
      </div>
    </>
  );

  const renderForgotView = () => (
    <>
      <div className="text-center relative z-10">
        <div className="flex justify-center mb-4">
             <TradeXCloudLogo className="w-20 h-20 text-brand" />
        </div>
        <h2 className="text-3xl font-extrabold text-text-primary">
          Reset Password
        </h2>
        <p className="text-brand text-[10px] uppercase tracking-[0.25em] font-bold mt-1 mb-2">
          Your AI Co-Pilot for Global Trade Success
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          Enter your email to receive a reset link.
        </p>
      </div>
      <form className="mt-8 space-y-6 relative z-10" onSubmit={handleForgotPassword}>
        <div className="rounded-md shadow-sm">
          <input name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-2 border border-accent bg-primary/40 backdrop-blur-md placeholder-text-secondary text-text-primary rounded-md focus:outline-none focus:ring-brand focus:border-brand sm:text-sm" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary bg-brand hover:bg-opacity-80 transition-all active:scale-95 shadow-lg shadow-brand/20">
            Send Reset Link
          </button>
        </div>
      </form>
      <div className="text-center relative z-10">
        <p className="text-sm text-text-secondary">
          Remembered your password?{' '}
          <button type="button" onClick={() => switchView('login')} className="font-medium text-brand hover:text-opacity-80">
            Sign in
          </button>
        </p>
      </div>
    </>
  );

  const renderContent = () => {
    switch(view) {
        case 'signup': return renderSignUpView();
        case 'forgot': return renderForgotView();
        case 'login':
        default:
            return renderLoginView();
    }
  }

  return (
    <div className="flex min-h-screen bg-primary">
      {/* Fixed Side Image Section */}
      <div className="hidden lg:block lg:w-[60%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=1200" 
          alt="Shipping Yard" 
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Overlay for better integration */}
        <div className="absolute inset-0 bg-brand/10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-primary"></div>
        
        {/* Decorative Quote */}
        <div className="absolute bottom-12 left-12 max-w-md z-20">
          <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Navigating Global Trade with AI Precision.</h3>
          <p className="text-text-secondary text-lg">Join the future of export-import operations.</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-[40%] flex flex-col items-center justify-center p-8 sm:p-12 relative overflow-hidden">
        {/* Background decorative elements for the form side */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-brand/5 rounded-full blur-3xl"></div>

        <div className="w-full max-w-md space-y-8 animate-fadeInUp relative z-10">
          <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-brand/20">
            {error && (
              <p className="text-sm text-red-400 text-center bg-red-900/40 backdrop-blur-md p-3 rounded-lg border border-red-500/30 mb-4 animate-shake">
                {error}
              </p>
            )}
            {renderContent()}
          </div>

          <div className="mt-8 text-center">
            <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-medium opacity-80">
              Powered by{' '}
              <a 
                href="https://diagnosticinfotech.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand hover:text-brand/80 transition-colors font-bold"
              >
                Diagnostic Infotech
              </a>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-shake { animation: shake 0.2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default Login;
