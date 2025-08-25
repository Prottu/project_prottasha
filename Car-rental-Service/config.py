import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

class Config:
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    SUPABASE_SERVICE_ROLE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY')
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key')
    
    @staticmethod
    def get_supabase_client() -> Client:
        """Get Supabase client with anon key"""
        return create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)
    
    @staticmethod
    def get_supabase_admin_client() -> Client:
        """Get Supabase client with service role key for admin operations"""
        return create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_ROLE_KEY)
