import { Locator, Page, expect } from '@playwright/test';

export class SuccessfulFormComponent {
  private readonly infoElement: Locator;
  private readonly avatarImg: Locator;

  constructor(private readonly page: Page) {
    this.infoElement = page.locator('li');
    this.avatarImg = page.locator(`img[alt='Avatar']`);
  }

  async shouldBeVisible() {
    await expect(
      this.page.getByText('Successful Form Submissions'),
    ).toBeVisible();
  }

  async nameShouldBeEqualTo(expectedName: string): Promise<void> {
    const textContent = await this.infoElement.innerText();
    const nameMatch = textContent.match(/Name:\s*(.*?)\s*Email:/s);
    const name = nameMatch ? nameMatch[1].trim() : '';
    expect(name).toBe(expectedName);
  }

  async emailShouldBeEqualTo(expectedEmail: string): Promise<void> {
    const textContent = await this.infoElement.innerText();
    const emailMatch = textContent.match(/Email:\s*(.*?)\s*(?:Avatar:|$)/s);
    const email = emailMatch ? emailMatch[1].trim() : '';
    expect(email).toBe(expectedEmail);
  }

  async avatarShouldBeVisible(): Promise<void> {
    await expect(this.avatarImg).toBeVisible();
    const avatarSrc = await this.avatarImg.getAttribute('src');
    expect(avatarSrc).not.toBeNull();
  }
}
