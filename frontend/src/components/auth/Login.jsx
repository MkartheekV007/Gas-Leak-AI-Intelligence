import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Droplet, AlertOctagon, Key } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [code2FA, setCode2FA] = useState('');
  
  const { login } = useAuth();
  const { settings } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (settings?.twoFactor && !show2FA) {
      setShow2FA(true);
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      if (show2FA && code2FA.length < 6) {
        throw new Error("Invalid 2FA code. Must be 6 digits.");
      }
      await login(email, password, rememberMe);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-success/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Droplet size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Welcome back</h1>
          <p className="text-textSecondary text-sm mt-1">Sign in to your account to continue</p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-2 text-danger text-sm">
                  <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <AnimatePresence mode="wait">
                {!show2FA ? (
                  <motion.div key="login" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-textSecondary mb-1.5 block">Email address</label>
                      <Input 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="bg-black/40 border-black/10 dark:border-white/10"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-sm font-medium text-textSecondary">Password</label>
                        <Link to="/forgot-password" className="text-sm text-primary hover:text-primary/80 transition-colors">
                          Forgot password?
                        </Link>
                      </div>
                      <Input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="bg-black/40 border-black/10 dark:border-white/10"
                      />
                    </div>

                    <div className="flex items-center">
                      <input 
                        type="checkbox" 
                        id="remember" 
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded border-border bg-black/40 text-primary focus:ring-primary focus:ring-offset-background"
                      />
                      <label htmlFor="remember" className="ml-2 text-sm text-textSecondary cursor-pointer">
                        Remember me for 7 days
                      </label>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="2fa" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                    <div>
                      <label className="text-sm font-medium text-textSecondary mb-1.5 block flex items-center gap-2">
                        <Key size={14} /> Two-Factor Authentication
                      </label>
                      <p className="text-xs text-textSecondary mb-4">Please enter the 6-digit code from your authenticator app.</p>
                      <Input 
                        type="text" 
                        required 
                        value={code2FA}
                        onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="000000"
                        className="bg-black/40 border-black/10 dark:border-white/10 text-center tracking-[0.5em] text-lg font-mono"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-base">
                {isSubmitting ? 'Signing in...' : (show2FA ? 'Verify Code' : 'Sign in')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-textSecondary text-sm mt-8">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Create an account
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
