import type { TodosType } from '$lib/types';
import type { Writable } from 'svelte/store';

export function closeUpdateOnOutsideClick(isEdit: Writable<boolean>) {
	window.addEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});
}

export function updateArrayObject<T>(
	arr: T[],
	identifierId: string | number,
	updatedData: Partial<T>
): T[] {
	return arr.map((item) =>
		(item as any).id === identifierId ? { ...item, ...updatedData } : item
	);
}

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

	function checkTodo(keyId: string, currentTodo: TodosType) {
		let todos: TodosType[] = getTodo('todos');

		const currentIndex = todos.findIndex((item) => item.id === currentTodo.id);
		const { id, isChecked, todo } = currentTodo;

		const newTodo = { id, todo, isChecked: !isChecked };
		todos.splice(currentIndex, 1, newTodo);
		addTodo(keyId, todos);
	}

	function editTodo(keyId: string, todos: TodosType[]) {
		addTodo(keyId, todos);
	}
	return {
		addTodo,
		getTodo,
		deleteTodo,
		checkTodo,
		editTodo
	};
}

export const LocalStorage = TodoLocalStorage();
