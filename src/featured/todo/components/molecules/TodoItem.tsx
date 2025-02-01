"use client";
import { Todo } from '@/core/domain/entities/todo.entity';
import { useService } from '@/core/infrastructure/providers/ServiceProvider';
import { useState } from 'react';
import { useTodoList } from '../../hooks/useTodoList';
interface TodoItemProps {
	todo: Todo.Response;
}

export const TodoItem = ({ todo }: TodoItemProps) => {
	const todoService = useService('todo');
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState(todo.title);
	const [description, setDescription] = useState(todo.description);
	const [error, setError] = useState('');
	const { toggleComplete } = useTodoList();

	const handleUpdate = async () => {
		const result = await todoService.update({
			id: todo.id,
			title,
			description,
			completed: todo.completed
		});

		if (result.success) {
			setIsEditing(false);
			setError('');
		} else {
			setError(result.error || 'Failed to update todo');
		}
	};

	const handleDelete = async () => {
		const result = await todoService.delete({ id: todo.id });
		if (!result.success) {
			setError(result.error || 'Failed to delete todo');
		}
	};

	return (
		<div className={`${todo.selected ? 'bg-blue-50' : ''}`}>
			<input
				type="checkbox"
				checked={todo.selected}
				onChange={() => toggleComplete(todo.id)}
			/>
			{isEditing ? (
				<div className="space-y-3">
					<input
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md"
					/>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full px-3 py-2 border border-gray-300 rounded-md"
					/>
					<div className="flex gap-2">
						<button
							onClick={handleUpdate}
							className="px-3 py-1 text-white bg-blue-600 rounded-md hover:bg-blue-700"
						>
							Save
						</button>
						<button
							onClick={() => setIsEditing(false)}
							className="px-3 py-1 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="space-y-2">
					<div className="flex justify-between">
						<h3 className="text-lg font-medium">{todo.title}</h3>
						<div className="flex gap-2">
							<button
								onClick={() => setIsEditing(true)}
								className="px-2 py-1 text-sm text-blue-600 hover:text-blue-800"
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className="px-2 py-1 text-sm text-red-600 hover:text-red-800"
							>
								Delete
							</button>
						</div>
					</div>
					<p className="text-gray-600">{todo.description}</p>
					{error && (
						<p className="text-sm text-red-600">{error}</p>
					)}
				</div>
			)}
		</div>
	);
};
