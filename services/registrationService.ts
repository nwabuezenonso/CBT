export interface RegistrationForm {
  id: string; // Mongoose _id or virtual id
  _id?: string;
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

export const registrationService = {
  getRegistrationForms: async (): Promise<RegistrationForm[]> => {
    const res = await fetch('/api/registrations');
    if (!res.ok) throw new Error('Failed to fetch registration forms');
    const forms = await res.json();
    return forms.map((f: any) => ({ ...f, id: f.id || f._id }));
  },

  getRegistrationFormByExamId: async (examId: string): Promise<RegistrationForm | null> => {
     try {
       const forms = await registrationService.getRegistrationForms();
       return forms.find(f => f.examId === examId) || null;
     } catch (e) {
       return null;
     }
  },

  getRegistrationFormById: async (id: string): Promise<RegistrationForm | null> => {
    const res = await fetch(`/api/registrations/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Failed to fetch registration form');
    const f = await res.json();
    return { ...f, id: f.id || f._id };
  },

  createRegistrationForm: async (
    examId: string,
    formData: Omit<RegistrationForm, "id" | "createdAt" | "responses" | "_id" | "examId">
  ): Promise<RegistrationForm> => {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, examId, responses: [] }),
    });
    if (!res.ok) throw new Error('Failed to create registration form');
    const f = await res.json();
    return { ...f, id: f.id || f._id };
  },

  updateRegistrationForm: async (formId: string, updates: Partial<RegistrationForm>): Promise<RegistrationForm> => {
    const res = await fetch(`/api/registrations/${formId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update registration form');
    const f = await res.json();
    return { ...f, id: f.id || f._id };
  },

  deleteRegistrationForm: async (formId: string): Promise<void> => {
    const res = await fetch(`/api/registrations/${formId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete registration form');
  },

  submitRegistration: async (
    formId: string,
    response: Omit<RegistrationResponse, "id" | "submittedAt" | "status">
  ): Promise<void> => {
     const res = await fetch(`/api/registrations/${formId}/responses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
     });
     
     if (!res.ok) throw new Error('Failed to submit registration');
  },

  generateShareableLink: (formId: string): string => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/register/${formId}`;
  },
};
