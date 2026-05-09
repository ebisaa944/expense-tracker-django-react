from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import UserSettings

User = get_user_model()


def build_username(email):
    local = email.split('@')[0].strip().lower().replace(' ', '.')
    candidate = local or 'user'
    suffix = 1

    while User.objects.filter(username=candidate).exists():
        suffix += 1
        candidate = f'{local}-{suffix}'

    return candidate


class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        exclude = ('id', 'user', 'created_at', 'updated_at')


class UserProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)
    settings = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'full_name', 'settings')

    def get_settings(self, obj):
        settings_obj, _ = UserSettings.objects.get_or_create(user=obj)
        return UserSettingsSerializer(settings_obj).data


class RegisterSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('full_name', 'email', 'password', 'confirm_password')

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return normalized

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})

        temp_user = User(email=attrs['email'], username=build_username(attrs['email']))
        first_name, _, last_name = attrs['full_name'].strip().partition(' ')
        temp_user.first_name = first_name
        temp_user.last_name = last_name
        validate_password(attrs['password'], temp_user)
        return attrs

    def create(self, validated_data):
        full_name = validated_data.pop('full_name').strip()
        validated_data.pop('confirm_password')
        first_name, _, last_name = full_name.partition(' ')

        user = User(
            username=build_username(validated_data['email']),
            email=validated_data['email'],
            first_name=first_name,
            last_name=last_name,
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username = serializers.CharField(write_only=True, required=False)
    email = serializers.CharField(write_only=True, required=False)
    password = serializers.CharField(write_only=True)
    remember_me = serializers.BooleanField(write_only=True, required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # SimpleJWT forces the username field to be required in its __init__, so we have to unset it
        self.fields[self.username_field].required = False
        self.fields[self.username_field].allow_blank = True

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        return token

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email:
            identifier = email.strip().lower()
            try:
                user_obj = User.objects.get(Q(email__iexact=identifier) | Q(username__iexact=identifier))
            except User.DoesNotExist as exc:
                raise serializers.ValidationError('No account found for this email or username.') from exc

            credentials = {
                self.username_field: user_obj.username,
                'password': password,
            }
        else:
            credentials = {
                self.username_field: attrs.get(self.username_field),
                'password': password,
            }

        self.user = authenticate(**credentials)

        if self.user is None:
            raise serializers.ValidationError('Invalid email or password.')

        data = super().validate({
            self.username_field: self.user.username,
            'password': password,
        })
        data['user'] = UserProfileSerializer(self.user).data
        return data
