import { Locator, Page, expect } from '@playwright/test';

export class ApplicationFormComponent {
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly confirmPasswordField: Locator;
  private readonly uploadAvatarButton: Locator;
  private readonly captchaSlider: Locator;
  private readonly submitFormButton: Locator;
  private readonly errorContainer: Locator;

  constructor(private readonly page: Page) {
    this.firstNameField = page.locator(`input[name='first_name']`);
    this.lastNameField = page.locator(`input[name='last_name']`);
    this.emailField = page.locator(`input[name='email']`);
    this.passwordField = page.locator(`input[name='password']`);
    this.confirmPasswordField = page.locator(`input[name='confirm_password']`);
    this.uploadAvatarButton = page.locator(`input[name='avatar']`);
    this.captchaSlider = page.locator(`#slider-thumb`);
    this.submitFormButton = page.locator(`input[type='submit']`);
    this.errorContainer = page.locator('ul > li');
  }

  async fillForm(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmedPassword: string;
  }): Promise<void> {
    await this.setFirstName(userData.firstName);
    await this.setLastName(userData.lastName);
    await this.setEmail(userData.email);
    await this.setPassword(userData.password);
    await this.confirmPassword(userData.confirmedPassword);
  }

  async setFirstName(firstName: string): Promise<void> {
    await this.firstNameField.fill(firstName);
  }

  async setLastName(lastName: string): Promise<void> {
    await this.lastNameField.fill(lastName);
  }

  async setEmail(email: string): Promise<void> {
    await this.emailField.fill(email);
  }

  async setPassword(pass: string): Promise<void> {
    await this.passwordField.fill(pass);
  }

  async confirmPassword(pass: string): Promise<void> {
    await this.confirmPasswordField.fill(pass);
  }

  async setAvatar(path: string): Promise<void> {
    await this.uploadAvatarButton.setInputFiles(path);
  }

  async unlockCaptcha(): Promise<void> {
    await this.page.evaluate(() => {
      const sliderThumb = document.querySelector('#slider-thumb');
      const sliderTrack = document.querySelector('#slider-track');
      const end = sliderTrack['offsetWidth'] - sliderThumb['offsetWidth'];

      sliderThumb['style'].left = `${end}px`;
      sliderThumb.textContent = 'Unlocked';

      if (!document.querySelector('#captcha_solved')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.setAttribute('type', 'hidden');
        hiddenInput.setAttribute('id', 'captcha_solved');
        hiddenInput.setAttribute('name', 'captcha_solved');
        hiddenInput.setAttribute('value', 'true');
        document.querySelector('form').appendChild(hiddenInput);
      }
    });
  }

  async unlockCaptchaHalfway(): Promise<void> {
    const sliderThumb = this.page.locator('#slider-thumb');
    const sliderTrack = this.page.locator('#slider-track');

    const thumbBox = await sliderThumb.boundingBox();
    const trackBox = await sliderTrack.boundingBox();

    const startX = thumbBox.x + thumbBox.width / 2;
    const startY = thumbBox.y + thumbBox.height / 2;

    const endX = trackBox.x + trackBox.width / 2;

    await this.page.mouse.move(startX, startY);
    await this.page.mouse.down();
    await this.page.mouse.move(endX, startY, { steps: 10 });
    await this.page.mouse.up();
  }

  async submitForm(): Promise<void> {
    await this.submitFormButton.click();
  }

  async validationErrorShouldBeVisible(errorText: string): Promise<void> {
    await expect(this.errorContainer).toHaveText(errorText);
  }
}
