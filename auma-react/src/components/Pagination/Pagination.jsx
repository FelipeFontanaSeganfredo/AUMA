import './Pagination.css';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    let start = Math.max(0, currentPage - 2);
    let end = Math.min(totalPages - 1, currentPage + 2);

    if (end - start < 4) {
      if (start === 0) end = Math.min(totalPages - 1, 4);
      else if (end === totalPages - 1) start = Math.max(0, totalPages - 5);
    }

    if (start > 0) {
      pages.push({ type: 'page', num: 0, label: '1' });
      if (start > 1) pages.push({ type: 'ellipsis', key: 'el-start' });
    }

    for (let i = start; i <= end; i++) {
      pages.push({ type: 'page', num: i, label: String(i + 1) });
    }

    if (end < totalPages - 1) {
      if (end < totalPages - 2) pages.push({ type: 'ellipsis', key: 'el-end' });
      pages.push({ type: 'page', num: totalPages - 1, label: String(totalPages) });
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
      >«</button>

      {getPages().map((item, idx) =>
        item.type === 'ellipsis'
          ? <span key={item.key || idx} className="ellipsis">...</span>
          : (
            <button
              key={item.num}
              className={item.num === currentPage ? 'active' : ''}
              onClick={() => onPageChange(item.num)}
            >
              {item.label}
            </button>
          )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
      >»</button>
    </div>
  );
}
