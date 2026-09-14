# E2E

Run e2e test

```sh
pnpm --filter car-doctor-web e2e
```

The sever will be started by the config in playwright.config.ts

```ts
webServer: {
  command: 'pnpm dev',                    
  url: baseURL,                           
  reuseExistingServer: !process.env.CI,   
},
```

## Mock backend

如果不想为 e2e 拉起整套后端 + 数据库，可以在 Playwright 里拦截网络请求，直接返回假数据：

```ts
await page.route('**/api/auth/login', (route) =>
  route.fulfill({ json: { token: 'fake', user: { email: '<b@b.com>' } } }),
);
```
