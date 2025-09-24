"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { registrationService, type RegistrationForm } from "@/services/registrationService";
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
import { CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
// import { useToast } from "@/hooks/use-toast"

export default function RegistrationFormPage() {
  const params = useParams();
  const router = useRouter();
  //   const { toast } = useToast()
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const formId = params.formId as string;
    const forms = registrationService.getRegistrationForms();
    const foundForm = forms.find((f) => f.id === formId);

    if (foundForm && foundForm.isActive) {
      setForm(foundForm);
    }
  }, [params.formId]);

  const handleInputChange = (fieldId: string, value: string) => {
    setResponses((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setIsSubmitting(true);

    try {
      // Validate required fields
      const missingFields = form.fields
        .filter((field) => field.required && !responses[field.id])
        .map((field) => field.label);

      if (missingFields.length > 0) {
        toast.error("Missing required Fields", {
          description: `Please fill in: ${missingFields.join(", ")}`,
        });
        return;
      }

      // Get student name and email from responses
      const nameField = form.fields.find((f) => f.label.toLowerCase().includes("name"));
      const emailField = form.fields.find((f) => f.type === "email");

      const studentName = nameField ? responses[nameField.id] : "Unknown";
      const studentEmail = emailField ? responses[emailField.id] : "unknown@email.com";

      // Create response object with field labels as keys
      const responseData: Record<string, string> = {};
      form.fields.forEach((field) => {
        responseData[field.label] = responses[field.id] || "";
      });

      registrationService.submitRegistration(form.id, {
        studentName,
        studentEmail,
        responses: responseData,
      });

      setIsSubmitted(true);
      toast.success("Registration Submitted", {
        description: "Your registration has been submitted successfully!",
      });
    } catch (error) {
      toast.error("Registration Failed", {
        description: "There was an error submitting your registration.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!form) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Form Not Found</h3>
            <p className="text-muted-foreground mb-4">
              This registration form is not available or has been deactivated.
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Registration Submitted</h3>
            <p className="text-muted-foreground mb-4">
              Thank you for registering! You will receive confirmation details soon.
            </p>
            <Button onClick={() => router.push("/")}>Go Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{form.title}</CardTitle>
            <CardDescription>{form.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>

                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      id={field.id}
                      type="email"
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "date" && (
                    <Input
                      id={field.id}
                      type="date"
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "select" && field.options && (
                    <Select
                      value={responses[field.id] || ""}
                      onValueChange={(value) => handleInputChange(field.id, value)}
                      required={field.required}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Registration"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
