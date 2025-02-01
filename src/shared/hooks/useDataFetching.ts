import { useAbortController } from './useAbortController';
import { useArrayState } from './useArrayState';
import { usePaging } from './usePaging';
import { useState, useCallback, useRef, useMemo, useEffect } from 'react';

export enum LoadingState {
    IDLE = 'IDLE',
    LOADING = 'LOADING',
    CREATING = 'CREATING',
    UPDATING = 'UPDATING',
    DELETING = 'DELETING',
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

interface SortConfig<T> {
    key: keyof T;
    direction: 'asc' | 'desc';
}

interface SelectableItem {
    id: string | number;
    selected?: boolean;
}

interface UseDataFetchingProps<T extends SelectableItem, CreateDTO, UpdateDTO> {
    fetchFn: (params: FetchParams) => Promise<FetchResponse<T>>;
    createFn: (data: CreateDTO) => Promise<T>;
    updateFn: (data: UpdateDTO) => Promise<T>;
    deleteFn: (id: string | number) => Promise<void>;
    itemsPerPage?: number;
    cacheKey?: string;
}

export function useDataFetching<T extends SelectableItem, CreateDTO, UpdateDTO extends { selected?: boolean }>({
    fetchFn,
    createFn,
    updateFn,
    deleteFn,
    itemsPerPage = 20,
    cacheKey
}: UseDataFetchingProps<T, CreateDTO, UpdateDTO>) {
    const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
    const [error, setError] = useState<string | null>(null);
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
    const [filters, setFilters] = useState<Partial<T>>({});

    const { signal, abort } = useAbortController('data-fetching');
    const { state: items, addItems, initArray, addItem, updateItem, removeItem } = useArrayState<T>();
    const { paging, hasReachEnd, resetPaging, nextPaging, updatePaging } = usePaging(itemsPerPage);

    const isFetchingRef = useRef(false);

    const sortedAndFilteredItems = useMemo(() => {
        let result = [...items];

        // Filtrage
        Object.entries(filters).forEach(([key, value]) => {
            result = result.filter(item => item[key as keyof T] === value);
        });

        // Tri
        if (sortConfig) {
            result.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [items, filters, sortConfig]);

    // Fetch Data
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

    // Create
    const create = useCallback(async (data: CreateDTO) => {
        try {
            setLoadingState(LoadingState.CREATING);
            setError(null);
            const newItem = await createFn(data);
            addItem(newItem);
            return newItem;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setLoadingState(LoadingState.ERROR);
            throw err;
        } finally {
            setLoadingState(LoadingState.IDLE);
        }
    }, [createFn, addItem]);

    // Update
    const update = useCallback(async (data: UpdateDTO) => {
        try {
            setLoadingState(LoadingState.UPDATING);
            setError(null);
            const updatedItem = await updateFn(data);
            updateItem(updatedItem);
            return updatedItem;
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setLoadingState(LoadingState.ERROR);
            throw err;
        } finally {
            setLoadingState(LoadingState.IDLE);
        }
    }, [updateFn, updateItem]);

    // Delete
    const remove = useCallback(async (id: string | number) => {
        try {
            setLoadingState(LoadingState.DELETING);
            setError(null);
            await deleteFn(id);
            removeItem(id);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setLoadingState(LoadingState.ERROR);
            throw err;
        } finally {
            setLoadingState(LoadingState.IDLE);
        }
    }, [deleteFn, removeItem]);

    // Load More
    const loadMore = useCallback(async () => {
        if (hasReachEnd || loadingState !== LoadingState.IDLE) return;
        nextPaging();
        await fetchData(true);
    }, [hasReachEnd, loadingState, nextPaging, fetchData]);

    // Refresh
    const refresh = useCallback(async () => {
        abort();
        resetPaging();
        await fetchData();
    }, [abort, resetPaging, fetchData]);

    const withAsyncState = useCallback(async <R>(
        operation: string,
        handler: () => Promise<R>
    ) => {
        try {
            setLoadingState(LoadingState[operation as keyof typeof LoadingState] || LoadingState.LOADING);
            setError(null);
            return await handler();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            }
            setLoadingState(LoadingState.ERROR);
            throw err;
        } finally {
            setLoadingState(LoadingState.IDLE);
        }
    }, []);

    // Mise à jour partielle
    const partialUpdate = useCallback(async (id: string | number, updates: Partial<UpdateDTO>) => {
        const currentItem = items.find(item => item.id === id);
        if (!currentItem) throw new Error('Item not found');

        return withAsyncState('UPDATING', async () => {
            const updatedItem = await updateFn({ ...currentItem, ...updates } as unknown as UpdateDTO);
            updateItem(updatedItem);
            return updatedItem;
        });
    }, [items, updateFn, updateItem, withAsyncState]);

    const toggleSelection = useCallback((id: string | number) => {
        const item = items.find(item => item.id === id);
        if (item) {
            partialUpdate(id, { id, selected: !item.selected } as unknown as Partial<UpdateDTO>);
        }
    }, [items, partialUpdate]);

    const selectAll = useCallback(() => {
        return withAsyncState('UPDATING', async () => {
            await Promise.all(
                items.map(item => partialUpdate(item.id, { selected: true } as Partial<UpdateDTO>))
            );
        });
    }, [items, partialUpdate, withAsyncState]);

    const clearSelection = useCallback(() => {
        return withAsyncState('UPDATING', async () => {
            await Promise.all(
                items.filter(item => item.selected)
                    .map(item => partialUpdate(item.id, { selected: false } as Partial<UpdateDTO>))
            );
        });
    }, [items, partialUpdate, withAsyncState]);

    const bulkUpdate = useCallback(async (updates: Partial<UpdateDTO>) => {
        return withAsyncState('UPDATING', async () => {
            const results = await Promise.all(
                items.filter(item => item.selected)
                    .map(item => partialUpdate(item.id, updates))
            );
            return results;
        });
    }, [items, partialUpdate, withAsyncState]);

    const bulkDelete = useCallback(async () => {
        return withAsyncState('DELETING', async () => {
            await Promise.all(
                items.filter(item => item.selected)
                    .map(item => remove(item.id))
            );
        });
    }, [items, remove, withAsyncState]);

    useEffect(() => {
        if (cacheKey) {
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                initArray(JSON.parse(cached));
            }
        }
    }, [cacheKey]);

    useEffect(() => {
        if (cacheKey && items.length > 0) {
            localStorage.setItem(cacheKey, JSON.stringify(items));
        }
    }, [cacheKey, items]);

    return {
        items: sortedAndFilteredItems,
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
        partialUpdate,
        toggleSelection,
        selectAll,
        clearSelection,
        bulkUpdate,
        bulkDelete,
        selectedItems: items.filter(item => item.selected),
        hasSelection: items.some(item => item.selected),
        selectedCount: items.filter(item => item.selected).length,
        setSort: setSortConfig,
        setFilters,
        sortConfig,
        filters,
        clearCache: useCallback(() => {
            if (cacheKey) {
                localStorage.removeItem(cacheKey);
            }
        }, [cacheKey])
    };
}
