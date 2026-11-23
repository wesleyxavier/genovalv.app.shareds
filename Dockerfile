FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY packages/core/package.json packages/core/
COPY packages/tokens/package.json packages/tokens/
COPY packages/elements/package.json packages/elements/
COPY playground/package.json playground/

RUN npm ci

COPY packages ./packages
COPY playground ./playground

RUN npm run build

FROM node:22-alpine AS preview
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4173
CMD ["npm", "run", "preview", "--workspace=@genovalv/playground", "--", "--host", "0.0.0.0", "--port", "4173"]
