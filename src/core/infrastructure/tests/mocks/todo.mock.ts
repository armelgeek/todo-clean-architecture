import nock from 'nock';
import { Todo } from '../../../domain/entities/todo.entity';
import { Base } from '../../../domain/entities/base.entity';
import { config } from '../../config';

export const mockTodoApi = {
	todoApiResponse: {
		todoId: '123',
		todoTitle: 'Test Todo',
		todoDescription: 'Test Description',
		isDone: false,
		created: '2024-03-20T10:00:00Z' as Base.DateStr,
		modified: '2024-03-20T10:00:00Z' as Base.DateStr
	} satisfies Todo.ApiResponse,

	mockCreateTodo: () => {
		return nock(config.apiUrl)
			.post('/todo/create')
			.reply(201, {
				success: true,
				data: mockTodoApi.todoApiResponse,
				error: null,
				metadata: null
			});
	},
	mockGetTodo: (todoId: string) => {
		return nock(config.apiUrl)
			.get(`/todos/${todoId}`)
			.reply(200, {
				success: true,
				data: mockTodoApi.todoApiResponse,
				error: null,
				metadata: null
			});
	},
	mockCreateTodoError: () => {
		return nock(config.apiUrl)
			.post('/todo/create')
			.reply(400, {
				success: false,
				data: null,
				error: 'Invalid todo data',
				metadata: null
			});
	},

	mockGetTodoNotFound: (todoId: string) => {
		return nock(config.apiUrl)
			.get(`/todos/${todoId}`)
			.reply(404, {
				success: false,
				data: null,
				error: 'Todo not found',
				metadata: null
			});
	},
	cleanUp: () => {
		nock.cleanAll();
	}
};
