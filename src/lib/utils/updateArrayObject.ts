export function updateArrayObject<T>(
	arr: T[],
	identifierId: string | number,
	updatedData: Partial<T>
): T[] {
	return arr.map((item) =>
		(item as any).id === identifierId ? { ...item, ...updatedData } : item
	);
}
