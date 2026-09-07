import { z } from 'zod';

export const clientSchema = z.object({
 name: z.string().min(1, 'Client name is required'),
 industry: z.string().min(1, 'Industry is required'),
 website: z.string().url('Invalid URL').optional().or(z.literal('')),
 contactName: z.string().min(1, 'Contact name is required'),
 contactEmail: z.string().email('Invalid email address'),
 contactPhone: z.string().optional().or(z.literal('')),
 address: z.object({
 street: z.string().optional(),
 city: z.string().optional(),
 state: z.string().optional(),
 country: z.string().optional(),
 zipCode: z.string().optional(),
 }).optional(),
 notes: z.string().optional(),
 status: z.enum(['active', 'inactive', 'archived']).default('active'),
 tags: z.array(z.string()).default([]),
});

export const reportSchema = z.object({
 title: z.string().min(1, 'Title is required'),
 description: z.string().optional(),
 type: z.enum(['monthly', 'quarterly', 'annual', 'custom']),
 clientId: z.string().min(1, 'Client is required'),
 sections: z.array(
 z.object({
 name: z.string(),
 type: z.enum(['kpi', 'chart', 'narrative', 'table', 'recommendation']),
 config: z.record(z.any()),
 order: z.number(),
 enabled: z.boolean(),
 })
 ).default([]),
});

export const organizationSchema = z.object({
 name: z.string().min(1, 'Organization name is required'),
 domain: z.string().min(1, 'Domain is required'),
 timezone: z.string().default('UTC'),
 dateFormat: z.string().default('MM/DD/YYYY'),
 currency: z.string().default('USD'),
 locale: z.string().default('en-US'),
});

export const signInSchema = z.object({
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const signUpSchema = z.object({
 organizationName: z.string().min(1, 'Organization name is required'),
 firstName: z.string().min(1, 'First name is required'),
 lastName: z.string().min(1, 'Last name is required'),
 email: z.string().email('Invalid email address'),
 password: z.string().min(8, 'Password must be at least 8 characters'),
 confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
 message: 'Passwords do not match',
 path: ['confirmPassword'],
});

export type ClientFormData = z.infer<typeof clientSchema>;
export type ReportFormData = z.infer<typeof reportSchema>;
export type OrganizationFormData = z.infer<typeof organizationSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;
