from django.urls import path
from . import views

urlpatterns = [
    path('create', views.create_order, name='create_order'),
    path('<int:user_id>', views.get_orders, name='get_orders'),
]