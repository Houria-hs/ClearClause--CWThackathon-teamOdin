import { test, expect } from "@playwright/test";

const backendUrl = "http://localhost:5000";

async function getUserState(request, email) {
  const response = await request.post(`${backendUrl}/api/auth/test/user-state`, { data: { email } });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

test("verified users receive a JWT only after one-time token verification", async ({ page, request }) => {
  const email = `verified-${Date.now()}@gmail.com`;
  const password = "Password123!";

  const runtime = await request.get(`${backendUrl}/api/auth/test/runtime`);
  expect(runtime.ok()).toBeTruthy();
  expect(await runtime.json()).toEqual({ testMode: true });

  await page.goto("/register");
  await page.getByPlaceholder("Enter your full name").fill("Verified User");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /^register$/i }).click();
  await expect(page).toHaveURL(/verify-email-pending/);

  const pendingState = await getUserState(request, email);
  expect(pendingState.is_verified).toBe(false);
  expect(pendingState.verification_token).toEqual(expect.any(String));

  const verificationLink = await request.post(`${backendUrl}/api/auth/test/verification-link`, { data: { email } });
  expect(verificationLink.ok()).toBeTruthy();
  const { verificationUrl } = await verificationLink.json();
  expect(verificationUrl).toMatch(/^http:\/\/localhost:5000\/api\/auth\/verify-email\?token=/);

  await page.goto(verificationUrl);
  await expect(page).toHaveURL(/verify-email-success/);
  await expect(page.getByRole("heading", { name: /email verified successfully/i })).toBeVisible();
  await expect(page).toHaveURL(/login/, { timeout: 6500 });

  const verifiedState = await getUserState(request, email);
  expect(verifiedState.is_verified).toBe(true);
  expect(verifiedState.verification_token).toBeNull();

  const reusedToken = await request.get(verificationUrl, { maxRedirects: 0 });
  expect(reusedToken.status()).toBe(400);

  const successfulLogin = await request.post(`${backendUrl}/api/auth/login`, { data: { email, password } });
  expect(successfulLogin.ok()).toBeTruthy();
  expect((await successfulLogin.json()).token).toEqual(expect.any(String));

  await page.goto("/login");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/Onboarding/);
  await page.getByRole("textbox").fill("Verified User");
  await page.getByRole("button", { name: /proceed/i }).click();
  await page.getByRole("button", { name: /agree & continue/i }).click();
  await expect(page).toHaveURL(/analyze/);

  // A returning onboarded user skips onboarding.
  await page.goto("/login");
  await page.evaluate(() => localStorage.removeItem("token"));
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/analyze/);
});

test("unverified users cannot receive or store a JWT, including after invalid verification", async ({ page, request }) => {
  const email = `unverified-${Date.now()}@gmail.com`;
  const password = "Password123!";

  await page.goto("/register");
  await page.getByPlaceholder("Enter your full name").fill("Unverified User");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /^register$/i }).click();
  await expect(page).toHaveURL(/verify-email-pending/);

  const pendingState = await getUserState(request, email);
  expect(pendingState.is_verified).toBe(false);
  expect(pendingState.verification_token).toEqual(expect.any(String));

  const blockedLogin = await request.post(`${backendUrl}/api/auth/login`, { data: { email, password } });
  expect(blockedLogin.status()).toBe(403);
  const blockedBody = await blockedLogin.json();
  expect(blockedBody).toEqual({ code: "EMAIL_NOT_VERIFIED", message: "Please verify your email first.", email });
  expect(blockedBody.token).toBeUndefined();

  await page.goto("/login");
  await page.evaluate(() => localStorage.removeItem("token"));
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Enter your password").fill(password);
  await page.getByRole("button", { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/verify-email-pending/);
  await expect.poll(() => page.evaluate(() => localStorage.getItem("token"))).toBeNull();

  const invalidToken = await request.get(`${backendUrl}/api/auth/verify-email?token=not-a-real-token`, { maxRedirects: 0 });
  expect(invalidToken.status()).toBe(400);
  const stateAfterInvalidToken = await getUserState(request, email);
  expect(stateAfterInvalidToken.is_verified).toBe(false);
  expect(stateAfterInvalidToken.verification_token).toEqual(expect.any(String));
});

test("duplicate registration, invalid passwords, and missing JWTs are rejected", async ({ page, request }) => {
  const email = `duplicate-${Date.now()}@gmail.com`;
  const password = "Password123!";

  await page.goto("/register");
  await page.getByPlaceholder("Enter your full name").fill("Duplicate User");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /^register$/i }).click();
  await expect(page).toHaveURL(/verify-email-pending/);

  const invalidPassword = await request.post(`${backendUrl}/api/auth/login`, { data: { email, password: "not-the-password" } });
  expect(invalidPassword.status()).toBe(401);
  expect((await invalidPassword.json()).token).toBeUndefined();

  const missingToken = await request.get(`${backendUrl}/api/auth/me`);
  expect(missingToken.status()).toBe(401);

  await page.goto("/register");
  await page.getByPlaceholder("Enter your full name").fill("Duplicate User Again");
  await page.getByPlaceholder("Enter your email").fill(email);
  await page.getByPlaceholder("Create a password").fill(password);
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /^register$/i }).click();
  await expect(page.getByText(/user already exists/i)).toBeVisible();
});
