'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Check, X, Plus, Copy, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ExaminersPage() {
  const { user } = useAuth();
  const [examiners, setExaminers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    employeeId: '',
  });

  useEffect(() => {
    if (user?.organizationId) {
      fetchExaminers();
    }
  }, [user?.organizationId]);

  const fetchExaminers = async () => {
    try {
      const response = await fetch(`/api/users?organizationId=${user?.organizationId}&role=EXAMINER`);
      if (!response.ok) throw new Error('Failed to fetch examiners');
      const data = await response.json();
      setExaminers(data);
    } catch (error) {
      toast.error('Failed to load examiners');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, status: 'ACTIVE' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(`Examiner ${status === 'ACTIVE' ? 'approved' : 'rejected'} successfully`);
      fetchExaminers();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const response = await fetch('/api/examiners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          organizationId: user?.organizationId,
          createdBy: user?.id,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create examiner');
      }

      toast.success('Examiner created successfully');
      setIsCreateOpen(false);
      setFormData({ name: '', email: '', password: '', phone: '', employeeId: '' });
      fetchExaminers();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setCreateLoading(false);
    }
  };

  const copyInviteLink = () => {
    if (typeof window !== 'undefined' && user?.organizationId) {
      const link = `${window.location.origin}/auth/register?role=EXAMINER&orgId=${user.organizationId}`;
      navigator.clipboard.writeText(link);
      toast.success('Invite link copied to clipboard');
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Examiners</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={copyInviteLink}>
            <LinkIcon className="h-4 w-4 mr-2" />
            Copy Invite Link
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Examiner
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Examiner</DialogTitle>
                <DialogDescription>
                  Add a new examiner to your organization. They will be able to log in immediately.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employeeId">Employee ID (Optional)</Label>
                  <Input
                    id="employeeId"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={createLoading}>
                    {createLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Examiner
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Examiner Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examiners.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No examiners found</TableCell>
                </TableRow>
              ) : (
                examiners.map((examiner) => (
                  <TableRow key={examiner._id}>
                    <TableCell>{examiner.name}</TableCell>
                    <TableCell>{examiner.email}</TableCell>
                    <TableCell>
                      <Badge variant={examiner.status === 'ACTIVE' ? 'default' : examiner.status === 'PENDING' ? 'secondary' : 'destructive'}>
                        {examiner.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(examiner.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="space-x-2">
                      {examiner.status === 'PENDING' && (
                        <>
                          <Button size="sm" onClick={() => handleStatusUpdate(examiner._id, 'ACTIVE')}>
                            <Check className="h-4 w-4 mr-1" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(examiner._id, 'REJECTED')}>
                            <X className="h-4 w-4 mr-1" /> Reject
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
