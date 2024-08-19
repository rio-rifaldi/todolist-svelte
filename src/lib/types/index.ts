import type { Writable } from 'svelte/store';

export type TodosType = {
	isChecked: boolean;
	id: number;
	todo: string;
};

export type EditTodo = {
	isEdit: Writable<boolean>;
	currentTodo: TodosType;
};

export type CustomeMouseEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };
export type CustomeKeyboardEvent = KeyboardEvent & {
	currentTarget: EventTarget & HTMLInputElement;
};
