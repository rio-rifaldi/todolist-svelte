export type TodosType = {
	isChecked: boolean;
	id: number;
	todo: string;
};

export type CustomeMouseEvent = MouseEvent & { currentTarget: EventTarget & HTMLButtonElement };
export type CustomeKeyboardEvent = KeyboardEvent & {
	currentTarget: EventTarget & HTMLInputElement;
};
