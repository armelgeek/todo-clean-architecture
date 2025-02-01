"use client";
import { useState } from 'react';
import { useService } from '@/core/infrastructure/providers/ServiceProvider';

export const CreateTodo = () => {
	const todoService = useService('todo');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [message, setMessage] = useState('');
	const [error, setError] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setMessage('');
		setError('');

		const result = await todoService.create({
			title,
			description
		});

		if (result.success) {
			setMessage('Todo created successfully');
			setTitle('');
			setDescription('');
		} else {
			setError(result.error || 'An error occurred');
		}
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-lg p-6 space-y-6 bg-white rounded-lg shadow-md">
			<div className="space-y-2">
				<label htmlFor="title" className="block text-sm font-medium text-gray-700">
					Title
				</label>
				<input
					id="title"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					required
				/>
			</div>
			<div className="space-y-2">
				<label htmlFor="description" className="block text-sm font-medium text-gray-700">
					Description
				</label>
				<textarea
					id="description"
					className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={4}
					required
				/>
			</div>
			<button
				type="submit"
				className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
			>
				Create Todo
			</button>
			{message && (
				<p className="p-3 text-sm text-green-700 bg-green-100 rounded-md">
					{message}
				</p>
			)}
			{error && (
				<p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">
					{error}
				</p>
			)}
		</form>
	);
};
