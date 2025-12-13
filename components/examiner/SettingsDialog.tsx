"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    institutionName: "CBT Pro Institution",
    adminEmail: user?.email || "",
    adminName: user?.name || "",
    autoGrading: true,
    emailNotifications: true,
    smsNotifications: false,
    examTimeWarnings: true,
    allowLateSubmissions: false,
    maxExamDuration: 180,
    defaultPassingScore: 70,
  });

  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem("cbt-settings", JSON.stringify(settings));
    toast.success("Settings saved successfully");
    onOpenChange(false);
  };

  const handleReset = () => {
    setSettings({
      institutionName: "CBT Pro Institution",
      adminEmail: user?.email || "",
      adminName: user?.name || "",
      autoGrading: true,
      emailNotifications: true,
      smsNotifications: false,
      examTimeWarnings: true,
      allowLateSubmissions: false,
      maxExamDuration: 180,
      defaultPassingScore: 70,
    });
    toast.success("Settings reset to defaults");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
          <DialogDescription>
            Configure your CBT system preferences and default values.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Institution Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Institution Settings</CardTitle>
              <CardDescription>Basic information about your institution</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="institution-name">Institution Name</Label>
                <Input
                  id="institution-name"
                  value={settings.institutionName}
                  onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-name">Administrator Name</Label>
                <Input
                  id="admin-name"
                  value={settings.adminName}
                  onChange={(e) => setSettings({ ...settings, adminName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-email">Administrator Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={settings.adminEmail}
                  onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Exam Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Exam Settings
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              </CardTitle>
              <CardDescription>Default exam configuration and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <Badge variant="outline" className="text-sm">
                      🚧 Coming Soon
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      Advanced exam settings will be available in the next update
                    </p>
                  </div>
                </div>
                <div className="opacity-30">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto Grading</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically grade multiple-choice questions
                      </p>
                    </div>
                    <Switch
                      checked={settings.autoGrading}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, autoGrading: checked })
                      }
                      disabled
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Exam Time Warnings</Label>
                      <p className="text-sm text-muted-foreground">
                        Show warnings when exam time is running out
                      </p>
                    </div>
                    <Switch
                      checked={settings.examTimeWarnings}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, examTimeWarnings: checked })
                      }
                      disabled
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Allow Late Submissions</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow students to submit after time expires
                      </p>
                    </div>
                    <Switch
                      checked={settings.allowLateSubmissions}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, allowLateSubmissions: checked })
                      }
                      disabled
                    />
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-duration">Max Exam Duration (minutes)</Label>
                      <Input
                        id="max-duration"
                        type="number"
                        value={settings.maxExamDuration}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            maxExamDuration: Number.parseInt(e.target.value) || 180,
                          })
                        }
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passing-score">Default Passing Score (%)</Label>
                      <Input
                        id="passing-score"
                        type="number"
                        value={settings.defaultPassingScore}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            defaultPassingScore: Number.parseInt(e.target.value) || 70,
                          })
                        }
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notification Settings</CardTitle>
              <CardDescription>Configure how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsNotifications: checked })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
