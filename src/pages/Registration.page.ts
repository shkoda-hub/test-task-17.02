import { Page } from '@playwright/test';
import { ApplicationFormComponent } from 'src/components/ApplicationForm.component';
import { SuccessfulFormComponent } from 'src/components/SuccessfulForm.component';

export class RegistrationPage {
  public readonly applicationForm: ApplicationFormComponent;
  public readonly successfulForm: SuccessfulFormComponent;

  constructor(private readonly page: Page) {
    this.applicationForm = new ApplicationFormComponent(this.page);
    this.successfulForm = new SuccessfulFormComponent(this.page);
  }

  async open() {
    await this.page.goto('/');
  }
}
