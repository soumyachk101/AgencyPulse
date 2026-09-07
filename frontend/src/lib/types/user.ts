export interface User {
 id: string;
 email: string;
 firstName: string;
 lastName: string;
 role: 'admin' | 'manager' | 'analyst';
 avatarUrl?: string;
 organizationId: string;
 createdAt: Date;
 updatedAt: Date;
}
