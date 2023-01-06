import React, { useContext, useState } from "react";
import { v4 as uuidV4 } from "uuid"
import useLocalStorage from "../hooks/useLocalStorage"

const BudgetsContext = React.createContext()

export const UNCATEGORIZED_BUDGET_ID = "Uncategorized"

export function useBudgets() {
	return useContext(BudgetsContext);
}


export const BudgetsProvider = ({ children }) => {
	const [budgets, setBudgets] = useLocalStorage("budgets", [])
	const [expenses, setExpenses] = useLocalStorage("expenses", [])

	budgetId: "13ecbe6c-9772-4dc6-99fa-f413e629af90"

	function getBudgetExpenses(budgetId) {
		return expenses.filter(expense => expense.budgetId === budgetId)

	}

	function addExpense({ description, amount, budgetId }) {
		setExpenses(prevExpenses => {
			return [...prevExpenses, { id: uuidV4(), description, amount, budgetId }]
		})
	}

	function addBudget({ budgetName, max }) {
		setBudgets(prevBudgets => {
			if (prevBudgets.find(budget => budget.budgetName === budgetName)) {
				return prevBudgets
			}
			return [...prevBudgets, { id: uuidV4(), budgetName, max }]
		})
	}
	function deleteExpense({ id }) {
		setExpenses(prevExpenses => {
			return prevExpenses.filter(expense => expense.id !== id)
		})
	}

	function deleteBudget({ id }) {
		setExpenses(prevExpenses => {
			return prevExpenses.map(expense => {
				if (expense.budgetId !== id) return expense
				return { ...expense, budgetId: UNCATEGORIZED_BUDGET_ID }
			})
		})
		setBudgets(prevBudgets => {
			return prevBudgets.filter(budget => budget.id !== id)
		})
	}
	return (
		<BudgetsContext.Provider value={
			{
				budgets,
				expenses,
				getBudgetExpenses,
				addExpense,
				addBudget,
				deleteExpense,
				deleteBudget
			}
		}>
			{children}
		</BudgetsContext.Provider>
	)
}