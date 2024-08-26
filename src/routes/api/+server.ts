import { turso } from './turso.server.js';

export async function PUT({ params, request, cookies }) {
	const { todoId } = await request.json();

	try {
		const result = await turso.execute({
			sql: 'UPDATE todo_list SET isChecked = NOT isChecked WHERE id = ?;',
			args: [String(todoId)]
		});
	} catch (error: any) {
		console.log(error);
	}
	return new Response(null, { status: 204 });
}
