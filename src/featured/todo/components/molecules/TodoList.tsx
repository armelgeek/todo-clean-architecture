"use client";
import { useTodoList } from '../../hooks/useTodoList';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
	const {
		todos,
		loadingState,
		error,
		hasReachEnd,
		loadMore,
		refresh
	} = useTodoList();
	if (loadingState === 'LOADING') return <div>Loading...</div>;
	if (error) return <div className="text-red-600">{error}</div>;

	return (
		<div className="w-full max-w-lg space-y-4">
			<button
				onClick={refresh}
				className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
			>
				Refresh
			</button>
			<ul className="divide-y divide-gray-200">
				{todos.map((todo) => (
					<TodoItem key={todo.id} todo={todo} />
				))}
			</ul>
			{!hasReachEnd && (
				<button
					onClick={loadMore}
					disabled={loadingState === 'LOADING_MORE'}
					className="w-full px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50"
				>
					{loadingState === 'LOADING_MORE' ? 'Loading...' : 'Load More'}
				</button>
			)}
		</div>
	);
};
