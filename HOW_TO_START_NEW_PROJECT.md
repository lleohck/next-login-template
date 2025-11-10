# HOW TO START A NEW CLIENT PROJECT
> Core: `next-auth-starter`  
> Owner: `lleohck`

Este documento explica EXACTAMENTE como iniciar um projeto novo de cliente usando este core.

---

## 1) criar o projeto novo do cliente

```sh
npx create-next-app@latest novo-projeto
cd novo-projeto
```
Obs: não instale auth / prisma / tailwind aqui.
O Core já tem tudo.

## 2) adicionar o core como submódulo
Core sempre fica na pasta /core na raiz do repo do cliente.

```sh
git submodule add git@github.com:lleohck/next-auth-starter.git core
git commit -m "add core"
```

## 3) expor as pastas do core no projeto do cliente
no topo do projeto do cliente, crie os alias no `tsconfig.json`:

```jsonc
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["core/*"]
    }
  }
}
```
## 4) copiar os endpoints / pages essenciais para o cliente
o cliente não deve alterar o core
então regra:

NUNCA editar nada dentro de /core

se quiser sobrepor algum arquivo, copie para o projeto local e edite lá

## 5) quando o core evoluir
no cliente:

``` sh
git submodule update --remote --merge
git commit -am "update core"
``` 
6) fluxo mental
tudo que é universal → fica no CORE

tudo que é específico do cliente → fica no repo do cliente

o core é sua fundação.


> /core          <- nunca editar local

> /app, /lib     <- trabalho do cliente
