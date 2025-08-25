from functools import wraps
from flask import request, jsonify
from config import Config
import jwt

def authenticate_user(f):
    """Decorator to authenticate users using Supabase JWT token"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No authorization token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Verify token with Supabase
            supabase = Config.get_supabase_client()
            user = supabase.auth.get_user(token)
            
            if not user or not user.user:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            # Add user info to request context
            request.current_user = user.user
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401
    
    return decorated_function

def authenticate_admin(f):
    """Decorator to authenticate admin users"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # First authenticate the user
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({'error': 'No authorization token provided'}), 401
        
        try:
            # Remove 'Bearer ' prefix if present
            if token.startswith('Bearer '):
                token = token[7:]
            
            # Verify token with Supabase
            supabase = Config.get_supabase_client()
            user = supabase.auth.get_user(token)
            
            if not user or not user.user:
                return jsonify({'error': 'Invalid or expired token'}), 401
            
            # Check if user has admin role
            user_metadata = user.user.user_metadata or {}
            if user_metadata.get('role') != 'admin':
                return jsonify({'error': 'Admin access required'}), 403
            
            # Add user info to request context
            request.current_user = user.user
            return f(*args, **kwargs)
            
        except Exception as e:
            return jsonify({'error': 'Authentication failed', 'details': str(e)}), 401
    
    return decorated_function
