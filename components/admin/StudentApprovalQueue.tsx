'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Check, X, Loader2, User, Mail, Phone, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface PendingUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  organizationId: {
    _id: string;
    name: string;
    type: string;
  };
  createdAt: string;
}

interface StudentApprovalQueueProps {
  organizationId?: string;
}

export function StudentApprovalQueue({ organizationId }: StudentApprovalQueueProps) {
  const [pendingUsers, setPendingUsers] = React.useState<PendingUser[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [actionLoading, setActionLoading] = React.useState<string | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<PendingUser | null>(null);
  const [actionType, setActionType] = React.useState<'approve' | 'reject' | null>(null);

  const fetchPendingUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const url = organizationId 
        ? `/api/users/pending?organizationId=${organizationId}`
        : '/api/users/pending';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch pending users');
      
      const data = await response.json();
      setPendingUsers(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  React.useEffect(() => {
    fetchPendingUsers();
  }, [fetchPendingUsers]);

  const handleApprove = async (userId: string) => {
    try {
      setActionLoading(userId);
      
      // Get current user ID from token/session (you'll need to implement this)
      const approvedBy = 'current-user-id'; // TODO: Get from auth context
      
      const response = await fetch(`/api/users/${userId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approvedBy }),
      });

      if (!response.ok) throw new Error('Failed to approve user');

      toast.success('User approved successfully');
      fetchPendingUsers();
      setSelectedUser(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (userId: string) => {
    try {
      setActionLoading(userId);
      
      const rejectedBy = 'current-user-id'; // TODO: Get from auth context
      
      const response = await fetch(`/api/users/${userId}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectedBy }),
      });

      if (!response.ok) throw new Error('Failed to reject user');

      toast.success('User rejected successfully');
      fetchPendingUsers();
      setSelectedUser(null);
      setActionType(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject user');
    } finally {
      setActionLoading(null);
    }
  };

  const openConfirmDialog = (user: PendingUser, action: 'approve' | 'reject') => {
    setSelectedUser(user);
    setActionType(action);
  };

  const confirmAction = () => {
    if (!selectedUser || !actionType) return;
    
    if (actionType === 'approve') {
      handleApprove(selectedUser._id);
    } else {
      handleReject(selectedUser._id);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Student Approval Queue</CardTitle>
          <CardDescription>Review and approve pending student registrations</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Student Approval Queue</CardTitle>
          <CardDescription>
            {pendingUsers.length} student{pendingUsers.length !== 1 ? 's' : ''} waiting for approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending approvals</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Role</TableHead>
                  {!organizationId && <TableHead>Organization</TableHead>}
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          {user.phone}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    {!organizationId && (
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.organizationId.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.organizationId.type}
                          </p>
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => openConfirmDialog(user, 'approve')}
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openConfirmDialog(user, 'reject')}
                          disabled={actionLoading === user._id}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!selectedUser && !!actionType} onOpenChange={() => {
        setSelectedUser(null);
        setActionType(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 'approve' ? 'Approve' : 'Reject'} Student Registration
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 'approve' ? (
                <>
                  Are you sure you want to approve <strong>{selectedUser?.name}</strong>?
                  They will be able to access the platform and take exams.
                </>
              ) : (
                <>
                  Are you sure you want to reject <strong>{selectedUser?.name}</strong>?
                  They will not be able to access the platform.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === 'reject' ? 'bg-destructive hover:bg-destructive/90' : ''}
            >
              {actionType === 'approve' ? 'Approve' : 'Reject'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
