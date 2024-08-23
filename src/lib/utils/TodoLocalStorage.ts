import type { TodosType } from '$lib/types';
import { updateArrayObject } from './updateArrayObject';

function TodoLocalStorage() {
	function addTodo(keyId: string, value: any) {
		let data = JSON.stringify(value);
		localStorage.setItem(keyId, data);
	}
	function getTodo(keyId: string) {
		const data = localStorage.getItem(keyId);
		if (!data) return;
		return JSON.parse(data);
	}
	function deleteTodo(keyId: string, todoId: number) {
		const currentValue: TodosType[] = getTodo(keyId);
		if (!currentValue) return;

		const result = currentValue.filter((todo) => todo.id !== todoId);
		addTodo(keyId, result);
	}

	function editTodo(keyId: string, todos: TodosType[]) {
		addTodo(keyId, todos);
	}
	return {
		addTodo,
		getTodo,
		deleteTodo,

		editTodo
	};
}

export const LocalStorage = TodoLocalStorage();
