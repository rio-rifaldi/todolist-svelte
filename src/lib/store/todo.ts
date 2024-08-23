import { browser } from '$app/environment';

import type { CustomeKeyboardEvent, CustomeMouseEvent, EditTodo, TodosType } from '$lib/types';
import { LocalStorage } from '$lib/utils/TodoLocalStorage';
import { updateArrayObject } from '$lib/utils/updateArrayObject';
import { writable } from 'svelte/store';

const isKeyboardEvent = (input: any): input is CustomeKeyboardEvent => {
	return typeof input.key !== 'undefined';
};
const currentTodoFromLocalStorage = browser && LocalStorage.getTodo('todos');

type SortOption = 'created' | 'updated';

function TodoStore() {
	const todos = writable<TodosType[]>(currentTodoFromLocalStorage);

	function createTodo(this: HTMLInputElement, e: CustomeKeyboardEvent): void;
	function createTodo(this: HTMLButtonElement, e: CustomeMouseEvent): void;
	function createTodo(this: any, e: any): void {
		if (isKeyboardEvent(e)) {
			if (e.key !== 'Enter') return;
			if (this.value === '') return;
			const inputTodo: TodosType = {
				id: Math.random(),
				isChecked: false,
				todo: this.value,
				createdAt: new Date(Date.now()),
				updatedAt: new Date(Date.now())
			};

			todos.update(($todos) => {
				LocalStorage.addTodo('todos', [...$todos, inputTodo]);

				return [...$todos, inputTodo];
			});

			this.value = '';
		} else {
			let inputValue = (this.previousElementSibling as HTMLInputElement).value;
			if (inputValue === '') return;

			const inputTodo: TodosType = {
				id: Math.random(),
				isChecked: false,
				todo: inputValue,
				createdAt: new Date(Date.now()),
				updatedAt: new Date(Date.now())
			};
			todos.update(($todos) => {
				LocalStorage.addTodo('todos', [...$todos, inputTodo]);
				return [...$todos, inputTodo];
			});
			(this.previousElementSibling as HTMLInputElement).value = '';
		}
	}

	function deleteTodo({ id: todoId }: TodosType) {
		todos.update(($todos) => {
			LocalStorage.deleteTodo('todos', todoId);
			return $todos.filter((todo) => todo.id !== todoId);
		});
	}
	function checkTodo(currentTodo: TodosType) {
		todos.update(($todos) => {
			const result = updateArrayObject($todos, currentTodo.id, {
				isChecked: !currentTodo.isChecked
			});
			LocalStorage.addTodo('todos', result);
			return result;
		});
	}
	function editTodo(props: EditTodo & { e: CustomeKeyboardEvent }): void;
	function editTodo(props: EditTodo & { inputRef: HTMLInputElement; e: CustomeMouseEvent }): void;
	function editTodo(props: any): void {
		if (isKeyboardEvent(props.e)) {
			const inputValue = props.e.currentTarget.value;
			if (props.e.key !== 'Enter') return;
			if (inputValue === '') return;

			todos.update(($todos) => {
				const result = updateArrayObject($todos, props.currentTodo.id, {
					todo: inputValue,
					updatedAt: new Date(Date.now())
				});
				LocalStorage.editTodo('todos', result);
				return result;
			});
			props.isEdit.set(false);
		} else {
			const inputValue = props.inputRef.value;
			if (inputValue === '') return;
			todos.update(($todos) => {
				const result = updateArrayObject($todos, props.currentTodo.id, {
					todo: inputValue,
					updatedAt: new Date(Date.now())
				});
				LocalStorage.editTodo('todos', result);
				return result;
			});
			props.isEdit.set(false);
		}
	}

	function deleteAllTodo() {
		localStorage.removeItem('todos');
		todos.set([]);
	}

	function sortBy(options: SortOption) {
		if (options === 'created') {
			const todosFromStorage: TodosType[] = LocalStorage.getTodo('todos');
			const result = todosFromStorage.sort((a, b) => {
				return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
			});
			todos.set(result);
		} else if (options === 'updated') {
			const todosFromStorage: TodosType[] = LocalStorage.getTodo('todos');
			const result = todosFromStorage.sort((a, b) => {
				return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
			});
			todos.set(result);
		}
	}

	return {
		todos,
		deleteTodo,
		checkTodo,
		createTodo,
		editTodo,
		deleteAllTodo,
		sortBy
	};
}

export const todosStore = TodoStore();
