import { test, expect } from "@playwright/test";

test("Complete authentication flow", async ({ page, request }) => {

  const email = `houria${Date.now()}@gmail.com`;
  const password = "Password123!";

  // Register
  await page.goto("/register");

  await page.getByPlaceholder("Enter your full name").fill("Houria");

  await page.getByPlaceholder("Enter your email").fill(email);

  await page.getByPlaceholder("Create a password").fill(password);

  await page.getByRole("checkbox").check();

  await page.getByRole("button", { name: /register/i }).click();

  // Should navigate to verification pending page
  await expect(page).toHaveURL(/verify-email-pending/);

  await expect(
    page.getByText(/check your email/i)
  ).toBeVisible();

  // Verify account using backend test route
  await request.post("http://localhost:5000/api/auth/test/verify", {
    data: { email },
  });

  // Login
  await page.goto("/login");

  await page.getByPlaceholder("Enter your email").fill(email);

  await page.getByPlaceholder("Enter your password").fill(password);

  await page.getByRole("button", {
    name: /log in/i,
  }).click();

  // Should land on onboarding
  await expect(page).toHaveURL(/Onboarding/);

  // Fill onboarding
  await page.getByRole("textbox").fill("Houria");

  await page.getByRole("button", {
    name: /continue/i,
  }).click();

  // Finished
  await expect(page).toHaveURL(/analyze/);
});