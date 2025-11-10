# CONTRIBUTING – CORE

Este documento define como trabalhar no **CORE Starter**.

---

## 1) ZERO regra de negócio do cliente

Este repositório NUNCA recebe regra específica de cliente.

Isso significa:

| tipo                               | onde vai               |
| ---------------------------------- | ---------------------- |
| auth, UI base, email, layout base  | **CORE**               |
| telas do cliente, flows de cliente | **projeto do cliente** |

---

## 2) Branch model

Sempre crie feature branch:

```
git checkout -b feature/minha-feature
```

Merge somente via PR para `main`.

---

## 3) Quando adicionar algo no CORE?

Sempre que:

* 2+ projetos precisarem da mesma coisa
* algo for claramente "base de produto"

Exemplo: password strength meter, componentes de formulário, auth flows.

---

## 4) Atualizando um projeto que usa o core

no projeto do cliente:

```
cd core
git pull origin main
cd ..
git add core
git commit -m "upgrade core"
```

---

## 5) Guideline filosófica

O CORE é o "sistema operacional" dos apps.

**O CORE não resolve negócios.**

Ele resolve o que TODO app precisa.
