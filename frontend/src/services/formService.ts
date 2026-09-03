import { api } from '@/lib/api';

export interface NewsletterPayload {
  email: string;
  source?: string;
}

export interface ContactPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export interface ConsultationPayload {
  name: string;
  email: string;
  phone: string;
  city: string;
  preferred_date?: string;
  requirement_type?: string;
}

export interface RequirementPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_whatsapp?: string;
  property_type: string;
  property_status: string;
  location_city: string;
  location_state?: string;
  location_locality?: string;
  pincode?: string;
  address?: string;
  scope: string;
  property_size: string;
  budget_range: string;
  timeline: string;
  design_preferences?: string;
  additional_notes?: string;
}

export const formService = {
  subscribeNewsletter: async (data: NewsletterPayload) => {
    const response = await api.post('/api/v1/newsletter/subscribe', data);
    return response.data;
  },

  submitContact: async (data: ContactPayload) => {
    const response = await api.post('/api/v1/contact', data);
    return response.data;
  },

  submitConsultation: async (data: ConsultationPayload) => {
    const response = await api.post('/api/v1/consultations', data);
    return response.data;
  },

  submitRequirement: async (data: RequirementPayload) => {
    const response = await api.post('/api/v1/requirements', data);
    return response.data;
  }
};
