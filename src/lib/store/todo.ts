import { browser } from '$app/environment';
import { LocalStorage, updateArrayObject } from '$lib/functions';
import type { CustomeKeyboardEvent, CustomeMouseEvent, EditTodo, TodosType } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

const isKeyboardEvent = (input: any): input is CustomeKeyboardEvent => {
	return typeof input.key !== 'undefined';
};

function TodoStore() {
	const currentTodoFromLocalStorage = (browser && LocalStorage.getTodo('todos')) || [];

	const todos = writable<TodosType[]>(currentTodoFromLocalStorage);
	todos.subscribe((todos) => currentTodoFromLocalStorage);

	function createTodo(this: HTMLInputElement, e: CustomeKeyboardEvent): void;
	function createTodo(this: HTMLButtonElement, e: CustomeMouseEvent): void;
	function createTodo(this: any, e: any): void {
		if (isKeyboardEvent(e)) {
			if (e.key !== 'Enter') return;
			if (this.value === '') return;
			const inputTodo: TodosType = {
				id: Math.random(),
				isChecked: false,
				todo: this.value
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
				todo: inputValue
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
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, todo, isChecked: !isChecked };
			$todos.splice(currentIndex, 1, newTodo);
			LocalStorage.checkTodo('todos', currentTodo);
			return $todos;
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
				const result = updateArrayObject($todos, props.currentTodo.id, { todo: inputValue });
				LocalStorage.editTodo('todos', result);
				return result;
			});
			props.isEdit.set(false);
		} else {
			const inputValue = props.inputRef.value;
			if (inputValue === '') return;
			todos.update(($todos) => {
				const result = updateArrayObject($todos, props.currentTodo.id, { todo: inputValue });
				LocalStorage.editTodo('todos', result);
				return result;
			});
			props.isEdit.set(false);
		}
	}
	function editTodoWithKey(
		e: CustomeKeyboardEvent,
		currentTodo: TodosType,
		isEdit: Writable<boolean>
	) {
		if (e.key !== 'Enter') return;
		if (e.currentTarget.value === '') return;

		todos.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, isChecked, todo: e.currentTarget.value };
			$todos.splice(currentIndex, 1, newTodo);
			LocalStorage.editTodo('todos', $todos);
			return $todos;
		});
		isEdit.set(false);
	}
	function editTodoWithButton(
		inputRef: HTMLInputElement,
		e: CustomeMouseEvent,
		isEdit: Writable<boolean>,
		currentTodo: TodosType
	) {
		if (inputRef.value === '') return;

		todos.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, isChecked, todo: inputRef.value };
			$todos.splice(currentIndex, 1, newTodo);
			LocalStorage.editTodo('todos', $todos);
			return $todos;
		});
		isEdit.set(false);
	}

	return {
		todos,
		deleteTodo,
		checkTodo,
		editTodoWithKey,
		editTodoWithButton,
		createTodo,
		editTodo
	};
}

export const todosStore = TodoStore();
