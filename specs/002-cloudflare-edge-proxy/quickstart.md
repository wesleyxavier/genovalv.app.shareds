# Quickstart: validar a borda local

Pré-requisitos: Docker Desktop; `npm install` em `New/Shareds/`; `.env` copiado de `.env.example`.

## 1. Subir a borda

```powershell
docker compose up -d edge-proxy
docker compose ps        # edge-certs-init: exited 0; edge-proxy: healthy
```

## 2. Validação manual

```powershell
# Redirecionamento
curl.exe -i http://playground.genova.localhost:8080/
# Esperado: 301 Location: https://playground.genova.localhost:8443/

# Headers via origin-echo
docker compose --profile test up -d edge-origin-echo
curl.exe -k -s https://echo.genova.localhost:8443/ -H "CF-Connecting-IP: 1.2.3.4"
# Esperado: JSON com CF-Connecting-IP = IP real (não 1.2.3.4), CF-Ray, CF-IPCountry, CF-Visitor, X-Forwarded-*

# Cache (duas chamadas)
curl.exe -k -sI https://echo.genova.localhost:8443/static/a.js   # X-Cache-Status: MISS
curl.exe -k -sI https://echo.genova.localhost:8443/static/a.js   # X-Cache-Status: HIT

# WAF
curl.exe -k -i https://echo.genova.localhost:8443/.env           # 403 + X-Edge-Rule
```

## 3. Suíte automatizada

```powershell
npm run test:edge
# Esperado: redirect, headers, cache, ratelimit e waf verdes
```

## 4. Apps reais

- ERP: subir o compose do ERP (porta 3101) → `https://erp.genova.localhost:8443`
- FactoryFloor: após a change de dockerização, `https://factoryfloor.genova.localhost:8443`; editar um arquivo e ver HMR em ≤ 5 s.
- Admin: acessar pela URL própria (fora da borda).

Contrato e variáveis: [contracts/edge-contract.md](contracts/edge-contract.md). Modelo: [data-model.md](data-model.md).
