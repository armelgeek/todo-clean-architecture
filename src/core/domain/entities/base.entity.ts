/**
 * @link https://egghead.io/blog/using-branded-types-in-typescript
 */
declare const __brand: unique symbol;
type CoreBrand<B> = { [__brand]: B };

/**
 * @description used to make some unique id or some unique primitive type
 */
export type Brand<T, B> = T & CoreBrand<B>;


/**
 *
// Exemple d'utilisation
type UserId = Brand<string, 'userId'>;
type PostId = Brand<string, 'postId'>;

// Maintenant ces deux types sont incompatibles même s'ils sont basés sur string
const userId: UserId = "123" as UserId;
const postId: PostId = "123" as PostId;

// Ceci générera une erreur de type
const error = userId = postId; // Error!

 */



export interface Pagination {
	page: number;
	limit: number;
	total: number;
}

export interface ApiResponse<T> {
	success: boolean;
	data?: T;
	error?: string | null;
	metadata?: Pagination | null;
}

export interface RequestOptions {
	headers?: Record<string, string>;
	timeout?: number;
	retry?: boolean;
}

export namespace Base {
	export type DateStr = Brand<string, 'DateStr'>;
	export interface Entity {
		id: string;
		createdAt: DateStr;
		updatedAt: DateStr;
	}

	export const toEntity = <T extends Entity>(apiResponse: any): T => apiResponse as T;
}

