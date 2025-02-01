import { CreateTodo } from '@/featured/todo/components/molecules/CreateTodo';
import { TodoList } from '@/featured/todo/components/molecules/TodoList';

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8 pb-20 gap-8 sm:p-20">
			<h1 className="text-3xl font-bold mb-4">Todo App</h1>
			<CreateTodo />
			<TodoList />
		</div>
	);
}
