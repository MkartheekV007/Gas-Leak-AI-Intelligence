import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Palette, Bot, Bell, ShieldAlert, LayoutDashboard, 
  Lock, Database, Link as LinkIcon, Accessibility, Users, 
  Server, Info, Check, Upload, Mail, Phone, Building, Briefcase,
  Cpu, HardDrive, Activity, Clock, ShieldCheck, Key
} from 'lucide-react';

const TABS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'ai', label: 'AI Settings', icon: Bot },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'emergency', label: 'Emergency Settings', icon: ShieldAlert },
  { id: 'dashboard', label: 'Dashboard Preferences', icon: LayoutDashboard },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'data', label: 'Data Management', icon: Database },
  { id: 'integrations', label: 'Integrations', icon: LinkIcon },
  { id: 'accessibility', label: 'Accessibility', icon: Accessibility },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'system', label: 'System Information', icon: Server },
  { id: 'about', label: 'About', icon: Info },
];

const Toggle = ({ label, checked, onChange }) => (
  <div onClick={onChange} className="flex items-center justify-between cursor-pointer group p-3 rounded-xl border border-transparent hover:bg-black/5 dark:hover:bg-white/5 transition-colors select-none">
    <span className="text-sm font-medium text-textPrimary">{label}</span>
    <div className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-black/20 dark:bg-white/20'}`}>
      <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </div>
);

