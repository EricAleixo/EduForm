import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  private getAppUrl(): string {
    return this.configService.get<string>('APP_URL', 'http://localhost:4200');
  }

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
                  <a href="${this.getAppUrl()}" style="display: inline-block; margin-bottom: 10px; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px; text-decoration: none;">Ir para a Home</a>
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
                  <strong>Data:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
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

  async sendApprovalEmail(
    to: string,
    studentName: string,
    registrationId: number
  ) {
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Inscrição Aprovada - Parabéns!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; text-align: center;">
              <h1 style="color: #155724; margin-bottom: 20px;">🎉 Inscrição Aprovada!</h1>
              
              <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="color: #333; margin-bottom: 15px;">Parabéns, ${studentName}!</h2>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                  Sua inscrição foi <strong>aprovada</strong> com sucesso! 
                  Estamos muito felizes em tê-lo(a) conosco!
                </p>
                
                <div style="background-color: #d1ecf1; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>Número de Inscrição:</strong> #${registrationId}
                </div>
                
                <p style="color: #666; line-height: 1.6; margin-bottom: 15px;">
                  Nossa equipe entrará em contato em breve com mais informações sobre o início das atividades.
                </p>
                
                <div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;">
                  <strong>📋 Próximos Passos:</strong><br>
                  • Aguarde contato da nossa equipe<br>
                  • Prepare-se para o início das atividades<br>
                  • Mantenha seus dados atualizados
                </div>
                
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                  <a href="${this.getAppUrl()}" style="display: inline-block; margin-bottom: 10px; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px; text-decoration: none;">Ir para a Home</a>
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });
      
      console.log(`Email de aprovação enviado para: ${to}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email de aprovação:', error);
      return false;
    }
  }

  async sendAdminApprovalRequest(
    studentName: string,
    studentEmail: string,
    registrationId: number,
    approvalToken: string
  ) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
      const approvalLink = `${this.getAppUrl()}/admin/approve/${registrationId}?token=${approvalToken}`;
      await this.mailerService.sendMail({
        to: adminEmail,
        subject: 'Aprovar Inscrição de Estudante',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h1 style="color: #ffc107; margin-bottom: 20px;">🔔 Aprovação de Inscrição</h1>
              <div style="background-color: white; padding: 20px; border-radius: 8px;">
                <h2 style="color: #333; margin-bottom: 15px;">Detalhes do Estudante:</h2>
                <div style="margin-bottom: 15px;">
                  <strong>Nome:</strong> ${studentName}<br>
                  <strong>Email:</strong> ${studentEmail}<br>
                  <strong>ID da Inscrição:</strong> #${registrationId}<br>
                </div>
                <p style="color: #666; line-height: 1.6;">Clique no botão abaixo para aprovar este estudante:</p>
                <a href="${approvalLink}" style="display: inline-block; margin: 20px 0; padding: 12px 24px; background-color: #28a745; color: white; border-radius: 5px; text-decoration: none; font-size: 16px;">Aprovar Estudante</a>
                <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #dee2e6;">
                  <a href="${this.getAppUrl()}" style="display: inline-block; margin-bottom: 10px; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px; text-decoration: none;">Ir para a Home</a>
                  <p style="color: #999; font-size: 14px; margin: 0;">
                    Este é um email automático, por favor não responda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        `,
      });
      console.log(`Solicitação de aprovação enviada para admin: ${adminEmail}`);
      return true;
    } catch (error) {
      console.error('Erro ao enviar solicitação de aprovação para admin:', error);
      return false;
    }
  }
} 