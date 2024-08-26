import type { Writable } from 'svelte/store';

export type TodosType = {
	isChecked: boolean;
	id: string;
	todo: string;
	createdAt: Date;
	updatedAt: Date;
};

export type EditTodo = {
	isEdit: Writable<boolean>;
	currentTodo: TodosType;
};

export type TodoDate = {
	isShow: boolean;
	sort: {
		created: string;
		updated: string;
	};
};

export type CustomeMouseEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };
export type CustomeKeyboardEvent = KeyboardEvent & {
	currentTarget: EventTarget & HTMLInputElement;
};
