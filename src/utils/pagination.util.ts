export const getPagination = (total:number,limit:number,page:number) =>{
    const totalPages = Math.ceil(total/limit)
    return {
        totalPages,
        page,
        hasNextPage : totalPages > page,
        hasPrevPage : page > 1,
        previousPage: page > 1 ? page -1 : null,
        nextPage : totalPages > page ? page +1 : null
    }
}