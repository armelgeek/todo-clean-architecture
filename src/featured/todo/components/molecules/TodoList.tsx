"use client";
import { useEffect, useState } from 'react';
import { useService } from '@/core/infrastructure/providers/ServiceProvider';
import { Todo } from '@/core/domain/entities/todo.entity';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
	const todoService = useService('todo');
	const [todos, setTodos] = useState<Todo.Response[]>([]);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchTodos = async () => {
			const result = await todoService.getAll();
			if (result.success && result.data) {
				setTodos(result.data);
			} else {
				setError(result.error || 'Failed to load todos');
			}
		};
		fetchTodos();
	}, [todoService]);

	return (
		<div className="w-full max-w-lg space-y-4">
			{error && (
				<p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>
			)}
			<ul className="divide-y divide-gray-200">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
		</div>
	);
};
