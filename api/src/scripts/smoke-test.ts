import { Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

function ok(label: string) {
  console.log(`  ✅ ${label}`)
}

function fail(label: string, error: unknown) {
  console.log(`  ❌ ${label}`)
  console.error(error)
  process.exitCode = 1
}

async function main() {
  console.log('== TESTE 1: criar User -> Category -> Transaction -> Goal encadeados ==')

  const user = await prisma.user.create({
    data: {
      name: 'Usuário de Teste',
      email: `teste-${Date.now()}@fintrack.dev`,
      passwordHash: 'hash-fake-apenas-para-teste',
    },
  })
  ok(`User criado (id=${user.id})`)

  const category = await prisma.category.create({
    data: {
      name: 'Alimentação',
      type: 'expense',
      color: '#FF5733',
      userId: user.id,
    },
  })
  ok(`Category criada (id=${category.id})`)

  const transaction = await prisma.transaction.create({
    data: {
      amount: 89.9,
      description: 'Almoço no restaurante',
      date: new Date(),
      type: 'expense',
      userId: user.id,
      categoryId: category.id,
    },
  })
  ok(`Transaction criada (id=${transaction.id}, amount=${transaction.amount.toString()})`)

  const goal = await prisma.goal.create({
    data: {
      month: '2026-09',
      limitAmount: 600,
      userId: user.id,
      categoryId: category.id,
    },
  })
  ok(`Goal criada (id=${goal.id}, limitAmount=${goal.limitAmount.toString()})`)

  console.log('\n== TESTE 2: relações carregadas via include ==')
  const userWithRelations = await prisma.user.findUnique({
    where: { id: user.id },
    include: { categories: true, transactions: true, goals: true },
  })
  if (
    userWithRelations?.categories.length === 1 &&
    userWithRelations?.transactions.length === 1 &&
    userWithRelations?.goals.length === 1
  ) {
    ok('User carregado com 1 category, 1 transaction e 1 goal')
  } else {
    fail('Relações não vieram como esperado', userWithRelations)
  }

  console.log('\n== TESTE 3: @@unique([userId, categoryId, month]) deve bloquear Goal duplicada ==')
  try {
    await prisma.goal.create({
      data: {
        month: '2026-09',
        limitAmount: 999,
        userId: user.id,
        categoryId: category.id,
      },
    })
    fail('Deveria ter lançado erro de unique constraint, mas criou normalmente', null)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      ok('Banco recusou a Goal duplicada (P2002 - unique constraint)')
    } else {
      fail('Erro inesperado ao testar unique constraint', error)
    }
  }

  console.log('\n== TESTE 4: onDelete Restrict deve impedir apagar Category em uso ==')
  try {
    await prisma.category.delete({ where: { id: category.id } })
    fail('Deveria ter lançado erro de Restrict, mas apagou a category', null)
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
      ok('Banco recusou apagar Category com Transaction vinculada (P2003 - FK restrict)')
    } else {
      fail('Erro inesperado ao testar Restrict', error)
    }
  }

  console.log('\n== TESTE 5: onDelete Cascade ao apagar o User ==')
  await prisma.user.delete({ where: { id: user.id } })

  const remaining = await prisma.$transaction([
    prisma.category.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: { userId: user.id } }),
    prisma.goal.count({ where: { userId: user.id } }),
  ])
  const [remainingCategories, remainingTransactions, remainingGoals] = remaining

  if (remainingCategories === 0 && remainingTransactions === 0 && remainingGoals === 0) {
    ok('Cascade limpou category, transaction e goal ao apagar o User')
  } else {
    fail('Sobraram registros após apagar o User', remaining)
  }

  console.log('\nTodos os testes concluídos.')
}

main()
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
