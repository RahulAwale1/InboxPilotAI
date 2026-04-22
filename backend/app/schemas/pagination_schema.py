from math import ceil
from typing import Generic, TypeVar

from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")


class PaginatedResponse(GenericModel, Generic[T]):
    items: list[T]
    page: int
    page_size: int
    total: int
    total_pages: int


def build_paginated_response(
    items: list[T],
    page: int,
    page_size: int,
    total: int,
) -> PaginatedResponse[T]:
    total_pages = ceil(total / page_size) if page_size > 0 else 1

    return PaginatedResponse[T](
        items=items,
        page=page,
        page_size=page_size,
        total=total,
        total_pages=total_pages,
    )