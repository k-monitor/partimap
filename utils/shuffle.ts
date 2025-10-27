// https://stackoverflow.com/a/2450976
export default <T>(_array: T[]) => {
	const array = [..._array];
	let currentIndex = array.length;
	while (currentIndex != 0) {
		const randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
	return array;
};
