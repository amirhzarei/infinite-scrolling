import { useCallback, useEffect, useRef } from "react";

export const useInfiniteScroll = ({ fetchData, targetRef }: any) => {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const handleIntersection = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fetchData();
                }
            });
        },
        [fetchData],
    );

    useEffect(() => {
        if (targetRef.current) {
            observerRef.current = new IntersectionObserver(handleIntersection, {
                root: null,
                rootMargin: '0px',
                threshold: 1,
            });

            observerRef.current.observe(targetRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [targetRef, handleIntersection]);

    return;
};