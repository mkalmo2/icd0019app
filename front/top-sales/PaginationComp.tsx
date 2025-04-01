import React from 'react';

type Props = {
    cb: (pageNo: number, pageSize: number) => void,
    pageNo: number,
    pageSize: number,
    pageCount: number
}

const PaginationComp = (props: Props) => {

    const pageNo = props.pageNo;
    const pageSize = props.pageSize;
    const pageCount = props.pageCount;

    function selectPage(pageNo: number) {
        pageNo = Math.min(Math.max(0, pageNo), props.pageCount - 1);

        props.cb(pageNo, pageSize);
    }

    function selectPageSize(pageSize: number) {
        props.cb(0, pageSize);
    }

    return (
        <nav className="d-flex align-items-center gap-2 mb-2 pagination-comp">
            <ul className="pagination mb-0">
                <li className={ pageNo == 0 ? 'page-item disabled' : 'page-item'}>
                    <button className="page-link"
                       onClick={() => selectPage(pageNo - 1)}>&laquo;</button>
                </li>
                {
                    (() => {
                        const maxPageLinks = 7;
                        const maxSideLinks = Math.floor(maxPageLinks / 2);
                        
                        let startPage = Math.max(0, pageNo - maxSideLinks);
                        let endPage = Math.min(pageCount - 1, pageNo + maxSideLinks);
                        
                        if (pageNo < maxSideLinks) {
                            endPage = Math.min(pageCount - 1, maxPageLinks - 1);
                        } else if (pageNo > pageCount - maxSideLinks - 1) {
                            startPage = Math.max(0, pageCount - maxPageLinks);
                        }
                        
                        const showStartEllipsis = startPage > 0;
                        const showEndEllipsis = endPage < pageCount - 1;
                        
                        const result = [];
                        
                        if (showStartEllipsis) {
                            result.push(
                                <li key="first" className="page-item">
                                    <button className="page-link" onClick={() => selectPage(0)}>1</button>
                                </li>
                            );
                            
                            if (startPage > 1) {
                                result.push(
                                    <li key="ellipsis-start" className="page-item disabled">
                                        <span className="page-link">...</span>
                                    </li>
                                );
                            }
                        }
                        
                        const pageNumbers = Array.from({length: endPage - startPage + 1}, (_, i) => startPage + i);
                        pageNumbers.forEach(num => {
                            const pageNumber = num + 1;
                            result.push(
                                <li key={num} className={pageNo == num ? 'page-item active' : 'page-item'}>
                                    <button className="page-link" onClick={() => selectPage(num)}>
                                        {pageNumber}
                                    </button>
                                </li>
                            );
                        });
                        
                        if (showEndEllipsis) {
                            if (endPage < pageCount - 2) {
                                result.push(
                                    <li key="ellipsis-end" className="page-item disabled">
                                        <span className="page-link">...</span>
                                    </li>
                                );
                            }
                            
                            result.push(
                                <li key="last" className="page-item">
                                    <button className="page-link" onClick={() => selectPage(pageCount - 1)}>
                                        {pageCount}
                                    </button>
                                </li>
                            );
                        }
                        
                        return result;
                    })()
                }
                <li className={ pageNo == pageCount - 1 ? 'page-item disabled' : 'page-item'}>
                    <button className="page-link"
                       onClick={() => selectPage(pageNo + 1)}>&raquo;</button>
                </li>
            </ul>
            <select className="form-select"
                    onChange={(e: any) => selectPageSize(e.target.value) }
                    aria-label="">
                <option selected={pageSize == 3} value="3">3</option>
                <option selected={pageSize == 10} value="10">10</option>
                <option selected={pageSize == 25} value="25">25</option>
            </select>
        </nav>
    );
}

export default PaginationComp;