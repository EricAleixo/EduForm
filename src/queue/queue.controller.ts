import { Controller, Get, UseGuards } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { EmailJobData } from './email.processor';

@Controller('queue')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class QueueController {
  constructor(
    @InjectQueue('email') private readonly emailQueue: Queue<EmailJobData>
  ) {}

  @Get('status')
  async getQueueStatus() {
    const [emailWaiting, emailActive, emailCompleted, emailFailed] = await Promise.all([
      this.emailQueue.getWaiting(),
      this.emailQueue.getActive(),
      this.emailQueue.getCompleted(),
      this.emailQueue.getFailed(),
    ]);

    return {
      email: {
        waiting: emailWaiting.length,
        active: emailActive.length,
        completed: emailCompleted.length,
        failed: emailFailed.length,
      },
      total: {
        waiting: emailWaiting.length,
        active: emailActive.length,
        completed: emailCompleted.length,
        failed: emailFailed.length,
      }
    };
  }

  @Get('jobs')
  async getJobs() {
    const emailJobs = await this.emailQueue.getJobs(['waiting', 'active', 'completed', 'failed']);

    return {
      email: emailJobs.map(job => ({
        id: job.id,
        status: job.finishedOn ? 'completed' : job.failedReason ? 'failed' : 'processing',
        data: job.data,
        progress: job.progress(),
        timestamp: job.timestamp,
      })),
    };
  }
} 