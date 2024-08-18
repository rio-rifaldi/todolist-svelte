import type { CustomeKeyboardEvent, CustomeMouseEvent, TodosType } from '$lib/types';
import { writable, type Writable } from 'svelte/store';

export default function TodoStore() {
	const todos = writable<TodosType[]>([]);

	function createTodoWithKey(this: HTMLInputElement, e: CustomeKeyboardEvent) {
		if (e.key !== 'Enter') return;
		if (this.value === '') return;

		const inputTodo: TodosType = {
			id: Math.random(),
			isChecked: false,
			todo: this.value
		};
		todos.update(($todos) => [...$todos, inputTodo]);
		this.value = '';
	}
	function createTodoWithButton(this: HTMLButtonElement, e: CustomeMouseEvent) {
		let inputValue = (this.previousElementSibling as HTMLInputElement).value;
		if (inputValue === '') return;

		const inputTodo: TodosType = {
			id: Math.random(),
			isChecked: false,
			todo: this.value
		};
		todos.update(($todos) => [...$todos, inputTodo]);
		(this.previousElementSibling as HTMLInputElement).value = '';
	}
	function deleteTodo({ id: todoId }: TodosType) {
		todos.update(($todos) => $todos.filter((todo) => todo.id !== todoId));
	}
	function checkTodo(currentTodo: TodosType) {
		todos.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, todo, isChecked: !isChecked };
			$todos.splice(currentIndex, 1, newTodo);
			return $todos;
		});
	}

	function editTodoWithKey(
		this: HTMLInputElement,
		e: CustomeKeyboardEvent,
		isEdit: Writable<boolean>,
		currentTodo: TodosType
	) {
		if (e.key !== 'Enter') return;
		if (this.value === '') return;

		todos.update(($todos) => {
			const currentIndex = $todos.findIndex((item) => item.id === currentTodo.id);
			const { id, isChecked, todo } = currentTodo;

			const newTodo = { id, isChecked, todo: e.currentTarget.value };
			$todos.splice(currentIndex, 1, newTodo);
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

			const newTodo = { id, isChecked, todo: e.currentTarget.value };
			$todos.splice(currentIndex, 1, newTodo);
			return $todos;
		});
		isEdit.set(false);
	}

	return {
		todos,
		createTodoWithKey,
		createTodoWithButton,
		deleteTodo,
		checkTodo,
		editTodoWithKey,
		editTodoWithButton
	};
}
