"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = (total, limit, page) => {
    const totalPages = Math.ceil(total / limit);
    return {
        totalPages,
        page,
        hasNextPage: totalPages > page,
        hasPrevPage: page > 1,
        previousPage: page > 1 ? page - 1 : null,
        nextPage: totalPages > page ? page + 1 : null
    };
};
exports.getPagination = getPagination;
