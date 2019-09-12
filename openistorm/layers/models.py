from django.db import models
from django.contrib.gis.db import models as gismodel
# from geonode import settings
from django.conf import settings

class ImageLayer(models.Model):
    dataset = models.CharField(max_length=100)
    timestamp = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True, blank=True, null=True)
    update_at = models.DateTimeField(auto_now=True, blank=True, null=True)

    def url_prefix(self):
        return settings.LAYERDATA_URL + 'waves_' + str(self.timestamp)

    @property
    def image(self):
        return self.url_prefix() + '.png'

    @property
    def image_background(self):
        return self.url_prefix() + '_bg.png'

    @property
    def metadata(self):
        return self.url_prefix() + '.json'

    def __unicode__(self):
        return self.dataset + '_' + str(self.timestamp)

    class Meta:
        ordering = ['timestamp']


