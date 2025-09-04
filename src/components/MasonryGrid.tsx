import { useState, useRef, useCallback } from 'react';
import styled from '@emotion/styled';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

const MasonryGrid = () => {
  const [photos, setPhotos] = useState<any[]>([]);
  const [nextPage, setNextPage] = useState<string>('1');
  const loadingRef = useRef<HTMLDivElement>(null);

  const apiKey = import.meta.env.VITE_API_KEY;
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const getPhotos = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/curated?page=${nextPage}&per_page=${50}`, {
        headers: {
          Authorization: apiKey ?? '',
        },
      });
      const { photos: newPhotos, next_page } = await response.json();
      setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
      setNextPage(next_page);
    } catch (error) {
      console.error((error as Error).message);
    }
  }, [nextPage]);

  useInfiniteScroll({ fetchData: getPhotos, targetRef: loadingRef });

  return (
    <>
      <ImageContainer>
        {photos?.map(photo => <img key={photo.id} src={photo.src.medium} alt={photo.alt} />)}
      </ImageContainer>
      {nextPage && <div ref={loadingRef}>Loading...</div>}
    </>
  );
};

const ImageContainer = styled.section`
  columns: 4 180px;
  gap: 20px;

  img {
    margin-bottom: 10px;
    border-radius: 5px;
    width: 100%;
    cursor: zoom-in;
    transition: transform 0.3s ease;
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    columns: 2 180px;
  }

  @media (max-width: 480px) {
    columns: 1 180px;
  }
`;

export default MasonryGrid;