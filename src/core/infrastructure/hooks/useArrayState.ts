import { useReducer, useCallback } from 'react';

type Action<T> =
	| { type: 'INIT'; payload: T[] }
	| { type: 'ADD'; payload: T }
	| { type: 'ADD_MULTIPLE'; payload: T[] }
	| { type: 'UPDATE'; payload: T }
	| { type: 'REMOVE'; payload: { id: string | number } }
	| { type: 'CLEAR' }
	| { type: 'REMOVE_MULTIPLE'; payload: { ids: (string | number)[] } };

type State<T> = T[];

type ItemWithId = { id: string | number };

const initialState: State<any> = [];

const arrayReducer = <T extends ItemWithId>(
	state: State<T>,
	action: Action<T>,
): State<T> => {
	switch (action.type) {
		case 'INIT':
			return [...action.payload];
		case 'ADD':
			return state.some(item => item.id === action.payload.id)
				? state
				: [...state, action.payload];
		case 'ADD_MULTIPLE':
			const newItems = action.payload.filter(
				newItem => !state.some(existingItem => existingItem.id === newItem.id)
			);
			return [...state, ...newItems];
		case 'UPDATE':
			return state.map(item =>
				item.id === action.payload.id
					? { ...item, ...action.payload, id: item.id }
					: item
			);
		case 'REMOVE':
			return state.filter(item => item.id !== action.payload.id);
		case 'REMOVE_MULTIPLE':
			return state.filter(item => !action.payload.ids.includes(item.id));
		case 'CLEAR':
			return [];
		default:
			return state;
	}
};

export const useArrayState = <T extends ItemWithId>(defaultValue: T[] = initialState) => {
	const [state, dispatch] = useReducer(
		arrayReducer as React.Reducer<State<T>, Action<T>>,
		defaultValue,
	);

	const initArray = useCallback((items: T[]) => {
		dispatch({ type: 'INIT', payload: items });
	}, []);

	const addItem = useCallback((item: T) => {
		dispatch({ type: 'ADD', payload: item });
	}, []);

	const addItems = useCallback((items: T[]) => {
		dispatch({ type: 'ADD_MULTIPLE', payload: items });
	}, []);

	const updateItem = useCallback((item: T) => {
		dispatch({ type: 'UPDATE', payload: item });
	}, []);

	const removeItem = useCallback((id: string | number) => {
		dispatch({ type: 'REMOVE', payload: { id } });
	}, []);

	const removeItems = useCallback((ids: (string | number)[]) => {
		dispatch({ type: 'REMOVE_MULTIPLE', payload: { ids } });
	}, []);

	const clearArray = useCallback(() => {
		dispatch({ type: 'CLEAR' });
	}, []);

	return {
		state,
		initArray,
		addItem,
		addItems,
		updateItem,
		removeItem,
		removeItems,
		clearArray
	};
};
