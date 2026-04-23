from rest_framework import serializers


class UserOwnedModelSerializer(serializers.ModelSerializer):
    """Base serializer that keeps ownership fields server-controlled."""

    owner_read_only_fields = ("user",)

    def get_fields(self):
        fields = super().get_fields()

        for field_name in self.owner_read_only_fields:
            if field_name in fields:
                fields[field_name].read_only = True

        return fields
