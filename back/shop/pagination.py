from django.db.models import Q

from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .models import Review


class PaginationAPIView(PageNumberPagination):
    """ Пагинация """

    page_size = 3
    page_size_query_param = 'page_size'
    max_page_size = 10


class ReviewPaginationAPIView(PaginationAPIView):
    """ Пагинация отзывов """

    page_size = 3

    def get_paginated_response(self, data):
        return Response(
            {
                'count': self.page.paginator.count,
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
                'results': data,
                'count_positive_reviews': Review.objects.filter(Q(appraisal__gt=3, appraisal__lte=5)).count(),
                'count_negative_reviews': Review.objects.filter(Q(appraisal__gte=1, appraisal__lt=4)).count(),
            },
        )
