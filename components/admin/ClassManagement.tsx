'use client';

import * as React from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface Class {
  _id: string;
  name: string;
  level: string;
  section?: string;
  academicYear: string;
  createdBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ClassManagementProps {
  organizationId: string;
  currentUserId: string;
}

export function ClassManagement({ organizationId, currentUserId }: ClassManagementProps) {
  const [classes, setClasses] = React.useState<Class[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingClass, setEditingClass] = React.useState<Class | null>(null);
  const [formData, setFormData] = React.useState({
    name: '',
    level: '',
    section: '',
    academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
  });

  const fetchClasses = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/classes?organizationId=${organizationId}`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      
      const data = await response.json();
      setClasses(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  React.useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingClass ? `/api/classes/${editingClass._id}` : '/api/classes';
      const method = editingClass ? 'PATCH' : 'POST';

      const payload = editingClass
        ? formData
        : { ...formData, organizationId, createdBy: currentUserId };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error(`Failed to ${editingClass ? 'update' : 'create'} class`);

      toast.success(`Class ${editingClass ? 'updated' : 'created'} successfully`);
      setDialogOpen(false);
      setEditingClass(null);
      setFormData({
        name: '',
        level: '',
        section: '',
        academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
      });
      fetchClasses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to save class');
    }
  };

  const handleEdit = (classItem: Class) => {
    setEditingClass(classItem);
    setFormData({
      name: classItem.name,
      level: classItem.level,
      section: classItem.section || '',
      academicYear: classItem.academicYear,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (classId: string) => {
    if (!confirm('Are you sure you want to delete this class? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete class');
      }

      toast.success('Class deleted successfully');
      fetchClasses();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete class');
    }
  };

  const openCreateDialog = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      level: '',
      section: '',
      academicYear: new Date().getFullYear() + '/' + (new Date().getFullYear() + 1),
    });
    setDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Class Management</CardTitle>
          <CardDescription>Manage classes and student groups</CardDescription>
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Class Management</CardTitle>
              <CardDescription>
                {classes.length} class{classes.length !== 1 ? 'es' : ''} in your organization
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Class
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {classes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No classes created yet</p>
              <Button variant="outline" className="mt-4" onClick={openCreateDialog}>
                Create your first class
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {classes.map((classItem) => (
                  <TableRow key={classItem._id}>
                    <TableCell className="font-medium">{classItem.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{classItem.level}</Badge>
                    </TableCell>
                    <TableCell>{classItem.section || '-'}</TableCell>
                    <TableCell>{classItem.academicYear}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{classItem.createdBy.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {classItem.createdBy.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(classItem)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(classItem._id)}
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClass ? 'Edit Class' : 'Create New Class'}</DialogTitle>
            <DialogDescription>
              {editingClass
                ? 'Update class information'
                : 'Add a new class to your organization'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., JSS1-A"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="level">Level *</Label>
                <Input
                  id="level"
                  placeholder="e.g., JSS1, SS2"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section">Section (Optional)</Label>
                <Input
                  id="section"
                  placeholder="e.g., A, B, C"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  placeholder="e.g., 2024/2025"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingClass ? 'Update' : 'Create'} Class
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
