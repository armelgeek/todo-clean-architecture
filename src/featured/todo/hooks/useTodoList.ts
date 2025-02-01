import { useDataFetching } from '@/shared/hooks/useDataFetching';
import { Todo } from '@/core/domain/entities/todo.entity';
import { todoRepository } from '@/core/infrastructure/repository/todo.repository';
import { useCallback } from 'react';

export function useTodoList() {
	const {
		items: todos,
		loadingState,
		error,
		hasReachEnd,
		create,
		update,
		remove,
		loadMore,
		refresh,
		abort,
		withAsyncState,
		partialUpdate
	} = useDataFetching<Todo.Response , Todo.CreateTodoDto, Todo.UpdateTodoDto & { selected?: boolean }>({
		fetchFn: async ({ page, itemsPerPage, signal }) => {
			const result = await todoRepository.getTodos();
			return {
				data: result.data || [],
				hasNext: false
			};
		},
		createFn: (data) => todoRepository.createTodo(data).then(res => res.data!),
		updateFn: (data) => todoRepository.updateTodo(data).then(res => res.data!),
		deleteFn: (id) => todoRepository.deleteTodo({ id: id as Todo.TodoId }).then(() => void 0)
	});

	const toggleComplete = useCallback(async (id: Todo.TodoId) => {
		const todo = todos.find(t => t.id === id);
		if (!todo) return;

		return partialUpdate(id, {
			completed: !todo.completed
		});
	}, [todos, partialUpdate]);

	const markAllAsComplete = useCallback(async () => {
		return withAsyncState('UPDATING', async () => {
			const updates = todos
				.filter(todo => !todo.completed)
				.map(todo => update({ ...todo, completed: true }));

			await Promise.all(updates);
		});
	}, [todos, update, withAsyncState]);

	return {
		todos,
		loadingState,
		error,
		hasReachEnd,
		create,
		update,
		remove,
		loadMore,
		refresh,
		abort,
		toggleComplete,
		markAllAsComplete
	};
}
