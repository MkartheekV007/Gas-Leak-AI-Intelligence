import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Droplet, AlertOctagon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Register() {
  const [formData, setFormData] = useState({
    full_name: '', email: '', phone: '', organization: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await register({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        organization: formData.organization,
        password: formData.password,
        role: "Viewer" // Default role
      });
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-warning/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-white mb-4 shadow-lg shadow-primary/20">
            <Droplet size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-textPrimary">Create an account</h1>
          <p className="text-textSecondary text-sm mt-1">Join the Gas Leak Safety Intelligence Platform</p>
        </div>

        <Card className="bg-surface/60 backdrop-blur-2xl border-black/10 dark:border-white/10 shadow-2xl">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-danger/10 border border-danger/20 rounded-lg flex items-start gap-2 text-danger text-sm">
                  <AlertOctagon size={16} className="mt-0.5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Full Name</label>
                  <Input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Email address</label>
                  <Input type="email" name="email" required value={formData.email} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Phone (Optional)</label>
                  <Input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Organization (Optional)</label>
                  <Input type="text" name="organization" value={formData.organization} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Password</label>
                  <Input type="password" name="password" required minLength={8} value={formData.password} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
                <div>
                  <label className="text-sm font-medium text-textSecondary mb-1 block">Confirm Password</label>
                  <Input type="password" name="confirm_password" required minLength={8} value={formData.confirm_password} onChange={handleChange} className="bg-black/40 border-black/10 dark:border-white/10" />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={isSubmitting} className="w-full h-11 text-base">
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-textSecondary text-sm mt-8">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
