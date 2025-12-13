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
  const [form, setForm] = useState<RegistrationForm | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const formId = params.formId as string;
    const loadForm = async () => {
        setIsLoading(true);
        try {
            const foundForm = await registrationService.getRegistrationFormById(formId);
            if (foundForm && foundForm.isActive) {
                setForm(foundForm);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    loadForm();
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

      await registrationService.submitRegistration(form.id, {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
           <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
           <p className="text-muted-foreground animate-pulse">Loading registration form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-slate-900">Form Not Found</h3>
            <p className="text-muted-foreground mb-6">
              This registration form is currently unavailable or has been deactivated by the administrator.
            </p>
            <Button onClick={() => router.push("/")} variant="outline">Back to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border-green-200">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold mb-2 text-slate-900">Registration Complete!</h3>
            <p className="text-muted-foreground mb-6">
              Thank you for registering. Your details have been successfully submitted.
            </p>
            <Button onClick={() => router.push("/")} className="w-full">Return Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-xl mx-auto">
    

        <Card className="shadow-sm border-slate-200 bg-white overflow-hidden rounded-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 py-6">
                <div className="text-center mb-10">
           <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
              <CheckCircle className="w-6 h-6" />
           </div>
           <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">{form.title}</h1>
           <p className="mt-2 text-base text-slate-600 max-w-md mx-auto">{form.description}</p>
        </div>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {form.fields.map((field) => (
                <div key={field.id} className="space-y-2">
                  <Label htmlFor={field.id} className="text-sm font-medium text-slate-700 block">
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1" title="Required">*</span>}
                  </Label>

                  {field.type === "text" && (
                    <Input
                      id={field.id}
                      className="h-10 bg-white border-slate-300 focus:border-primary focus:ring-primary/20 transition-all font-normal text-slate-900 placeholder:text-slate-400"
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "email" && (
                    <Input
                      id={field.id}
                      type="email"
                      className="h-10 bg-white border-slate-300 focus:border-primary focus:ring-primary/20 transition-all font-normal text-slate-900 placeholder:text-slate-400"
                      placeholder="name@example.com"
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "textarea" && (
                    <Textarea
                      id={field.id}
                      className="min-h-[100px] bg-white border-slate-300 focus:border-primary focus:ring-primary/20 transition-all resize-y font-normal text-slate-900 placeholder:text-slate-400 p-3"
                      placeholder="Type your answer here..."
                      value={responses[field.id] || ""}
                      onChange={(e) => handleInputChange(field.id, e.target.value)}
                      required={field.required}
                    />
                  )}

                  {field.type === "date" && (
                    <Input
                      id={field.id}
                      type="date"
                      className="h-10 bg-white border-slate-300 focus:border-primary focus:ring-primary/20 transition-all font-normal text-slate-900"
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
                      <SelectTrigger className="h-10 bg-white border-slate-300 focus:border-primary focus:ring-primary/20 transition-all font-normal text-slate-900">
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

              {form.fields.length === 0 && (
                 <div className="text-center py-12 text-slate-400 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                    <p>No fields to fill out.</p>
                 </div>
              )}

              <div className="pt-4">
                <Button 
                    type="submit" 
                    className="w-full h-10 text-base font-medium shadow-sm transition-all bg-primary hover:bg-primary/90 text-primary-foreground" 
                    disabled={isSubmitting || form.fields.length === 0}
                >
                    {isSubmitting ? (
                        <>
                           <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                           Submitting...
                        </>
                    ) : (
                        "Submit Registration"
                    )}
                </Button>
              </div>
            </form>
          </CardContent>
          <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
            <p className="text-xs text-slate-400">
              Powered by <span className="font-semibold text-slate-600">SecureExam</span> • Privacy Policy
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
