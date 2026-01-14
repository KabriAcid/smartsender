import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  Building,
  HardDrive,
  Clock,
  Bell,
  Shield,
  Save,
  Loader2,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    institutionName: 'University of Lagos',
    institutionEmail: 'admin@unilag.edu.ng',
    storageQuotaGB: 100,
    sessionTimeoutMinutes: 30,
    maxFileSizeMB: 50,
    allowedFileTypes: '.pdf,.docx,.xlsx,.pptx,.jpg,.png',
    emailNotifications: true,
    loginAlerts: true,
    storageAlerts: true,
    twoFactorEnabled: false,
  });

  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSaving(false);

    toast({
      title: 'Settings Saved',
      description: 'Your changes have been applied successfully.',
    });
  };

  return (
    <div className="min-h-screen">
      <AdminHeader
        title="Settings"
        description="Configure system-wide settings and preferences"
      />

      <div className="p-4 lg:p-8 max-w-4xl">
        <div className="space-y-8">
          {/* Institution Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Building className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Institution</h2>
                <p className="text-sm text-muted-foreground">Basic organization settings</p>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="institutionName">Institution Name</Label>
                <Input
                  id="institutionName"
                  value={settings.institutionName}
                  onChange={(e) => setSettings((s) => ({ ...s, institutionName: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="institutionEmail">Contact Email</Label>
                <Input
                  id="institutionEmail"
                  type="email"
                  value={settings.institutionEmail}
                  onChange={(e) => setSettings((s) => ({ ...s, institutionEmail: e.target.value }))}
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </motion.section>

          {/* Storage Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Storage</h2>
                <p className="text-sm text-muted-foreground">File storage configuration</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Storage Quota</Label>
                  <span className="text-sm text-muted-foreground">{settings.storageQuotaGB} GB</span>
                </div>
                <Slider
                  value={[settings.storageQuotaGB]}
                  onValueChange={(v) => setSettings((s) => ({ ...s, storageQuotaGB: v[0] }))}
                  max={500}
                  min={10}
                  step={10}
                  className="w-full"
                />
              </div>

              <Separator className="bg-border" />

              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Max File Size</Label>
                  <span className="text-sm text-muted-foreground">{settings.maxFileSizeMB} MB</span>
                </div>
                <Slider
                  value={[settings.maxFileSizeMB]}
                  onValueChange={(v) => setSettings((s) => ({ ...s, maxFileSizeMB: v[0] }))}
                  max={200}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>

              <Separator className="bg-border" />

              <div className="grid gap-2">
                <Label htmlFor="allowedTypes">Allowed File Types</Label>
                <Input
                  id="allowedTypes"
                  value={settings.allowedFileTypes}
                  onChange={(e) => setSettings((s) => ({ ...s, allowedFileTypes: e.target.value }))}
                  className="bg-secondary border-border"
                  placeholder=".pdf,.docx,.xlsx"
                />
                <p className="text-xs text-muted-foreground">Comma-separated file extensions</p>
              </div>
            </div>
          </motion.section>

          {/* Session Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Clock className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Session</h2>
                <p className="text-sm text-muted-foreground">Session timeout and security</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid gap-3">
                <div className="flex items-center justify-between">
                  <Label>Session Timeout</Label>
                  <span className="text-sm text-muted-foreground">{settings.sessionTimeoutMinutes} minutes</span>
                </div>
                <Slider
                  value={[settings.sessionTimeoutMinutes]}
                  onValueChange={(v) => setSettings((s) => ({ ...s, sessionTimeoutMinutes: v[0] }))}
                  max={120}
                  min={5}
                  step={5}
                  className="w-full"
                />
              </div>
            </div>
          </motion.section>

          {/* Notification Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Bell className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
                <p className="text-sm text-muted-foreground">Email and alert preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive email updates for important events</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, emailNotifications: v }))}
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Login Alerts</Label>
                  <p className="text-xs text-muted-foreground">Get notified of new login attempts</p>
                </div>
                <Switch
                  checked={settings.loginAlerts}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, loginAlerts: v }))}
                />
              </div>

              <Separator className="bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <Label>Storage Alerts</Label>
                  <p className="text-xs text-muted-foreground">Alert when storage quota is near limit</p>
                </div>
                <Switch
                  checked={settings.storageAlerts}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, storageAlerts: v }))}
                />
              </div>
            </div>
          </motion.section>

          {/* Security Settings */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-lg p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-foreground">Security</h2>
                <p className="text-sm text-muted-foreground">Advanced security options</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
                </div>
                <Switch
                  checked={settings.twoFactorEnabled}
                  onCheckedChange={(v) => setSettings((s) => ({ ...s, twoFactorEnabled: v }))}
                />
              </div>
            </div>
          </motion.section>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-end"
          >
            <Button onClick={handleSave} disabled={isSaving} className="gap-2 min-w-[140px]">
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
