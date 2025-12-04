from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Order
import json


# ---- HEALTH ENDPOINT ----
@api_view(['GET'])
def health(request):
    return Response({"status": "ok"})

@api_view(['POST'])
def create_order(request):
    data = request.data
    order = Order.objects.create(
        user_id=data['userId'],
        total=data['total'],
        status='pending',
        items=data['items']
    )
    
    return Response({
        'id': order.id,
        'userId': order.user_id,
        'items': order.items,
        'total': float(order.total),
        'status': order.status,
        'createdAt': order.created_at.isoformat()
    })

@api_view(['GET'])
def get_orders(request, user_id):
    orders = Order.objects.filter(user_id=user_id)
    
    orders_list = [{
        'id': order.id,
        'userId': order.user_id,
        'items': order.items,
        'total': float(order.total),
        'status': order.status,
        'createdAt': order.created_at.isoformat()
    } for order in orders]
    
    return Response(orders_list)