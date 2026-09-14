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
