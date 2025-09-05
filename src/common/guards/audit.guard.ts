import { Injectable, CanActivate, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

export const AUDIT_KEY = 'audit';
export const Audit = (action: string) => SetMetadata(AUDIT_KEY, action);

@Injectable()
export class AuditGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const action = this.reflector.get<string>(AUDIT_KEY, context.getHandler());
    
    if (!action) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    // Log audit event
    this.logAuditEvent(action, user, request);
    
    return true;
  }

  private logAuditEvent(action: string, user: any, request: any) {
    const auditLog = {
      timestamp: new Date().toISOString(),
      action,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.role,
      ip: request.ip,
      userAgent: request.get('User-Agent'),
      method: request.method,
      url: request.url,
      body: this.sanitizeBody(request.body),
      params: request.params,
      query: request.query,
    };

    // In production, you would send this to a logging service
    console.log('AUDIT LOG:', JSON.stringify(auditLog, null, 2));
    
    // TODO: Send to audit service (e.g., Winston, ELK stack, etc.)
  }

  private sanitizeBody(body: any): any {
    if (!body) return body;
    
    const sanitized = { ...body };
    
    // Remove sensitive fields
    const sensitiveFields = ['password', 'currentPassword', 'newPassword'];
    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]';
      }
    });
    
    return sanitized;
  }
}
