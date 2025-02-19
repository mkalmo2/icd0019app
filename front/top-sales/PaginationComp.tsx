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
        <nav className="d-flex align-items-center gap-2 mb-2">
            <ul className="pagination mb-0">
                <li className={ pageNo == 0 ? 'page-item disabled' : 'page-item'}>
                    <button className="page-link"
                       onClick={() => selectPage(pageNo - 1)}>&laquo;</button>
                </li>
                {
                    [...Array(pageCount)].map((_m, num) =>
                        <li className={ pageNo == num ? 'page-item active' : 'page-item'}>
                            <button className="page-link"
                               onClick={() => selectPage(num)}>{num + 1}</button>
                        </li>
                    )
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