import { useRef, useState } from 'react';

type PageData = {
	page: number;
	hasNext: boolean;
	itemPerPage: number;
};

export function usePaging(itemPerPage: number = 20) {
	const pagingRef = useRef<PageData>({ page: 1, itemPerPage, hasNext: true });
	const [hasReachEnd, setHasReachEnd] = useState(false);

	const resetPaging = () => {
		pagingRef.current.page = 1;
		pagingRef.current.hasNext = true;
		setHasReachEnd(false);
	};

	const nextPaging = () => {
		pagingRef.current.page += 1;
	};

	const updatePaging = (hasNext: boolean) => {
		setHasReachEnd(!hasNext);
	};

	return {
		nextPaging,
		hasReachEnd,
		resetPaging,
		updatePaging,
		paging: pagingRef.current,
	};
}
