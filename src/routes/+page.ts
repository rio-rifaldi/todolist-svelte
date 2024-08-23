import { browser } from '$app/environment';
import type { TodosType } from '$lib/types';
import { LocalStorage } from '$lib/utils/TodoLocalStorage';
import type { PageLoad } from './$types';

export const load: PageLoad = async (e) => {
	const currentTodoFromLocalStorage: TodosType[] = browser && LocalStorage.getTodo('todos');
	return {
		data: 'haloo'
	};
};
