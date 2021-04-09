import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { pugEngine } from 'nodemailer-pug-engine';
import Log from '../../../utils/log';
import { UserTypes } from '../../../data/types/entity-types';

export class Email {
  private email: Mail;

  private readonly templateDir = __dirname + '/templates';  

  constructor() {
    this.email = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      }
    });

    this.email.verify((error) => (error)
      ? Log.error(error, 'email')
      : Log.info('Logged in to email service', 'email'));
    
    this.email.use('compile', pugEngine({
      templateDir: this.templateDir,
      pretty: true,
    }));
  }

  public async send<K extends keyof EmailTemplate>(template: K, ctx: EmailTemplate[K], ...to: string[]) {
    await this.email.sendMail({
      from: process.env.EMAIL_ADDRESS,
      to: to.join(', '),
      subject: subjects[template],
      template,
      ctx,
    } as any);
  }
}

export interface EmailTemplate {
  'verify': {
    expiresIn: number;
    user: UserTypes.Self;
    code: string;
  };
  'verify-email': this['verify'];
} 

const subjects: { [k in keyof EmailTemplate]: string } = {
  'verify': 'Accord - Login Verification Code',
  'verify-email': 'Accord - Verify Email',
};