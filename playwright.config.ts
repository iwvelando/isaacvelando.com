import { defineConfig, devices } from "@playwright/test";

const remote = process.env.BASE_URL;
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  use: {
    baseURL: remote ?? "http://127.0.0.1:4187",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { browserName: "chromium", viewport: { width: 1440, height: 1000 } },
    },
    {
      name: "phone",
      use: { ...devices["Pixel 7"], viewport: { width: 360, height: 760 } },
    },
    ...(process.env.WEBKIT
      ? [{ name: "webkit", use: { ...devices["iPhone 15"] } }]
      : []),
  ],
  webServer: remote
    ? undefined
    : {
        command: "npm run preview -- --port 4187 --strictPort",
        url: "http://127.0.0.1:4187",
        reuseExistingServer: false,
      },
});
