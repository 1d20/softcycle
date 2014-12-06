from django.conf.urls import patterns, include, url
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = patterns(
    '',
    url(r'^$', 'apps.core.views.index', name='index'),
    url(r'^logout/$', 'apps.core.views.logout', name='logout'),
    url(r'^api/', include('apps.api.urls')),
    url(r'', include('social_auth.urls')),

    url(r'^admin/', include(admin.site.urls)),
) + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
