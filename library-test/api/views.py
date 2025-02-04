from __future__ import annotations

from models import Author, Book
from serializers import AuthorSerializer, BookSerializer, UserSerializer
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter
from django.contrib.postgres.search import TrigramSimilarity
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny


# ViewSet for books
class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['title', 'author__name']

    # Get recommendations based on user's favorite books
    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        
        favorite_books = user.favorites.all()
        if not favorite_books:
            return Response({'message': 'No favorites found.'}, status=status.HTTP_200_OK)
        
        recommended_books = Book.objects.exclude(id__in=favorite_books.values_list('id', flat=True))
        recommended_books = recommended_books.annotate(similarity=TrigramSimilarity('title', ' '.join([book.title for book in favorite_books]))).order_by('-similarity')[:5]
        return Response(BookSerializer(recommended_books, many=True).data)

    # Add or remove a book from user's favorites
    @action(detail=True, methods=['post', 'delete'])
    def favorite(self, request, pk=None):
        user = request.user
        if not user.is_authenticated:
            return Response({'error': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            book = Book.objects.get(pk=pk)
        except Book.DoesNotExist:
            return Response({'error': 'Book not found'}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'POST':
            if user.favorites.count() >= 20:
                return Response({'error': 'Maximum favorites reached'}, status=status.HTTP_400_BAD_REQUEST)
            user.favorites.add(book)
        else:
            user.favorites.remove(book)

        return Response({'message': 'Favorite updated'}, status=status.HTTP_200_OK)


# ViewSet for authors
class AuthorViewSet(viewsets.ModelViewSet):
    queryset = Author.objects.all()
    serializer_class = AuthorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['name']
    
    
# Authentication View
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

