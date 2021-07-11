from django_filters import rest_framework as filter

from .models import Review


class ReviewFilter(filter.FilterSet):
    """ Фильтр отзывов """

    appraisal = filter.RangeFilter()

    class Meta:
        model = Review
        fields = ['appraisal']
