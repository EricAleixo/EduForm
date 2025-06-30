import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EmailJobData } from './email.processor';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue<EmailJobData>
  ) {}

  async addEmailJob(data: EmailJobData) {
    await this.emailQueue.add('send-email', data, {
      attempts: 3, // Tentar 3 vezes se falhar
      backoff: {
        type: 'exponential',
        delay: 2000, // 2 segundos inicial
      },
    });
  }

  async addConfirmationEmail(to: string, studentName: string, registrationId: number) {
    await this.addEmailJob({
      type: 'confirmation',
      to,
      studentName,
      registrationId,
    });
  }

  async addAdminNotificationEmail(studentName: string, studentEmail: string, registrationId: number) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    
    await this.addEmailJob({
      type: 'admin-notification',
      to: adminEmail,
      studentName,
      studentEmail,
      registrationId,
    });
  }

  async addApprovalEmail(to: string, studentName: string, registrationId: number) {
    await this.addEmailJob({
      type: 'approval',
      to,
      studentName,
      registrationId,
    });
  }

  async addAdminApprovalRequestEmail(studentName: string, studentEmail: string, registrationId: number, approvalToken: string) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    await this.addEmailJob({
      type: 'admin-approval-request',
      to: adminEmail,
      studentName,
      studentEmail,
      registrationId,
      approvalToken,
    });
  }
} 