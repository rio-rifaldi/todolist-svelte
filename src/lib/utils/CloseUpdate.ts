import type { Writable } from 'svelte/store';

export function closeUpdate(isEdit: Writable<boolean>) {
	window.addEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});

	return window.removeEventListener('click', (e) => {
		if (document.getElementById('todolist')?.contains(e.target as Node)) {
			return;
		} else {
			isEdit.set(false);
		}
	});
}
