import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Droplet, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // Always show success to prevent email enumeration
      setSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Droplet size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Reset Password</h1>
          <p className="text-textSecondary text-sm mt-1 text-center">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-2xl">
          <CardContent className="p-8">
            {success ? (
              <div className="text-center space-y-4">
                <div className="flex justify-center text-success mb-2">
                  <CheckCircle2 size={48} />
                </div>
                <h3 className="text-lg font-semibold text-textPrimary">Check your inbox</h3>
                <p className="text-textSecondary text-sm">
                  If an account exists for <strong>{email}</strong>, we have sent a password reset link.
                </p>
                <div className="pt-4">
                  <Link to="/login">
                    <Button variant="secondary" className="w-full">Return to login</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
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

                <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-base">
                  {isSubmitting ? 'Sending link...' : 'Send reset link'}
                </Button>
                
                <div className="text-center mt-4">
                  <Link to="/login" className="text-sm text-textSecondary hover:text-primary transition-colors">
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
