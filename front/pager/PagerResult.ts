interface PagerResult {
    pageRows: string[],
    pageSize: number,
    currentPageNo: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
}

export default PagerResult;