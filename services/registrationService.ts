export interface RegistrationForm {
  id: string;
  examId: string;
  title: string;
  description: string;
  fields: RegistrationField[];
  isActive: boolean;
  createdAt: string;
  responses: RegistrationResponse[];
}

export interface RegistrationField {
  id: string;
  type: "text" | "email" | "select" | "textarea" | "date";
  label: string;
  required: boolean;
  options?: string[]; // for select fields
}

export interface RegistrationResponse {
  id: string;
  studentEmail: string;
  studentName: string;
  responses: Record<string, string>;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
}

const storageKey = "cbt_registration_forms";

export const registrationService = {
  getRegistrationForms(): RegistrationForm[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(storageKey);
    return stored ? JSON.parse(stored) : [];
  },

  saveRegistrationForms(forms: RegistrationForm[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(storageKey, JSON.stringify(forms));
  },

  createRegistrationForm(
    examId: string,
    formData: Omit<RegistrationForm, "id" | "createdAt" | "responses">
  ): RegistrationForm {
    const forms = this.getRegistrationForms();
    const newForm: RegistrationForm = {
      ...formData,
      id: Date.now().toString(),
      examId,
      createdAt: new Date().toISOString(),
      responses: [],
    };

    forms.push(newForm);
    this.saveRegistrationForms(forms);
    return newForm;
  },

  getRegistrationFormByExamId(examId: string): RegistrationForm | null {
    const forms = this.getRegistrationForms();
    return forms.find((form) => form.examId === examId) || null;
  },

  updateRegistrationForm(formId: string, updates: Partial<RegistrationForm>): void {
    const forms = this.getRegistrationForms();
    const index = forms.findIndex((form) => form.id === formId);
    if (index !== -1) {
      forms[index] = { ...forms[index], ...updates };
      this.saveRegistrationForms(forms);
    }
  },

  submitRegistration(
    formId: string,
    response: Omit<RegistrationResponse, "id" | "submittedAt" | "status">
  ): void {
    const forms = this.getRegistrationForms();
    const formIndex = forms.findIndex((form) => form.id === formId);

    if (formIndex !== -1) {
      const newResponse: RegistrationResponse = {
        ...response,
        id: Date.now().toString(),
        submittedAt: new Date().toISOString(),
        status: "pending",
      };

      forms[formIndex].responses.push(newResponse);
      this.saveRegistrationForms(forms);
    }
  },

  generateShareableLink(formId: string): string {
    return `${window.location.origin}/register/${formId}`;
  },

  deleteRegistrationForm(formId: string): void {
    const forms = this.getRegistrationForms();
    const filtered = forms.filter((form) => form.id !== formId);
    this.saveRegistrationForms(filtered);
  },
};
