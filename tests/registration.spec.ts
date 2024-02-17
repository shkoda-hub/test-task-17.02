import { test } from '../src/fixture/customFixture';
import { faker } from '@faker-js/faker';

const userData = {
  firstName: faker.name.firstName(),
  lastName: faker.name.lastName(),
  email: faker.internet.email(),
  password: 'qwerty123',
  confirmedPassword: 'qwerty123',
};

test.describe('registration tests', async () => {
  test.beforeEach(async ({ pages }) => {
    await pages.registrationPage.open();
  });

  test('should be possible to register with valid data', async ({ pages }) => {
    await test.step('fill registration form', async () => {
      await pages.registrationPage.applicationForm.fillForm(userData);
    });

    await test.step('unlock captcha and submit form', async () => {
      await pages.registrationPage.applicationForm.unlockCaptcha();
      await pages.registrationPage.applicationForm.submitForm();
    });

    await test.step('validate successful form', async () => {
      await pages.registrationPage.successfulForm.shouldBeVisible();
      await pages.registrationPage.successfulForm.nameShouldBeEqualTo(
        `${userData.firstName} ${userData.lastName}`,
      );

      await pages.registrationPage.successfulForm.emailShouldBeEqualTo(
        userData.email,
      );
    });
  });

  test('should be validation by password match', async ({ pages }) => {
    await test.step('fill registration form', async () => {
      await pages.registrationPage.applicationForm.setFirstName(
        userData.firstName,
      );

      await pages.registrationPage.applicationForm.setLastName(
        userData.lastName,
      );

      await pages.registrationPage.applicationForm.setEmail(userData.email);

      await pages.registrationPage.applicationForm.setPassword(
        userData.password,
      );

      await pages.registrationPage.applicationForm.confirmPassword(
        userData.password + '1',
      );
    });

    await test.step('unlock captcha and submit form', async () => {
      await pages.registrationPage.applicationForm.unlockCaptcha();
      await pages.registrationPage.applicationForm.submitForm();
    });

    await test.step('check validation error', async () => {
      await pages.registrationPage.applicationForm.validationErrorShouldBeVisible(
        'Passwords do not match!',
      );
    });
  });

  test('halfway captcha should not be accepted', async ({ pages }) => {
    await test.step('fill registration form', async () => {
      await pages.registrationPage.applicationForm.fillForm(userData);
    });

    await test.step('unlock captcha to halfway and submit form', async () => {
      await pages.registrationPage.applicationForm.unlockCaptchaHalfway();
      await pages.registrationPage.applicationForm.submitForm();
    });

    await test.step('check validation error', async () => {
      await pages.registrationPage.applicationForm.validationErrorShouldBeVisible(
        'Please solve the captcha!',
      );
    });
  });

  test('should be possible to upload png avatar', async ({ pages }) => {
    await test.step('fill registration form', async () => {
      await pages.registrationPage.applicationForm.fillForm(userData);
    });

    await test.step('upload avatar', async () => {
      await pages.registrationPage.applicationForm.setAvatar(
        'tests/testAvatars/png_avatar.png',
      );
    });

    await test.step('unlock captcha and submit form', async () => {
      await pages.registrationPage.applicationForm.unlockCaptcha();
      await pages.registrationPage.applicationForm.submitForm();
    });

    await test.step('validate avatar', async () => {
      await pages.registrationPage.successfulForm.avatarShouldBeVisible();
    });
  });

  test('should be possible to upload jpg avatar', async ({ pages }) => {
    await test.step('fill registration form', async () => {
      await pages.registrationPage.applicationForm.fillForm(userData);
    });

    await test.step('upload avatar', async () => {
      await pages.registrationPage.applicationForm.setAvatar(
        'tests/testAvatars/jpg_avatar.jpg',
      );
    });

    await test.step('unlock captcha and submit form', async () => {
      await pages.registrationPage.applicationForm.unlockCaptcha();
      await pages.registrationPage.applicationForm.submitForm();
    });

    await test.step('validate avatar', async () => {
      await pages.registrationPage.successfulForm.avatarShouldBeVisible();
    });
  });
});
