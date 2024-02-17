import { test as base } from '@playwright/test';
import { RegistrationPage } from 'src/pages/Registration.page';

type Fixtures = {
  pages: {
    registrationPage: RegistrationPage;
  };
};

export const test = base.extend<Fixtures>({
  pages: async ({ page }, use) => {
    const pages = {
      registrationPage: new RegistrationPage(page),
    };
    await use(pages);
  },
});
