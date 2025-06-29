import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendRegistrationConfirmation(
    to: string,
    studentName: string,
    registrationId: number
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Confirmação de Inscrição - Formulário de Estudante',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
              <h1 style="color: #007bff; margin-bottom: 20px;">✅ Inscrição Confirmada!</h1>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #333; margin-bottom: 15px;">Olá, ${studentName}!</h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                  Sua inscrição foi recebida e processada com sucesso. 
                  Agradecemos seu interesse em nosso programa!
                </p>
                
                <div style="background-color: #e9ecef; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>Número de Inscrição:</strong> #${registrationId}
                </div>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                  Guarde este número para futuras consultas. 
                  Nossa equipe entrará em contato em breve com mais informações.
                </p>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });
      
      console.log(`Email de confirmação enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return false;
    }
  }

  async sendAdminNotification(
    studentName: string,
    studentEmail: string,
    registrationId: number
  ) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: 'Nova Inscrição Recebida',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h1 style="color: #28a745; margin-bottom: 20px;">📝 Nova Inscrição</h1>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 15px;">Detalhes da Inscrição:</h2>
                
                <div style="margin-bottom: 15px;">
                  <strong>Nome:</strong> ${studentName}<br>
                  <strong>Email:</strong> ${studentEmail}<br>
                  <strong>ID da Inscrição:</strong> #${registrationId}<br>
                  <strong>Data:</strong> ${new Date().toLocaleString('pt-BR')}
                </div>
                
                <p style="color: #666; line-height: 1.6;">
                  Uma nova inscrição foi recebida através do formulário. 
                  Acesse o painel administrativo para revisar os detalhes completos.
                </p>
              </div>
            </div>
          </div>
        `,
      });
      
      console.log(`Notificação enviada para admin: ${adminEmail}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar notificação para admin:', error);
      return false;
    }
  }
} 