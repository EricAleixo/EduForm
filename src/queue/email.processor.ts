import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { EmailService } from '../email/email.service';

export interface EmailJobData {
  type: 'confirmation' | 'admin-notification' | 'approval';
  to: string;
  studentName: string;
  studentEmail?: string;
  registrationId: number;
}

@Processor('email')
export class EmailProcessor {
  constructor(private readonly emailService: EmailService) {}

  @Process('send-email')
  async handleSendEmail(job: Job<EmailJobData>) {
    const { type, to, studentName, studentEmail, registrationId } = job.data;

    try {
      if (type === 'confirmation') {
        await this.emailService.sendRegistrationConfirmation(
          to,
          studentName,
          registrationId
        );
        console.log(`✅ Email de confirmação enviado para: ${to}`);
      } else if (type === 'admin-notification') {
        await this.emailService.sendAdminNotification(
          studentName,
          studentEmail!,
          registrationId
        );
        console.log(`✅ Notificação enviada para admin: ${to}`);
      } else if (type === 'approval') {
        await this.emailService.sendApprovalEmail(
          to,
          studentName,
          registrationId
        );
        console.log(`✅ Email de aprovação enviado para: ${to}`);
      }
    } catch (error) {
      console.error(`❌ Erro ao processar email ${type}:`, error);
      throw error;
    }
  }
} 