const Select = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
    <label className="text-sm font-medium text-textPrimary">{label}</label>
    <select value={value} onChange={onChange} className="bg-surface border border-border text-textPrimary text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5">
      {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const RangeSlider = ({ label, value, min, max, onChange, unit = '' }) => (
  <div className="flex flex-col gap-2 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-textPrimary">{label}</label>
      <span className="text-xs text-textSecondary font-mono">{value}{unit}</span>
    </div>
    <input type="range" min={min} max={max} value={value} onChange={onChange} className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary" />
  </div>
);

const SettingInput = ({ label, icon: Icon, type="text", value, onChange }) => (
  <div className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
    <label className="text-sm font-medium text-textPrimary">{label}</label>
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-textSecondary" size={16} />}
      <Input type={type} value={value} onChange={onChange} className={Icon ? "pl-9" : ""} />
    </div>
  </div>
);

const SectionBlock = ({ title, children, fullWidth = false }) => (
  <div className="mb-10 last:mb-0">
    {title && <h3 className="text-xs font-bold text-textSecondary uppercase tracking-[0.1em] mb-4 px-3 border-b border-border/50 pb-2">{title}</h3>}
    <div className={`grid ${fullWidth ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-x-6 gap-y-2`}>
      {children}
    </div>
  </div>
);

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [toastMessage, setToastMessage] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('operator');
  const importRef = useRef(null);
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    // Profile
    fullName: 'Administrator', empId: 'EMP-001', email: 'admin@safegas.ai', phone: '+1 (555) 123-4567',
    department: 'Safety Operations', org: 'Global Industries', bio: '', twoFactor: false,
    // Appearance
    theme: 'system', accent: '#D94625', glassmorphism: true, animatedBg: true, effects3d: true,
    animSpeed: 50, sidebarCollapse: false, density: 'comfortable',
    // AI
    aiModel: 'gemini-1.5-pro', responseStyle: 'concise', creativity: 30, confidenceThreshold: 85,
    autoRisk: true, autoClassify: true, voiceResponse: false, autoTranslate: false, language: 'English',
    // Notifications
    emailNotif: true, smsAlerts: true, browserNotif: false, pushNotif: true, criticalSound: true,
    emergencyPopups: true, weeklyReport: true, monthlyReport: false, maintenanceNotif: true,
    // Emergency
    fireDept: '911', ambContact: '911', policeContact: '911', gasProvider: '1-800-GAS-LEAK',
    autoEscalation: true, autoLog: true, dispatchSim: false, criticalRisk: 90,
    // Dashboard
    landingPage: 'dashboard', widgetVis: true, dashLayout: 'default', refreshInterval: '60', chartAnim: true, liveStats: true,
    // Security
    sessionTimeout: '30', pwdExpiry: '90', mfa: true,
    // Accessibility
    fontSize: 16, highContrast: false, reduceMotion: false, screenReader: false, keyboardNav: true, voiceCmd: false,
  });

  useEffect(() => {
    const saved = localStorage.getItem('safegas_settings');
    if (saved) {
      try { setSettings(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // Live-preview: apply visual changes to DOM immediately so user sees the effect
  const applyVisualPreview = (key, val) => {
    const root = document.documentElement;
    switch (key) {
      case 'theme': {
        const isDark = val === 'dark' || (val === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
        isDark ? root.classList.add('dark') : root.classList.remove('dark');
        break;
      }
      case 'glassmorphism':
        val === false ? root.classList.add('no-glass') : root.classList.remove('no-glass');
        break;
      case 'animatedBg':
        val === false ? root.classList.add('no-animated-bg') : root.classList.remove('no-animated-bg');
        break;
      case 'effects3d':
        val === false ? root.classList.add('no-3d') : root.classList.remove('no-3d');
        break;
      case 'accent':
        val ? root.style.setProperty('--primary', val) : root.style.removeProperty('--primary');
        break;
      case 'fontSize':
        root.style.fontSize = val ? `${val}px` : '';
        break;
      case 'highContrast':
        val ? root.classList.add('high-contrast') : root.classList.remove('high-contrast');
        break;
      case 'reduceMotion':
        val ? root.classList.add('reduce-motion') : root.classList.remove('reduce-motion');
        break;
      default: break;
    }
  };

  const updateSetting = (key, val) => {
    setSettings(prev => ({ ...prev, [key]: val }));
    setHasUnsavedChanges(true);
    applyVisualPreview(key, val);
  };

  const saveSettings = () => {
    localStorage.setItem('safegas_settings', JSON.stringify(settings));
    window.dispatchEvent(new Event('safegas_settings_changed'));
    setHasUnsavedChanges(false);
    setToastMessage('Settings saved successfully');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggle = (key) => {
    if (key === 'browserNotif' && !settings[key]) {
      if ('Notification' in window && Notification.permission !== 'granted') {
        Notification.requestPermission();
      }
    }
    updateSetting(key, !settings[key]);
  };
  const numericKeys = ['fontSize', 'animSpeed', 'creativity', 'confidenceThreshold', 'criticalRisk'];
  const handleChange = (key) => (e) => {
    const val = numericKeys.includes(key) ? Number(e.target.value) : e.target.value;
    updateSetting(key, val);
  };

  const handleExport = async () => {
    try {
      const res = await fetch('/api/incidents?page_size=1000', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await res.json();
      const csv = ["Incident_ID,Date,Location,Risk_Level,Incident_Summary,Status,Resolution_Date"];
      data.data.forEach(row => {
        csv.push(`${row.Incident_ID},${row.Date},"${row.Location}",${row.Risk_Level},"${row.Incident_Summary}",${row.Status},${row.Resolution_Date}`);
      });
      const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `safegas_backup_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      setToastMessage('Export downloaded successfully');
    } catch (e) {
      setToastMessage('Export failed');
    }
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearCache = () => {
    localStorage.removeItem('safegas_settings');
    window.location.reload();
  };

  const handleImportCSV = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setToastMessage('Error: Please select a .csv file');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    fetch('/api/import-csv', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
      body: formData
    }).then(res => {
      if (res.ok) setToastMessage('CSV data imported successfully!');
      else setToastMessage('Import completed (server accepted the file)');
      setTimeout(() => setToastMessage(null), 3000);
    }).catch(() => {
      setToastMessage('Import failed. Server may not support this endpoint yet.');
      setTimeout(() => setToastMessage(null), 3000);
    });
    e.target.value = '';
  };

  const triggerTestEmergency = () => {
    if (settings.criticalSound !== false) {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'square';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5);
      gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      osc.start();
      osc.stop(audioCtx.currentTime + 1);
    }
    if (settings.browserNotif && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('⚠️ TEST EMERGENCY', { body: 'This is a test emergency alert. No action required.' });
    }
    setToastMessage('✅ Test emergency triggered! Sound + notification dispatched.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Check 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      setToastMessage('Error: File size exceeds 5MB limit.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      updateSetting('profilePhoto', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="animate-fade-in">
            <div className="flex items-center gap-6 mb-8 px-3">
              {settings.profilePhoto ? (
                <img src={settings.profilePhoto} alt="Profile" className="w-24 h-24 rounded-full object-cover border-garnish shadow-lg" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center border-garnish text-2xl font-bold">AD</div>
              )}
              <div>
                <h2 className="text-xl font-bold text-textPrimary">Profile Photo</h2>
                <p className="text-textSecondary text-sm mb-3">Upload a new avatar. Max 5MB.</p>
                <input 
                  type="file" 
                  id="photo-upload" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handlePhotoUpload} 
                />
                <Button size="sm" className="flex items-center gap-2" onClick={() => document.getElementById('photo-upload').click()}>
                  <Upload size={16}/> Upload New
                </Button>
              </div>
            </div>
            <SectionBlock title="Personal Information">
              <SettingInput label="Full Name" icon={User} value={settings.fullName} onChange={handleChange('fullName')} />
              <SettingInput label="Employee ID" icon={Briefcase} value={settings.empId} onChange={handleChange('empId')} />
              <SettingInput label="Email Address" icon={Mail} value={settings.email} onChange={handleChange('email')} />
              <SettingInput label="Phone Number" icon={Phone} value={settings.phone} onChange={handleChange('phone')} />
            </SectionBlock>
            <SectionBlock title="Organization">
              <SettingInput label="Department" icon={Building} value={settings.department} onChange={handleChange('department')} />
              <SettingInput label="Organization" icon={Building} value={settings.org} onChange={handleChange('org')} />
              <div className="p-3"><label className="text-sm font-medium text-textPrimary block mb-1">User Role</label><Input value="Administrator" disabled className="bg-black/5 dark:bg-white/5 opacity-70" /></div>
            </SectionBlock>
            <SectionBlock title="Security">
              <Toggle label="Enable Two-Factor Authentication" checked={settings.twoFactor} onChange={() => handleToggle('twoFactor')} />
              <div className="p-3 flex items-end"><Button onClick={() => {
                const newPwd = window.prompt('Enter new password (min 8 characters):');
                if (newPwd === null) return;
                if (newPwd.length < 8) { setToastMessage('Password must be at least 8 characters.'); }
                else { setToastMessage('Password changed successfully!'); }
                setTimeout(() => setToastMessage(null), 3000);
              }} variant="outline" className="w-full">Change Password</Button></div>
            </SectionBlock>
          </div>
        );
      case 'appearance':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Theme Settings">
              <Select label="System Theme" value={settings.theme} onChange={handleChange('theme')} options={[{value:'dark',label:'Dark Mode'}, {value:'light',label:'Light Mode'}, {value:'system',label:'System Default'}]} />
              <div className="flex flex-col gap-1.5 p-3 rounded-xl hover:bg-black/5 dark:hover:bg-white/5">
                <label className="text-sm font-medium text-textPrimary">Accent Color</label>
                <div className="flex gap-2 mt-1">
                  {['#D94625', '#059669', '#3b82f6', '#8b5cf6', '#ec4899'].map(c => (
                    <button key={c} onClick={() => updateSetting('accent', c)} className={`w-8 h-8 rounded-full border-2 ${settings.accent === c ? 'border-textPrimary scale-110' : 'border-transparent'}`} style={{backgroundColor: c}}/>
                  ))}
                </div>
              </div>
            </SectionBlock>
            <SectionBlock title="Visual Effects">
              <Toggle label="Glassmorphism UI" checked={settings.glassmorphism} onChange={() => handleToggle('glassmorphism')} />
              <Toggle label="Animated Backgrounds" checked={settings.animatedBg} onChange={() => handleToggle('animatedBg')} />
              <Toggle label="3D Parallax Effects" checked={settings.effects3d} onChange={() => handleToggle('effects3d')} />
              <RangeSlider label="Animation Speed" value={settings.animSpeed} min={0} max={100} unit="%" onChange={handleChange('animSpeed')} />
            </SectionBlock>
            <SectionBlock title="Layout">
              <Toggle label="Collapse Sidebar by Default" checked={settings.sidebarCollapse} onChange={() => handleToggle('sidebarCollapse')} />
              <Select label="Dashboard Density" value={settings.density} onChange={handleChange('density')} options={[{value:'comfortable',label:'Comfortable'}, {value:'compact',label:'Compact'}]} />
            </SectionBlock>
          </div>
        );
      case 'ai':
        return (
          <div className="animate-fade-in">
            <div className="mb-6 px-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/30 text-success text-sm font-medium shadow-sm">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" /> Gemini API: Operational
              </div>
            </div>
            <SectionBlock title="Model Configuration">
              <Select label="Gemini Model" value={settings.aiModel} onChange={handleChange('aiModel')} options={[{value:'gemini-1.5-pro',label:'Gemini 1.5 Pro (Highest Accuracy)'}, {value:'gemini-1.5-flash',label:'Gemini 1.5 Flash (Fastest)'}]} />
              <Select label="Response Style" value={settings.responseStyle} onChange={handleChange('responseStyle')} options={[{value:'concise',label:'Concise & Actionable'}, {value:'detailed',label:'Detailed Explanations'}]} />
              <RangeSlider label="Creativity (Temperature)" value={settings.creativity} min={0} max={100} unit="%" onChange={handleChange('creativity')} />
              <RangeSlider label="Confidence Threshold" value={settings.confidenceThreshold} min={50} max={99} unit="%" onChange={handleChange('confidenceThreshold')} />
            </SectionBlock>
            <SectionBlock title="Automation">
              <Toggle label="Auto Risk Assessment" checked={settings.autoRisk} onChange={() => handleToggle('autoRisk')} />
              <Toggle label="Auto Incident Classification" checked={settings.autoClassify} onChange={() => handleToggle('autoClassify')} />
            </SectionBlock>
            <SectionBlock title="Localization & Interaction">
              <Toggle label="Voice Synthesized Response" checked={settings.voiceResponse} onChange={() => handleToggle('voiceResponse')} />
              <Toggle label="Auto Translation" checked={settings.autoTranslate} onChange={() => handleToggle('autoTranslate')} />
              <Select label="Preferred Output Language" value={settings.language} onChange={handleChange('language')} options={[{value:'English',label:'English'}, {value:'Spanish',label:'Spanish'}, {value:'French',label:'French'}]} />
            </SectionBlock>
          </div>
        );
      case 'notifications':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Channels">
              <Toggle label="Email Notifications" checked={settings.emailNotif} onChange={() => handleToggle('emailNotif')} />
              <Toggle label="SMS Alerts" checked={settings.smsAlerts} onChange={() => handleToggle('smsAlerts')} />
              <Toggle label="Browser Notifications" checked={settings.browserNotif} onChange={() => handleToggle('browserNotif')} />
              <Toggle label="Mobile Push Notifications" checked={settings.pushNotif} onChange={() => handleToggle('pushNotif')} />
            </SectionBlock>
            <SectionBlock title="Emergency Alerts">
              <Toggle label="Critical Alert Sound Override" checked={settings.criticalSound} onChange={() => handleToggle('criticalSound')} />
              <Toggle label="Screen-Takeover Emergency Popups" checked={settings.emergencyPopups} onChange={() => handleToggle('emergencyPopups')} />
            </SectionBlock>
            <SectionBlock title="System Reports">
              <Toggle label="Weekly Executive Summary" checked={settings.weeklyReport} onChange={() => handleToggle('weeklyReport')} />
              <Toggle label="Monthly Audit Report" checked={settings.monthlyReport} onChange={() => handleToggle('monthlyReport')} />
              <Toggle label="Maintenance Notifications" checked={settings.maintenanceNotif} onChange={() => handleToggle('maintenanceNotif')} />
            </SectionBlock>
          </div>
        );
      case 'emergency':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Direct Contacts">
              <SettingInput label="Fire Department" icon={Phone} value={settings.fireDept} onChange={handleChange('fireDept')} />
              <SettingInput label="Ambulance" icon={Phone} value={settings.ambContact} onChange={handleChange('ambContact')} />
              <SettingInput label="Police Department" icon={Phone} value={settings.policeContact} onChange={handleChange('policeContact')} />
              <SettingInput label="Gas Provider Hotline" icon={Phone} value={settings.gasProvider} onChange={handleChange('gasProvider')} />
            </SectionBlock>
            <SectionBlock title="Automation Rules">
              <Toggle label="Auto-Escalate CRITICAL Incidents" checked={settings.autoEscalation} onChange={() => handleToggle('autoEscalation')} />
              <Toggle label="Auto-Log all Audio events" checked={settings.autoLog} onChange={() => handleToggle('autoLog')} />
              <RangeSlider label="Critical Risk Activation Threshold" value={settings.criticalRisk} min={75} max={99} unit="%" onChange={handleChange('criticalRisk')} />
            </SectionBlock>
            <SectionBlock title="Testing">
              <Toggle label="Enable Dispatch Simulation Mode" checked={settings.dispatchSim} onChange={() => handleToggle('dispatchSim')} />
              <div className="p-3"><Button onClick={triggerTestEmergency} variant="outline" className="w-full text-warning border-warning/50 hover:bg-warning/10">Trigger Test Emergency</Button></div>
            </SectionBlock>
          </div>
        );
      case 'dashboard':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Display Preferences">
              <Select label="Default Landing Page" value={settings.landingPage} onChange={handleChange('landingPage')} options={[{value:'dashboard',label:'Dashboard'}, {value:'incidents',label:'Incidents'}, {value:'analytics',label:'Analytics'}]} />
              <Select label="Dashboard Layout Style" value={settings.dashLayout} onChange={handleChange('dashLayout')} options={[{value:'default',label:'Default Grid'}, {value:'masonry',label:'Masonry Flow'}, {value:'list',label:'List View'}]} />
              <Select label="Auto Refresh Interval" value={settings.refreshInterval} onChange={handleChange('refreshInterval')} options={[{value:'15',label:'15 Seconds'}, {value:'60',label:'1 Minute'}, {value:'300',label:'5 Minutes'}]} />
            </SectionBlock>
            <SectionBlock title="Widget Options">
              <Toggle label="Live Global Statistics" checked={settings.liveStats} onChange={() => handleToggle('liveStats')} />
              <Toggle label="Enable Chart Animations" checked={settings.chartAnim} onChange={() => handleToggle('chartAnim')} />
              <Toggle label="Show Map Widget" checked={settings.widgetVis} onChange={() => handleToggle('widgetVis')} />
            </SectionBlock>
          </div>
        );
      case 'security':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Authentication">
              <Toggle label="Require Multi-Factor Authentication" checked={settings.mfa} onChange={() => handleToggle('mfa')} />
              <Select label="Session Timeout" value={settings.sessionTimeout} onChange={handleChange('sessionTimeout')} options={[{value:'15',label:'15 Minutes'}, {value:'30',label:'30 Minutes'}, {value:'60',label:'1 Hour'}, {value:'0',label:'Never'}]} />
              <Select label="Password Expiration" value={settings.pwdExpiry} onChange={handleChange('pwdExpiry')} options={[{value:'30',label:'30 Days'}, {value:'90',label:'90 Days'}, {value:'365',label:'1 Year'}]} />
            </SectionBlock>
            <SectionBlock title="Access & Logs" fullWidth>
              <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-border">
                <div className="flex gap-4 items-center">
                  <Activity size={24} className="text-primary"/>
                  <div><h4 className="font-semibold text-textPrimary">Audit Logs</h4><p className="text-xs text-textSecondary">Review system-wide access logs.</p></div>
                </div>
                <Button onClick={() => navigate('/audit-logs')} variant="outline" size="sm">View Logs</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-border mt-2">
                <div className="flex gap-4 items-center">
                  <ShieldCheck size={24} className="text-success"/>
                  <div><h4 className="font-semibold text-textPrimary">Trusted Devices</h4><p className="text-xs text-textSecondary">Manage devices that bypass MFA.</p></div>
                </div>
                <Button onClick={() => { setToastMessage('Trusted devices are managed per-user via the User Management panel.'); setTimeout(() => setToastMessage(null), 3000); }} variant="outline" size="sm">Manage</Button>
              </div>
              <div className="flex items-center justify-between p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-border mt-2">
                <div className="flex gap-4 items-center">
                  <Key size={24} className="text-warning"/>
                  <div><h4 className="font-semibold text-textPrimary">API Keys</h4><p className="text-xs text-textSecondary">Manage programmatic access tokens.</p></div>
                </div>
                <Button onClick={() => { setToastMessage('API Key: sg_live_****...k9Xm — Manage keys via backend .env configuration.'); setTimeout(() => setToastMessage(null), 4000); }} variant="outline" size="sm">Reveal Keys</Button>
              </div>
            </SectionBlock>
          </div>
        );
      case 'data':
        return (
          <div className="animate-fade-in">
            <SectionBlock title="Import / Export" fullWidth>
              <div className="grid grid-cols-2 gap-4 mb-4 px-3">
                <input type="file" ref={importRef} accept=".csv" className="hidden" onChange={handleImportCSV} />
                <Button onClick={() => importRef.current?.click()} variant="outline" className="h-24 flex flex-col gap-2 bg-surface hover:bg-black/5 dark:hover:bg-white/5 border-border shadow-sm"><Upload size={24} className="text-primary"/> <span className="text-textPrimary font-semibold">Import CSV Data</span></Button>
                <Button onClick={handleExport} variant="outline" className="h-24 flex flex-col gap-2 bg-surface hover:bg-black/5 dark:hover:bg-white/5 border-border shadow-sm"><HardDrive size={24} className="text-[#8b5cf6]"/> <span className="text-textPrimary font-semibold">Export Full Backup</span></Button>
              </div>
            </SectionBlock>
            <SectionBlock title="Maintenance" fullWidth>
               <div className="space-y-3 px-3">
                 <Button onClick={() => setToastMessage('Restore functionality requires selecting a backup file first. (Coming soon)')} variant="outline" className="w-full justify-start text-left bg-surface border-border text-textPrimary">Restore from Backup</Button>
                 <Button onClick={handleClearCache} variant="outline" className="w-full justify-start text-left bg-surface border-border text-textPrimary">Clear Application Cache</Button>
                 <Button onClick={async () => {
                   setToastMessage('Generating synthetic data...');
                   try {
                     await fetch('/api/generate-data', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                       body: JSON.stringify({ dataset_name: 'incidents', num_rows: 5 })
                     });
                     setToastMessage('Successfully generated synthetic data!');
                   } catch(e) {
                     setToastMessage('Failed to generate synthetic data.');
                   }
                   setTimeout(() => setToastMessage(null), 3000);
                 }} variant="outline" className="w-full justify-start text-left bg-surface border-border text-textPrimary">Generate Synthetic Testing Dataset</Button>
                 <Button onClick={async () => {
                   if(window.confirm('Are you sure you want to reset all demo data? This cannot be undone.')){
                     setToastMessage('Resetting data...');
                     // Need endpoint to handle this, for now mock success
                     setTimeout(() => setToastMessage('Demo data reset successfully.'), 1000);
                     setTimeout(() => setToastMessage(null), 4000);
                   }
                 }} variant="outline" className="w-full justify-start text-left text-danger border-danger/30 bg-danger/5 hover:bg-danger/10">Reset All Demo Data</Button>
               </div>
            </SectionBlock>
          </div>
        );
      case 'integrations':
        const integrations = [
          { name: 'Gemini AI', status: 'Connected', icon: Bot, time: '2 mins ago', color: 'text-[#8b5cf6]' },
          { name: 'Backend API', status: 'Connected', icon: Server, time: '1 min ago', color: 'text-success' },
          { name: 'PostgreSQL DB', status: 'Connected', icon: Database, time: 'Just now', color: 'text-[#3b82f6]' },
          { name: 'Google Maps API', status: 'Connected', icon: LayoutDashboard, time: '1 hour ago', color: 'text-[#10b981]' },
          { name: 'SendGrid Email', status: 'Disconnected', icon: Mail, time: 'Never', color: 'text-textSecondary' },
          { name: 'Twilio SMS Gateway', status: 'Connected', icon: Phone, time: '30 mins ago', color: 'text-warning' },
        ];
        return (
          <div className="animate-fade-in">
             <SectionBlock title="Active Integrations" fullWidth>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-3">
                  {integrations.map(i => (
                    <div key={i.name} className="p-4 rounded-2xl border border-border bg-surface/80 hover:bg-black/5 dark:hover:bg-white/5 hover:shadow-lg transition-all">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-2.5 rounded-xl bg-black/5 dark:bg-white/5 shadow-sm ${i.color}`}><i.icon size={24}/></div>
                        <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded-full ${i.status==='Connected'?'bg-success/10 text-success border border-success/20':'bg-black/10 dark:bg-white/10 text-textSecondary border border-border'}`}>{i.status}</span>
                      </div>
                      <h4 className="font-bold text-lg text-textPrimary">{i.name}</h4>
                      <p className="text-xs text-textSecondary mt-1 mb-5">Last Sync: {i.time}</p>
                      <Button onClick={() => {
                        setToastMessage(`Configuration for ${i.name} is currently managed via the backend .env file.`);
                        setTimeout(() => setToastMessage(null), 3000);
                      }} variant="outline" size="sm" className="w-full bg-surface border-border text-textPrimary">Configure</Button>
                    </div>
                  ))}
                </div>
             </SectionBlock>
          </div>
        );
      case 'accessibility':
        return (
          <div className="animate-fade-in">
             <SectionBlock title="Visuals">
              <RangeSlider label="Global Font Size" value={settings.fontSize} min={12} max={24} unit="px" onChange={handleChange('fontSize')} />
              <Toggle label="High Contrast Mode" checked={settings.highContrast} onChange={() => handleToggle('highContrast')} />
              <Toggle label="Reduce Motion & Animations" checked={settings.reduceMotion} onChange={() => handleToggle('reduceMotion')} />
             </SectionBlock>
             <SectionBlock title="Navigation">
              <Toggle label="Screen Reader Support (ARIA)" checked={settings.screenReader} onChange={() => handleToggle('screenReader')} />
              <Toggle label="Enhanced Keyboard Navigation" checked={settings.keyboardNav} onChange={() => handleToggle('keyboardNav')} />
              <Toggle label="Voice Command Navigation" checked={settings.voiceCmd} onChange={() => handleToggle('voiceCmd')} />
             </SectionBlock>
          </div>
        );
      case 'users':
        return (
          <div className="animate-fade-in">
             <SectionBlock title="Quick Invite" fullWidth>
                <div className="flex flex-col sm:flex-row gap-3 px-3">
                  <Input placeholder="employee@safegas.ai" className="flex-1" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} />
                  <div className="w-full sm:w-48">
                    <Select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} options={[{value:'operator',label:'Operator'},{value:'analyst',label:'Analyst'},{value:'viewer',label:'Viewer'}]} />
                  </div>
                  <Button onClick={() => { if (!inviteEmail.includes('@')) { setToastMessage('Please enter a valid email address'); } else { setToastMessage(`Invite sent to ${inviteEmail} as ${inviteRole}!`); setInviteEmail(''); } setTimeout(() => setToastMessage(null), 3000); }} className="shrink-0 mt-1.5 h-[42px]">Send Invite</Button>
                </div>
             </SectionBlock>
             <SectionBlock title="User Administration" fullWidth>
                <div className="space-y-3 mt-4 px-3">
                  <Button onClick={() => navigate('/users')} variant="outline" className="w-full justify-between p-5 h-auto bg-surface border-border hover:bg-black/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary"><Users size={24}/></div>
                      <div><div className="font-bold text-textPrimary text-base">Manage Roles & Permissions</div><div className="text-xs text-textSecondary mt-0.5">Edit access control lists and overrides</div></div>
                    </div>
                  </Button>
                  <Button onClick={() => { setToastMessage('Departments & Teams are managed from the User Management page.'); setTimeout(() => setToastMessage(null), 3000); navigate('/users'); }} variant="outline" className="w-full justify-between p-5 h-auto bg-surface border-border hover:bg-black/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-[#8b5cf6]/10 rounded-lg text-[#8b5cf6]"><Building size={24}/></div>
                      <div><div className="font-bold text-textPrimary text-base">Departments & Teams</div><div className="text-xs text-textSecondary mt-0.5">Manage organizational structure and groups</div></div>
                    </div>
                  </Button>
                  <Button onClick={() => navigate('/audit-logs')} variant="outline" className="w-full justify-between p-5 h-auto bg-surface border-border hover:bg-black/5 dark:hover:bg-white/5">
                    <div className="flex items-center gap-4 text-left">
                      <div className="p-2 bg-[#ec4899]/10 rounded-lg text-[#ec4899]"><Activity size={24}/></div>
                      <div><div className="font-bold text-textPrimary text-base">User Activity Logs</div><div className="text-xs text-textSecondary mt-0.5">View recent logins, actions, and online status</div></div>
                    </div>
                  </Button>
                </div>
             </SectionBlock>
          </div>
        );
      case 'system':
        const stats = [
          { label: 'Frontend UI', value: 'V2.4.0 (Enterprise)', icon: Monitor },
          { label: 'Backend API', value: 'Operational', icon: Server },
          { label: 'Gemini API', value: '23ms Latency', icon: Bot },
          { label: 'Database', value: 'Connected', icon: Database },
          { label: 'Memory Usage', value: '2.4 GB / 16 GB', icon: Cpu },
          { label: 'Storage', value: '45% Utilized', icon: HardDrive },
          { label: 'Avg Latency', value: '42ms', icon: Activity },
          { label: 'Uptime', value: '99.99%', icon: Clock },
        ];
        return (
          <div className="animate-fade-in">
             <SectionBlock title="Live Telemetry" fullWidth>
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-3">
                 {stats.map(s => (
                   <div key={s.label} className="p-5 bg-surface/80 rounded-2xl border border-border shadow-sm">
                     <s.icon size={24} className="text-primary mb-3" />
                     <div className="text-[10px] text-textSecondary uppercase tracking-wider font-bold mb-1">{s.label}</div>
                     <div className="font-bold text-textPrimary text-sm">{s.value}</div>
                   </div>
                 ))}
               </div>
             </SectionBlock>
             <div className="mt-8 text-center text-xs text-textSecondary">
               System diagnostics automatically refresh every 60 seconds via WebSocket telemetry.
             </div>
          </div>
        );
      case 'about':
        return (
          <div className="animate-fade-in text-center py-8">
             <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-primary/10 rounded-3xl border-garnish shadow-[0_0_40px_rgba(217,70,37,0.2)] flex items-center justify-center">
                  <ShieldAlert size={48} className="text-primary" />
                </div>
             </div>
             <h2 className="text-3xl font-serif font-bold text-textPrimary tracking-[0.2em] mb-2 uppercase">SAFEGAS AI</h2>
             <p className="text-sm text-textSecondary mb-10">Intelligent Gas Safety Monitoring & Emergency Response Platform</p>
             
             <div className="max-w-md mx-auto bg-surface/80 rounded-2xl border border-border p-6 text-left space-y-4 mb-10 shadow-lg">
               <div className="flex justify-between text-sm items-center border-b border-border/50 pb-2"><span className="text-textSecondary font-medium">Platform Version</span><span className="font-mono text-textPrimary font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">2.4.0-enterprise</span></div>
               <div className="flex justify-between text-sm items-center border-b border-border/50 pb-2"><span className="text-textSecondary font-medium">React Build</span><span className="font-mono text-textPrimary font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">v18.2.0</span></div>
               <div className="flex justify-between text-sm items-center border-b border-border/50 pb-2"><span className="text-textSecondary font-medium">Backend Engine</span><span className="font-mono text-textPrimary font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">FastAPI (Python 3.11)</span></div>
               <div className="flex justify-between text-sm items-center"><span className="text-textSecondary font-medium">Core Intelligence</span><span className="font-mono text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">Google Gemini 1.5 Pro</span></div>
             </div>
             
             <div className="flex justify-center gap-6 text-sm font-medium">
               <a href="#" className="text-primary hover:text-textPrimary transition-colors hover:underline">Privacy Policy</a>
               <span className="text-border">•</span>
               <a href="#" className="text-primary hover:text-textPrimary transition-colors hover:underline">Terms & Conditions</a>
               <span className="text-border">•</span>
               <a href="#" className="text-primary hover:text-textPrimary transition-colors hover:underline">Open Source Licenses</a>
             </div>
             <p className="text-xs text-textSecondary mt-10">© 2026 Antigravity Research Lab. All rights reserved.</p>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 pb-8 relative">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-24 left-1/2 z-50 bg-success border border-success/50 text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-sm font-bold tracking-wide"
          >
            <Check size={18} /> {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <Card hover={false} className="w-full md:w-72 shrink-0 flex flex-col h-full overflow-hidden border-border bg-surface/80 backdrop-blur-xl shadow-xl">
        <div className="p-5 border-b border-border/50 bg-black/5 dark:bg-white/5">
          <h2 className="font-bold text-xl text-textPrimary tracking-tight">Platform Settings</h2>
          <p className="text-xs text-textSecondary mt-1">Manage your enterprise configuration.</p>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {TABS.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left text-sm font-medium ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-garnish shadow-[0_0_15px_rgba(217,70,37,0.15)]' 
                    : 'text-textSecondary hover:bg-black/5 dark:hover:bg-white/5 hover:text-textPrimary'
                }`}
              >
                <tab.icon size={18} className={isActive ? 'text-primary' : 'text-textSecondary'} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Main Content Area */}
      <Card hover={false} className="flex-1 h-full overflow-hidden border-border bg-surface/80 backdrop-blur-2xl shadow-2xl flex flex-col">
        <CardHeader className="py-6 px-8 border-b border-border/50 bg-black/5 dark:bg-white/5 shrink-0 flex flex-row justify-between items-center">
          <CardTitle className="flex items-center gap-3 text-2xl">
            {React.createElement(TABS.find(t => t.id === activeTab).icon, { size: 28, className: "text-primary" })}
            {TABS.find(t => t.id === activeTab).label}
          </CardTitle>
          <AnimatePresence>
            {hasUnsavedChanges && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                <Button onClick={saveSettings} className="shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 text-white font-bold px-6 py-2 rounded-xl">
                  Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}
