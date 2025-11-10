# Como usar esse Starter

## criar novo projeto

```bash
npx degit <seu-user>/<repo-starter> nome-projeto-novo
cd nome-projeto-novo
npm i
```

## onde programar

* **core/** → nao mexer (auth, prisma, emails)
* **app/(feature)/** → aqui vc cria as features reais do projeto

## coisas pra trocar sempre que criar um novo projeto

1. logo
2. textos / copyright
3. cores tema (tailwind)

## checklist

* [ ] trocar o nome do projeto em `package.json`
* [ ] apontar os dominios no `.env`
* [ ] configurar provider de email

## regra

se precisar evoluir o core (ex: melhorar fluxo de email verify)
→ editar no repo do starter e nao no projeto

isso mantém o starter vivo e atualizado.
