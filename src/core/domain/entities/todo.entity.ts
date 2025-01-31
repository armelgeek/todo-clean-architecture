import { ApiResponse as ApiBaseResponse, Base, Brand } from './base.entity';

export namespace Todo {
	export type TodoId = Brand<string, 'TodoId'>;
	export interface Entity extends Base.Entity {
		id: TodoId;
		title: string;
		description: string;
		completed: boolean;
	}


	export interface TodoDto {
		title: string;
		description: string;
		completed: boolean;
	}

	export interface Response extends Entity {
		id: TodoId;
		title: string;
		description: string;
		completed: boolean;
		createdAt: Base.DateStr;
		updatedAt: Base.DateStr;
	}


	export interface ApiResponse {
		todoId: string;
		todoTitle: string;
		todoDescription: string;
		isDone: boolean;
		created: Base.DateStr;
		modified: Base.DateStr;
	}

	// Request
	export type CreateTodoDto = Pick<TodoDto, 'title' | 'description'>;

	//Response
	export type CreateTodoResponse = ApiBaseResponse<Todo.Response>;

	export const toEntity = (response: Todo.ApiResponse): Todo.Response => ({
		id: response.todoId as TodoId,
		title: response.todoTitle,
		description: response.todoDescription,
		completed: response.isDone,
		createdAt: response.created,
		updatedAt: response.modified
	});
}
