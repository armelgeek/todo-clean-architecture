import { useEffect, useMemo, useRef } from 'react';

export function useAbortController(key = 'unknown') {
    const _is_mounted = useRef<boolean>(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    useEffect(() => {
        _is_mounted.current = true;
        return () => {
            _is_mounted.current = false;
        };
    }, []);

    const getController = (): AbortController => {
        if (!abortControllerRef.current) {
            console.log(`[>] Create first new ${key}`);
            abortControllerRef.current = new AbortController();
        }

        if (abortControllerRef.current && abortControllerRef.current.signal.aborted) {
            console.log(`[>] Abort controller & create new ${key}`);
            abortControllerRef.current.abort();
            abortControllerRef.current = new AbortController();
        }

        return abortControllerRef.current;
    };

    return useMemo(
        () => ({
            get signal() {
                const controller = getController();
                return controller.signal;
            },
            abort() {
                if (_is_mounted.current) {
                    return;
                }
                console.log(`[>] Request aborted ${key}`);
                if (!abortControllerRef.current?.signal.aborted) {
                    abortControllerRef.current?.abort();
                }
            },
            get controller() {
                return getController();
            },
        }),
        [],
    );
}
