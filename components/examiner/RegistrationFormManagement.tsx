"use client";

import { useState, useEffect } from "react";
import {
  registrationService,
  type RegistrationForm,
  type RegistrationField,
} from "@/services/registrationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Plus, Trash2, Copy, Users, Mail, X, Edit } from "lucide-react";
import { toast } from "sonner";

interface RegistrationFormManagerProps {
  examId: string;
  examTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationFormManager({
  examId,
  examTitle,
  isOpen,
  onClose,
}: RegistrationFormManagerProps) {
  const [showCreateFormSheet, setShowCreateFormSheet] = useState(false);
  const [showResponsesSheet, setShowResponsesSheet] = useState(false);
  const [activeForm, setActiveForm] = useState<RegistrationForm | null>(null);
  const [viewResponseForm, setViewResponseForm] = useState<RegistrationForm | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      if (isOpen && examId) {
        setIsLoading(true);
        try {
          const form = await registrationService.getRegistrationFormByExamId(examId);
          setActiveForm(form);
        } catch (error) {
          console.error(error);
          toast.error("Failed to load registration form");
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchForm();
  }, [isOpen, examId]);

  const [formData, setFormData] = useState({
    title: `Registration for ${examTitle}`,
    description: "Please fill out this form to register for the exam.",
    isActive: true,
  });

  const [fields, setFields] = useState<RegistrationField[]>([
    {
      id: "1",
      type: "text" as const,
      label: "Full Name",
      required: true,
    },
    {
      id: "2",
      type: "email" as const,
      label: "Email Address",
      required: true,
    },
  ]);

  const [newField, setNewField] = useState<Partial<RegistrationField>>({
    type: "text",
    label: "",
    required: false,
    options: [],
  });
  const [optionsInput, setOptionsInput] = useState("");

  const loadFormForEditing = () => {
    if (!activeForm) return;

    setFormData({
      title: activeForm.title,
      description: activeForm.description,
      isActive: activeForm.isActive,
    });
    setFields(activeForm.fields);
    setIsEditing(true);
    setShowCreateFormSheet(true);
  };

  const resetFormData = () => {
    setFormData({
      title: `Registration for ${examTitle}`,
      description: "Please fill out this form to register for the exam.",
      isActive: true,
    });
    setFields([
      {
        id: "1",
        type: "text" as const,
        label: "Full Name",
        required: true,
      },
      {
        id: "2",
        type: "email" as const,
        label: "Email Address",
        required: true,
      },
    ]);
    setIsEditing(false);
  };

  const addField = () => {
    if (!newField.label) return;

    const field: RegistrationField = {
      id: Date.now().toString(),
      type: newField.type as RegistrationField["type"],
      label: newField.label,
      required: newField.required || false,
      options: newField.options,
    };

    setFields([...fields, field]);
    setNewField({ type: "text", label: "", required: false, options: [] });
    setOptionsInput("");
  };

  const removeField = (fieldId: string) => {
    setFields(fields.filter((field) => field.id !== fieldId));
  };

  const saveRegistrationForm = async () => {
    try {
      if (isEditing && activeForm) {
        // Update existing form
        const updated = await registrationService.updateRegistrationForm(activeForm.id || activeForm._id!, {
          ...formData,
          fields,
        });
        setActiveForm(updated);
        toast.success("Registration form updated successfully!");
      } else {
        const created = await registrationService.createRegistrationForm(examId, {
          ...formData,
          fields,
        });
        setActiveForm(created);
        toast.success("Registration form created successfully!");
      }

      setShowCreateFormSheet(false);
      resetFormData();
      // onClose(); // Keep open to show status? Or close as per original logic. Original closed it.
    } catch (error) {
      toast.error(`Failed to ${isEditing ? "update" : "create"} registration form.`);
    }
  };

  const copyShareableLink = () => {
    if (!activeForm) return;

    const link = registrationService.generateShareableLink(activeForm.id || activeForm._id!);
    navigator.clipboard.writeText(link);
    toast.success("Registration link copied to clipboard!");
  };

  const viewResponses = () => {
    if (!activeForm) return;
    setViewResponseForm(activeForm);
    setShowResponsesSheet(true);
  };

  const deleteForm = async () => {
    if (!activeForm) return;

    if (confirm("Are you sure you want to delete this registration form?")) {
      await registrationService.deleteRegistrationForm(activeForm.id || activeForm._id!);
      setActiveForm(null);
      toast.success("Registration form deleted successfully!");
      // onClose();
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Registration Form - {examTitle}</DialogTitle>
            <DialogDescription>Manage student registration for this exam</DialogDescription>
          </DialogHeader>

          {isLoading ? (
             <div className="flex justify-center py-8">Loading...</div>
          ) : activeForm ? (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Users className="w-4 h-4 mr-2" />
                    <h3 className="font-medium">Form Status</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span>Status:</span>
                      <Badge
                        variant={activeForm.isActive ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {activeForm.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Responses:</span>
                      <span className="font-semibold">{activeForm.responses.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fields:</span>
                      <span className="font-semibold">{activeForm.fields.length}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center mb-3">
                    <Mail className="w-4 h-4 mr-2" />
                    <h3 className="font-medium">Share Options</h3>
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start text-xs bg-transparent"
                      onClick={copyShareableLink}
                    >
                      <Copy className="w-3 h-3 mr-2" />
                      Copy Registration Link
                    </Button>
                  </div>
                </Card>
              </div>

              <div className="flex flex-wrap gap-2 justify-between">
                <div className="flex gap-2">
                  <Button size="sm" onClick={viewResponses}>
                    <Users className="w-4 h-4 mr-2" />
                    Responses ({activeForm.responses.length})
                  </Button>
                  <Button size="sm" variant="outline" onClick={loadFormForEditing}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Form
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={deleteForm}>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button size="sm" variant="outline" onClick={onClose}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-2">No Registration Form</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create a registration form to allow students to register for this exam
              </p>
              <Button
                onClick={() => {
                  resetFormData();
                  setShowCreateFormSheet(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Registration Form
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={showCreateFormSheet} onOpenChange={setShowCreateFormSheet}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>
              {isEditing ? "Edit Registration Form" : "Create Registration Form"}
            </SheetTitle>
            <SheetDescription>
              {isEditing
                ? "Update the registration form settings and fields"
                : `Set up a registration form for students to register for ${examTitle}`}
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 mt-6 px-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Form Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label>Active</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={formData.isActive}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({ ...prev, isActive: checked }))
                    }
                  />
                  <span className="text-sm">{formData.isActive ? "Active" : "Inactive"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Form Fields</h3>

              <div className="border rounded-lg p-4 space-y-4">
                <h4 className="font-medium">Add New Field</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Field Type</Label>
                    <Select
                      value={newField.type}
                      onValueChange={(value) =>
                        setNewField((prev) => ({
                          ...prev,
                          type: value as RegistrationField["type"],
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                        <SelectItem value="select">Select</SelectItem>
                        <SelectItem value="date">Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Field Label</Label>
                    <Input
                      value={newField.label}
                      onChange={(e) => setNewField((prev) => ({ ...prev, label: e.target.value }))}
                      placeholder="Enter field label"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Required</Label>
                    <div className="flex items-center space-x-2 pt-2">
                      <Switch
                        checked={newField.required}
                        onCheckedChange={(checked) =>
                          setNewField((prev) => ({ ...prev, required: checked }))
                        }
                      />
                    </div>
                  </div>
                </div>

                {newField.type === "select" && (
                  <div className="space-y-2">
                    <Label>Options (comma-separated)</Label>
                    <Input
                      placeholder="Option 1, Option 2, Option 3"
                      value={optionsInput}
                      onChange={(e) => {
                        const val = e.target.value;
                        setOptionsInput(val);
                        setNewField((prev) => ({
                          ...prev,
                          options: val
                            .split(",")
                            .map((opt) => opt.trim())
                            .filter(Boolean),
                        }));
                      }}
                    />
                  </div>
                )}

                <Button onClick={addField} disabled={!newField.label}>
                  Add Field
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Current Fields ({fields.length})</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded"
                    >
                      <div>
                        <span className="font-medium">{field.label}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({field.type}) {field.required && "• Required"}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeField(field.id)}
                        disabled={field.id === "1" || field.id === "2"} // Protect default fields
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateFormSheet(false);
                  resetFormData();
                }}
              >
                Cancel
              </Button>
              <Button onClick={saveRegistrationForm}>
                {isEditing ? "Update Form" : "Create Form"}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Registration Responses Sheet */}
      <Sheet open={showResponsesSheet} onOpenChange={setShowResponsesSheet}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Registration Responses</SheetTitle>
            <SheetDescription>
              {viewResponseForm?.responses.length || 0} responses received
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 mt-6">
            {viewResponseForm?.responses && viewResponseForm.responses.length > 0 ? (
              viewResponseForm.responses.map((response) => (
                <Card key={response.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{response.studentName}</CardTitle>
                      <Badge
                        variant={
                          response.status === "approved"
                            ? "default"
                            : response.status === "rejected"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {response.status}
                      </Badge>
                    </div>
                    <CardDescription>{response.studentEmail}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(response.responses).map(([fieldLabel, value]) => (
                        <div key={fieldLabel} className="flex justify-between">
                          <span className="font-medium">{fieldLabel}:</span>
                          <span>{value}</span>
                        </div>
                      ))}
                      <div className="text-xs text-muted-foreground pt-2">
                        Submitted: {new Date(response.submittedAt).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No responses yet</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
