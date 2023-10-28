import { useEffect, useRef, useState } from "react";
import "./styles.css";

const pages = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25,
];

export const PackmanPagination = ({ allPages, currentPage, setPage }) => {
  const [activePage, setActivePage] = useState(0);

  const [isReversing, setIsReversing] = useState(false);

  const previousPage = useRef(currentPage);

  const handlePageChanged = (page) => {
    setPage(page);
    setActivePage(page);
  };

  useEffect(() => {
    setIsReversing(previousPage.current > currentPage);
    previousPage.current = currentPage;

    if (currentPage !== activePage) {
      setActivePage(currentPage);
    }
  }, [currentPage]);

  return (
    <div className="pagination">
      {pages.slice(0, allPages).map((page) => (
        <button onClick={() => handlePageChanged(page)} />
      ))}
      <div
        className={`pacman ${isReversing ? "reverse" : ""}`}
        style={{ translate: `${activePage > 1 ? (activePage - 1) * 100 : 0}%` }}
      />
    </div>
  );
};
