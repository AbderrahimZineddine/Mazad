export interface PaginationArg {
    page: number;
    limit: number;


}

export interface FilterArgs {
    keyword?: string;
    fields?: string;
    sort?: string;
}

