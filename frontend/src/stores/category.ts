import { defineStore } from 'pinia'

type CategoryType = 'income' | 'expense'

const STORAGE_KEY_BASE = 'ledger_categories'

function getUserName(): string {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return 'guest'
    const obj = JSON.parse(raw || 'null')
    return obj?.username || 'guest'
  } catch {
    return 'guest'
  }
}

function getStorageKey(): string {
  const username = getUserName()
  return `${STORAGE_KEY_BASE}:${username}`
}

function load() {
  const raw = localStorage.getItem(getStorageKey())
  if (raw) {
    try {
      const parsed = JSON.parse(raw)
      return {
        incomeCategories: Array.isArray(parsed?.incomeCategories) ? parsed.incomeCategories : [],
        expenseCategories: Array.isArray(parsed?.expenseCategories) ? parsed.expenseCategories : []
      }
    } catch {
      return { incomeCategories: [], expenseCategories: [] }
    }
  }
  return { incomeCategories: [], expenseCategories: [] }
}

export const useCategoryStore = defineStore('category', {
  state: () => {
    const stored = load()
    return {
      incomeCategories: stored.incomeCategories.length
        ? stored.incomeCategories
        : ['工资', '奖金', '投资收益', '其他收入'],
      expenseCategories: stored.expenseCategories.length
        ? stored.expenseCategories
        : ['食品', '交通', '住房', '医疗', '娱乐', '购物']
    }
  },
  actions: {
    persist() {
      localStorage.setItem(
        getStorageKey(),
        JSON.stringify({
          incomeCategories: this.incomeCategories,
          expenseCategories: this.expenseCategories
        })
      )
    },
    reloadFromStorage() {
      const stored = load()
      this.incomeCategories = stored.incomeCategories.length
        ? stored.incomeCategories
        : ['工资', '奖金', '投资收益', '其他收入']
      this.expenseCategories = stored.expenseCategories.length
        ? stored.expenseCategories
        : ['食品', '交通', '住房', '医疗', '娱乐', '购物']
    },
    addCategory(type: CategoryType, name: string) {
      const n = name.trim()
      if (!n) return
      if (type === 'income') {
        if (!this.incomeCategories.includes(n)) {
          this.incomeCategories.push(n)
          this.persist()
        }
      } else {
        if (!this.expenseCategories.includes(n)) {
          this.expenseCategories.push(n)
          this.persist()
        }
      }
    },
    removeCategory(type: CategoryType, name: string) {
      if (type === 'income') {
        this.incomeCategories = this.incomeCategories.filter(c => c !== name)
      } else {
        this.expenseCategories = this.expenseCategories.filter(c => c !== name)
      }
      this.persist()
    },
    reorderCategory(type: CategoryType, fromIndex: number, toIndex: number) {
      if (fromIndex === toIndex) return
      if (type === 'income') {
        if (fromIndex < 0 || fromIndex >= this.incomeCategories.length) return
        if (toIndex < 0) toIndex = 0
        if (toIndex >= this.incomeCategories.length) toIndex = this.incomeCategories.length - 1
        const item = this.incomeCategories.splice(fromIndex, 1)[0]
        this.incomeCategories.splice(toIndex, 0, item)
      } else {
        if (fromIndex < 0 || fromIndex >= this.expenseCategories.length) return
        if (toIndex < 0) toIndex = 0
        if (toIndex >= this.expenseCategories.length) toIndex = this.expenseCategories.length - 1
        const item = this.expenseCategories.splice(fromIndex, 1)[0]
        this.expenseCategories.splice(toIndex, 0, item)
      }
      this.persist()
    }
  }
})
