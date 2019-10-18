from rest_framework import serializers
from models import Setting

class SettingSerializer(serializers.ModelSerializer):
    sl_reference = serializers.IntegerField
    sl_notification_threshold = serializers.IntegerField
    user_id = serializers.UUIDField
    class Meta:
        model = Setting
        fields = ('sl_reference', 'sl_notification_threshold', 'user_id')

