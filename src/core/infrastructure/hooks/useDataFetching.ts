import { useAbortController } from './useAbortController';
import { useArrayState } from './useArrayState';
import { usePaging } from './usePaging';
import { useState, useCallback, useRef } from 'react';

export enum LoadingState {
	IDLE = 'IDLE',
	LOADING = 'LOADING',
	REFRESHING = 'REFRESHING',
	LOADING_MORE = 'LOADING_MORE',
	ERROR = 'ERROR'
}

interface FetchResponse<T> {
	data: T[];
	hasNext: boolean;
}

interface FetchParams {
	page: number;
	itemsPerPage: number;
	signal: AbortSignal;
}

interface UseDataFetchingProps<T> {
	fetchFn: (params: FetchParams) => Promise<FetchResponse<T>>;
	itemsPerPage?: number;
}

export function useDataFetching<T extends { id: string | number }>({
	fetchFn,
	itemsPerPage = 20
}: UseDataFetchingProps<T>) {
	const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
	const [error, setError] = useState<string | null>(null);

	const { signal, abort } = useAbortController('data-fetching');
	const { state: items, addItems, initArray } = useArrayState<T>();
	const { paging, hasReachEnd, resetPaging, nextPaging, updatePaging } = usePaging(itemsPerPage);

	const isFetchingRef = useRef(false);

	const fetchData = useCallback(async (isLoadingMore = false) => {
		if (isFetchingRef.current) return;
		isFetchingRef.current = true;

		try {
			setLoadingState(isLoadingMore ? LoadingState.LOADING_MORE : LoadingState.LOADING);
			setError(null);

			const response = await fetchFn({
				page: paging.page,
				itemsPerPage: paging.itemPerPage,
				signal
			});

			if (isLoadingMore) {
				addItems(response.data);
			} else {
				initArray(response.data);
			}

			updatePaging(response.hasNext);
		} catch (err) {
			if (err instanceof Error) {
				setError(err.message);
			}
			setLoadingState(LoadingState.ERROR);
		} finally {
			isFetchingRef.current = false;
			setLoadingState(LoadingState.IDLE);
		}
	}, [fetchFn, paging, signal, addItems, initArray, updatePaging]);

	const loadMore = useCallback(async () => {
		if (hasReachEnd || loadingState !== LoadingState.IDLE) return;
		nextPaging();
		await fetchData(true);
	}, [hasReachEnd, loadingState, nextPaging, fetchData]);

	const refresh = useCallback(async () => {
		abort();
		resetPaging();
		await fetchData();
	}, [abort, resetPaging, fetchData]);

	return {
		items,
		loadingState,
		error,
		hasReachEnd,
		loadMore,
		refresh,
		abort
	};
}
